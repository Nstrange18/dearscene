import { isStory, type Story, type Media } from '../domain/models';
import type { DraftStore, MediaService } from './contracts';
const PREFIX = 'dearscene:v1:';
export function makeDraftStore(storage: Storage): DraftStore {
  return {
    list() { const stories: Story[] = []; for (let i = 0; i < storage.length; i++) { const key = storage.key(i); if (!key?.startsWith(PREFIX)) continue; const story = this.get(key.slice(PREFIX.length)); if (story) stories.push(story); } return stories.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); },
    get(id) { try { const value: unknown = JSON.parse(storage.getItem(PREFIX + id) || 'null'); return isStory(value) ? value : undefined; } catch { return undefined; } },
    save(story) { if (!isStory(story)) throw new Error('This draft contains invalid story data.'); storage.setItem(PREFIX + story.id, JSON.stringify(story)); },
    remove(id) { storage.removeItem(PREFIX + id); },
  };
}
export const drafts: DraftStore = {
  list: () => makeDraftStore(window.localStorage).list(),
  get: id => makeDraftStore(window.localStorage).get(id),
  save: story => makeDraftStore(window.localStorage).save(story),
  remove: id => makeDraftStore(window.localStorage).remove(id),
};
export const localMedia: MediaService = {
  async prepare(file) {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) throw new Error('Choose a JPG, PNG, WebP, or GIF image.');
    if (file.size > 4 * 1024 * 1024) throw new Error('Choose an image under 4 MB.');
    // Resize before persistence: data URLs survive reloads, unlike temporary blob URLs.
    const bitmap = await createImageBitmap(file);
    try {
      const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
      const context = canvas.getContext('2d'); if (!context) throw new Error('Image preview is unavailable in this browser.');
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      return { id: crypto.randomUUID(), kind: 'image', src: canvas.toDataURL('image/webp', .8), alt: file.name.replace(/\.[^.]+$/, ''), source: 'local' } satisfies Media;
    } finally { bitmap.close(); }
  },
};
