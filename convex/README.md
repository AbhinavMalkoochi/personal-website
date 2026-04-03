# Convex Backend Notes

This directory contains Spotify-related backend logic for the personal site.

## Files

- `schema.ts`: table schemas and validators.
- `spotify.ts`: public query + throttled refresh action + internal credential/cache logic.
- `crons.ts`: schedules Spotify polling as a safety net.

## Tables

### `spotifyCredentials`

- `accessToken: string`
- `refreshToken: string`
- `expiresAt: number`

Only internal functions read/write this table.

### `spotifyNowPlaying`

- `isPlaying: boolean`
- `trackName: string`
- `artistName: string`
- `albumName: string`
- `albumArt: string`
- `trackUrl?: string | null`
- `trackId?: string`
- `progressMs: number`
- `durationMs: number`
- `fetchedAt: number`

This table stores one canonical snapshot consumed by the frontend query.

## Data Flow (SWR Caching Pattern)

1. Frontend subscribes to `spotify.currentlyPlaying` via `useQuery` — all visitors share the same reactive row.
2. Frontend calls `spotify.ensureFreshNowPlaying` every ~10s. The action checks `fetchedAt` and short-circuits if the cache is younger than 10s, ensuring at most one Spotify API call per 10s regardless of visitor count.
3. When a song is playing, the frontend also schedules a predictive fetch for the exact moment the song should end, catching transitions instantly.
4. `refreshNowPlaying` (internal action) handles token refresh and Spotify API calls, then writes to `spotifyNowPlaying` via `updateNowPlaying`.
5. When the DB updates, Convex pushes new data to every subscribed frontend via WebSockets.
6. The frontend uses `requestAnimationFrame` to smoothly interpolate progress between server updates.
7. A safety cron runs `refreshNowPlaying` every 5 minutes in case no visitors are polling.

## Validation/Resilience Rules

- `trackUrl` is optional/nullable to prevent runtime validation crashes when Spotify omits URL fields.
- Progress is clamped to `[0, durationMs]`.
- When idle, the mutation skips writes unless metadata actually changed (avoids needless subscription pushes).
- API failures do not delete cached playback data.
- `204` responses mark playback inactive to enable last-played fallback.

## Commands

Run Convex functions locally with the project root scripts/workflow you already use, and verify with:

```bash
npm run lint
```
