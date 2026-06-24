import { cookies } from "next/headers";
import Dashboard from "./components/Dashboard";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("spotify_access_token");

  if (!token) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        color: "#f0f0f0",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
        <h1 style={{
          fontSize: "4rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginBottom: "0.5rem",
          fontFamily: "'Space Grotesk', sans-serif",
        }}>SoundSelf</h1>
        <p style={{ color: "#888", marginBottom: "2.5rem", fontSize: "1.1rem" }}>
          Discover your music personality
        </p>
        <a href="/api/auth/login" style={{
          background: "#1DB954",
          color: "#000",
          padding: "0.9rem 2.5rem",
          borderRadius: "999px",
          fontWeight: 700,
          textDecoration: "none",
          fontSize: "1rem",
        }}>
          Connect Spotify
        </a>
      </main>
    );
  }

  let personality: any = null;
  try {
    const res = await fetch("http://127.0.0.1:3000/api/personality", {
      headers: { Cookie: `spotify_access_token=${token.value}` },
      cache: "no-store",
    });
    personality = await res.json();
  } catch (e) {
    personality = null;
  }

  if (!personality) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0f0f0" }}>
        <p>Something went wrong. <a href="/api/auth/login" style={{ color: "#1DB954" }}>Try logging in again.</a></p>
      </main>
    );
  }

  return <Dashboard personality={personality} />;
}