# SoundSelf

**AI-powered Spotify personality analyzer.** Connects to your Spotify account, runs K-Means clustering on your listening history, and uses Claude to generate a personalised music personality profile.

---

## What it does

1. **Authenticates** with Spotify via OAuth 2.0 (implemented manually without a library)
2. **Fetches** your top tracks and artists across three time windows (4 weeks, 6 months, all time)
3. **Engineers features** from track metadata — release year, rank score, listening recency, track duration, cross-timeframe presence — since Spotify deprecated their audio features endpoint in November 2024
4. **Clusters** your tracks into 3 groups using K-Means (scikit-learn) to identify distinct listening modes
5. **Generates** a personality archetype and description via the Claude API (Haiku) based on cluster composition
6. **Displays** a dashboard with your archetype, top artists, top tracks, recently played, and listening stats (artist diversity, era breakdown, avg track length)

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, React |
| ML backend | Python, Flask, scikit-learn |
| AI | Anthropic Claude API (Haiku) |
| Auth | Spotify OAuth 2.0 (manual implementation) |
| Styling | Inline CSS, Google Fonts (Space Grotesk + Inter) |

---

## Architecture

```
Browser → Next.js (App Router)
              ├── /api/auth/login        → redirects to Spotify OAuth
              ├── /api/auth/callback     → exchanges code for token, sets cookie
              ├── /api/spotify/data      → fetches top artists, tracks, recently played
              ├── /api/ml/cluster        → fetches tracks, engineers features, calls Flask
              └── /api/personality       → calls ML endpoint + Claude API, returns profile

Flask (port 5000)
              └── /cluster              → receives feature vectors, runs K-Means, returns clusters
```

---

## ML approach

Spotify deprecated their audio features API (valence, energy, danceability) in November 2024, making it unavailable for new apps. Rather than using a third-party workaround, I engineered a custom feature set from available track metadata:

- `release_year` — normalised release year (anchored to 1960)
- `rank_score` — position in top 50 (inverted, higher rank = higher score)
- `is_recent_hit` — whether the track appears in short-term (4 week) top tracks
- `is_all_time` — whether the track appears in long-term (multi-year) top tracks
- `duration` — normalised track length

Features are standardised with `StandardScaler` before clustering. Missing values are imputed using column means via `SimpleImputer`. K-Means runs with k=3 and a fixed random seed for reproducibility.

---

## Running locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Spotify Developer app with `http://127.0.0.1:3000/api/auth/callback` as the redirect URI
- An Anthropic API key

### Setup

```bash
# Clone the repo
git clone https://github.com/a3214781/soundself
cd soundself/spotify-personality

# Install Next.js dependencies
npm install

# Set up Python ML backend
cd ml
python3 -m venv venv
source venv/bin/activate
pip install flask scikit-learn numpy
```

Create `.env.local` in `spotify-personality/`:

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
AUTH_SECRET=any_random_string
AUTH_URL=http://127.0.0.1:3000
ANTHROPIC_API_KEY=your_anthropic_key
```

### Run

Terminal 1 — Flask ML server:
```bash
cd ml
source venv/bin/activate
python3 app.py
```

Terminal 2 — Next.js:
```bash
cd spotify-personality
npx next dev --hostname 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000`.

---

## Notes

- The Spotify access token expires after ~1 hour. Clear cookies and log in again to refresh.
- The personality analysis takes 10–15 seconds on first load — it's running the ML pipeline and a Claude API call server-side before rendering.
- The `ml/` folder requires the virtual environment to be activated before running.

---

## What I learned

Building this involved debugging Spotify's new redirect URI security requirements (no localhost, HTTP only for 127.0.0.1 loopback), adapting to a mid-build API deprecation, implementing OAuth 2.0 from scratch to understand the token exchange flow, and integrating a Python ML backend with a Next.js frontend via a REST interface.