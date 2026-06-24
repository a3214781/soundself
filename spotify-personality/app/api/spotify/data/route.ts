import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("spotify_access_token");

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const timeRange = request.nextUrl.searchParams.get("time_range") || "medium_term";

  const [artistsRes, tracksRes, recentRes] = await Promise.all([
    fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    }),
    fetch(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    }),
    fetch("https://api.spotify.com/v1/me/player/recently-played?limit=10", {
      headers: { Authorization: `Bearer ${token.value}` },
    }),
  ]);

  const [artists, tracks, recent] = await Promise.all([
    artistsRes.json(),
    tracksRes.json(),
    recentRes.json(),
  ]);

  return NextResponse.json({
    artists: artists.items,
    tracks: tracks.items,
    recent: recent.items,
  });
}