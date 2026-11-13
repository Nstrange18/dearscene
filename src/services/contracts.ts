import type { Story, Media } from '../domain/models';
export interface DraftStore { list(): Story[]; get(id: string): Story | undefined; save(story: Story): void; remove(id: string): void }
export interface MediaService { prepare(file: File): Promise<Media> }
export interface AuthService { currentUser(): Promise<{ id: string } | null> }
export interface PublishingService { publish(story: Story): Promise<{ slug: string }>; find(slug: string): Promise<Story | undefined> }
