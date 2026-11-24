package com.devai.secretshield.engine;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class SecretScannerTest {
 private final SecretScanner scanner=new SecretScanner();
 @Test void knownTokenDetectedAndMasked(){var r=scanner.scan("token = ghp_abcdefghijklmnopqrstuvwxyz1234567890");assertTrue(r.totalFindings()>0);assertFalse(r.findings().get(0).maskedValue().contains("abcdefghijklmnopqrstuvwxyz1234567890"));}
 @Test void privateKeyBlockDetectedAndRedacted(){var r=scanner.scan("-----BEGIN PRIVATE KEY-----\nFAKEKEYMATERIAL\n-----END PRIVATE KEY-----");assertTrue(r.findings().stream().anyMatch(f->f.type().equals("PRIVATE_KEY")));assertTrue(r.findings().stream().anyMatch(f->f.maskedValue().contains("REDACTED")));}
 @Test void placeholderAssignmentDoesNotTriggerAssignmentFinding(){var r=scanner.scan("api_key = 'YOUR_API_KEY'");assertFalse(r.findings().stream().anyMatch(f->f.ruleId().equals("SS-ASSIGN-001")));}
 @Test void databaseUrlDetected(){var r=scanner.scan("jdbc:postgresql://user:password@host/db");assertTrue(r.findings().stream().anyMatch(f->f.type().equals("DATABASE_URL")));}
 @Test void oversizedInputRejected(){assertThrows(IllegalArgumentException.class,()->scanner.scan("x".repeat(102401)));}
 @Test void lineNumberDetected(){var r=scanner.scan("hello\napi_key = 'not-a-placeholder-secret-12345'");assertTrue(r.findings().stream().anyMatch(f->f.line()==2));}
 @Test void namedPlaceholderSuffixIgnored(){var r=scanner.scan("api_key = \'YOUR_API_KEY_HERE\'");assertFalse(r.findings().stream().anyMatch(f->f.ruleId().equals("SS-ASSIGN-001")));}
 @Test void environmentReferencesAndTemplatePlaceholdersAreIgnored(){
  var r=scanner.scan("String apiKey = System.getenv(\"API_KEY\");\nString password = \"${DB_PASSWORD}\";\nString example = \"YOUR_API_KEY_HERE\";");
  assertFalse(r.findings().stream().anyMatch(f->f.type().equals("HARDCODED_CREDENTIAL")));
 }
 @Test void databaseUrlFindingDoesNotExposeOriginalValue(){
  String input="jdbc:postgresql://user:SuperSecretPass123@host/db";
  var r=scanner.scan(input);
  assertTrue(r.findings().stream().anyMatch(f->f.type().equals("DATABASE_URL")));
  assertFalse(r.findings().stream().anyMatch(f->f.maskedValue().contains("SuperSecretPass123")));
 }

 private boolean has(String input,String type){return scanner.scan(input).findings().stream().anyMatch(f->f.type().equals(type));}
 private boolean none(String input){return scanner.scan(input).totalFindings()==0;}
 @Test void maskUsesAsciiOnly(){
  var r=scanner.scan("token = ghp_abcdefghijklmnopqrstuvwxyz1234567890\nPOSTGRES_PASSWORD=supersecret99");
  assertTrue(r.totalFindings()>0);
  for(var f:r.findings()){assertTrue(f.maskedValue().chars().allMatch(c->c<128));assertTrue(f.maskedValue().contains("*"));}
 }
 @Test void dbPasswordEnvVarsDetected(){
  for(String k:new String[]{"POSTGRES_PASSWORD","DB_PASSWORD","MYSQL_PASSWORD","REDIS_PASSWORD","MYSQL_ROOT_PASSWORD"}){
   assertTrue(has(k+"=Sup3rS3cretValue","HARDCODED_CREDENTIAL"));
  }
 }
 @Test void dockerComposeYamlCredentialsDetected(){
  String y="services:\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: postgres\n      MYSQL_PASSWORD: \"hunter2hunter2\"\n      - REDIS_PASSWORD=Redis-Pa55-w0rd\n";
  var r=scanner.scan(y);
  assertTrue(r.findings().stream().filter(f->f.type().equals("HARDCODED_CREDENTIAL")).count()>=3);
  assertTrue(has("command: redis-server --requirepass MyRedisPass123","HARDCODED_CREDENTIAL"));
 }
 @Test void dockerComposeSafeReferencesIgnored(){
  assertTrue(none("environment:\n  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}\n  DB_PASSWORD: ${DB_PASSWORD:-postgres}\n  MYSQL_PASSWORD_FILE: /run/secrets/mysql_pw\n  REDIS_PASSWORD: $REDIS_PASSWORD\n"));
 }
 @Test void placeholdersIgnored(){
  assertTrue(none("DB_PASSWORD=changeme\nPOSTGRES_PASSWORD=<your-password>\nAPI_KEY=your_api_key_here\npassword: \"********\"\nsecret = 'xxxxxxxx'"));
 }
 @Test void codeEnvLookupsAndExpressionsIgnored(){
  assertTrue(none("String password = System.getenv(\"DB_PASSWORD\");\nconst token = process.env.API_TOKEN;\npassword = os.environ[\"DB_PASSWORD\"]\nString password = user.getPassword();\nmax_tokens: 1000\nsecretName: my-secret"));
 }
 @Test void jwtDetected(){
  assertTrue(has("Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U","JWT"));
 }
 @Test void apiTokensDetected(){
  assertTrue(has("key=AKIAIOSFODNN7EXAMPL3","KNOWN_TOKEN"));
  assertTrue(has("x = sk-proj-Ab3dEf6hIj9kLm2nOp5qRs8tUv","KNOWN_TOKEN"));
  assertTrue(has("AIzaSyA1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q","KNOWN_TOKEN"));
 }
 @Test void privateKeysSeverityCritical(){
  var r=scanner.scan("-----BEGIN OPENSSH PRIVATE KEY-----\nabc\n-----END OPENSSH PRIVATE KEY-----");
  assertEquals(1,r.critical());
 }
 @Test void dbUrlsMaskPasswordAndSkipEnvRefs(){
  var r=scanner.scan("postgres://app:Sup3rSecret!@db:5432/app\nmongodb+srv://u:pw12345678@cluster0.mongodb.net/x\nredis://:RedisPw1234@cache:6379");
  assertTrue(r.findings().size()==3);
  for(var f:r.findings()){assertFalse(f.maskedValue().contains("Sup3rSecret"));assertFalse(f.maskedValue().contains("pw12345678"));assertFalse(f.maskedValue().contains("RedisPw1234"));assertEquals("HIGH",f.severity());}
  assertTrue(none("DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@db:5432/app\nspring.datasource.url=jdbc:postgresql://localhost:5432/devai"));
 }
 @Test void jdbcPasswordParamDetected(){
  assertTrue(has("jdbc:mysql://h/db?user=a&password=Zx9!kLm2pQ","DATABASE_URL"));
  assertTrue(has("spring.datasource.password=Zx9!kLm2pQ","HARDCODED_CREDENTIAL"));
 }
 @Test void weakDefaultsAreMediumNotCritical(){
  var r=scanner.scan("POSTGRES_PASSWORD=postgres");
  assertEquals(1,r.medium());
 }
 @Test void blankInputReturnsNoFindings(){assertEquals(0,scanner.scan("   ").totalFindings());}
 @Test void nullInputRejected(){assertThrows(IllegalArgumentException.class,()->scanner.scan(null));}
}
