import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { features, featureHue, featureImg } from '../../lib/features';

/** Curved 3D carousel: cards drift on their own, bend in from the edges, pause on hover. */
export function CurveCarousel() {
  const pos = useRef(0), paused = useRef(false), els = useRef<(HTMLAnchorElement | null)[]>([]);
  useEffect(() => {
    let raf = 0, last = performance.now(); const n = features.length;
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, .05); last = t;
      if (!paused.current) pos.current = (pos.current + dt * .3) % n;
      els.current.forEach((el, i) => {
        if (!el) return; let d = i - pos.current; d = ((((d + n / 2) % n) + n) % n) - n / 2; const ad = Math.abs(d);
        el.style.transform = `translate3d(${d * el.offsetWidth * 1.06}px,${ad * ad * 9}px,${-ad * 110}px) rotateY(${-d * 24}deg) scale(${1 - ad * .035})`;
        el.style.opacity = String(Math.max(0, 1 - Math.max(0, ad - 1.9) * 1.2)); el.style.zIndex = String(100 - Math.round(ad * 10));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <section className="curve-section">
      <div className="curve-head" data-reveal><span className="eyebrow"><i /> 02 / CAPABILITIES</span><h2>Seven ways to<br /><em>see the whole picture.</em></h2></div>
      <div className="curve-stage" onMouseLeave={() => (paused.current = false)}>
        {features.map((f, i) => { const Icon = f.icon; return (
          <Link key={f.title} to={f.path} ref={(el) => { els.current[i] = el; }} className="curve-card" onMouseEnter={() => (paused.current = true)} onFocus={() => (paused.current = true)}>
            <img src={featureImg(i)} alt="" style={{ filter: featureHue(i) }} />
            <span className="cc-body"><span className="cc-top"><small>{f.number}</small><Icon size={20} /></span><small className="cc-tag">{f.tag}</small><strong>{f.title}</strong><span className="cc-desc">{f.desc}</span><ArrowUpRight size={18} className="cc-go" /></span>
          </Link>); })}
      </div>
      <p className="curve-note">Drifting on its own. Hover to hold a card still.</p>
    </section>
  );
}
