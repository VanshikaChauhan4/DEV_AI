# DevMind AI — cinematic frontend

A responsive React + TypeScript + Vite frontend for DevMind AI, redesigned around the supplied visual references: atmospheric full-screen imagery, editorial typography, luminous details, and scroll-linked parallax depth.

## Included

- Layered parallax landing hero using GSAP ScrollTrigger and Lenis smooth scrolling.
- Scroll reveal animations, responsive layouts, interactive capability selector, workflow section, principles section, and CTA.
- Existing workspace routes retained as frontend previews.
- Lucide icons and Framer Motion transitions.
- Remote Unsplash image URLs are used for atmospheric photography; replace them with local licensed assets if you need offline use.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Main files

- `src/app/App.tsx` — landing page, feature interactions, and workspace routes.
- `src/components/ui/parallax-scrolling.tsx` — reusable GSAP/ScrollTrigger + Lenis parallax hero.
- `src/components/ui/halftone-wordmark-footer.tsx` — existing interactive footer.
- `src/styles/globals.css` — responsive styles, image layers, and visual design system.

## Component folder / shadcn note

This project uses `src/components/ui/` as the reusable UI component location, which follows the common shadcn-style convention. Keeping shared UI components there makes them easy to discover and reuse. The project already uses TypeScript. Tailwind and shadcn/ui are not required because this version uses a custom CSS design system. If you want to add shadcn/ui later, follow the current Vite instructions at https://ui.shadcn.com/docs/installation/vite and align its component alias with `src/components/ui`.

## Backend status

Workspace input actions are explicitly marked as UI previews. They do not claim to run live AI analysis until connected to the DevMind backend.


## Updated landing page visuals

The landing page now uses all six supplied visual references from `public/assets/images/`: `moonlit-bloom.png`, `polaris-landscape.png`, `luminous-valley.png`, `imagine-create.png`, `dreamscape-tree.png`, and `strange-world.png`. The hero uses a shorter, product-focused message and the visual mosaic introduces the six reference images with new captions. The reference files are kept locally so they do not depend on third-party image hosting.

Run `npm install` and then `npm run dev` from this `frontend` directory.
