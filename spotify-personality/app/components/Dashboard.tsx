"use client";
import { useState, useEffect } from "react";

const TIME_RANGES = [
  { label: "4 weeks", value: "short_term" },
  { label: "6 months", value: "medium_term" },
  { label: "All time", value: "long_term" },
];

const TABS = ["Artists", "Tracks", "Recent"];
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
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#f0f0f0",
      fontFamily: "'Inter', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />

      {/* Personality Hero */}
      {/* Personality Hero */}
      <div style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "4rem 2rem 3rem",
        textAlign: "center",
      }}>
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
        <p style={{
          fontSize: "1.05rem",
          lineHeight: 1.75,
          color: "#bbb",
          maxWidth: "620px",
          margin: "0 auto 2.5rem",
          textAlign: "left",
        }}>
          {personality.description}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
          {personality.clusters.map((cluster: any, i: number) => (
            <div key={i} style={{
              background: "#111",
              border: `1px solid ${clusterColors[i]}33`,
              borderRadius: "12px",
              padding: "1.25rem",
              textAlign: "left",
            }}>
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
              <p style={{ fontSize: "0.9rem", color: "#888", lineHeight: 1.6, margin: 0 }}>
                {cluster.vibe}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Tab + Filter Bar */}
      <div style={{
        position: "sticky",
        top: 0,
        background: "#0a0a0aee",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1a1a1a",
        zIndex: 10,
        padding: "0 2rem",
      }}>
        <div style={{
          maxWidth: "860px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "52px",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: "0" }}>
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #1DB954" : "2px solid transparent",
                color: activeTab === tab ? "#f0f0f0" : "#555",
                padding: "0 1.25rem",
                height: "52px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "color 0.15s",
                fontFamily: "'Inter', sans-serif",
              }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Time range */}
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {TIME_RANGES.map((range) => (
              <button key={range.value} onClick={() => setTimeRange(range.value)} style={{
                background: timeRange === range.value ? "#1DB954" : "transparent",
                color: timeRange === range.value ? "#000" : "#555",
                border: `1px solid ${timeRange === range.value ? "#1DB954" : "#2a2a2a"}`,
                borderRadius: "999px",
                padding: "0.3rem 0.85rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
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
          <div style={{ textAlign: "center", color: "#333", padding: "4rem", fontSize: "0.9rem" }}>
            Loading...
          </div>
        ) : (
          <>
            {/* Artists Tab */}
            {activeTab === "Artists" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.5rem" }}>
                {data?.artists?.map((artist: any, i: number) => (
                  <div key={artist.id} style={{ textAlign: "center" }}>
                    <div style={{ position: "relative", marginBottom: "0.6rem" }}>
                      <img
                        src={artist.images?.[1]?.url || artist.images?.[0]?.url}
                        alt={artist.name}
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: i === 0 ? "2px solid #1DB954" : "2px solid #1e1e1e",
                        }}
                      />
                      {i < 3 && (
                        <div style={{
                          position: "absolute", top: 0, left: 0,
                          background: i === 0 ? "#1DB954" : "#222",
                          color: i === 0 ? "#000" : "#888",
                          fontSize: "0.6rem", fontWeight: 700,
                          width: "20px", height: "20px", borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {i + 1}
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#ccc", margin: "0 0 0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                      {artist.name}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "#444", margin: 0 }}>
                      {artist.genres?.[0] || ""}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tracks Tab */}
            {activeTab === "Tracks" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {data?.tracks?.map((track: any, i: number) => (
                  <div key={track.id} style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "0.75rem 1rem",
                    background: "#111", borderRadius: "10px",
                    border: "1px solid #1a1a1a",
                    transition: "border-color 0.15s",
                  }}>
                    <span style={{ color: "#333", fontSize: "0.8rem", width: "20px", textAlign: "right", flexShrink: 0, fontWeight: 500 }}>
                      {i + 1}
                    </span>
                    <img src={track.album.images?.[2]?.url} alt={track.name}
                      style={{ width: "42px", height: "42px", borderRadius: "6px", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#f0f0f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                        {track.name}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#555" }}>
                        {track.artists.map((a: any) => a.name).join(", ")} · {track.album.name}
                      </p>
                    </div>
                    <div style={{
                      background: "#1DB95422",
                      borderRadius: "4px",
                      padding: "0.2rem 0.5rem",
                      fontSize: "0.7rem",
                      color: "#1DB954",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}>
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
                  <div key={`${item.track.id}-${i}`} style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "0.75rem 1rem",
                    background: "#111", borderRadius: "10px",
                    border: "1px solid #1a1a1a",
                  }}>
                    <img src={item.track.album.images?.[2]?.url} alt={item.track.name}
                      style={{ width: "42px", height: "42px", borderRadius: "6px", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#f0f0f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                        {item.track.name}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#555" }}>
                        {item.track.artists.map((a: any) => a.name).join(", ")}
                      </p>
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "#333", flexShrink: 0 }}>
                      {new Date(item.played_at).toLocaleDateString("en-AU", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "2rem", borderTop: "1px solid #111" }}>
        <a href="/api/auth/login" style={{ color: "#333", fontSize: "0.75rem", textDecoration: "none" }}>
          Refresh analysis
        </a>
      </div>
    </main>
  );
}