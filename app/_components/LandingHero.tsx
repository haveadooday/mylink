"use client";

import { useEffect, useState } from "react";
import {
  Link2,
  Sparkles,
  Zap,
  BarChart3,
  Share2,
  Palette,
  MousePointerClick,
  ArrowRight,
  Loader2,
  Camera,
  Video,
  Code,
  Music,
  Globe,
  Mail,
  Heart,
  Star,
  CheckCircle2,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LandingHeroProps {
  onLogin: () => void;
  isLoginPending: boolean;
}

interface SampleLink {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface SampleProfile {
  handle: string;
  bio: string;
  initial: string;
  gradient: string;
  links: SampleLink[];
}

const SAMPLE_PROFILES: SampleProfile[] = [
  {
    handle: "designer_mina",
    bio: "디자이너 · 일러스트레이터",
    initial: "M",
    gradient: "from-pink-400 to-rose-500",
    links: [
      { title: "Behance 포트폴리오", icon: Palette, color: "bg-blue-500/30" },
      { title: "Instagram", icon: Camera, color: "bg-pink-500/30" },
      { title: "굿즈샵 (스마트스토어)", icon: Heart, color: "bg-rose-500/30" },
    ],
  },
  {
    handle: "creator_jun",
    bio: "영상 크리에이터 · 1.2만 구독자",
    initial: "J",
    gradient: "from-amber-400 to-orange-500",
    links: [
      { title: "YouTube 채널", icon: Video, color: "bg-red-500/30" },
      { title: "최신 브이로그 EP.42", icon: Music, color: "bg-purple-500/30" },
      { title: "비즈니스 문의", icon: Mail, color: "bg-slate-500/30" },
    ],
  },
  {
    handle: "dev_jieun",
    bio: "풀스택 개발자 · 기술 블로거",
    initial: "J",
    gradient: "from-cyan-400 to-blue-500",
    links: [
      { title: "GitHub", icon: Code, color: "bg-zinc-700/40" },
      { title: "기술 블로그 (Velog)", icon: Globe, color: "bg-emerald-500/30" },
      { title: "이력서 PDF", icon: Star, color: "bg-yellow-500/30" },
    ],
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "30초 셋업",
    desc: "구글 로그인 한 번이면 끝. 회원가입 양식 따위 없어요.",
    accent: "from-yellow-300/40 to-amber-400/40",
  },
  {
    icon: Sparkles,
    title: "실시간 반영",
    desc: "링크를 추가하면 바로 내 페이지에 짠! 새로고침도 필요 없어요.",
    accent: "from-pink-300/40 to-fuchsia-400/40",
  },
  {
    icon: BarChart3,
    title: "클릭 통계",
    desc: "어떤 링크가 인기 많은지, 누가 가장 많이 눌렸는지 한눈에.",
    accent: "from-cyan-300/40 to-sky-400/40",
  },
  {
    icon: Share2,
    title: "짧은 URL 하나",
    desc: "mylink/내이름 하나만 알려주면 모든 게 공유돼요.",
    accent: "from-emerald-300/40 to-teal-400/40",
  },
];

const STEPS = [
  {
    n: "01",
    title: "로그인하기",
    desc: "구글 계정으로 30초만에 시작",
    icon: Rocket,
  },
  {
    n: "02",
    title: "링크 모으기",
    desc: "인스타, 유튜브, 블로그… 다 넣으세요",
    icon: Link2,
  },
  {
    n: "03",
    title: "공유하기",
    desc: "내 URL 하나로 모든 걸 보여주세요",
    icon: Share2,
  },
];

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.77-2.4 3.61v3h3.86c2.26-2.09 3.59-5.17 3.59-8.46z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.18 7.18 0 0 1 0-4.58V6.62H1.29a11.94 11.94 0 0 0 0 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}

function PhonePreview({ profile }: { profile: SampleProfile }) {
  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px]">
      {/* 떠다니는 장식 아이콘 (데스크탑에서만 보임) */}
      <div className="hidden md:block absolute -top-6 -left-10 w-12 h-12 rounded-2xl glass-card flex items-center justify-center rotate-[-12deg] animate-bounce-slow">
        <Sparkles className="w-5 h-5 text-yellow-200" />
      </div>
      <div className="hidden md:block absolute -bottom-4 -right-8 w-14 h-14 rounded-2xl glass-card flex items-center justify-center rotate-[8deg] animate-bounce-slow-delayed">
        <Heart className="w-6 h-6 text-pink-300" />
      </div>

      {/* 폰 프레임 */}
      <div className="relative rounded-[2.5rem] border-[6px] border-white/30 bg-black/40 p-2 shadow-2xl backdrop-blur-md">
        {/* 노치 */}
        <div className="mx-auto mb-2 mt-1 h-1.5 w-16 rounded-full bg-white/40" />

        {/* 화면 */}
        <div className="overflow-hidden rounded-[2rem] bg-mesh-gradient p-4 min-h-[420px]">
          <div className="flex flex-col items-center gap-3 text-center text-white">
            {/* 아바타 */}
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${profile.gradient} flex items-center justify-center border-2 border-white/40 shadow-xl text-white font-bold text-2xl transition-all duration-500`}
            >
              {profile.initial}
            </div>
            <div className="transition-all duration-500">
              <p className="text-base font-bold leading-tight">
                @{profile.handle}
              </p>
              <p className="text-[11px] text-white/80 mt-0.5">{profile.bio}</p>
            </div>

            {/* 링크 목록 */}
            <div className="w-full flex flex-col gap-2 mt-2">
              {profile.links.map((link, i) => {
                const Icon = link.icon;
                return (
                  <div
                    key={`${profile.handle}-${i}`}
                    className="w-full rounded-xl glass-card flex items-center gap-2.5 px-3 py-2.5 text-left transition-all duration-500"
                    style={{
                      animation: `slide-in-up 0.4s ease-out ${i * 80}ms both`,
                    }}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg ${link.color} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-white truncate flex-1">
                      {link.title}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-white/60">
                      <MousePointerClick className="w-3 h-3" />
                      {Math.floor(Math.random() * 200 + 30)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 푸터 워터마크 */}
            <p className="text-[9px] text-white/50 mt-3 flex items-center gap-1">
              <Link2 className="w-2.5 h-2.5" />
              made with MyLink
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingHero({ onLogin, isLoginPending }: LandingHeroProps) {
  // 샘플 프로필 자동 순환 (3.5초 간격)
  const [profileIdx, setProfileIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setProfileIdx((i) => (i + 1) % SAMPLE_PROFILES.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const currentProfile = SAMPLE_PROFILES[profileIdx];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-2 sm:mt-4 pb-8">
      {/* ─── 히어로 ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-8 items-center pt-6 sm:pt-10 pb-8">
        {/* 좌측: 카피 + CTA */}
        <div className="flex flex-col gap-5 sm:gap-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 self-center lg:self-start glass-card rounded-full px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold w-fit border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            무료 · 누구나 · 30초만에 시작
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            흩어진 내 링크,
            <br />
            <span className="bg-gradient-to-r from-pink-200 via-yellow-100 to-cyan-200 bg-clip-text text-transparent">
              한 페이지로
            </span>{" "}
            모으기
          </h1>

          <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
            인스타, 유튜브, 블로그, 포트폴리오까지.
            <br className="hidden sm:inline" />
            나만의{" "}
            <span className="font-bold text-white">mylink/내이름</span> 페이지를
            만들고 한 줄로 공유해보세요.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center lg:justify-start mt-1">
            <Button
              onClick={onLogin}
              disabled={isLoginPending}
              className="bg-white hover:bg-zinc-100 text-black font-bold py-6 px-6 rounded-xl shadow-xl border border-white flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 text-sm sm:text-base"
            >
              {isLoginPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
                  로그인 중...
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Google로 무료 시작
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* 소형 신뢰 표시 */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start text-xs text-white/70 mt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              신용카드 불필요
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              평생 무료
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              광고 없음
            </span>
          </div>
        </div>

        {/* 우측: 폰 미리보기 */}
        <div className="flex justify-center lg:justify-end">
          <PhonePreview profile={currentProfile} />
        </div>

        {/* 미리보기 인디케이터 (모바일/데스크탑 공통, 폰 아래) */}
        <div className="flex justify-center gap-1.5 lg:col-start-2 -mt-4">
          {SAMPLE_PROFILES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setProfileIdx(i)}
              aria-label={`미리보기 ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === profileIdx ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ─── 기능 ─── */}
      <section className="mt-10 sm:mt-16">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            왜 <span className="text-yellow-200">MyLink</span>일까요?
          </h2>
          <p className="text-white/70 text-sm mt-2">
            가볍게 시작해서 진하게 쓸 수 있어요
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Card
                key={f.title}
                className="glass-card border-0 p-5 flex flex-col gap-3 hover:-translate-y-1 hover:bg-white/20 transition-all duration-300 cursor-default group"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center border border-white/30 shadow-inner group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{f.title}</h3>
                  <p className="text-white/75 text-xs mt-1 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ─── 3단계 ─── */}
      <section className="mt-12 sm:mt-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            딱 <span className="text-cyan-200">3단계</span>면 충분해요
          </h2>
          <p className="text-white/70 text-sm mt-2">
            복잡한 설정 없이, 바로 공유 가능한 페이지가 완성됩니다
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 데스크탑용 연결선 */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                className="relative flex flex-col items-center text-center gap-3 p-5 rounded-2xl glass-card border border-white/15"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-white/15 border border-white/30 flex items-center justify-center shadow-inner">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white text-black text-xs font-extrabold flex items-center justify-center shadow-md">
                    {s.n}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg mt-1">{s.title}</h3>
                <p className="text-white/75 text-sm leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 하단 CTA ─── */}
      <section className="mt-12 sm:mt-20">
        <Card className="glass-card border-0 p-7 sm:p-10 text-center flex flex-col items-center gap-5 overflow-hidden relative">
          {/* 배경 장식 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(251,194,235,0.4), transparent 50%), radial-gradient(circle at 80% 70%, rgba(166,193,238,0.4), transparent 50%)",
            }}
          />

          <div className="relative w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              지금 바로 내 MyLink 만들기
            </h2>
            <p className="text-white/80 text-sm sm:text-base mt-2 max-w-md mx-auto">
              로그인 후 1분이면 첫 링크가 살아 숨쉽니다.
              <br className="hidden sm:inline" />
              나만의 페이지로 흩어진 나를 한데 모아보세요.
            </p>
          </div>

          <Button
            onClick={onLogin}
            disabled={isLoginPending}
            className="relative bg-white hover:bg-zinc-100 text-black font-bold py-6 px-8 rounded-xl shadow-xl border border-white flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoginPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
                로그인 중...
              </>
            ) : (
              <>
                <GoogleIcon />
                Google 계정으로 시작하기
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <p className="relative text-[11px] text-white/60">
            로그인 시 서비스 이용약관에 동의하는 것으로 간주됩니다
          </p>
        </Card>
      </section>
    </div>
  );
}
