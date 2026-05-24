import { Link2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-mesh-gradient text-white pb-16">
      {/* 헤더 스켈레톤 */}
      <header className="w-full max-w-4xl mx-auto px-4 py-3 sticky top-4 z-50">
        <div className="w-full h-16 rounded-2xl glass-card flex items-center justify-between px-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">MyLink</span>
          </div>
          <div className="w-24 h-8 rounded-xl bg-white/10 animate-pulse" />
        </div>
      </header>

      <main className="w-full max-w-md flex flex-col gap-6 mt-4 px-4">
        {/* 프로필 스켈레톤 */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <div className="w-24 h-24 rounded-full bg-white/15 animate-pulse" />
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="w-36 h-6 rounded-lg bg-white/15 animate-pulse" />
            <div className="w-56 h-4 rounded-lg bg-white/10 animate-pulse" />
          </div>
        </div>

        {/* 소셜 아이콘 스켈레톤 */}
        <div className="flex justify-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-11 h-11 rounded-full bg-white/10 animate-pulse" />
          ))}
        </div>

        {/* 링크 스켈레톤 */}
        <div className="flex flex-col gap-4 mt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-[66px] rounded-xl glass-card animate-pulse bg-white/10"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
