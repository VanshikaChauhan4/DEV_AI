package com.devai.secretshield.engine;

import com.devai.secretshield.model.Finding;
import com.devai.secretshield.model.ScanResult;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Local, rule-based secret scanner. No network calls, no LLM, nothing is stored or logged.
 * Findings only ever carry a masked value (ASCII '*' masking, never the raw secret).
 */
@Service
public class SecretScanner {
  private static final int MAX_BYTES = 100 * 1024;
  /** ASCII-only mask character: avoids charset/mojibake problems (e.g. the old "â€¢" bug). */
  private static final char MASK = '*';
  private static final String FULL_MASK = "********";

  private record Hit(String rule, String type, String title, String severity, int confidence,
                     int start, int end, String masked, String reason, String remediation, String detector) {}

  // ---- patterns -------------------------------------------------------------------------------
  private static final Pattern PRIVATE_KEY = Pattern.compile(
      "-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY(?: BLOCK)?-----(?:[\\s\\S]*?-----END (?:[A-Z0-9]+ )*PRIVATE KEY(?: BLOCK)?-----)?");

  private static final Pattern TOKEN_PREFIX = Pattern.compile(
      "\\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|glpat-[A-Za-z0-9_-]{20,}"
    + "|AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{30,}"
    + "|sk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}|(?:sk|rk|pk)_live_[A-Za-z0-9]{16,}"
    + "|xox[baprs]-[A-Za-z0-9-]{15,}|hf_[A-Za-z0-9]{20,}|npm_[A-Za-z0-9]{30,}"
    + "|SG\\.[A-Za-z0-9_-]{16,}\\.[A-Za-z0-9_-]{16,})");

  private static final Pattern JWT = Pattern.compile(
      "\\b(eyJ[A-Za-z0-9_-]{5,})\\.([A-Za-z0-9_-]{5,})\\.([A-Za-z0-9_-]{5,})\\b");

  private static final Pattern BEARER = Pattern.compile("(?i)\\bBearer\\s+([A-Za-z0-9._~+/=-]{20,})");

  /** scheme://user:password@host  (db, broker, ftp and http(s) basic-auth URLs; optional jdbc: prefix). */
  private static final Pattern URL_CREDS = Pattern.compile(
      "(?i)\\b(?:jdbc:)?(?:mongodb(?:\\+srv)?|rediss?|postgres(?:ql)?|mysql|mariadb|amqps?|sqlserver|mssql|ftps?|https?)://"
    + "([^\\s/:@'\"<>]*):([^\\s/@'\"<>]+)@[^\\s'\"<>]+");

  /** jdbc:...;password=xxx or ...?user=a&password=xxx */
  private static final Pattern JDBC_PARAM = Pattern.compile(
      "(?i)\\bjdbc:[^\\s'\"]*?[?;&]password=([^&;\\s'\"]+)[^\\s'\"]*");

  /** redis-server --requirepass xxx */
  private static final Pattern REQUIREPASS = Pattern.compile("(?i)--(?:requirepass|masterauth)[ =]+(?:\"([^\"\\n]+)\"|'([^'\\n]+)'|([^\\s'\"]+))");

  /**
   * key (= | :) value. Handles .env, YAML (incl. docker-compose mappings and "- KEY=value" lists),
   * JSON, properties, and source code assignments.
   */
  private static final Pattern ASSIGN = Pattern.compile(
      "(?<![A-Za-z0-9_.\\-])[\"'`]?([A-Za-z0-9_.\\-]*[A-Za-z0-9_])[\"'`]?[ \\t]*[:=](?!=)[ \\t]*"
    + "(?:\"([^\"\\n]*)\"|'([^'\\n]*)'|`([^`\\n]*)`|(\\$\\{[^}\\n]*\\}[^\\s'\"`#;,]*|[^\\s'\"`#;,{}]+))");

  private static final Pattern CAMEL = Pattern.compile("(?<=[a-z0-9])(?=[A-Z])");
  private static final Set<String> SENSITIVE_LAST = Set.of(
      "password", "passwd", "pwd", "passphrase", "secret", "token", "apikey", "accesstoken", "authtoken",
      "secretkey", "credential", "credentials");
  private static final Set<String> KEY_PREFIX = Set.of(
      "api", "secret", "private", "access", "encryption", "signing", "master", "auth", "session", "jwt");
  private static final Set<String> DEV_DEFAULTS = Set.of(
      "postgres", "root", "admin", "password", "pass", "secret", "123456", "12345678", "mysql", "redis", "guest", "user", "qwerty");
  private static final Set<String> TYPE_WORDS = Set.of(
      "string", "str", "char", "char[]", "int", "long", "bool", "boolean", "any", "object", "var", "let", "const",
      "null", "nil", "none", "undefined", "true", "false", "empty", "required", "optional", "secret", "number");

