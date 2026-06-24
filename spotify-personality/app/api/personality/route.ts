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
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Based on this person's Spotify listening data grouped into 3 clusters, generate a music personality profile. Be creative, specific, and fun. Give them an archetype name and describe their listening personality in 2-3 paragraphs.

Cluster data:
${clusterSummary}

Format your response as JSON with these fields:
- archetype: a creative 2-3 word name for their music personality
- description: 2-3 paragraphs about their listening personality
- clusters: array of 3 objects each with a "mood" (1-3 word label) and "vibe" (one sentence description)

Return only valid JSON, no markdown.`
      }
    ]
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const personality = JSON.parse(clean);

  return NextResponse.json(personality);
}