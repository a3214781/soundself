import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("spotify_access_token");

  return (
    <div>
      <h1>SoundSelf</h1>
      {token ? (
        <p>Logged in! Token exists.</p>
      ) : (
        <a href="/api/auth/login">Login with Spotify</a>
      )}
    </div>
  );
}