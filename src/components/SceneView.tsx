import { animate, motion, useMotionValue } from 'motion/react';
import { useEffect, type CSSProperties } from 'react';
import type { Scene, StoryStyle } from '../domain/models';
import { useMotionPreference } from '../hooks/useMotionPreference';
export function luminanceFor(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)!.map(v => { const n = parseInt(v, 16) / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; });
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
export function inkFor(hex: string) {
  const luminance = luminanceFor(hex);
  // Preserve brand inks when they pass WCAG AA; use black/white for midtone custom colors.
  if ((luminance + .05) / (luminanceFor('#342642') + .05) >= 4.5) return '#342642';
  if ((luminanceFor('#FBF8F2') + .05) / (luminance + .05) >= 4.5) return '#FBF8F2';
  return luminance > .179 ? '#000000' : '#FFFFFF';
}
export function SceneView({ scene, style, accent, paused = false, miniature = false }: { scene: Scene; style: StoryStyle; accent: string; paused?: boolean; miniature?: boolean }) {
  const reduced = useMotionPreference(); const scale = useMotionValue(1);
  useEffect(() => { scale.set(1); }, [scene.media?.src, scale]);
  useEffect(() => { if (reduced || miniature) { scale.set(1); return; } if (paused) return; const controls = animate(scale, 1.06, { duration: Math.max(0, (1.06 - scale.get()) / .06 * 7), ease: 'linear' }); return () => controls.stop(); }, [paused, reduced, miniature, scale, scene.media?.src]);
  return <article className={`scene scene--${style} scene--${scene.layout} ${miniature ? 'scene--mini' : ''}`} style={{ background: scene.background, color: inkFor(scene.background), '--story-accent': accent } as CSSProperties}>
    {scene.media && <div className="scene-photo"><motion.img key={scene.media.src} src={scene.media.src} alt={scene.media.alt} loading={miniature ? 'lazy' : 'eager'} style={{ scale }} onError={e => { e.currentTarget.style.opacity = '0'; }} /><span className="photo-fallback" aria-hidden="true">A moment to remember</span></div>}
    <motion.div className="scene-copy" initial={reduced || miniature ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
      <p className="scene-eyebrow">{scene.eyebrow}</p><h2>{scene.title}</h2><p className="scene-body">{scene.body}</p>
    </motion.div>
    {style === 'celebration' && <div className="celebration-spark" aria-hidden="true">✳</div>}
    {style === 'journey' && <div className="journey-line" aria-hidden="true"/>}
  </article>;
}
