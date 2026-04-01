# Ad Engine — AI Ad Concept Generator

Generate Arcads-ready UGC video ad concepts and matching landing pages from a single product brief. Paste your product details, pick a tone, and get 4 video scripts + a fully designed landing page in seconds.

## What It Does

1. **Enter your product info** — name, description, audience, benefits, tone
2. **Optionally paste a website URL** — the engine scrapes brand colors, fonts, and assets to match your existing brand identity
3. **Get 4 ad concepts** — each with a scroll-stopping hook, full spoken script, tone direction, and CTA
4. **Get a landing page** — complete HTML, styled to match your brand, ready to deploy
5. **Generate AI UGC videos** — pick an Arcads actor and voice, and generate video ads directly from the dashboard

## Tech Stack

- **Next.js 16** (App Router + Turbopack)
- **Claude API** (Anthropic) — generates ad concepts and landing page HTML
- **Arcads API** — generates AI UGC-style video ads from scripts
- **Tailwind CSS 4**
- **Cheerio** — scrapes brand assets from websites

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/brodyautomates/ad-engine.git
cd ad-engine
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your API keys:

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) → API Keys |
| `ARCADS_CLIENT_ID` | [Arcads Dashboard](https://app.arcads.ai/) → Settings → API |
| `ARCADS_CLIENT_SECRET` | Same location as Client ID |
| `ARCADS_AUTH_TOKEN` | Base64-encode `client_id:client_secret`, prefix with `Basic ` |

**Generating your ARCADS_AUTH_TOKEN:**

```bash
echo -n "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" | base64
```

Then set: `ARCADS_AUTH_TOKEN=Basic <output-from-above>`

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy to Vercel in one click:

1. Push this repo to your GitHub account
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Add your environment variables in Vercel's project settings
4. Deploy

## Project Structure

```
ad-engine/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # App layout + metadata
│   ├── globals.css           # Tailwind + custom styles
│   └── api/
│       ├── generate/route.ts # Claude API — concepts + landing page
│       └── arcads/
│           ├── actors/route.ts    # List Arcads actors
│           ├── voices/route.ts    # List Arcads voices
│           ├── generate/route.ts  # Trigger video generation
│           └── status/route.ts    # Poll video status
├── components/
│   ├── campaign-form.tsx     # Product input form
│   ├── concept-card.tsx      # Ad concept display + Arcads trigger
│   ├── actor-picker.tsx      # Arcads actor/situation selector
│   ├── voice-picker.tsx      # Arcads voice selector
│   └── landing-preview.tsx   # Landing page iframe preview
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── arcads.ts             # Arcads API client
│   └── scrape.ts             # Brand website scraper
└── .env.local.example        # Environment variable template
```

## API Costs

- **Anthropic Claude** — each generation uses ~8,000 tokens across two parallel API calls (concepts + landing page). At current Sonnet pricing, roughly $0.03-0.05 per generation.
- **Arcads** — video generation costs depend on your Arcads plan. Each video uses one credit.

## License

MIT
