import data from './templates.json';
import type { Template, Story } from '../domain/models';
export const templates = data as Template[];
export const getTemplate = (id: string) => templates.find(t => t.id === id);
export function sampleStory(template: Template): Story {
  return { version: 1, id: `sample-${template.id}`, templateId: template.id, title: template.name, style: template.style, accent: template.accent, scenes: template.scenes, updatedAt: '2026-11-12T00:00:00.000Z' };
}
