import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Purrly - curl up. let it out. don't hold back.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    return new ImageResponse(
        (
            <div
                style={{
                    background: "#FAF7F2",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: "80px 100px",
                    gap: 0,
                }}
            >
                {/* Left: wordmark + tagline */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: "50%",
                                    background: "#D4845A",
                                    opacity: 1 - i * 0.25,
                                }}
                            />
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "baseline", marginBottom: 24 }}>
                        <span style={{ fontFamily: "sans-serif", fontSize: 128, fontWeight: 700, color: "#2C2416", lineHeight: 1, letterSpacing: "-2px" }}>
                            purr
                        </span>
                        <span style={{ fontFamily: "sans-serif", fontSize: 128, fontWeight: 700, color: "#D4845A", lineHeight: 1, letterSpacing: "-2px" }}>
                            ly
                        </span>
                    </div>

                    <p style={{ fontFamily: "sans-serif", fontSize: 36, fontWeight: 400, color: "#6B5744", margin: 0, fontStyle: "italic", letterSpacing: "-0.5px" }}>
                        curl up. let it out. don&apos;t hold back.
                    </p>
                </div>

                {/* Right: logo */}
                <div
                    style={{
                        width: 320,
                        height: 320,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#FDF1EA",
                        borderRadius: 48,
                        border: "2px solid #EDCBB8",
                        flexShrink: 0,
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${baseUrl}/logo.png`} width={200} height={200} alt="Purrly logo" />
                </div>

                {/* purrly.app pill */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 60,
                        right: 100,
                        background: "#FDF1EA",
                        border: "2px solid #EDCBB8",
                        borderRadius: 999,
                        padding: "10px 24px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span style={{ fontFamily: "sans-serif", fontSize: 22, color: "#D4845A" }}>
                        purrly.app
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