  private static final Pattern PLACEHOLDER = Pattern.compile(
      "(?i)^(?:your[_ .-]?.*|<[^>]*>|\\[[^\\]]*\\]|x{3,}|\\*+|#+|\\.{3,}|-+|_+|todo|tbd|redacted|removed|hidden"
    + "|(?:example|sample|dummy|test|fake)(?:[_ -]?(?:api[_ -]?key|key|token|secret|password|value))?"
    + "|placeholder.*|change[_ -]?me.*|change[_ -]?this.*|replace[_ -]?me.*|insert[_ -].*|put[_ -].*here|enter[_ -].*"
    + "|.*[_-]here|secret[_-]?here|token[_-]?here|password[_-]?here)$");

  private static final Pattern ENV_REF = Pattern.compile(
      "(?i)^(?:\\$\\{.*|\\$\\(.*|\\$[a-z_][a-z0-9_]*|%[a-z_][a-z0-9_]*%|\\{\\{.*|\\{%.*|#\\{.*|@[a-z_.]+@"
    + "|process\\.env\\b.*|import\\.meta\\.env\\b.*|os\\.environ\\b.*|os\\.getenv\\b.*|getenv\\b.*|env\\(.*|env\\[.*|env\\..*"
    + "|system\\.getenv.*|system\\.getproperty.*|environment\\.getproperty.*|config\\.get.*|settings\\..*|secrets\\..*"
    + "|vault[.:].*|secretmanager\\..*|keyvault\\..*|parameterstore\\..*|ssm:.*|ref\\+.*|!(?:ref|sub|getatt|vault).*"
    + "|/run/secrets/.*|file:.*|classpath:.*)$");

  private static final Pattern IDENT_EXPR = Pattern.compile(
      "^(?:[A-Za-z_][A-Za-z0-9_]*(?:\\.[A-Za-z_][A-Za-z0-9_]*)+|[a-z]+(?:[A-Z][a-z0-9]*)+|[A-Za-z_][A-Za-z0-9_.]*\\(.*|[A-Za-z_][A-Za-z0-9_]*\\[.*)$");

  private static final Pattern GENERIC = Pattern.compile("(?<![A-Za-z0-9])[A-Za-z0-9+/=_-]{24,}(?![A-Za-z0-9])");
  private static final Pattern CONTEXT_WORD = Pattern.compile("(?i)token|secret|password|credential|api.?key");
  private static final Pattern DOC_WORD = Pattern.compile("(?i)\\b(?:dummy|placeholder|sample|fake|example(?!\\.))\\b");

  // ---- public API -----------------------------------------------------------------------------
  public ScanResult scan(String input) {
    long started = System.nanoTime();
    if (input == null) throw new IllegalArgumentException("Input is required.");
    int bytes = input.getBytes(StandardCharsets.UTF_8).length;
    if (bytes > MAX_BYTES) throw new IllegalArgumentException("Input exceeds the 100 KB limit.");

    List<Hit> hits = new ArrayList<>();
    detectPrivateKeys(input, hits);
    detectKnownTokens(input, hits);
    detectJwt(input, hits);
    detectBearer(input, hits);
    detectUrlCredentials(input, hits);
    detectRequirePass(input, hits);
    detectAssignments(input, hits);
    detectEntropy(input, hits);
    hits = dedupe(hits);

    List<Finding> findings = new ArrayList<>();
    int idx = 1;
    for (Hit h : hits) {
      int[] lc = lineColumn(input, h.start());
      int score = adjustConfidence(h, input);
      String level = score >= 90 ? "Very High" : score >= 75 ? "High" : score >= 50 ? "Medium" : score >= 25 ? "Low" : "Very Low";
      findings.add(new Finding("ss-" + idx++, h.rule(), h.type(), h.title(), h.severity(), score, level, lc[0], lc[1],
          h.masked(), h.reason(), List.of(h.detector()), h.remediation(), List.of(h.detector()), false, null));
    }
    int critical = count(findings, "CRITICAL"), high = count(findings, "HIGH"), med = count(findings, "MEDIUM"),
        low = count(findings, "LOW"), info = count(findings, "INFO");
    long ms = (System.nanoTime() - started) / 1_000_000;
    return new ScanResult("COMPLETED", UUID.randomUUID().toString(), findings.size(), critical, high, med, low, info, 0,
        findings.isEmpty() ? "No suspicious secrets detected by enabled rules."
            : "Potential credential exposure detected. Review findings and rotate confirmed exposed credentials.",
        ms, bytes,
        List.of("Known token patterns", "Private-key block detection", "JWT structure", "Bearer tokens",
            "Credential assignment context (.env, YAML, Docker Compose, JSON, code)", "Credentialed connection URLs",
            "Entropy + context"),
        List.of("Format detection does not verify whether credentials are active.",
            "Heuristic scanning may miss unknown formats or produce false positives.",
            "Only the provided text is scanned; this is not a repository-wide audit."),
        findings);
  }

