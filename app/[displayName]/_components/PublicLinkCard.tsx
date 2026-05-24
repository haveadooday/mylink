"use client";

import { Card, CardContent } from "@/components/ui/card";
import { incrementLinkClick } from "@/lib/firebase/links";

interface Props {
  ownerUid: string;
  linkId: string;
  title: string;
  url: string;
}

export default function PublicLinkCard({ ownerUid, linkId, title, url }: Props) {
  let domain = "google.com";
  try {
    domain = new URL(url).hostname;
  } catch {
    // invalid URL
  }
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const handleClick = () => {
    // fire-and-forget — 네비게이션을 막지 않음
    void incrementLinkClick(ownerUid, linkId).catch(() => {
      // 클릭 카운트 증가 실패는 사용자 경험을 막지 않도록 무시
    });
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block w-full"
    >
      <Card className="w-full glass-card hover:-translate-y-0.5 hover:bg-white/20 border-0 transition-all duration-300 cursor-pointer overflow-hidden">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faviconUrl}
              alt={`${title} icon`}
              className="w-6 h-6 object-contain"
            />
          </div>
          <span className="font-semibold text-lg text-white truncate flex-1">
            {title}
          </span>
        </CardContent>
      </Card>
    </a>
  );
}
