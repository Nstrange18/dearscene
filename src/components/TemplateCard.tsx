import { Link } from 'react-router';
import { ArrowUpRight, Play } from 'lucide-react';
import type { Template } from '../domain/models';
import { SceneView } from './SceneView';
export function TemplateCard({ template, onPreview }: { template: Template; onPreview: (template: Template) => void }) {
  return <article className={`template-card card--${template.style}`}><button className="template-art" aria-label={`Preview ${template.name}`} onClick={() => onPreview(template)}><SceneView scene={template.scenes[0]} style={template.style} accent={template.accent} miniature/><span className="preview-affordance"><Play size={14}/> Preview story</span></button><div className="template-details"><div><span className="small-label">{template.occasion}</span><h3>{template.name}</h3></div><Link className="circle-link" to={`/create/${template.id}`} aria-label={`Create ${template.name}`}><ArrowUpRight size={22}/></Link></div><p>{template.description}</p></article>;
}
