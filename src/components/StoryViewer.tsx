import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import type { Story } from '../domain/models';
import { SceneView } from './SceneView';
import { useMotionPreference } from '../hooks/useMotionPreference';
export function StoryViewer({ story }: { story: Story }) {
  const reduced = useMotionPreference(); const [index, setIndex] = useState(0); const [paused, setPaused] = useState(true); const [mode, setMode] = useState<'tap' | 'scroll'>('tap');
  const scrollRef = useRef<HTMLDivElement>(null); const [hidden, setHidden] = useState(document.hidden);
  useEffect(() => { const change = () => setHidden(document.hidden); document.addEventListener('visibilitychange', change); return () => document.removeEventListener('visibilitychange', change); }, []);
  useEffect(() => { if (paused || hidden || mode === 'scroll' || index === story.scenes.length - 1) return; const timer = window.setTimeout(() => setIndex(i => i + 1), 7000); return () => clearTimeout(timer); }, [paused, hidden, mode, index, story.scenes.length]);
  useEffect(() => { if (reduced) setPaused(true); }, [reduced]);
  useEffect(() => {
    if (mode !== 'scroll' || !scrollRef.current) return;
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setIndex(Number((entry.target as HTMLElement).dataset.index)); }, { root: scrollRef.current, threshold: .6 });
    scrollRef.current.querySelectorAll('[data-index]').forEach(el => observer.observe(el)); return () => observer.disconnect();
  }, [mode, story.id]);
  const go = (next: number) => { const value = Math.max(0, Math.min(story.scenes.length - 1, next)); setIndex(value); if (mode === 'scroll') scrollRef.current?.children[value]?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'nearest' }); };
  return <div className="story-viewer" onKeyDown={e => { if ((e.target as HTMLElement).matches('button, select, input')) return; if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); } }} tabIndex={0} aria-label={`${story.title} story viewer`}>
    <div className="viewer-toolbar"><span>{index + 1} / {story.scenes.length}</span><div className="segmented" aria-label="Viewer mode"><button aria-pressed={mode === 'tap'} onClick={() => setMode('tap')}>Tap</button><button aria-pressed={mode === 'scroll'} onClick={() => { setMode('scroll'); setPaused(true); }}>Scroll</button></div><button className="icon-button" title="Replay story" aria-label="Replay story" onClick={() => { go(0); setPaused(true); }}><RotateCcw size={18}/></button></div>
    <div className="scene-progress" aria-label="Scenes">{story.scenes.map((scene, i) => <button key={scene.id} aria-label={`Go to scene ${i + 1}`} aria-current={i === index ? 'step' : undefined} className={i <= index ? 'is-complete' : ''} onClick={() => go(i)}/>)}</div>
    {mode === 'tap' ? <div className="tap-stage"><AnimatePresence mode="wait"><motion.div key={story.scenes[index].id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .22 }}><SceneView scene={story.scenes[index]} style={story.style} accent={story.accent} paused={paused || hidden}/></motion.div></AnimatePresence><button className="tap-zone tap-zone--left" aria-label="Previous scene" disabled={index === 0} onClick={() => go(index - 1)}/><button className="tap-zone tap-zone--right" aria-label="Next scene" disabled={index === story.scenes.length - 1} onClick={() => go(index + 1)}/></div> : <div className="scroll-stage" ref={scrollRef}>{story.scenes.map((scene, i) => <div key={scene.id} data-index={i}><SceneView scene={scene} style={story.style} accent={story.accent} paused/></div>)}</div>}
    <div className="viewer-controls"><button className="icon-button" aria-label="Previous scene" disabled={index === 0} onClick={() => go(index - 1)}><ArrowLeft size={20}/></button><button className="play-button" disabled={mode === 'scroll'} onClick={() => { if (index === story.scenes.length - 1) { go(0); setPaused(false); } else setPaused(p => !p); }}>{paused || index === story.scenes.length - 1 ? <Play size={16}/> : <Pause size={16}/>} {mode === 'scroll' ? 'Scroll to explore' : paused || index === story.scenes.length - 1 ? 'Play story' : 'Pause story'}</button><button className="icon-button" aria-label="Next scene" disabled={index === story.scenes.length - 1} onClick={() => go(index + 1)}><ArrowRight size={20}/></button></div>
    <span className="sr-only" aria-live="polite">Scene {index + 1}: {story.scenes[index].title}</span>
  </div>;
}
