"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  updateUserProfile,
  type UserProfile,
  type UpdateProfileData,
} from "@/lib/firebase/user";
import { queryKeys } from "@/lib/queryKeys";

/**
 * 특정 유저의 프로필을 가져오는 쿼리 훅
 * staleTime을 넉넉히 줘서 불필요한 refetch를 방지합니다.
 */
export function useUserProfile(uid: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.userProfile(uid ?? ""),
    queryFn: () => getUserProfile(uid!),
    enabled: !!uid,
    staleTime: 60_000, // 1분
  });
}

/**
 * 프로필 업데이트 mutation — 낙관적 업데이트(Optimistic Update) 적용
 *
 * 흐름:
 *  1. onMutate: 진행 중인 refetch 취소 → 이전 캐시 스냅샷 → 캐시 즉시 업데이트
 *  2. UI가 서버 응답 없이 바로 변경된 값을 보여줌
 *  3. onError: Firestore 쓰기 실패 시 스냅샷으로 롤백
 *  4. onSettled: 성공/실패 무관하게 서버 최신값으로 최종 동기화
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, data }: { uid: string; data: UpdateProfileData }) =>
      updateUserProfile(uid, data),

    onMutate: async ({ uid, data }) => {
      // 1. 진행 중인 refetch가 낙관적 업데이트를 덮어쓰지 못하도록 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.userProfile(uid) });

      // 2. 현재 캐시 값을 스냅샷으로 저장 (롤백용)
      const previousProfile = queryClient.getQueryData<UserProfile>(
        queryKeys.userProfile(uid)
      );

      // 3. 캐시를 낙관적으로 즉시 업데이트
      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(queryKeys.userProfile(uid), {
          ...previousProfile,
          ...data,
        });
      }

      // context로 스냅샷 전달 (onError에서 사용)
      return { previousProfile, uid };
    },

    onError: (_err, _vars, context) => {
      // Firestore 쓰기 실패 시 이전 상태로 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(
          queryKeys.userProfile(context.uid),
          context.previousProfile
        );
      }
    },

    onSettled: (_data, _err, { uid }) => {
      // 성공/실패 무관하게 서버 최신 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile(uid) });
    },
  });
}
