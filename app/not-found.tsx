import Link from "next/link";
import { Link2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-mesh-gradient text-white">
      {/* 헤더 */}
      <header className="w-full max-w-4xl mx-auto px-4 py-3 sticky top-4 z-50">
        <div className="w-full h-16 rounded-2xl glass-card flex items-center px-6 border border-white/20 shadow-lg">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 shadow-inner">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              MyLink
            </span>
          </Link>
        </div>
      </header>

      {/* 404 콘텐츠 */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
        {/* 아이콘 */}
        <div className="relative">
          <div className="w-28 h-28 rounded-3xl glass-card flex items-center justify-center border border-white/20 shadow-2xl">
            <SearchX className="w-14 h-14 text-white/70" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white font-bold text-sm shadow-lg border border-red-400/40">
            !
          </div>
        </div>

        {/* 텍스트 */}
        <div className="flex flex-col gap-3">
          <p className="text-white/40 text-sm font-semibold tracking-widest uppercase">
            404 Not Found
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
            존재하지 않는 프로필이거나 잘못된 주소입니다.
            <br />
            URL을 다시 확인해주세요.
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            className="bg-white hover:bg-zinc-100 text-black font-bold px-6 py-5 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
