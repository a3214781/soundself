"use client";
import { useState, useEffect } from "react";

const TIME_RANGES = [
  { label: "4 weeks", value: "short_term" },
  { label: "6 months", value: "medium_term" },
  { label: "All time", value: "long_term" },
];

const TABS = ["Artists", "Tracks", "Recent", "Stats"];
const clusterColors = ["#1DB954", "#9b59b6", "#e67e22"];

export default function Dashboard({ personality }: { personality: any }) {
  const [timeRange, setTimeRange] = useState("medium_term");
  const [activeTab, setActiveTab] = useState("Artists");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/spotify/data?time_range=${timeRange}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [timeRange]);

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0f0f0", fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />

      {/* Personality Hero */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 2rem 3rem", textAlign: "center" }}>
        <p style={{ color: "#555", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
          Your Music Personality
        </p>
        <h1 style={{
          fontSize: "clamp(2.5rem, 8vw, 5rem)",
          fontWeight: 800,
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          marginBottom: "2rem",
          background: "linear-gradient(135deg, #1DB954, #9b59b6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "inline-block",
        }}>
          {personality.archetype}
        </h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#bbb", maxWidth: "620px", margin: "0 auto 2.5rem", textAlign: "left" }}>
          {personality.description}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
          {personality.clusters.map((cluster: any, i: number) => (
            <div key={i} style={{ background: "#111", border: `1px solid ${clusterColors[i]}33`, borderRadius: "12px", padding: "1.25rem", textAlign: "left" }}>
              <div style={{
                display: "inline-block",
                background: `${clusterColors[i]}22`,
                color: clusterColors[i],
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.25rem 0.6rem",
                borderRadius: "999px",
                marginBottom: "0.75rem",
              }}>
                {cluster.mood}
              </div>
              <p style={{ fontSize: "0.9rem", color: "#888", lineHeight: 1.6, margin: 0 }}>{cluster.vibe}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Tab + Filter Bar */}
      <div style={{ position: "sticky", top: 0, background: "#0a0a0aee", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a", zIndex: 10, padding: "0 2rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "52px" }}>
          <div style={{ display: "flex" }}>
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background: "none", border: "none",
                borderBottom: activeTab === tab ? "2px solid #1DB954" : "2px solid transparent",
                color: activeTab === tab ? "#f0f0f0" : "#555",
                padding: "0 1.25rem", height: "52px", fontSize: "0.85rem", fontWeight: 600,
                cursor: "pointer", transition: "color 0.15s", fontFamily: "'Inter', sans-serif",
              }}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {TIME_RANGES.map((range) => (
              <button key={range.value} onClick={() => setTimeRange(range.value)} style={{
                background: timeRange === range.value ? "#1DB954" : "transparent",
                color: timeRange === range.value ? "#000" : "#555",
                border: `1px solid ${timeRange === range.value ? "#1DB954" : "#2a2a2a"}`,
                borderRadius: "999px", padding: "0.3rem 0.85rem", fontSize: "0.75rem",
                fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif",
              }}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#333", padding: "4rem", fontSize: "0.9rem" }}>Loading...</div>
        ) : (
          <>
            {/* Artists Tab */}
            {activeTab === "Artists" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.5rem" }}>
                {data?.artists?.map((artist: any, i: number) => (
                  <div key={artist.id} style={{ textAlign: "center" }}>
                    <div style={{ position: "relative", marginBottom: "0.6rem" }}>
                      <img src={artist.images?.[1]?.url || artist.images?.[0]?.url} alt={artist.name}
                        style={{ width: "100%", aspectRatio: "1", borderRadius: "50%", objectFit: "cover", border: i === 0 ? "2px solid #1DB954" : "2px solid #1e1e1e" }} />
                      {i < 3 && (
                        <div style={{ position: "absolute", top: 0, left: 0, background: i === 0 ? "#1DB954" : "#222", color: i === 0 ? "#000" : "#888", fontSize: "0.6rem", fontWeight: 700, width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {i + 1}
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#ccc", margin: "0 0 0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{artist.name}</p>
                    <p style={{ fontSize: "0.7rem", color: "#444", margin: 0 }}>{artist.genres?.[0] || ""}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tracks Tab */}
            {activeTab === "Tracks" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {data?.tracks?.map((track: any, i: number) => (
                  <div key={track.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 1rem", background: "#111", borderRadius: "10px", border: "1px solid #1a1a1a" }}>
                    <span style={{ color: "#333", fontSize: "0.8rem", width: "20px", textAlign: "right", flexShrink: 0, fontWeight: 500 }}>{i + 1}</span>
                    <img src={track.album.images?.[2]?.url} alt={track.name} style={{ width: "42px", height: "42px", borderRadius: "6px", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#f0f0f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{track.name}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#555" }}>{track.artists.map((a: any) => a.name).join(", ")} · {track.album.name}</p>
                    </div>
                    <div style={{ background: "#1DB95422", borderRadius: "4px", padding: "0.2rem 0.5rem", fontSize: "0.7rem", color: "#1DB954", fontWeight: 600, flexShrink: 0 }}>
                      {track.popularity}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Tab */}
            {activeTab === "Recent" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {data?.recent?.map((item: any, i: number) => (
                  <div key={`${item.track.id}-${i}`} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 1rem", background: "#111", borderRadius: "10px", border: "1px solid #1a1a1a" }}>
                    <img src={item.track.album.images?.[2]?.url} alt={item.track.name} style={{ width: "42px", height: "42px", borderRadius: "6px", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#f0f0f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{item.track.name}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#555" }}>{item.track.artists.map((a: any) => a.name).join(", ")}</p>
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "#333", flexShrink: 0 }}>
                      {new Date(item.played_at).toLocaleDateString("en-AU", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "Stats" && (

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {console.log("tracks:", data?.tracks?.slice(0, 2)) as any}

                {/* Artist Dominance */}
                <div style={{ background: "#111", borderRadius: "12px", padding: "1.5rem", border: "1px solid #1a1a1a" }}>
                  <p style={{ color: "#555", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                    Artist Dominance — tracks in your top 10
                  </p>
                  {(() => {
                    const artistCount: Record<string, number> = {};
                    data?.tracks?.forEach((track: any) => {
                      const artist = track.artists[0].name;
                      artistCount[artist] = (artistCount[artist] || 0) + 1;
                    });
                    const sorted = Object.entries(artistCount).sort((a, b) => b[1] - a[1]);
                    const max = sorted[0]?.[1] || 1;
                    return sorted.map(([artist, count]) => (
                      <div key={artist} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.6rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "#ccc", width: "140px", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{artist}</span>
                        <div style={{ flex: 1, background: "#1a1a1a", borderRadius: "999px", height: "6px", overflow: "hidden" }}>
                          <div style={{ width: `${(count / max) * 100}%`, height: "100%", background: "linear-gradient(90deg, #1DB954, #9b59b6)", borderRadius: "999px" }} />
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "#555", width: "20px", textAlign: "right", flexShrink: 0 }}>{count}</span>
                      </div>
                    ));
                  })()}
                </div>

                {/* Era Breakdown */}
                <div style={{ background: "#111", borderRadius: "12px", padding: "1.5rem", border: "1px solid #1a1a1a" }}>
                  <p style={{ color: "#555", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Era Breakdown</p>
                  {(() => {
                    const eras: Record<string, number> = { "Pre-2000s": 0, "2000s": 0, "2010s": 0, "2020s": 0 };
                    data?.tracks?.forEach((track: any) => {
                      const year = parseInt(track.album.release_date.split("-")[0]);
                      if (year < 2000) eras["Pre-2000s"]++;
                      else if (year < 2010) eras["2000s"]++;
                      else if (year < 2020) eras["2010s"]++;
                      else eras["2020s"]++;
                    });
                    const total = Object.values(eras).reduce((a, b) => a + b, 0);
                    const eraColors = ["#e67e22", "#1DB954", "#9b59b6", "#3498db"];
                    return (
                      <div>
                        <div style={{ display: "flex", height: "12px", borderRadius: "999px", overflow: "hidden", marginBottom: "1rem" }}>
                          {Object.entries(eras).map(([era, count], i) => (
                            count > 0 && <div key={era} style={{ width: `${(count / total) * 100}%`, background: eraColors[i] }} />
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                          {Object.entries(eras).map(([era, count], i) => (
                            <div key={era} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: eraColors[i] }} />
                              <span style={{ fontSize: "0.8rem", color: "#888" }}>{era}</span>
                              <span style={{ fontSize: "0.8rem", color: "#555" }}>{Math.round((count / total) * 100)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Listening Stats */}
                <div style={{ background: "#111", borderRadius: "12px", padding: "1.5rem", border: "1px solid #1a1a1a" }}>
                  <p style={{ color: "#555", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                    Listening Stats
                  </p>
                  {(() => {
                    const uniqueArtists = new Set(data?.tracks?.map((t: any) => t.artists[0].name)).size;
                    const totalTracks = data?.tracks?.length || 0;
                    const avgDuration = Math.round(
                      (data?.tracks?.reduce((sum: number, t: any) => sum + t.duration_ms, 0) || 0) / (totalTracks || 1) / 1000
                    );
                    const avgMins = Math.floor(avgDuration / 60);
                    const avgSecs = avgDuration % 60;
                    const diversityScore = Math.round((uniqueArtists / totalTracks) * 100);

                    return (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                        <div style={{ background: "#0a0a0a", borderRadius: "8px", padding: "1.25rem", textAlign: "center" }}>
                          <p style={{ fontSize: "2rem", fontWeight: 800, color: "#1DB954", margin: "0 0 0.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>{uniqueArtists}</p>
                          <p style={{ fontSize: "0.75rem", color: "#555", margin: 0 }}>unique artists</p>
                        </div>
                        <div style={{ background: "#0a0a0a", borderRadius: "8px", padding: "1.25rem", textAlign: "center" }}>
                          <p style={{ fontSize: "2rem", fontWeight: 800, color: "#9b59b6", margin: "0 0 0.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>{avgMins}:{avgSecs.toString().padStart(2, "0")}</p>
                          <p style={{ fontSize: "0.75rem", color: "#555", margin: 0 }}>avg track length</p>
                        </div>
                        <div style={{ background: "#0a0a0a", borderRadius: "8px", padding: "1.25rem", textAlign: "center" }}>
                          <p style={{ fontSize: "2rem", fontWeight: 800, color: "#e67e22", margin: "0 0 0.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>{diversityScore}%</p>
                          <p style={{ fontSize: "0.75rem", color: "#555", margin: 0 }}>artist diversity</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "2rem", borderTop: "1px solid #111" }}>
        <a href="/api/auth/login" style={{ color: "#333", fontSize: "0.75rem", textDecoration: "none" }}>Refresh analysis</a>
      </div>
    </main>
  );
}