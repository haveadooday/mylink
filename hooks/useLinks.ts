"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLinks,
  getLinksByClickCount,
  addLink,
  updateLink,
  deleteLink,
  type Link,
} from "@/lib/firebase/links";
import { queryKeys } from "@/lib/queryKeys";

/**
 * 특정 유저의 링크 목록을 가져오는 쿼리 훅
 */
export function useLinks(uid: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.links(uid ?? ""),
    queryFn: () => getLinks(uid!),
    enabled: !!uid,
  });
}

/**
 * 특정 유저의 링크 목록을 클릭수 내림차순으로 가져오는 쿼리 훅 (통계 페이지용)
 */
export function useLinksByClickCount(uid: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.linksByClicks(uid ?? ""),
    queryFn: () => getLinksByClickCount(uid!),
    enabled: !!uid,
  });
}

/**
 * 링크 추가 mutation — 성공 시 링크 목록 캐시 무효화
 */
export function useAddLink(uid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (link: Omit<Link, "id" | "createdAt" | "updatedAt">) =>
      addLink(uid, link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links(uid) });
    },
  });
}

/**
 * 링크 수정 mutation — 성공 시 링크 목록 캐시 무효화
 */
export function useUpdateLink(uid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      linkId,
      data,
    }: {
      linkId: string;
      data: Partial<Omit<Link, "id" | "createdAt" | "updatedAt">>;
    }) => updateLink(uid, linkId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links(uid) });
    },
  });
}

/**
 * 링크 삭제 mutation — 성공 시 링크 목록 캐시 무효화
 */
export function useDeleteLink(uid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (linkId: string) => deleteLink(uid, linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links(uid) });
    },
  });
}
