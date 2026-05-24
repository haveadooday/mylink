"use client";

import { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebase/config";
import { signInWithGoogle, logOut } from "@/lib/firebase/auth";
import { syncUserProfile } from "@/lib/firebase/user";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Firebase Auth 상태를 관리하는 커스텀 훅
 * - 로그인 시 syncUserProfile 호출 후 프로필 캐시를 선(先)주입
 * - 로그아웃 시 프로필 캐시 제거
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Firestore 프로필 upsert 후 쿼리 캐시에 선주입
          // → useUserProfile 쿼리가 즉시 데이터를 받아볼 수 있음
          const profile = await syncUserProfile(currentUser);
          queryClient.setQueryData(queryKeys.userProfile(currentUser.uid), profile);
        } catch (error) {
          console.error("유저 프로필 동기화 오류:", error);
        }
      } else {
        // 로그아웃 시 프로필/링크 캐시 모두 제거
        queryClient.removeQueries({ queryKey: ["userProfile"] });
        queryClient.removeQueries({ queryKey: ["links"] });
      }

      setAuthLoading(false);
    });

    return unsubscribe;
  }, [queryClient]);

  const handleLogin = async () => {
    if (isLoginPending) return;
    setIsLoginPending(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
    } finally {
      setIsLoginPending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return { user, authLoading, isLoginPending, handleLogin, handleLogout };
}
