import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

function useTyper(words: string[], loop: boolean, start = 0) {
  const [text, setText] = useState('');
  useEffect(() => {
    let w = 0, c = 0, del = false, id = 0;
    const step = () => {
      const word = words[w]; c += del ? -1 : 1; setText(word.slice(0, c));
      let delay = del ? 30 : 75;
      if (!del && c === word.length) { if (!loop) return; del = true; delay = 1600; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; delay = 380; }
      id = window.setTimeout(step, delay);
    };
    id = window.setTimeout(step, start);
    return () => clearTimeout(id);
  }, []);
  return text;
}

function Network() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext('2d')!; let raf = 0, W = 0, H = 0;
    const size = () => { const d = Math.min(devicePixelRatio, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size(); addEventListener('resize', size);
    const N = 70, p = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      p.forEach((a, i) => {
        a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
        for (let j = i + 1; j < N; j++) { const b = p[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 150) { ctx.strokeStyle = `rgba(201,185,255,${(1 - d / 150) * .35})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
        ctx.fillStyle = 'rgba(255,200,220,.85)'; ctx.beginPath(); ctx.arc(a.x, a.y, 1.8, 0, 7); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw(); return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} aria-hidden />;
}

/** Hero: animated typing + scroll effects (Lenis smooth scroll and [data-reveal] reveals for the whole page). */
export function ParallaxComponent() {
  const root = useRef<HTMLElement>(null);
  const title = useTyper(['DevMind AI'], false, 500);
  const purpose = useTyper(['Predict the risk.', 'Repair the code.', 'Prove every fix.'], true, 1500);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', () => ScrollTrigger.update());
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    gsap.to('.hero-ai-content', { yPercent: 30, opacity: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: .6 } });
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) =>
      gsap.fromTo(el, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
    return () => { ScrollTrigger.getAll().forEach((s) => s.kill()); gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  return (
    <section ref={root} className="hero-ai" id="top" aria-label="DevMind AI">
      <div className="hero-ai-bg" />
      <div className="hero-ai-content">
        <h1>{title}<span className="caret" /></h1>
        <h2>{purpose}<span className="caret caret-sm" /></h2>
        <p className="hero-quote">“Build ideas. Ship with proof.”</p><a className="hero-explore" href="/dashboard">Start exploring ↗</a><a className="hero-agents" href="/#agents">Meet the six agents ↗</a>
      </div>
      <a className="scroll-cue" href="#platform" aria-label="Scroll down"><span>SCROLL</span><i /></a>
    </section>
  );
}
