"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { User } from "firebase/auth";
import {
  LogOut,
  Link2,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  BarChart2,
  BarChart3,
  ChevronDown,
  UserPen,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserProfile, checkDisplaynameAvailable } from "@/lib/firebase/user";
import { useUpdateProfile } from "@/hooks/useProfile";

interface HeaderProps {
  user: User | null;
  userProfile?: UserProfile | null;
  onLogin: () => Promise<void>;
  onLogout: () => Promise<void>;
  isLoading?: boolean;
  isLoginPending?: boolean;
  linkCount?: number;
}

export default function Header({
  user,
  userProfile,
  onLogin,
  onLogout,
  isLoading = false,
  isLoginPending = false,
  linkCount = 0,
}: HeaderProps) {
  const displayName =
    userProfile?.displayname || user?.displayName || "사용자";
  const email = userProfile?.email || user?.email || "";
  const photoURL = userProfile?.photoURL || user?.photoURL || null;
  const username =
    userProfile?.displayname ||
    user?.email?.split("@")[0] ||
    user?.uid?.slice(0, 8) ||
    "user";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 프로필 수정 모달 상태
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editDisplayname, setEditDisplayname] = useState("");
  const [editBio, setEditBio] = useState("");
  const [displaynameStatus, setDisplaynameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "empty" | "unchanged"
  >("idle");
  // 유효성 검증 에러 (저장 전 로컬 검증용)
  const [validationError, setValidationError] = useState<string | null>(null);

  // 프로필 업데이트 mutation (낙관적 업데이트 포함)
  const updateProfileMutation = useUpdateProfile();

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `/${username}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await onLogout();
  };

  // 프로필 수정 모달 열기
  const handleOpenEditProfile = () => {
    setEditDisplayname(userProfile?.displayname || "");
    setEditBio(userProfile?.bio || "");
    setDisplaynameStatus("idle");
    setValidationError(null);
    updateProfileMutation.reset();
    setIsDropdownOpen(false);
    setIsEditProfileOpen(true);
  };

  // displayname 중복 확인 (디바운싱)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkDisplayname = useCallback(
    (value: string) => {
      if (!user) return;

      if (!value.trim()) {
        setDisplaynameStatus("empty");
        return;
      }
      if (value.trim() === userProfile?.displayname) {
        setDisplaynameStatus("unchanged");
        return;
      }

      setDisplaynameStatus("checking");
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        try {
          const available = await checkDisplaynameAvailable(value.trim(), user.uid);
          setDisplaynameStatus(available ? "available" : "taken");
        } catch {
          setDisplaynameStatus("idle");
        }
      }, 600);
    },
    [user, userProfile?.displayname]
  );

  const handleDisplaynameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditDisplayname(value);
    checkDisplayname(value);
  };

  // 프로필 저장 (낙관적 업데이트: Firestore 응답 전에 UI 즉시 반영)
  const handleSaveProfile = () => {
    if (!user) return;

    if (!editDisplayname.trim()) {
      setValidationError("표시 이름은 비워둘 수 없습니다.");
      return;
    }
    if (displaynameStatus === "taken") {
      setValidationError("이미 사용 중인 표시 이름입니다.");
      return;
    }
    if (displaynameStatus === "checking") {
      setValidationError("중복 확인이 완료될 때까지 기다려주세요.");
      return;
    }

    setValidationError(null);

    const changedDisplayname =
      editDisplayname.trim() !== userProfile?.displayname
        ? editDisplayname.trim()
        : undefined;
    const changedBio =
      editBio.trim() !== userProfile?.bio ? editBio.trim() : undefined;

    // 변경 사항이 없으면 그냥 닫기
    if (changedDisplayname === undefined && changedBio === undefined) {
      setIsEditProfileOpen(false);
      return;
    }

    updateProfileMutation.mutate(
      {
        uid: user.uid,
        data: {
          ...(changedDisplayname !== undefined && { displayname: changedDisplayname }),
          ...(changedBio !== undefined && { bio: changedBio }),
        },
      },
      {
        onSuccess: () => {
          setIsEditProfileOpen(false);
        },
      }
    );
  };

  // displayname 상태 표시 뱃지
  const renderDisplaynameStatus = () => {
    switch (displaynameStatus) {
      case "checking":
        return (
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <Loader2 className="w-3 h-3 animate-spin" />확인 중...
          </span>
        );
      case "available":
        return (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <Check className="w-3 h-3" />사용 가능한 이름입니다.
          </span>
        );
      case "taken":
        return (
          <span className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="w-3 h-3" />이미 사용 중인 이름입니다.
          </span>
        );
      case "empty":
        return (
          <span className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="w-3 h-3" />표시 이름을 입력해주세요.
          </span>
        );
      case "unchanged":
        return (
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            현재 사용 중인 이름입니다.
          </span>
        );
      default:
        return null;
    }
  };

  const isSaveDisabled =
    updateProfileMutation.isPending ||
    displaynameStatus === "taken" ||
    displaynameStatus === "checking" ||
    displaynameStatus === "empty";

  // 저장 중 또는 로컬 유효성 오류 표시
  const saveError =
    validationError ||
    (updateProfileMutation.isError ? "저장 중 오류가 발생했습니다. 다시 시도해주세요." : null);

  return (
    <>
      <header className="w-full max-w-4xl mx-auto px-4 py-3 sticky top-4 z-50">
        <div className="w-full h-16 rounded-2xl glass-card flex items-center justify-between px-6 border border-white/20 dark:border-white/10 shadow-lg">
          {/* 서비스 로고 */}
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 shadow-inner">
              <Link2 className="w-5 h-5 text-white" />
            </span>
            <span className="font-bold text-xl tracking-tight text-white">MyLink</span>
          </Link>

          {/* 우측 로그인/로그아웃 버튼 */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/60">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : user ? (
              /* 프로필 드롭다운 트리거 */
              <div className="relative" ref={dropdownRef}>
                <button
                  id="profile-dropdown-trigger"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/15 border border-white/10 hover:border-white/25 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 shadow-md shrink-0">
                    {photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                        {displayName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-semibold text-white leading-tight">{displayName}</span>
                    <span className="text-[10px] text-white/50 truncate max-w-[100px]">@{username}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* 드롭다운 패널 */}
                {isDropdownOpen && (
                  <div
                    id="profile-dropdown-menu"
                    className="absolute right-0 top-[calc(100%+10px)] w-72 rounded-2xl border border-white/15 shadow-2xl overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(30,30,50,0.97) 0%, rgba(20,20,40,0.99) 100%)",
                      backdropFilter: "blur(24px)",
                    }}
                  >
                    {/* 유저 정보 헤더 */}
                    <div className="px-5 py-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-md shrink-0">
                          {photoURL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                              {displayName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{displayName}</p>
                          <p className="text-white/50 text-xs truncate">{email}</p>
                          <p className="text-white/40 text-[10px] mt-0.5">@{username}</p>
                        </div>
                      </div>
                    </div>

                    {/* 링크 통계 */}
                    <div className="px-5 py-3 border-b border-white/10">
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/25 flex items-center justify-center shrink-0">
                          <BarChart2 className="w-4 h-4 text-indigo-300" />
                        </div>
                        <div>
                          <p className="text-white/50 text-[10px] font-medium uppercase tracking-wide">등록된 링크</p>
                          <p className="text-white font-bold text-lg leading-tight">
                            {linkCount}
                            <span className="text-white/40 text-xs font-normal ml-1">개</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 액션 메뉴 */}
                    <div className="px-3 py-3 flex flex-col gap-1">
                      <a
                        id="profile-view-link"
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium group"
                      >
                        <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                        내 프로필 페이지 보기
                      </a>

                      <button
                        id="profile-copy-link"
                        type="button"
                        onClick={handleCopyLink}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium group text-left"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">링크가 복사되었습니다!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                            프로필 링크 복사
                          </>
                        )}
                      </button>

                      {/* 통계 페이지 */}
                      <Link
                        id="profile-stats-link"
                        href="/stats"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium group"
                      >
                        <BarChart3 className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                        내 링크 통계
                      </Link>

                      {/* 프로필 수정 */}
                      <button
                        id="profile-edit-btn"
                        type="button"
                        onClick={handleOpenEditProfile}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium group text-left"
                      >
                        <UserPen className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                        프로필 수정
                      </button>

                      <div className="my-1 border-t border-white/10" />

                      <button
                        id="profile-logout-btn"
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400/90 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm font-medium group text-left"
                      >
                        <LogOut className="w-4 h-4 group-hover:text-red-300 transition-colors" />
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 구글 소셜 로그인 버튼
              <Button
                onClick={onLogin}
                disabled={isLoginPending}
                className="bg-white hover:bg-zinc-100 text-black font-semibold rounded-xl flex items-center gap-2 shadow-md border border-white px-4 py-2 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoginPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.77-2.4 3.61v3h3.86c2.26-2.09 3.59-5.17 3.59-8.46z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
                    <path fill="#FBBC05" d="M5.27 14.29a7.18 7.18 0 0 1 0-4.58V6.62H1.29a11.94 11.94 0 0 0 0 10.76l3.98-3.09z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
                  </svg>
                )}
                <span>{isLoginPending ? "로그인 중..." : "Google로 시작하기"}</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 프로필 수정 다이얼로그 */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border border-zinc-800 text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <UserPen className="w-5 h-5 text-white/70" />
              프로필 수정
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5 py-2">
            {/* 아바타 미리보기 */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                {photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    {(editDisplayname || displayName).charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {editDisplayname || displayName}
                </p>
                <p className="text-white/40 text-xs mt-0.5">@{username}</p>
                <p className="text-white/30 text-[10px] mt-0.5 truncate">{email}</p>
              </div>
            </div>

            {/* 표시 이름 입력 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-displayname" className="text-zinc-400 text-sm">
                표시 이름
              </Label>
              <Input
                id="edit-displayname"
                value={editDisplayname}
                onChange={handleDisplaynameChange}
                placeholder="표시될 이름을 입력하세요"
                maxLength={30}
                className={`bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600 ${
                  displaynameStatus === "taken" || displaynameStatus === "empty"
                    ? "border-red-500 focus-visible:ring-red-500"
                    : displaynameStatus === "available"
                    ? "border-emerald-500 focus-visible:ring-emerald-500"
                    : "border-zinc-700"
                }`}
              />
              <div className="min-h-[18px]">{renderDisplaynameStatus()}</div>
            </div>

            {/* 소개 입력 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-bio" className="text-zinc-400 text-sm">
                한 줄 소개
              </Label>
              <Input
                id="edit-bio"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="간단한 소개를 입력하세요"
                maxLength={100}
                className="bg-zinc-800 text-white placeholder:text-zinc-500 border-zinc-700 focus-visible:ring-zinc-600"
              />
              <p className="text-zinc-600 text-[10px] text-right">{editBio.length} / 100</p>
            </div>

            {/* 오류 메시지 (로컬 유효성 검증 또는 mutation 에러) */}
            {saveError && (
              <p className="text-red-400 text-xs flex items-center gap-1.5 bg-red-950/40 border border-red-900/40 px-3 py-2.5 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {saveError}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditProfileOpen(false)}
              disabled={updateProfileMutation.isPending}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaveDisabled}
              className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  저장 중...
                </>
              ) : (
                "저장하기"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
