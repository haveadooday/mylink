import { ImageResponse } from "next/og";
import {
  MESH_GRADIENT,
  OG_CONTENT_TYPE,
  OG_SIZE,
  loadPretendard,
} from "../_og/og-assets";

export const alt = "MyLink 통계 — 어떤 링크가 사랑받고 있는지 확인해보세요";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const { bold, regular } = await loadPretendard();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: MESH_GRADIENT,
          fontFamily: "Pretendard",
          position: "relative",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "72px 96px",
            background: "rgba(255,255,255,0.32)",
            border: "1px solid rgba(255,255,255,0.45)",
            borderRadius: 40,
            boxShadow: "0 24px 70px rgba(31, 28, 44, 0.22)",
            maxWidth: 940,
          }}
        >
          {/* BarChart3 아이콘 배지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 132,
              height: 132,
              borderRadius: 30,
              background: "rgba(255,255,255,0.28)",
              border: "1px solid rgba(255,255,255,0.55)",
              marginBottom: 40,
              boxShadow: "inset 0 2px 8px rgba(255,255,255,0.35)",
            }}
          >
            <svg
              width="76"
              height="76"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="M7 16V9" />
              <path d="M12 16V5" />
              <path d="M17 16v-4" />
            </svg>
          </div>

          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              color: "white",
              letterSpacing: -2.5,
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            내 링크 통계
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 28,
              color: "rgba(255,255,255,0.92)",
              marginTop: 28,
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 760,
              fontWeight: 400,
            }}
          >
            <div>어떤 링크가 사랑받고 있는지</div>
            <div>한눈에 확인해보세요</div>
          </div>
        </div>

        {/* 브랜드 워드마크 */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "rgba(255,255,255,0.85)",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 17H7A5 5 0 0 1 7 7h2" />
            <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          MyLink
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: regular, style: "normal", weight: 400 },
        { name: "Pretendard", data: bold, style: "normal", weight: 800 },
      ],
    },
  );
}
