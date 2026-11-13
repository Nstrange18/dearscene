# Stage 1 verification

## Automated checks
- `npm run build`: passed, including strict TypeScript compilation and the Vite production build.
- `npm test`: 9 tests passed.
- Coverage: independent template copies, valid story schemas, immutable scene ordering, minimum scene count, malformed records and unsafe media URLs, local image/draft round trips, quota failures, image type/size validation, and foreground contrast across brand/custom colors.

## Browser checks
- Home, gallery, create, editor, saved-story preview and local mock-published routes opened successfully.
- Three art directions inspected: scrapbook, celebration and cinematic journey.
- Gallery occasion filters, positive/negative search results and clearing filters worked.
- Viewer Play/Pause, restarting from the final scene, scroll navigation and Replay worked.
- Changing the reduced-motion preference during playback stopped zoom and paused playback; computed photo transform became `none`.
- Edited headline and selected local image survived a reload.
- Scene reordering and adding worked. Removal confirmation preserved the scene on cancel and removed it on confirm.
- Background selection updated the renderer to Dream Lilac (`rgb(221, 210, 239)`).
- Mobile Edit/Preview switch showed a preview matching the full 844px viewport height.
- Home and gallery at a 320px viewport had document scroll width equal to available content width (305px with a 15px desktop scrollbar). Desktop home and editor inspected at 1440px; editor/preview also inspected at 390px.
- Mobile navigation closed after section navigation and scrolled to How it works.
- Mock demo link opened the saved story. Missing draft IDs showed a recovery screen.
- Draft deletion confirmed and removed the disposable QA drafts. No browser page errors were reported in the final checks.

## Delivery boundaries
No remote Git push, deployment, real authentication, server storage, upload service, online publishing, payments or watermarks. Mock demo links require the same browser data. Clearing browser storage removes drafts; quota failures are surfaced in the editor. Sample photography needs network access. Production hosting needs SPA route fallback to `index.html`.

The local repository uses branch `stage-1`. The downloadable archive includes source and `dist/`, excluding Git metadata and `node_modules/`.

## Stage 2
Implement the existing service contracts with real identity, durable storage, upload validation and server-backed publishing. Add ownership/access controls, slug handling, data migrations and cross-device conflict handling.
