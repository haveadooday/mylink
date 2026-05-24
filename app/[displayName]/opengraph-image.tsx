import { ImageResponse } from "next/og";
import { getUserProfileByDisplayname } from "@/lib/firebase/user";
import { getLinks } from "@/lib/firebase/links";
import {
  MESH_GRADIENT,
  OG_CONTENT_TYPE,
  OG_SIZE,
  loadPretendard,
} from "../_og/og-assets";

export const alt = "MyLink 프로필";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

interface Props {
  params: Promise<{ displayName: string }>;
}

/**
 * Satori 의 `<img src>` 는 URL fetch 를 지원하지만, Google 아바타처럼
 * 일부 CDN 은 직접 fetch 가 더 안정적이라 미리 data URL 로 변환한다.
 */
async function toDataUrl(url: string | null): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, {
      // 캐시: 동일 사용자 OG 가 자주 호출돼도 외부 호출 줄임
      cache: "force-cache",
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "image/png";
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: Props) {
  const { displayName } = await params;
  const decoded = decodeURIComponent(displayName);

  const [{ bold, regular }, profile] = await Promise.all([
    loadPretendard(),
    getUserProfileByDisplayname(decoded).catch(() => null),
  ]);

  // 프로필이 없으면 기본 브랜드 OG 로 폴백
  const displayname = profile?.displayname ?? decoded;
  const bio = profile?.bio ?? "MyLink 로 만든 프로필 페이지";
  const photoDataUrl = await toDataUrl(profile?.photoURL ?? null);

  // 링크 수: 실패해도 그래픽이 무너지지 않도록 0 처리
  let linkCount = 0;
  if (profile?.uid) {
    try {
      const links = await getLinks(profile.uid);
      linkCount = links.filter((l) => l.url).length;
    } catch {
      linkCount = 0;
    }
  }

  const initial = displayname.charAt(0).toUpperCase() || "?";

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
        {/* 메인 카드 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "64px 88px 56px",
            background: "rgba(255,255,255,0.32)",
            border: "1px solid rgba(255,255,255,0.45)",
            borderRadius: 40,
            boxShadow: "0 24px 70px rgba(31, 28, 44, 0.22)",
            maxWidth: 980,
          }}
        >
          {/* 프로필 아바타 (실제 페이지의 96px 원형 카드를 OG 비율에 맞춰 확대) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 168,
              height: 168,
              borderRadius: 84,
              background: "rgba(255,255,255,0.30)",
              border: "3px solid rgba(255,255,255,0.6)",
              marginBottom: 32,
              overflow: "hidden",
              boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
            }}
          >
            {photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoDataUrl}
                alt={displayname}
                width={168}
                height={168}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  fontSize: 80,
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                {initial}
              </div>
            )}
          </div>

          {/* @displayname */}
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              color: "white",
              letterSpacing: -2.5,
              textAlign: "center",
              lineHeight: 1.05,
              maxWidth: 880,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
            }}
          >
            @{displayname}
          </div>

          {/* bio */}
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.92)",
              marginTop: 20,
              textAlign: "center",
              lineHeight: 1.45,
              maxWidth: 820,
              fontWeight: 400,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {bio}
          </div>

          {/* 링크 카운트 배지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 32,
              padding: "12px 22px",
              background: "rgba(255,255,255,0.22)",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: 999,
              fontSize: 22,
              fontWeight: 700,
              color: "white",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 17H7A5 5 0 0 1 7 7h2" />
              <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            {linkCount}개의 링크
          </div>
        </div>

        {/* 푸터 브랜딩 */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "rgba(255,255,255,0.85)",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: -0.4,
          }}
        >
          <svg
            width="24"
            height="24"
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
          MyLink 로 만든 페이지
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
