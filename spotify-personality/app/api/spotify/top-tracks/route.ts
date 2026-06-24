import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("spotify_access_token");

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const tracksResponse = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term",
    {
      headers: { Authorization: `Bearer ${token.value}` },
    }
  );

  const tracksData = await tracksResponse.json();
  const trackIds = tracksData.items.map((track: any) => track.id).join(",");

  const featuresResponse = await fetch(
    `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
    {
      headers: { Authorization: `Bearer ${token.value}` },
    }
  );

  const featuresData = await featuresResponse.json();

  return NextResponse.json({
    tracks: tracksData.items,
    features: featuresData.audio_features,
  });
}