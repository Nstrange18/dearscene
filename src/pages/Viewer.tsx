import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { drafts } from '../services/local';
import { templates, sampleStory } from '../data/templates';
import { StoryViewer } from '../components/StoryViewer';
export function Missing({ title = 'This chapter isn’t here yet.' }: { title?: string }) { return <main id="main" className="container empty-state missing-page"><h1>{title}</h1><p>It may be saved in another browser, or the link may be incomplete.</p><Link className="button button--fig" to="/templates">Explore templates <ArrowRight size={18}/></Link></main>; }
export function Viewer({ published = false }: { published?: boolean }) {
  const { storyId = '', slug = '' } = useParams(); let story;
  try { story = published ? drafts.list().find(s => s.slug === slug) || templates.filter(t => t.id === slug).map(sampleStory)[0] : drafts.get(storyId); } catch { return <Missing title="Your browser storage is unavailable."/>; }
  if (!story) return <Missing/>;
  return <main id="main" className="viewer-page container"><div className="viewer-page-header">{published ? <><p className="small-label">Local demo · shared publishing comes in Stage 2</p><Link className="text-button" to="/templates">Make your own <ArrowRight size={16}/></Link></> : <><Link className="text-button" to={`/editor/${story.id}`}><ArrowLeft size={16}/> Back to editing</Link><span>{story.title}</span></>}</div><StoryViewer key={story.id} story={story}/></main>;
}
