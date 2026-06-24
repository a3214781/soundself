import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("spotify_access_token");

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get top tracks for all three time ranges
  const [shortRes, medRes, longRes] = await Promise.all([
    fetch("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term", {
      headers: { Authorization: `Bearer ${token.value}` },
    }),
    fetch("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term", {
      headers: { Authorization: `Bearer ${token.value}` },
    }),
    fetch("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term", {
      headers: { Authorization: `Bearer ${token.value}` },
    }),
  ]);

  const [shortData, medData, longData] = await Promise.all([
    shortRes.json(),
    medRes.json(),
    longRes.json(),
  ]);

  const tracks = medData.items;

  // Engineer features from metadata
  const features = tracks.map((track: any, index: number) => {
    const releaseYear = parseInt(track.album.release_date.split("-")[0]);
    const rank = index + 1;
    const popularity = track.popularity;
    const isShortTerm = shortData.items.some((t: any) => t.id === track.id) ? 1 : 0;
    const isLongTerm = longData.items.some((t: any) => t.id === track.id) ? 1 : 0;
    const durationMins = track.duration_ms / 60000;

    return {
      track_id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      features: {
        popularity: popularity / 100,
        release_year: (releaseYear - 1960) / 65,
        rank_score: 1 - rank / 50,
        is_recent_hit: isShortTerm,
        is_all_time: isLongTerm,
        duration: Math.min(durationMins / 10, 1),
      },
    };
  });

  // Send to Flask
  const mlResponse = await fetch("http://127.0.0.1:5000/cluster", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features: features.map((f: any) => f.features) }),
  });

  const mlData = await mlResponse.json();

  const clusters = mlData.clusters.map((cluster: any) => ({
    ...cluster,
    tracks: cluster.track_indices.map((i: number) => ({
      name: features[i].name,
      artist: features[i].artist,
    })),
  }));

  return NextResponse.json({ clusters });
}