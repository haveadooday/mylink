import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

/**
 * Google 팝업으로 로그인
 */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * 로그아웃
 */
export async function logout() {
  await signOut(auth);
}

/**
 * 인증 상태 변경 구독
 * @param callback 인증 상태가 바뀔 때 호출될 콜백 함수
 * @returns unsubscribe 함수
 */
export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export { auth };
