"use client";

import * as React from "react";

export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };
export interface HalftoneWordmarkFooterProps {
  wordmark?: string;
  label?: string;
  meta?: string;
  columns?: FooterColumn[];
  backToTop?: boolean;
  background?: string;
  backgroundImage?: string;
  ink?: string;
  warm?: string;
  dotGap?: number;
  radius?: number;
  height?: string;
  className?: string;
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Platform", links: [{ label: "Capabilities", href: "#features" }, { label: "Workflow", href: "#workflow" }, { label: "Workspace", href: "/dashboard" }] },
  { title: "Intelligence", links: [{ label: "Predictive risk", href: "/risk" }, { label: "AI repair", href: "/repair" }, { label: "RootCause memory", href: "/rootcause" }] },
  { title: "Connect", links: [{ label: "Email the team", href: "mailto:chauhanvanshika913@gmail.com" }, { label: "Portfolio", href: "https://vanshikaportfolio-peach.vercel.app/" }] },
];

export default function HalftoneWordmarkFooter({
  wordmark = "devmind",
  label = "DevMind AI / Engineering intelligence",
  meta = "PREDICT WITH EVIDENCE · REPAIR WITH CONFIDENCE",
  columns = DEFAULT_COLUMNS,
  backToTop = true,
  background = "#070a12",
  backgroundImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1800&q=80",
  ink = "#dce9ff",
  warm = "#67f5d0",
  dotGap = 6,
  radius = 86,
  height = "410px",
  className = "",
}: HalftoneWordmarkFooterProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 1;
    let heightPx = 1;
    let dpr = 1;
    let pointerX = -10000;
    let pointerY = -10000;
    let raf = 0;
    let dots: Array<{ x: number; y: number; homeX: number; homeY: number; r: number; vx: number; vy: number }> = [];
    let ring = { x: 0, y: 0, at: -10000 };
    let visible = true;
    const footerImage = new Image();
    footerImage.crossOrigin = "anonymous";
    footerImage.src = backgroundImage;
    footerImage.onload = () => paint(performance.now());
    const inkRgb = parseColor(ink);
    const warmRgb = parseColor(warm);

    function parseColor(value: string) {
      const hex = value.replace("#", "");
      const normalized = hex.length === 3 ? hex.split("").map((part) => part + part).join("") : hex;
      const number = Number.parseInt(normalized, 16);
      return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
    }

    const layout = () => {
      const rect = root.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      heightPx = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(heightPx * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${heightPx}px`;
      const mask = document.createElement("canvas");
      mask.width = width;
      mask.height = heightPx;
      const maskCtx = mask.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return;
      maskCtx.fillStyle = "#fff";
      const fontSize = Math.min(width / Math.max(wordmark.length * 0.57, 1), heightPx * 0.72);
      maskCtx.font = `800 ${fontSize}px Inter, Arial, sans-serif`;
      maskCtx.textAlign = "center";
      maskCtx.textBaseline = "alphabetic";
      maskCtx.fillText(wordmark, width / 2, heightPx * 0.98);
      const pixels = maskCtx.getImageData(0, 0, width, heightPx).data;
      dots = [];
      const gap = Math.max(4, dotGap);
      for (let y = 0; y < heightPx; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const alpha = pixels[(Math.min(heightPx - 1, y) * width + Math.min(width - 1, x)) * 4 + 3];
          if (alpha > 0) dots.push({ x: x + gap / 2, y: y + gap / 2, homeX: x + gap / 2, homeY: y + gap / 2, r: gap * 0.42 * (alpha / 255), vx: 0, vy: 0 });
        }
      }
      paint(performance.now());
    };

    const paint = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (footerImage.complete && footerImage.naturalWidth > 0) {
        ctx.drawImage(footerImage, 0, 0, width, heightPx);
        ctx.fillStyle = "rgba(7, 10, 18, .86)";
        ctx.fillRect(0, 0, width, heightPx);
      } else {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, heightPx);
      }
      let moving = false;
      for (const dot of dots) {
        if (!reducedMotion) {
          const dx = dot.x - pointerX;
          const dy = dot.y - pointerY;
          const distance = Math.hypot(dx, dy) || 0.001;
          if (distance < radius) {
            const force = (1 - distance / radius) * 3.2;
            dot.vx += (dx / distance) * force;
            dot.vy += (dy / distance) * force;
          }
          const age = now - ring.at;
          if (age >= 0 && age < 700) {
            const distanceFromRing = Math.hypot(dot.homeX - ring.x, dot.homeY - ring.y);
            const band = Math.max(0, 1 - Math.abs(distanceFromRing - age * 0.72) / 18);
            dot.vx += ((dot.homeX - ring.x) / (distanceFromRing || 1)) * band * 2;
            dot.vy += ((dot.homeY - ring.y) / (distanceFromRing || 1)) * band * 2;
          }
          dot.vx = (dot.vx + (dot.homeX - dot.x) * 0.055) * 0.82;
          dot.vy = (dot.vy + (dot.homeY - dot.y) * 0.055) * 0.82;
          dot.x += dot.vx;
          dot.y += dot.vy;
          if (Math.abs(dot.vx) + Math.abs(dot.vy) > 0.03 || Math.abs(dot.x - dot.homeX) + Math.abs(dot.y - dot.homeY) > 0.08) moving = true;
        }
        const heat = Math.min(1, Math.hypot(dot.x - dot.homeX, dot.y - dot.homeY) / 28);
        const rgb = inkRgb.map((value, index) => Math.round(value + (warmRgb[index] - value) * heat));
        ctx.fillStyle = `rgb(${rgb.join(",")})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (moving || now - ring.at < 700) raf = requestAnimationFrame(paint);
      else raf = 0;
    };
    const wake = () => { if (!raf && visible) raf = requestAnimationFrame(paint); };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      wake();
    };
    const onLeave = () => { pointerX = -10000; pointerY = -10000; wake(); };
    const onClick = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest("a,button")) return;
      const rect = canvas.getBoundingClientRect();
      ring = { x: event.clientX - rect.left, y: event.clientY - rect.top, at: performance.now() };
      wake();
    };
    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(root);
    const observer = new IntersectionObserver((entries) => {
      visible = Boolean(entries[0]?.isIntersecting);
      if (visible) wake(); else { cancelAnimationFrame(raf); raf = 0; }
    });
    observer.observe(root);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onClick);
    layout();
    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      observer.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onClick);
    };
  }, [wordmark, background, backgroundImage, ink, warm, dotGap, radius]);

  return (
    <footer ref={rootRef} className={`hwf-root ${className}`} style={{ height, background, color: ink }}>
      <style>{`
        .hwf-root{position:relative;width:100%;overflow:hidden;isolation:isolate;-webkit-font-smoothing:antialiased}
        .hwf-root canvas{position:absolute;inset:0;display:block;max-width:none;touch-action:pan-y}
        .hwf-top{position:relative;z-index:1;display:grid;grid-template-columns:1.35fr repeat(3,minmax(0,1fr));gap:24px;padding:clamp(22px,3.4vw,40px) clamp(20px,4vw,56px) 0;font:10px 'DM Mono',monospace;letter-spacing:.14em;text-transform:uppercase;line-height:1.85}
        .hwf-brand strong{display:block;font-weight:500;color:${ink}}.hwf-brand span{display:block;opacity:.55;margin-top:5px;max-width:220px}
        .hwf-col h3{margin:0 0 8px;font:inherit;opacity:.42}.hwf-col ul{list-style:none;margin:0;padding:0}.hwf-col a,.hwf-up{color:inherit;text-decoration:none;opacity:.72;background:none;border:0;padding:0;font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer;background-image:linear-gradient(currentColor,currentColor);background-size:0% 1px;background-repeat:no-repeat;background-position:0 100%;transition:opacity .25s ease,background-size .35s ease}.hwf-col a:hover,.hwf-up:hover{opacity:1;background-size:100% 1px}.hwf-col a:focus-visible,.hwf-up:focus-visible{outline:1px solid currentColor;outline-offset:4px;opacity:1}
        .hwf-rule{position:relative;z-index:1;display:flex;justify-content:flex-end;align-items:center;margin:24px clamp(20px,4vw,56px) 0;padding-top:12px;border-top:1px solid #dce9ff24;font:10px 'DM Mono',monospace;letter-spacing:.16em;text-transform:uppercase}
        .hwf-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
        @media(max-width:700px){.hwf-top{grid-template-columns:1fr 1fr;row-gap:18px}.hwf-brand{grid-column:1/-1}.hwf-rule{margin-top:20px}}
        @media(prefers-reduced-motion:reduce){.hwf-col a,.hwf-up{transition:none}}
      `}</style>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="hwf-sr">{wordmark}</span>
      <div className="hwf-top">
        <div className="hwf-brand"><strong>{label}</strong><span>{meta}</span></div>
        {columns.map((column) => <nav className="hwf-col" key={column.title} aria-label={column.title}>
          <h3>{column.title}</h3><ul>{column.links.map((link) => <li key={link.label}><a href={link.href}>{link.label}</a></li>)}</ul>
        </nav>)}
      </div>
      <div className="hwf-rule">{backToTop && <button className="hwf-up" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top ↑</button>}</div>
    </footer>
  );
}
