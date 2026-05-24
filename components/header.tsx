"use client";

import { User } from "firebase/auth";
import { LogOut, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/firebase/user";

interface HeaderProps {
  user: User | null;
  userProfile?: UserProfile | null;
  onLogin: () => Promise<void>;
  onLogout: () => Promise<void>;
  isLoading?: boolean;
}

export default function Header({ user, userProfile, onLogin, onLogout, isLoading = false }: HeaderProps) {
  const displayName = userProfile?.displayname || user?.displayName || "사용자";
  const email = userProfile?.email || user?.email || "";
  const photoURL = userProfile?.photoURL || user?.photoURL || null;

  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-3 sticky top-4 z-50">
      <div className="w-full h-16 rounded-2xl glass-card flex items-center justify-between px-6 border border-white/20 dark:border-white/10 shadow-lg">
        {/* 서비스 로고 */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 shadow-inner">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">MyLink</span>
        </div>

        {/* 우측 로그인/로그아웃 버튼 */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/60">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* 유저 아바타 및 닉네임 */}
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-sm font-semibold text-white">{displayName}</span>
                <span className="text-[10px] text-white/60 truncate max-w-[120px]">{email}</span>
              </div>
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/30 shadow-md">
                {photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoURL}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                    {displayName.charAt(0)}
                  </div>
                )}
              </div>
              
              {/* 로그아웃 버튼 */}
              <Button
                onClick={onLogout}
                variant="ghost"
                className="text-white hover:bg-white/15 gap-2 px-3 rounded-xl border border-white/10 hover:border-white/20 text-xs sm:text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xs:inline">로그아웃</span>
              </Button>
            </div>
          ) : (
            // 구글 소셜 로그인 버튼
            <Button
              onClick={onLogin}
              className="bg-white hover:bg-zinc-100 text-black font-semibold rounded-xl flex items-center gap-2 shadow-md border border-white px-4 py-2 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs sm:text-sm"
            >
              {/* 구글 G 로고 SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.77-2.4 3.61v3h3.86c2.26-2.09 3.59-5.17 3.59-8.46z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.29a7.18 7.18 0 0 1 0-4.58V6.62H1.29a11.94 11.94 0 0 0 0 10.76l3.98-3.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
              <span>Google로 시작하기</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
