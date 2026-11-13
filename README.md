# DearScene — Stage 1

Local-first cinematic stories built with React, Vite, TypeScript, Tailwind, Motion for React and React Router.

## Run
Requires Node 22.13+ and npm.

```sh
npm install
npm run dev
npm test
npm run build
```

Open the local URL printed by Vite. Production hosts must serve `index.html` for unknown paths so direct route links work.

## Try it
1. Browse `/templates`, filter by occasion or search a feeling.
2. Open any template preview. Try Tap, Scroll, Play, Pause and Replay.
3. Choose a template, name your story, and create a draft.
4. Edit text, replace a photo, change colors, move/add/remove scenes. Drafts save on each change.
5. Preview the complete story. On a phone use the editor’s Edit / Preview switch.
6. Create a demo link to visit `/s/:slug`. This is a local mock, accessible only in the browser holding the draft. Built-in samples also work at `/s/our-story`, `/s/your-special-day`, `/s/look-how-far`.
7. Return to the gallery to resume or delete local drafts.

## Storage and media
Drafts use versioned, validated JSON in localStorage. Images are resized to a maximum 1400px edge and encoded as WebP before saving; JPG/PNG/WebP/GIF up to 4 MB are accepted. GIF becomes a still image. Browser storage is limited: failures are visible, and unsaved edits remain in editor memory until you leave. Clearing browser data removes drafts. There is no server upload, authentication, payment, watermark or real online publication.

Sample photography loads from Unsplash and needs a network connection. User images and self-hosted fonts work locally. Manrope and Fraunces are distributed through Fontsource under their included open font licenses.

## Boundaries
`src/services/contracts.ts` defines draft, media, identity and publishing contracts. Only the draft and media adapters are implemented. Future services should replace these adapters without changing the scene renderer. Brand colors live in semantic CSS tokens. Custom story colors are serialized with the story and get a computed light/dark foreground.

See `IMPLEMENTATION.md` for the architecture and Stage 2 scope.
