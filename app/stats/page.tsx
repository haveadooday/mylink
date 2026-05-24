"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Loader2,
  MousePointerClick,
  BarChart3,
  Link2,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import Header from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useProfile";
import { useLinksByClickCount } from "@/hooks/useLinks";

const chartConfig = {
  clickCount: {
    label: "클릭수",
    color: "#a5b4fc",
  },
} satisfies ChartConfig;

export default function StatsPage() {
  const router = useRouter();
  const { user, authLoading, isLoginPending, handleLogin, handleLogout } =
    useAuth();
  const { data: userProfile } = useUserProfile(user?.uid);
  const {
    data: links = [],
    isLoading,
    isFetching,
  } = useLinksByClickCount(user?.uid);

  // 비로그인 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const totalClicks = useMemo(
    () => links.reduce((acc, link) => acc + (link.clickCount ?? 0), 0),
    [links]
  );

  // 차트 데이터: 상위 10개만 표시 (가독성)
  const chartData = useMemo(
    () =>
      links.slice(0, 10).map((link) => ({
        name:
          link.title.length > 12 ? `${link.title.slice(0, 12)}…` : link.title,
        clickCount: link.clickCount ?? 0,
      })),
    [links]
  );

  const isRefreshing = !isLoading && isFetching;

  return (
    <div className="flex min-h-screen flex-col items-center bg-mesh-gradient text-white pb-12">
      <Header
        user={user}
        userProfile={userProfile}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoading={authLoading}
        isLoginPending={isLoginPending}
        linkCount={links.length}
      />

      <div className="w-full max-w-2xl flex flex-col gap-6 mt-4 px-4 relative z-10">
        {authLoading || !user ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <p className="text-white/70 text-sm font-medium">
              {authLoading
                ? "사용자 정보를 확인하고 있습니다..."
                : "홈으로 이동합니다..."}
            </p>
          </div>
        ) : (
          <>
            {/* 페이지 헤더 */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 shadow-inner">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    내 링크 통계
                  </h1>
                  <p className="text-white/70 text-xs font-medium mt-0.5">
                    어떤 링크가 사랑받고 있는지 확인해보세요
                  </p>
                </div>
              </div>
              <a
                href="/"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-xl transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                에디터로
              </a>
            </div>

            {/* 총 클릭수 카드 */}
            <Card className="w-full glass-card border-0 overflow-hidden shadow-xl">
              <CardContent className="p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/30 flex items-center justify-center border border-indigo-300/30 shrink-0">
                    <MousePointerClick className="w-7 h-7 text-indigo-100" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider">
                      총 클릭수
                    </p>
                    <p className="text-white font-extrabold text-4xl leading-tight mt-1">
                      {totalClicks.toLocaleString()}
                      <span className="text-white/40 text-base font-normal ml-2">
                        회
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70 bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg">
                    <Link2 className="w-3.5 h-3.5" />
                    {links.length}개 링크
                  </div>
                  {isRefreshing && (
                    <span className="flex items-center gap-1 text-[10px] text-white/40">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      갱신 중...
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 차트 카드 */}
            {!isLoading && links.length > 0 && (
              <Card className="w-full glass-card border-0 overflow-hidden shadow-xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-white/90 tracking-tight">
                      클릭수 TOP {Math.min(10, chartData.length)}
                    </h2>
                    <span className="text-[10px] text-white/40 font-medium">
                      많이 눌린 순
                    </span>
                  </div>
                  <ChartContainer
                    config={chartConfig}
                    className="w-full h-[260px]"
                  >
                    <BarChart
                      accessibilityLayer
                      data={chartData}
                      margin={{ top: 16, right: 12, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="rgba(255,255,255,0.08)"
                      />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{
                          fill: "rgba(255,255,255,0.6)",
                          fontSize: 11,
                        }}
                        interval={0}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        tick={{
                          fill: "rgba(255,255,255,0.5)",
                          fontSize: 11,
                        }}
                        width={32}
                      />
                      <ChartTooltip
                        cursor={{ fill: "rgba(255,255,255,0.06)" }}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Bar
                        dataKey="clickCount"
                        fill="var(--color-clickCount)"
                        radius={[8, 8, 0, 0]}
                      >
                        <LabelList
                          dataKey="clickCount"
                          position="top"
                          offset={6}
                          fill="rgba(255,255,255,0.85)"
                          fontSize={11}
                          fontWeight={600}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            {/* 링크별 클릭수 리스트 */}
            <div className="flex flex-col gap-3 mt-1">
              <h2 className="text-sm font-bold text-white/80 tracking-tight px-1">
                전체 링크별 클릭수
              </h2>

              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-[64px] rounded-xl glass-card animate-pulse bg-white/10"
                  />
                ))
              ) : links.length === 0 ? (
                <p className="text-center text-white/50 text-sm py-12 bg-white/5 rounded-xl border border-white/5">
                  아직 등록된 링크가 없습니다.
                  <br />
                  먼저 에디터에서 링크를 추가해보세요!
                </p>
              ) : (
                links.map((link, idx) => {
                  let domain = "google.com";
                  try {
                    domain = new URL(link.url).hostname;
                  } catch {
                    /* ignore */
                  }
                  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                  const clicks = link.clickCount ?? 0;
                  const percent =
                    totalClicks > 0
                      ? Math.round((clicks / totalClicks) * 100)
                      : 0;

                  return (
                    <Card
                      key={link.id}
                      className="w-full glass-card border-0 overflow-hidden"
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        {/* 순위 뱃지 */}
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 border ${
                            idx === 0
                              ? "bg-yellow-400/20 text-yellow-200 border-yellow-300/30"
                              : idx === 1
                                ? "bg-zinc-300/20 text-zinc-100 border-zinc-300/30"
                                : idx === 2
                                  ? "bg-orange-400/20 text-orange-200 border-orange-300/30"
                                  : "bg-white/10 text-white/60 border-white/10"
                          }`}
                        >
                          {idx + 1}
                        </div>

                        {/* 파비콘 + 정보 */}
                        <div className="flex items-center min-w-0 flex-1 gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={faviconUrl}
                              alt={`${link.title} icon`}
                              className="w-5 h-5 object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white text-sm truncate">
                              {link.title}
                            </p>
                            <p className="text-white/40 text-[11px] truncate mt-0.5">
                              {domain}
                            </p>
                          </div>
                        </div>

                        {/* 클릭수 */}
                        <div className="flex flex-col items-end shrink-0">
                          <span className="flex items-center gap-1 text-white font-bold text-base">
                            <MousePointerClick className="w-4 h-4 text-white/60" />
                            {clicks.toLocaleString()}
                          </span>
                          <span className="text-white/40 text-[10px] font-medium mt-0.5">
                            {percent}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
