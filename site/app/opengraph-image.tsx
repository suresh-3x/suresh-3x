import { ImageResponse } from "next/og";

export const alt =
  "Codename CORAL — Tropical Luxury Residences by Mayfair Housing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #06181d 0%, #0c2a31 52%, #7a241e 135%)",
          color: "#fdfbf7",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#ff9b86",
          }}
        >
          <span>Mayfair Housing presents</span>
          <span>Mira Road (E)</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 130, lineHeight: 1, letterSpacing: -2 }}>
            Codename CORAL
          </div>
          <div style={{ display: "flex", fontSize: 34, marginTop: 24, color: "#f8f2e9" }}>
            2 &amp; 3 Bed Deck-Residences · From Rs. 1.34 Cr* · 40+ amenities
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "#abe2e6" }}>
          MahaRERA P51700002231 · codenamecoral.com
        </div>
      </div>
    ),
    { ...size },
  );
}
