import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("spotify_access_token");

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get clusters from our ML endpoint
  const clusterRes = await fetch("http://127.0.0.1:3000/api/ml/cluster", {
    headers: { Cookie: `spotify_access_token=${token.value}` },
  });
  const clusterData = await clusterRes.json();

  // Build a summary of each cluster for Claude
  const clusterSummary = clusterData.clusters.map((cluster: any) => {
    const trackList = cluster.tracks.slice(0, 5).map((t: any) => `${t.name} by ${t.artist}`).join(", ");
    return `Cluster ${cluster.cluster_id}: ${cluster.tracks.length} tracks. Sample tracks: ${trackList}. Center stats: popularity=${cluster.center.popularity}, is_recent_hit=${cluster.center.is_recent_hit}, is_all_time=${cluster.center.is_all_time}`;
  }).join("\n");

  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 500,
    messages: [
  {
    role: "user",
    content: `Generate a music personality profile from this Spotify cluster data. Return ONLY valid JSON, no markdown.

${clusterSummary}

JSON format:
{"archetype":"2-3 word name","description":"2-3 paragraphs","clusters":[{"mood":"1-3 words","vibe":"one sentence"},{"mood":"...","vibe":"..."},{"mood":"...","vibe":"..."}]}`
      }
    ]
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const personality = JSON.parse(clean);

  return NextResponse.json(personality);
}