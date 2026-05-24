import { notFound } from "next/navigation";
import { Camera, Code, Mail, Video, Link2 } from "lucide-react";
import { getUserProfileByDisplayname } from "@/lib/firebase/user";
import { getLinks } from "@/lib/firebase/links";
import PublicLinkCard from "./_components/PublicLinkCard";

interface Props {
  params: Promise<{ displayName: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { displayName } = await params;
  return {
    title: `@${displayName} · MyLink`,
    description: `${displayName}의 MyLink 프로필 페이지`,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { displayName } = await params;

  // displayname으로 유저 검색
  const profile = await getUserProfileByDisplayname(displayName);
  if (!profile) notFound();

  // 해당 유저의 링크 목록 조회 (users/{userId}/links)
  const links = await getLinks(profile.uid);
  const visibleLinks = links.filter((l) => l.url); // url이 있는 링크만 표시

  return (
    <div className="flex min-h-screen flex-col items-center bg-mesh-gradient text-white pb-16">
      {/* 상단 브랜드 헤더 */}
      <header className="w-full max-w-4xl mx-auto px-4 py-3 sticky top-4 z-50">
        <div className="w-full h-16 rounded-2xl glass-card flex items-center justify-between px-6 border border-white/20 shadow-lg">
          <a
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 shadow-inner">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              MyLink
            </span>
          </a>
          {/* 나도 만들기 버튼 */}
          <a
            href="/"
            className="text-xs sm:text-sm font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl transition-all"
          >
            나도 만들기 →
          </a>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="w-full max-w-md flex flex-col gap-6 mt-4 px-4 relative z-10">
        {/* 프로필 정보 */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center border-2 border-white/40 shadow-xl overflow-hidden bg-white/10 backdrop-blur-md">
            {profile.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photoURL}
                alt={profile.displayname}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-white/80">
                {profile.displayname.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              @{profile.displayname}
            </h1>
            <p className="text-white/85 mt-1 text-sm font-medium">
              {profile.bio || "반갑습니다! 마이링크 페이지입니다."}
            </p>
          </div>
        </div>

        {/* 소셜 퀵링크 아이콘 */}
        <div className="flex justify-center gap-4">
          <span className="p-3 rounded-full glass-card opacity-40 cursor-not-allowed">
            <Camera className="w-5 h-5" />
          </span>
          <span className="p-3 rounded-full glass-card opacity-40 cursor-not-allowed">
            <Video className="w-5 h-5" />
          </span>
          <span className="p-3 rounded-full glass-card opacity-40 cursor-not-allowed">
            <Code className="w-5 h-5" />
          </span>
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="p-3 rounded-full glass-card hover:-translate-y-1 hover:bg-white/20 transition-all"
            >
              <Mail className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* 링크 목록 */}
        <div className="flex flex-col gap-4 mt-2">
          {visibleLinks.length === 0 ? (
            <p className="text-center text-white/50 text-sm py-12 bg-white/5 rounded-xl border border-white/5">
              아직 등록된 링크가 없습니다.
            </p>
          ) : (
            visibleLinks.map((link) => (
              <PublicLinkCard
                key={link.id}
                ownerUid={profile.uid}
                linkId={link.id}
                title={link.title}
                url={link.url}
              />
            ))
          )}
        </div>

        {/* 푸터 브랜딩 */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-white/30 text-xs">
          <Link2 className="w-3 h-3" />
          <span>MyLink로 만든 페이지</span>
        </div>
      </main>
    </div>
  );
}