  // ---- detectors ------------------------------------------------------------------------------
  private void detectPrivateKeys(String in, List<Hit> hits) {
    Matcher m = PRIVATE_KEY.matcher(in);
    while (m.find()) {
      boolean full = m.group().contains("-----END");
      hits.add(new Hit("SS-PRIVATE-001", "PRIVATE_KEY", "Private key material detected", "CRITICAL", full ? 99 : 90,
          m.start(), m.end(), "[REDACTED PRIVATE KEY]",
          full ? "Private-key block marker and matching block structure detected." : "Private-key header detected (block end not present).",
          "Treat as exposed: revoke/replace the key and remove it from source history where possible.", "Private key detector"));
    }
  }

  private void detectKnownTokens(String in, List<Hit> hits) {
    Matcher m = TOKEN_PREFIX.matcher(in);
    while (m.find()) {
      String v = m.group();
      String lower = v.toLowerCase(Locale.ROOT);
      if (lower.contains("your_") || lower.contains("your-") || lower.contains("example") || lower.contains("xxxx")
          || lower.contains("placeholder") || lower.contains("dummy")) continue;
      if (lower.startsWith("sk-") && (!v.matches(".*\\d.*") || entropy(v) < 3.2)) continue; // e.g. CSS/class-like words
      hits.add(new Hit("SS-TOKEN-001", "KNOWN_TOKEN", "Recognized credential token format", "HIGH", 92,
          m.start(), m.end(), mask(v), "Value matches a known credential-like token format; activity is not verified.",
          "Revoke or rotate the token if real; store it in a secret manager.", "Known token detector"));
    }
  }

  private void detectJwt(String in, List<Hit> hits) {
    Matcher m = JWT.matcher(in);
    while (m.find()) {
      boolean validHeader = jwtHeaderLooksValid(m.group(1));
      hits.add(new Hit("SS-JWT-001", "JWT", validHeader ? "JWT detected" : "JWT-like value detected",
          validHeader ? "HIGH" : "LOW", validHeader ? 90 : 45, m.start(), m.end(), mask(m.group()),
          validHeader ? "Three-segment JWT with a decodable header detected; signature and validity are not verified."
                      : "Three-segment JWT-like structure detected, but the header could not be decoded.",
          "Avoid committing tokens. Revoke or invalidate it if exposed and review token lifetime.", "JWT structural detector"));
    }
  }

  private void detectBearer(String in, List<Hit> hits) {
    Matcher m = BEARER.matcher(in);
    while (m.find()) {
      String v = m.group(1);
      if (isSafeValue(v) || (!v.matches(".*\\d.*") && entropy(v) < 3.5)) continue;
      hits.add(new Hit("SS-BEARER-001", "BEARER_TOKEN", "Bearer token in text", "HIGH", 80, m.start(1), m.end(1), mask(v),
          "Authorization bearer value detected; validity is not verified.",
          "Remove the token from source and rotate it if it is real.", "Bearer token detector"));
    }
  }

  private void detectUrlCredentials(String in, List<Hit> hits) {
    Matcher m = URL_CREDS.matcher(in);
    while (m.find()) {
      String pw = m.group(2);
      if (isEnvOrTemplateRef(pw) || pw.chars().allMatch(c -> c == '*' || c == 'x' || c == 'X')) continue;
      String whole = m.group();
      int rel = m.start(2) - m.start();
      String masked = whole.substring(0, rel) + FULL_MASK + whole.substring(rel + pw.length());
      boolean db = whole.toLowerCase(Locale.ROOT).matches("^(?:jdbc:)?(?:https?|ftps?)://.*") == false;
      hits.add(new Hit("SS-DB-001", db ? "DATABASE_URL" : "URL_CREDENTIALS",
          db ? "Database connection string with embedded password" : "URL with embedded credentials", "HIGH", 88,
          m.start(), m.end(), masked, "Connection string embeds a password in plain text.",
          "Remove embedded credentials and inject them from protected configuration.", "Connection URL detector"));
    }
    Matcher j = JDBC_PARAM.matcher(in);
    while (j.find()) {
      String pw = j.group(1);
      if (isSafeValue(pw)) continue;
      String whole = j.group();
      int rel = j.start(1) - j.start();
      hits.add(new Hit("SS-DB-002", "DATABASE_URL", "JDBC URL with password parameter", "HIGH", 85, j.start(), j.end(),
          whole.substring(0, rel) + FULL_MASK + whole.substring(rel + pw.length()),
          "JDBC connection string carries a plain-text password parameter.",
          "Remove the password from the URL and inject it from protected configuration.", "Connection URL detector"));
    }
  }

