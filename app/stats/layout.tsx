import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "내 링크 통계",
  description: "내 MyLink 페이지의 링크별 클릭수와 인기 링크 순위를 확인하세요.",
  alternates: {
    canonical: "/stats",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
