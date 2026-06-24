import { redirect } from "next/navigation";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const redirectUri = "http://127.0.0.1:3000/api/auth/callback";
  const scopes = "user-top-read user-read-recently-played";

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
  });

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

  redirect(spotifyAuthUrl);
}