  private void detectRequirePass(String in, List<Hit> hits) {
    Matcher m = REQUIREPASS.matcher(in);
    while (m.find()) {
      int g = m.group(1) != null ? 1 : m.group(2) != null ? 2 : 3;
      String v = m.group(g);
      if (isSafeValue(v)) continue;
      hits.add(new Hit("SS-ASSIGN-002", "HARDCODED_CREDENTIAL", "Hardcoded Redis password in command", "HIGH", 85,
          m.start(g), m.end(g), mask(v), "Redis password passed as a literal command-line argument.",
          "Use an environment variable or secret file instead of a literal password.", "Assignment detector"));
    }
  }

  private void detectAssignments(String in, List<Hit> hits) {
    Matcher m = ASSIGN.matcher(in);
    while (m.find()) {
      String key = m.group(1);
      if (!sensitiveKey(key)) continue;
      int g = 2; String value = m.group(2);
      for (int i = 3; i <= 5 && value == null; i++) { value = m.group(i); g = i; }
      if (value == null) continue;
      boolean quoted = g < 5;
      value = value.trim();
      if (value.length() < 4 || isSafeValue(value)) continue;
      boolean passwordKey = lastSegment(key).matches("password|passwd|pwd|passphrase");
      if (value.matches("\\d+") && !passwordKey) continue;
      if (TYPE_WORDS.contains(value.toLowerCase(Locale.ROOT)) && !value.equalsIgnoreCase("secret")) continue;
      if (!quoted && IDENT_EXPR.matcher(value).matches()) continue; // code expression, e.g. user.getPassword(), this.token
      if (value.chars().allMatch(c -> c == '*' || c == '.' || c == '-' || c == '_' || c == 'x' || c == 'X')) continue;
      boolean weak = DEV_DEFAULTS.contains(value.toLowerCase(Locale.ROOT)) || (value.length() < 8 && entropy(value) < 3.0);
      int conf = 70 + (entropy(value) >= 3.0 && value.length() >= 12 ? 10 : 0) + (value.length() >= 16 ? 8 : 0);
      String reason = weak ? "Credential-like key assigned a literal value that looks like a weak/default credential."
                           : "Credential-like key assigned a non-placeholder literal value.";
      hits.add(new Hit("SS-ASSIGN-001", "HARDCODED_CREDENTIAL", "Hardcoded credential: " + safeKey(key), weak ? "MEDIUM" : "HIGH",
          Math.min(92, conf), m.start(g), m.end(g), mask(value), reason,
          "Move the value to a protected environment variable or secret manager (e.g. ${" + envName(key) + "}) and rotate it if it was ever committed.",
          "Assignment detector"));
    }
  }

  private void detectEntropy(String in, List<Hit> hits) {
    Matcher g = GENERIC.matcher(in);
    while (g.find()) {
      String v = g.group();
      if (isSafeValue(v) || entropy(v) < 4.0 || covered(hits, g.start(), g.end())) continue;
      if (!v.matches(".*\\d.*") || v.matches("[A-Z0-9_]+") || v.matches("^[A-Za-z][A-Za-z0-9_]*=.*")) continue; // env-var names / plain words are not secrets
      String nearby = in.substring(Math.max(0, g.start() - 80), Math.min(in.length(), g.end() + 80));
      if (!CONTEXT_WORD.matcher(nearby).find()) continue;
      hits.add(new Hit("SS-ENTROPY-001", "GENERIC_SECRET", "Suspicious high-entropy value", "LOW", 48, g.start(), g.end(), mask(v),
          "High-entropy string found near credential-related context; manual review recommended.",
          "Confirm whether this is a secret; if so rotate it and move it to secure configuration.", "Entropy + context"));
    }
  }

