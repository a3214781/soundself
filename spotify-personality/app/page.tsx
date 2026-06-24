import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("spotify_access_token");

  if (!token) {
    return (
      <div>
        <h1>SoundSelf</h1>
        <a href="/api/auth/login">Login with Spotify</a>
      </div>
    );
  }

  const response = await fetch("https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term", {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  const data = await response.json();

  return (
    <div>
      <h1>SoundSelf</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}