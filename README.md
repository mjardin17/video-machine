# Video Machine — Commercial Factory

A standalone, integration-ready commercial-planning service. It accepts verified product-listing data, creates factual `Clean Showcase` plans for vertical, square, and landscape outputs, and exposes campaign/status contracts that Boss Lister can call later.

## Current scope

- HTTP API using Node's built-in server
- In-memory campaign and render-job store for local development
- Deterministic photo selection, eligibility checks, factual-copy guard, scene planning, and quality scoring
- Mock render queue and artifact-verification contract
- Typed Boss Lister client/webhook payloads, with no network requests

## Explicitly not included

No Boss Lister changes, deployment, database, cloud storage, Remotion, FFmpeg, real MP4 rendering, paid services, publishing, or external AI/image/video calls are included in this foundation.

## Run locally

```bash
npm install
npm run dev
```

The server listens on `http://localhost:3000` by default. Set `PORT` to change it.

## API

### `POST /v1/campaigns`

Creates an in-memory campaign and one mock render job per requested aspect ratio.

```json
{
  "externalProductId": "boss-lister-product-123",
  "title": "Nike Air Max 90",
  "price": { "amount": 85, "currency": "USD" },
  "condition": "Excellent",
  "size": "Men's 10",
  "cta": "Message to buy",
  "photos": [
    { "id": "photo-1", "url": "https://example.com/hero.jpg", "width": 1600, "height": 2000, "approved": true },
    { "id": "photo-2", "url": "https://example.com/detail.jpg", "width": 1600, "height": 2000, "approved": true }
  ],
  "aspectRatios": ["9:16", "1:1", "16:9"]
}
```

### `GET /v1/campaigns/:campaignId`

Returns campaign eligibility, selected photos, scene plans, jobs, audit events, and a Boss Lister-compatible status payload.

### `GET /v1/campaigns/:campaignId/artifacts`

Returns only verified artifacts. The foundation creates no artifacts because no renderer is connected.

### `GET /health`

Returns service readiness and rendering mode.

## Future Boss Lister connection

Boss Lister can later POST the verified listing payload to `/v1/campaigns`, retain `campaignId`, poll the campaign endpoint, or receive a completed-campaign webhook. The `src/connectors/bossLister.ts` module defines those typed contracts without connecting to Boss Lister today.
