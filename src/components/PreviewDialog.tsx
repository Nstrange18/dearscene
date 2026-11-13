import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { X, ArrowRight } from 'lucide-react';
import type { Template } from '../domain/models';
import { sampleStory } from '../data/templates';
import { StoryViewer } from './StoryViewer';
export function PreviewDialog({ template, close }: { template: Template; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); const prior = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = prior; }; }, []);
  return <dialog className="preview-dialog" ref={ref} onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }} aria-label={`${template.name} template preview`}><div className="dialog-header"><strong>{template.name}</strong><button autoFocus className="icon-button" onClick={close} aria-label="Close preview"><X size={22}/></button></div><StoryViewer story={sampleStory(template)}/><div className="dialog-footer"><p>Make this story your own.</p><Link className="button button--citrus" to={`/create/${template.id}`}>Use this template <ArrowRight size={18}/></Link></div></dialog>;
}
