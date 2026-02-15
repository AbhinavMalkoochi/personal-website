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

1. Cron runs every 15 seconds: `internal.spotify.pollNowPlaying`.
2. Poll action refreshes token if near expiry.
3. Poll action calls Spotify currently-playing endpoint.
4. Response is normalized and upserted into `spotifyNowPlaying`.
5. Inactive/non-track states preserve last track metadata and set `isPlaying: false`.
6. Public `currentlyPlaying` query returns playback metadata to the client.

## Validation/Resilience Rules

- `trackUrl` is optional/nullable to prevent runtime validation crashes when Spotify omits URL fields.
- Progress is clamped to `[0, durationMs]`.
- API failures (`401/403`, `429`, `5xx`) do not delete cached playback data.
- `204` responses do not clear the document; they mark playback inactive to enable last-played fallback.

## Commands

Run Convex functions locally with the project root scripts/workflow you already use, and verify with:

```bash
npm run lint
```
