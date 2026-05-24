"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Code,
  Camera,
  Video,
  Mail,
  Share2,
  Plus,
  Loader2,
  Pencil,
  Trash2,
  X,
  Check,
  MousePointerClick,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { type Link } from "@/lib/firebase/links";
import Header from "@/components/header";
import LandingHero from "@/app/_components/LandingHero";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useProfile";
import { useLinks, useAddLink, useUpdateLink, useDeleteLink } from "@/hooks/useLinks";

const domainRegex =
  /^[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z0-9][-a-zA-Z0-9.]*[a-zA-Z]{2,}$/;

const linkFormSchema = z.object({
  title: z
    .string()
    .min(1, "타이틀을 입력해주세요.")
    .max(20, "타이틀은 최대 20자까지 입력 가능합니다.")
    .refine((val) => val.trim().length > 0, "타이틀을 입력해주세요."),
  url: z
    .string()
    .min(1, "URL을 입력해주세요.")
    .refine((val) => {
      let testVal = val.trim();
      if (!/^https?:\/\//i.test(testVal)) testVal = `https://${testVal}`;
      try {
        const parsed = new URL(testVal);
        return domainRegex.test(parsed.hostname);
      } catch (_) {
        return false;
      }
    }, "올바른 도메인 주소 형식을 입력해주세요 (예: naver.com 또는 https://naver.com)"),
});

type LinkFormValues = z.infer<typeof linkFormSchema>;

const normalizeUrl = (url: string) =>
  /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;

export default function Page() {
  // ── 인증 & 데이터 훅 ─────────────────────────────────────────────
  const { user, authLoading, isLoginPending, handleLogin, handleLogout } = useAuth();
  const { data: userProfile } = useUserProfile(user?.uid);

  const uid = user?.uid ?? "";
  const { data: links = [], isLoading, isFetching } = useLinks(user?.uid);
  const addLinkMutation = useAddLink(uid);
  const updateLinkMutation = useUpdateLink(uid);
  const deleteLinkMutation = useDeleteLink(uid);

  // 링크 목록 갱신 중 여부 (초기 로딩 제외)
  const isRefreshing = !isLoading && isFetching;

  // 현재 삭제 중인 링크 ID
  const isDeletingId = deleteLinkMutation.isPending
    ? (deleteLinkMutation.variables as string)
    : null;

  // ── UI 상태 ──────────────────────────────────────────────────────
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetLink, setDeleteTargetLink] = useState<Link | null>(null);

  // ── 폼 ───────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: { title: "", url: "" },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: editErrors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: { title: "", url: "" },
  });

  // ── 핸들러 ───────────────────────────────────────────────────────
  const onSubmit = (data: LinkFormValues) => {
    addLinkMutation.mutate(
      { title: data.title.trim(), url: normalizeUrl(data.url) },
      { onSuccess: () => { reset(); setIsAddDialogOpen(false); } }
    );
  };

  const handleOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) reset();
  };

  const handleEditStart = (link: Link) => {
    setEditingId(link.id);
    setValueEdit("title", link.title);
    setValueEdit("url", link.url);
  };

  const handleEditCancel = () => { setEditingId(null); resetEdit(); };

  const onEditSubmit = (data: LinkFormValues) => {
    if (!editingId) return;
    updateLinkMutation.mutate(
      { linkId: editingId, data: { title: data.title.trim(), url: normalizeUrl(data.url) } },
      { onSuccess: () => { setEditingId(null); resetEdit(); } }
    );
  };

  const handleDeleteRequest = (link: Link) => setDeleteTargetLink(link);
  const handleDeleteCancel = () => setDeleteTargetLink(null);
  const handleDeleteConfirm = () => {
    if (!deleteTargetLink) return;
    const targetId = deleteTargetLink.id;
    setDeleteTargetLink(null);
    deleteLinkMutation.mutate(targetId);
  };

  // ── 렌더 ─────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col items-center bg-mesh-gradient text-white pb-12">
      {/* 글로벌 상단 헤더 */}
      <Header
        user={user}
        userProfile={userProfile}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoading={authLoading}
        isLoginPending={isLoginPending}
        linkCount={links.length}
      />

      {/* 메인 콘텐츠 영역 */}
      {authLoading ? (
        // 인증 로딩 스피너
        <div className="w-full max-w-md flex flex-col items-center justify-center py-20 gap-3 mt-4 px-4 relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-white/70 text-sm font-medium">사용자 정보를 확인하고 있습니다...</p>
        </div>
      ) : !user ? (
        // 비로그인 랜딩 (전체 너비 사용)
        <div className="w-full relative z-10">
          <LandingHero onLogin={handleLogin} isLoginPending={isLoginPending} />
        </div>
      ) : (
        // 로그인 완료된 사용자 프로필 및 링크 관리 UI
        <div className="w-full max-w-md flex flex-col gap-6 mt-4 px-4 relative z-10">
          <>
            {/* Share Button */}
            <div className="absolute top-0 right-0">
              <button className="p-2 rounded-full glass-card hover:bg-white/20 transition-colors cursor-pointer">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center border-2 border-white/40 shadow-xl overflow-hidden bg-white/10 backdrop-blur-md">
                {userProfile?.photoURL || user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userProfile?.photoURL || user.photoURL || undefined}
                    alt={userProfile?.displayname || user.displayName || "User avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white/80" />
                )}
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  @{userProfile?.displayname || user.displayName || user.email?.split("@")[0] || "user"}
                </h1>
                <p className="text-white/85 mt-1 text-sm font-medium">
                  {userProfile?.bio || "반갑습니다! 마이링크 페이지입니다."}
                </p>
                <p className="text-white/50 mt-0.5 text-[10px] font-light">{user.email}</p>
              </div>
            </div>

            {/* Social Quick Links */}
            <div className="flex justify-center gap-4 my-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass-card hover:-translate-y-1 hover:bg-white/20 transition-all">
                <Camera className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass-card hover:-translate-y-1 hover:bg-white/20 transition-all">
                <Video className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass-card hover:-translate-y-1 hover:bg-white/20 transition-all">
                <Code className="w-5 h-5" />
              </a>
              <a href={`mailto:${user.email}`} className="p-3 rounded-full glass-card hover:-translate-y-1 hover:bg-white/20 transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* Add Link Button & Dialog */}
            <div className="flex justify-center w-full mt-2">
              <Dialog open={isAddDialogOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm shadow-md rounded-xl py-6 text-base gap-2 cursor-pointer">
                    <Plus className="w-5 h-5" /> 새로운 링크 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-zinc-900 border border-zinc-800 text-white rounded-xl">
                  <DialogHeader>
                    <DialogTitle>새로운 링크 추가</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="title" className="text-zinc-400">타이틀</Label>
                        <Input
                          id="title"
                          {...register("title")}
                          placeholder="예: 내 포트폴리오"
                          className={`bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600 ${errors.title ? "border-red-500 focus-visible:ring-red-500" : "border-zinc-700"}`}
                        />
                        {errors.title && <span className="text-xs text-red-400 font-medium mt-0.5">{errors.title.message}</span>}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="url" className="text-zinc-400">URL</Label>
                        <Input
                          id="url"
                          {...register("url")}
                          placeholder="https://example.com"
                          className={`bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600 ${errors.url ? "border-red-500 focus-visible:ring-red-500" : "border-zinc-700"}`}
                        />
                        {errors.url && <span className="text-xs text-red-400 font-medium mt-0.5">{errors.url.message}</span>}
                      </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                        취소
                      </Button>
                      <Button type="submit" disabled={addLinkMutation.isPending} className="bg-white text-black hover:bg-zinc-200">
                        {addLinkMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "추가하기"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Links List */}
            <div className="flex flex-col gap-4 mt-2">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-full h-[66px] rounded-xl glass-card animate-pulse bg-white/10" />
                ))
              ) : isRefreshing ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-white/60" />
                  <p className="text-white/50 text-sm">목록을 갱신하는 중...</p>
                </div>
              ) : links.length === 0 ? (
                <p className="text-center text-white/50 text-sm py-8 bg-white/5 rounded-xl border border-white/5">
                  아직 등록된 링크가 없습니다.<br />첫 번째 링크를 추가해보세요!
                </p>
              ) : (
                links.map((link) => {
                  // 인라인 편집 UI
                  if (editingId === link.id) {
                    return (
                      <div key={link.id} className="w-full">
                        <Card className="w-full glass-card border-0 overflow-hidden bg-white/10 backdrop-blur-md">
                          <CardContent className="p-4">
                            <form onSubmit={handleSubmitEdit(onEditSubmit)} className="flex flex-col gap-3">
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="edit-title" className="text-zinc-400 text-xs">타이틀 수정</Label>
                                <Input
                                  id="edit-title"
                                  {...registerEdit("title")}
                                  placeholder="예: 내 포트폴리오"
                                  className={`bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600 text-sm h-9 ${editErrors.title ? "border-red-500 focus-visible:ring-red-500" : "border-zinc-700"}`}
                                />
                                {editErrors.title && <span className="text-xs text-red-400 font-medium mt-0.5">{editErrors.title.message}</span>}
                              </div>
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="edit-url" className="text-zinc-400 text-xs">URL 수정</Label>
                                <Input
                                  id="edit-url"
                                  {...registerEdit("url")}
                                  placeholder="https://example.com"
                                  className={`bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600 text-sm h-9 ${editErrors.url ? "border-red-500 focus-visible:ring-red-500" : "border-zinc-700"}`}
                                />
                                {editErrors.url && <span className="text-xs text-red-400 font-medium mt-0.5">{editErrors.url.message}</span>}
                              </div>
                              <div className="flex justify-end gap-2 mt-1">
                                <Button type="button" onClick={handleEditCancel} variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800 px-3 py-1 h-8 text-xs">
                                  <X className="w-3.5 h-3.5 mr-1" />취소
                                </Button>
                                <Button type="submit" disabled={updateLinkMutation.isPending} className="bg-white text-black hover:bg-zinc-200 px-3 py-1 h-8 text-xs font-semibold">
                                  {updateLinkMutation.isPending ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <><Check className="w-3.5 h-3.5 mr-1" />저장</>
                                  )}
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  }

                  // 일반 링크 카드 UI
                  let domain = "google.com";
                  try { domain = new URL(link.url).hostname; } catch (_) { /* ignore */ }
                  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

                  return (
                    <div key={link.id} className="relative w-full group">
                      {isDeletingId === link.id ? (
                        <Card className="w-full glass-card border-0 transition-all duration-300 overflow-hidden bg-white/5 opacity-60">
                          <CardContent className="flex items-center justify-center p-4 h-[72px]">
                            <Loader2 className="w-5 h-5 animate-spin text-white/60 mr-2" />
                            <span className="text-sm text-white/60">삭제하는 중...</span>
                          </CardContent>
                        </Card>
                      ) : (
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                          <Card className="w-full glass-card hover:-translate-y-0.5 hover:bg-white/20 border-0 transition-all duration-300 cursor-pointer overflow-hidden">
                            <CardContent className="flex items-center justify-between p-4 relative">
                              <div className="flex items-center min-w-0 pr-2">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 overflow-hidden mr-4">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={faviconUrl} alt={`${link.title} icon`} className="w-6 h-6 object-contain" />
                                </div>
                                <span className="font-semibold text-lg text-white truncate">{link.title}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 z-20">
                                <span className="flex items-center gap-1 text-white/70 text-sm font-medium">
                                  <MousePointerClick className="w-4 h-4" />
                                  {link.clickCount ?? 0}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEditStart(link); }}
                                  title="수정"
                                  className="p-2 rounded-lg bg-white/10 hover:bg-white/30 text-white/80 hover:text-white transition-all cursor-pointer border border-white/10"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteRequest(link); }}
                                  title="삭제"
                                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-200 transition-all cursor-pointer border border-red-500/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <Dialog open={!!deleteTargetLink} onOpenChange={(open) => { if (!open) handleDeleteCancel(); }}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border border-zinc-800 text-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">정말 삭제하시겠습니까?</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-3">
            <p className="text-zinc-300 text-sm">
              삭제할 링크: <span className="font-bold text-white text-base">{deleteTargetLink?.title}</span>
            </p>
            <p className="text-red-400 font-medium text-xs bg-red-950/40 border border-red-900/40 p-3 rounded-lg flex items-center gap-1.5">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={handleDeleteCancel} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
              취소
            </Button>
            <Button type="button" onClick={handleDeleteConfirm} className="bg-red-600 text-white hover:bg-red-700">
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
