# A Little Birthday Surprise — Asyamsalsa ♡

A responsive, interactive birthday experience built with Next.js, React, TypeScript, Tailwind-compatible CSS, and Framer Motion.

## Requirements
- Node.js 20.9 or later
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Add the six photos
Place the actual images in `public/images/birthday/` using these exact filenames:
- `photo-1.jpg`
- `photo-2.jpg`
- `photo-3.jpg`
- `photo-4.jpg`
- `photo-5.jpg`
- `photo-6.jpg`

The gallery displays clear placeholders until each image is present. If your images are PNG or WebP, update the paths in `components/BirthdayExperience.tsx` in the `photos` array.

## Personalize the letter
Edit the birthday letter text in `components/BirthdayExperience.tsx`, in the `scene === "letter"` section. Photo captions and the five star messages are also defined near the top of that file.

## Build
```bash
npm run build
npm run start
```

## Deploy to Vercel
Push the project to a Git repository and import it into Vercel. The default Next.js settings should work.

## Notes
- No backend or database is required.
- Music is not included because no suitable audio file was supplied. The experience works without sound.
- No real photos are included. Add only photos you have permission to use.
