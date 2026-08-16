# Caliber

Professional meeting and assessment frontend for investor sessions, client technical reviews, candidate interviews, freelancer/agency evaluations, and other assessment workflows.

This phase is **UI and application structure only**. Video, audio, screen sharing, code execution, recording, AI, and the production backend are represented with mock data and simulated interactions. No external meeting APIs or SDKs are used.

Built with **Next.js 16** (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Run locally1

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What’s included

- Role-aware dashboard (company, investor, client, candidate)
- User and company profiles
- Session list, detail, and creation wizard
- Meeting room: participant layout, chat, simulated screen share, controls
- Coding assessment workspace and system-design whiteboard
- Evaluation questions, private notes, scorecards
- Reports and settings
- Reusable UI primitives in `src/components/ui.tsx`
- Typed mock domain layer in `src/lib/` ready to swap for a real API

Use **View as** in the sidebar to preview investor, client, candidate, and company experiences.
