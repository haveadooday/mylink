import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "./config";

// Google 인증 공급자 설정
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * Google 계정으로 로그인을 진행합니다 (팝업 창 방식)
 * - cancelled-popup-request: 팝업이 이미 열려있을 때 다시 호출된 경우 (이전 팝업 취소)
 * - popup-closed-by-user: 사용자가 직접 팝업을 닫은 경우
 * 위 두 경우는 실제 오류가 아니므로 조용히 null을 반환합니다.
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (
      code === "auth/cancelled-popup-request" ||
      code === "auth/popup-closed-by-user"
    ) {
      // 사용자가 팝업을 닫거나 중복 요청 시 → 무시
      return null;
    }
    console.error("Google 로그인 중 에러 발생:", error);
    throw error;
  }
}

/**
 * 로그아웃을 진행합니다
 */
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("로그아웃 중 에러 발생:", error);
    throw error;
  }
}
