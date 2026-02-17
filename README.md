# Personal Website

Personal site built with Next.js App Router and Convex-backed Spotify integration.

## Stack

- Next.js 16 + React 19
- Tailwind CSS v4 + global CSS
- Convex (cron polling + cached now-playing state)

## Key App Areas

- `app/layout.tsx`: root providers and global UI layers.
- `app/components/SpotifyNowPlaying.tsx`: hideable Spotify card with live progress.
- `convex/spotify.ts`: token refresh, Spotify polling, normalization, and cache updates.
- `convex/schema.ts`: Convex table schemas.

## Spotify Behavior

- Polls Spotify currently-playing every 15 seconds from Convex cron.
- Stores a normalized snapshot in `spotifyNowPlaying`.
- Keeps the last known track when playback is inactive and marks `isPlaying: false`.
- Handles missing URLs/nullable IDs safely to avoid runtime validation errors.

## Mobile and UI Notes

- Spotify card is hideable and restored with a compact button.
- Main content reserves bottom space so the card does not block content.

## Local Development

```bash
npm install
npm run dev
```

Lint:

```bash
npm run lint
```

