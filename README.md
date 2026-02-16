# LuminaWrite ✍️

> Professional content creation platform — write faster, optimize smarter, publish everywhere.

## Features

- **Smart Writing Studio** — Real-time suggestions, SEO keywords & sentiment analysis
- **Magic Draft** — Generate full articles from a single topic
- **Content Refiner** — Polish any text with one click
- **Image Generator** — Create visuals for your content
- **Multi-Channel Preview** — Instagram, LinkedIn & Twitter previews
- **Content Library** — Organize and manage all your drafts
- **Performance Analytics** — Track reach and engagement

## Tech Stack

- React 19 + TypeScript
- Vite + Tailwind CSS
- Lucide React + Recharts
- [@google/genai](https://www.npmjs.com/package/@google/genai)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local and add your API key

# 3. Run
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_KEY` | Your API key from [ai.google.dev](https://ai.google.dev) |

> ⚠️ Never commit `.env.local` to GitHub!

## Build for Production

```bash
npm run build
npm run preview
```

## License

© 2025 LuminaWrite
