import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getTemplate, sampleStory } from '../data/templates';
import { createStory } from '../domain/models';
import { drafts } from '../services/local';
import { StoryViewer } from '../components/StoryViewer';
import { Missing } from './Viewer';
export function Create() {
  const { templateId = '' } = useParams(); const template = getTemplate(templateId); const navigate = useNavigate(); const [title, setTitle] = useState(''); const [error, setError] = useState('');
  if (!template) return <Missing title="That template is still unwritten."/>;
  return <main id="main" className="container create-page"><div><Link className="text-button" to="/templates"><ArrowLeft size={17}/> All templates</Link><p className="eyebrow">Your story starts here</p><h1>{template.name}</h1><p>{template.description}</p><form onSubmit={e => { e.preventDefault(); try { const story = createStory(template); story.title = title.trim() || template.name; drafts.save(story); navigate(`/editor/${story.id}`); } catch { setError('Could not save a new draft. Allow browser storage or free some space, then try again.'); } }}><label className="field-label" htmlFor="story-title">Give your story a name</label><input id="story-title" placeholder={template.name} value={title} maxLength={100} onChange={e => setTitle(e.target.value)}/><p className="field-help">Just for you. You can change this anytime.</p>{error && <p className="error-message" role="alert">{error}</p>}<button className="button button--fig" type="submit">Make it yours <ArrowRight size={18}/></button><p className="storage-note">Your draft and photos stay in this browser. No account needed.</p></form></div><StoryViewer story={sampleStory(template)}/></main>;
}