  // ---- helpers --------------------------------------------------------------------------------
  private static boolean sensitiveKey(String key) {
    String[] seg = segments(key);
    if (seg.length == 0) return false;
    String last = seg[seg.length - 1];
    if (SENSITIVE_LAST.contains(last)) return true;
    return seg.length >= 2 && last.equals("key") && KEY_PREFIX.contains(seg[seg.length - 2]);
  }
  private static String[] segments(String key) {
    List<String> out = new ArrayList<>();
    for (String part : key.split("[^A-Za-z0-9]+")) {
      if (part.isEmpty()) continue;
      for (String s : CAMEL.split(part)) if (!s.isEmpty()) out.add(s.toLowerCase(Locale.ROOT));
    }
    return out.toArray(new String[0]);
  }
  private static String lastSegment(String key) { String[] s = segments(key); return s.length == 0 ? "" : s[s.length - 1]; }
  private static String safeKey(String key) { return key.length() > 60 ? key.substring(0, 60) : key; }
  private static String envName(String key) { String n = key.replaceAll("[^A-Za-z0-9]+", "_").toUpperCase(Locale.ROOT); return n.isEmpty() ? "SECRET" : n; }

  private static boolean isEnvOrTemplateRef(String v) {
    String n = v.trim().replaceAll("^[\"'`]+|[\"'`]+$", "");
    return ENV_REF.matcher(n).matches() || (n.startsWith("<") && n.endsWith(">"));
  }
  /** True for placeholders and safe references to env vars / secret stores. */
  private static boolean isSafeValue(String v) {
    String n = v.trim().replaceAll("^[\"'`]+|[\"'`]+$", "");
    return n.length() < 3 || isEnvOrTemplateRef(n) || PLACEHOLDER.matcher(n).matches();
  }

  private static boolean jwtHeaderLooksValid(String header) {
    try {
      String s = new String(Base64.getUrlDecoder().decode(header.replaceAll("=+$", "")), StandardCharsets.UTF_8);
      return s.startsWith("{") && (s.contains("\"alg\"") || s.contains("\"typ\""));
    } catch (IllegalArgumentException e) { return false; }
  }

  private static List<Hit> dedupe(List<Hit> in) {
    in.sort(Comparator.comparingInt(Hit::start).thenComparingInt(Hit::end));
    List<Hit> out = new ArrayList<>();
    for (Hit h : in) {
      int found = -1;
      for (int i = 0; i < out.size(); i++) {
        Hit p = out.get(i);
        if (h.start() < p.end() && h.end() > p.start()) { found = i; break; }
      }
      if (found < 0) out.add(h);
      else if (h.confidence() > out.get(found).confidence()) out.set(found, h);
    }
    out.sort(Comparator.comparingInt(Hit::start));
    return out;
  }
  private static boolean covered(List<Hit> h, int s, int e) { return h.stream().anyMatch(x -> s < x.end() && e > x.start()); }

  private static int adjustConfidence(Hit h, String input) {
    int score = h.confidence();
    String ctx = input.substring(Math.max(0, h.start() - 60), Math.min(input.length(), h.end() + 60));
    if (DOC_WORD.matcher(ctx).find()) score -= 25;
    return Math.max(0, Math.min(100, score));
  }

  private static int[] lineColumn(String s, int offset) {
    int line = 1, col = 1;
    for (int i = 0; i < Math.min(offset, s.length()); i++) { if (s.charAt(i) == '\n') { line++; col = 1; } else col++; }
    return new int[]{line, col};
  }

  /** Masks with ASCII '*'. Short values are fully masked; longer ones keep a tiny prefix/suffix for identification. */
  static String mask(String s) {
    if (s == null || s.isEmpty()) return FULL_MASK;
    if (s.startsWith("-----BEGIN")) return "[REDACTED PRIVATE KEY]";
    if (s.length() < 16) return FULL_MASK;
    int keepStart = 4, keepEnd = 3;
    return s.substring(0, keepStart) + String.valueOf(MASK).repeat(Math.min(16, s.length() - keepStart - keepEnd)) + s.substring(s.length() - keepEnd);
  }

  private static double entropy(String s) {
    if (s.isEmpty()) return 0;
    Map<Character, Integer> counts = new HashMap<>();
    for (char c : s.toCharArray()) counts.merge(c, 1, Integer::sum);
    double e = 0;
    for (int n : counts.values()) { double p = (double) n / s.length(); e -= p * (Math.log(p) / Math.log(2)); }
    return e;
  }
  private static int count(List<Finding> fs, String severity) { return (int) fs.stream().filter(f -> f.severity().equals(severity)).count(); }
}
