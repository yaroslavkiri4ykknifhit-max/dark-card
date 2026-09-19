# Digital Black Card MVP

## Setup Instructions

1. **Frontend**: Open `index.html` locally or host it on GitHub Pages. Update the `WORKER_URL` inside `index.html` to point to your deployed Cloudflare Worker URL.
2. **Backend**: Deploy `worker.js` to Cloudflare Workers.

## Third-Party API Configuration

I have used **PassNinja** for the third-party API, as it allows generating Apple Wallet passes via REST API without immediately needing an Apple Dev Certificate for testing.

1. Go to [PassNinja](https://passninja.com/) and create a free account.
2. Navigate to your dashboard to obtain your free API Key.
3. Open `worker.js` and replace `YOUR_PASSNINJA_API_KEY_HERE` with your actual API key.
4. Deploy the updated `worker.js` to Cloudflare Workers.
