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
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
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
