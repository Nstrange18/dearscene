export type StoryStyle = 'scrapbook' | 'celebration' | 'journey';
export type SceneLayout = 'cover' | 'split' | 'quote' | 'closing';
export interface Media { id: string; kind: 'image'; src: string; alt: string; source: 'sample' | 'local' }
export interface Scene { id: string; layout: SceneLayout; eyebrow: string; title: string; body: string; media?: Media; background: string }
export interface Template { id: string; name: string; description: string; occasion: string; style: StoryStyle; accent: string; scenes: Scene[] }
export interface Story { version: 1; id: string; templateId: string; title: string; style: StoryStyle; accent: string; scenes: Scene[]; updatedAt: string; slug?: string }
export function createStory(template: Template): Story {
  return { version: 1, id: crypto.randomUUID(), templateId: template.id, title: template.name, style: template.style, accent: template.accent, scenes: structuredClone(template.scenes), updatedAt: new Date().toISOString() };
}
export function moveScene(story: Story, id: string, direction: -1 | 1): Story {
  const scenes = [...story.scenes]; const from = scenes.findIndex(s => s.id === id); const to = from + direction;
  if (from < 0 || to < 0 || to >= scenes.length) return story;
  [scenes[from], scenes[to]] = [scenes[to], scenes[from]]; return { ...story, scenes };
}
export function removeScene(story: Story, id: string): Story {
  return story.scenes.length < 2 ? story : { ...story, scenes: story.scenes.filter(s => s.id !== id) };
}
const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const hex = (v: unknown) => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);
export function isStory(value: unknown): value is Story {
  if (!record(value) || value.version !== 1 || !['scrapbook', 'celebration', 'journey'].includes(String(value.style)) || !hex(value.accent)) return false;
  if (!['id', 'templateId', 'title', 'updatedAt'].every(k => typeof value[k] === 'string') || !Array.isArray(value.scenes) || !value.scenes.length) return false;
  const ids = new Set<string>();
  return value.scenes.every(s => {
    if (!record(s) || !['cover', 'split', 'quote', 'closing'].includes(String(s.layout)) || !['id', 'eyebrow', 'title', 'body'].every(k => typeof s[k] === 'string') || !hex(s.background) || ids.has(String(s.id))) return false;
    ids.add(String(s.id));
    return s.media === undefined || (record(s.media) && s.media.kind === 'image' && typeof s.media.id === 'string' && typeof s.media.alt === 'string' && ['sample', 'local'].includes(String(s.media.source)) && typeof s.media.src === 'string' && /^(https:\/\/|data:image\/(png|jpeg|webp|gif);base64,)/.test(s.media.src));
  });
}
