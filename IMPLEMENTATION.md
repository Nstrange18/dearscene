# DearScene Stage 1

New local project: no existing repository was supplied. No deployment or remote push.

## Architecture
- React + Vite + TypeScript; React Router owns the six requested route families.
- CSS semantic tokens + Tailwind; self-hosted Fraunces/Manrope; Motion respects reduced motion.
- `domain/`: serializable, versioned Story / Scene / Template / Media models and immutable editing operations.
- `data/templates.json`: three distinct editorial story directions, consumed by one renderer.
- `services/`: replaceable draft, media, auth and publishing contracts; local-only adapters in Stage 1.
- `components/`: shared navigation, template cards, scene renderer and tap/scroll story viewer.
- `pages/`: home, filtered gallery, create, editor, preview and mock published viewer.

## Implementation and verification
1. Build tokens, templates and storage boundaries.
2. Build responsive discovery pages and interactive previews.
3. Build editor, autosave, media replacement and viewer controls.
4. Verify model/storage edge cases, route workflows, production build and responsive browser behavior.

## Stage 2
Connect real identity, durable draft/media storage and upload validation; add server-backed publishing, slug ownership and access control. Add migrations and cross-device conflict handling. No payments or watermarks are part of Stage 1.
