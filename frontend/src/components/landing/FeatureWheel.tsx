import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { features, featureHue, featureImg } from '../../lib/features';

/** Ferris wheel: gondolas stay upright while the wheel turns; hover pauses; click selects. */
export function FeatureWheel() {
  const [active, setActive] = useState(0);
  const rot = useRef(0), paused = useRef(false), box = useRef<HTMLDivElement>(null), cards = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    let raf = 0, last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, .05); last = t;
      if (!paused.current) rot.current += dt * 8;
      const r = (box.current?.clientWidth ?? 600) * .37;
      cards.current.forEach((el, i) => {
        if (!el) return; const a = (rot.current + (i * 360) / features.length - 90) * Math.PI / 180;
        el.style.transform = `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r}px))`;
      });
      box.current?.style.setProperty('--rot', `${rot.current}deg`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, []);
  const f = features[active], Icon = f.icon;
  return (
    <section className="wheel-section section-pad" id="platform">
      <div className="wheel-wrap" data-reveal>
        <span className="eyebrow"><i /> 01 / THE PLATFORM</span>
        <h2 className="wheel-title">Not another chatbot.<br /><em>A wheel that keeps turning.</em></h2>
        <div className="wheel" ref={box} onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
          <i className="wheel-leg" style={{ transform: 'rotate(17deg)' }} /><i className="wheel-leg" style={{ transform: 'rotate(-17deg)' }} />
          <div className="wheel-spin"><div className="wheel-rim" /><div className="wheel-rim wheel-rim-in" />
            {features.map((_, i) => <i key={i} className="wheel-spoke" style={{ transform: `rotate(${(i * 360) / features.length - 180}deg)` }} />)}</div>
          <div className="wheel-hub"><b>07</b><span>CAPABILITIES</span></div>
          {features.map((x, i) => (
            <button key={x.title} ref={(el) => { cards.current[i] = el; }} className={`wheel-card ${i === active ? 'is-active' : ''}`} onClick={() => setActive(i)} onFocus={() => setActive(i)} aria-label={x.title}>
              <span className="wc-in"><img src={featureImg(i)} alt="" style={{ filter: featureHue(i) }} /><span className="wc-txt"><small>{x.number}</small>{x.title}</span></span>
            </button>
          ))}
        </div>
      </div>
      <motion.div key={active} className="wheel-detail" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .45 }}>
        <span className="wd-icon"><Icon size={26} /></span>
        <span className="eyebrow"><i /> FEATURE {f.number} / {f.tag}</span>
        <h3>{f.title}</h3><p>{f.desc}</p><small>{f.metric}</small>
        <Link to={f.path} className="button-primary">Explore {f.title} <ArrowRight size={15} /></Link>
        <em className="wd-hint">Click any gondola · hover to pause the wheel</em>
      </motion.div>
    </section>
  );
}
