/**
 * OG 이미지에서 공통으로 사용하는 폰트 로더 / 디자인 토큰.
 * 폰트는 모듈 캐시에 저장해 동일 인스턴스 내 재호출 비용을 줄인다.
 *
 * Satori 는 WOFF2(Brotli) 디코딩을 지원하지 않아 OTF 를 받는다.
 * (Pretendard 배포본은 TTF 가 아니라 OTF 로 배포된다.)
 */

const PRETENDARD_BOLD =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf";
const PRETENDARD_REGULAR =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Regular.otf";

let cachedFonts: { bold: ArrayBuffer; regular: ArrayBuffer } | null = null;

export async function loadPretendard() {
  if (cachedFonts) return cachedFonts;
  const [bold, regular] = await Promise.all([
    fetch(PRETENDARD_BOLD).then((r) => r.arrayBuffer()),
    fetch(PRETENDARD_REGULAR).then((r) => r.arrayBuffer()),
  ]);
  cachedFonts = { bold, regular };
  return cachedFonts;
}

/**
 * `app/globals.css` 의 `.bg-mesh-gradient` 라이트 테마 색을 정적 그라데이션으로 변환.
 * Satori 는 background-size/animation 을 지원하지 않으므로 한 컷으로 굳힌다.
 */
export const MESH_GRADIENT =
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 50%, #a18cd1 100%)";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;
