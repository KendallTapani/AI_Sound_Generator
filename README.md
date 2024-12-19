This is a Nextjs app that uses the Elevenlabs sound-generation endpoint to Generate and Play audio, generated using the text. I noticed that although complex sounds are possible to get perfect, it is very difficult in the prompting, and it is easier to generate really good individual sounds, save the file, and edit them in an audio editor, and that is what the app does. This is a manual fetch, not using the elevenlabs library.
Very good product, editing the individual sounds in Audacity makes a really good end result.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
