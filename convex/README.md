# Convex Backend Notes

This directory contains Spotify-related backend logic for the personal site.

## Files

- `schema.ts`: table schemas and validators.
- `spotify.ts`: public query + internal credential/token/cache logic + Spotify polling action.
- `crons.ts`: schedules Spotify polling.

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

## Data Flow

1. Safety cron runs every 5 minutes: `internal.spotify.pollNowPlaying`.
2. Client tabs report heartbeat presence with `spotify.reportViewerPresence`.
3. Client tabs call `spotify.ensureFreshNowPlaying` on mount/focus/visibility and light intervals.
4. `ensureFreshNowPlaying` checks staleness/backoff and triggers `internal.spotify.pollNowPlaying` only when needed.
5. Poll action uses a lock (`spotifyPollState`) to prevent duplicate concurrent refreshes.
6. Poll action refreshes token when near expiry and fetches Spotify currently-playing.
7. Responses are normalized and upserted into `spotifyNowPlaying`, with write suppression for low-signal updates.
8. Inactive/non-track states preserve last track metadata and set `isPlaying: false`.
9. Public `currentlyPlaying` query remains a cache read for all clients.

## Validation/Resilience Rules

- `trackUrl` is optional/nullable to prevent runtime validation crashes when Spotify omits URL fields.
- Progress is clamped to `[0, durationMs]`.
- Unchanged snapshots are skipped to reduce mutation churn.
- Polling uses backoff on `429`/`5xx` and lock-based dedupe under concurrent triggers.
- Without recent viewers, refresh cadence is heavily reduced to lower always-on cost.
- API failures (`401/403`, `429`, `5xx`) do not delete cached playback data.
- `204` responses do not clear the document; they mark playback inactive to enable last-played fallback.

## Commands

Run Convex functions locally with the project root scripts/workflow you already use, and verify with:

```bash
npm run lint
```
