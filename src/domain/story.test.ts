import { describe, expect, it } from 'vitest';
import { createStory, isStory, moveScene, removeScene } from './models';
import { templates } from '../data/templates';
import { makeDraftStore, localMedia } from '../services/local';
import { inkFor, luminanceFor } from '../components/SceneView';
function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return { get length() { return map.size; }, clear: () => map.clear(), getItem: k => map.get(k) ?? null, setItem: (k, v) => { map.set(k, v); }, removeItem: k => { map.delete(k); }, key: i => [...map.keys()][i] ?? null };
}
describe('template-driven stories', () => {
  it('chooses readable foregrounds across brand colors and custom midtones', () => {
    for (const color of ['#342642', '#FBF8F2', '#F3AD98', '#DDD2EF', '#DFF29F', '#777777', '#888888', '#ff0000', '#0000ff']) {
      const foreground = luminanceFor(inkFor(color)); const background = luminanceFor(color);
      expect((Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05)).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('creates a valid independent story from each JSON template', () => {
    for (const template of templates) {
      const story = createStory(template); expect(isStory(story)).toBe(true); expect(story.scenes).not.toBe(template.scenes);
      story.scenes[0].title = 'My changed headline'; expect(template.scenes[0].title).not.toBe('My changed headline');
    }
  });
  it('moves scenes without changing the original or losing content', () => {
    const story = createStory(templates[0]); const first = story.scenes[0]; const next = moveScene(story, first.id, 1);
    expect(next.scenes[1]).toEqual(first); expect(story.scenes[0]).toEqual(first); expect(next.scenes).toHaveLength(story.scenes.length);
    expect(moveScene(story, first.id, -1)).toBe(story); expect(moveScene(story, 'missing', 1)).toBe(story);
  });
  it('keeps at least one scene when removing', () => {
    const story = createStory(templates[0]); const next = removeScene(story, story.scenes[0].id); expect(next.scenes).toHaveLength(3);
    const single = { ...story, scenes: [story.scenes[0]] }; expect(removeScene(single, single.scenes[0].id)).toBe(single);
  });
  it('rejects unsafe media, invalid layouts, duplicate scene IDs and unsupported versions', () => {
    const story = createStory(templates[0]);
    expect(isStory({ ...story, version: 9 })).toBe(false);
    expect(isStory({ ...story, scenes: [] })).toBe(false);
    expect(isStory({ ...story, scenes: [story.scenes[0], story.scenes[0]] })).toBe(false);
    expect(isStory({ ...story, scenes: [{ ...story.scenes[0], layout: 'unknown' }] })).toBe(false);
    expect(isStory({ ...story, scenes: [{ ...story.scenes[0], media: { ...story.scenes[0].media, src: 'javascript:alert(1)' } }] })).toBe(false);
  });
});
describe('local drafts', () => {
  it('round trips edited content and local media, and removes drafts', () => {
    const store = makeDraftStore(memoryStorage()); const story = createStory(templates[0]); story.scenes[0].media = { id: 'local', source: 'local', kind: 'image', src: 'data:image/webp;base64,AAAA', alt: 'My photo' }; story.title = 'My own story';
    store.save(story); expect(store.get(story.id)).toEqual(story); expect(store.list()).toEqual([story]); store.remove(story.id); expect(store.get(story.id)).toBeUndefined();
  });
  it('ignores malformed/foreign records without dropping valid drafts', () => {
    const storage = memoryStorage(); const store = makeDraftStore(storage); const story = createStory(templates[0]);
    storage.setItem('another-app', 'private data'); storage.setItem('dearscene:v1:broken', '{bad json'); storage.setItem('dearscene:v1:invalid', '{}'); store.save(story);
    expect(store.list()).toEqual([story]); expect(storage.getItem('another-app')).toBe('private data');
  });
  it('exposes quota failures so the editor cannot falsely report success', () => {
    const storage = memoryStorage(); storage.setItem = () => { throw new Error('Quota exceeded'); }; const store = makeDraftStore(storage);
    expect(() => store.save(createStory(templates[0]))).toThrow('Quota exceeded');
  });
  it('rejects invalid images before reading them', async () => {
    await expect(localMedia.prepare(new File(['text'], 'test.txt', { type: 'text/plain' }))).rejects.toThrow('Choose a JPG');
    await expect(localMedia.prepare(new File([new Uint8Array(4 * 1024 * 1024 + 1)], 'big.png', { type: 'image/png' }))).rejects.toThrow('under 4 MB');
  });
});
