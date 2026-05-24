import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { db } from "./config";

export interface UserProfile {
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayname: string;
  username: string;
  bio: string;
}

/**
 * 로그인 시 사용자의 구글 정보를 Firestore users/{uid} 경로에 병합 저장(upsert)합니다.
 * 기존 데이터가 존재하는 경우 bio, displayname, username 등 기존 입력값은 보존하고,
 * photoURL 등 갱신 가능한 프로필 데이터만 업데이트합니다.
 */
export async function syncUserProfile(user: FirebaseUser): Promise<UserProfile> {
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  const email = user.email;
  const emailPrefix = email ? email.split("@")[0] : "user";

  if (docSnap.exists()) {
    // 문서가 이미 존재하면 기존 정보 유지하며 photoURL 등 기본 정보 최신화
    const existingData = docSnap.data() as UserProfile;
    const updatedProfile: UserProfile = {
      uid: user.uid,
      email: email,
      photoURL: user.photoURL || existingData.photoURL,
      displayname: existingData.displayname || emailPrefix,
      username: existingData.username || emailPrefix,
      bio: existingData.bio || "반갑습니다! 마이링크 페이지입니다.",
    };
    await setDoc(docRef, updatedProfile, { merge: true });
    return updatedProfile;
  } else {
    // 신규 유저 생성
    const newProfile: UserProfile = {
      uid: user.uid,
      email: email,
      photoURL: user.photoURL,
      displayname: emailPrefix,
      username: emailPrefix,
      bio: "반갑습니다! 마이링크 페이지입니다.",
    };
    await setDoc(docRef, newProfile);
    return newProfile;
  }
}

/**
 * Firestore에서 유저 프로필 정보를 조회합니다.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

/**
 * Firestore의 유저 프로필 정보를 실시간으로 구독합니다.
 */
export function subscribeToUserProfile(
  uid: string,
  onUpdate: (profile: UserProfile) => void,
  onError?: (error: Error) => void
): () => void {
  const docRef = doc(db, "users", uid);
  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as UserProfile);
      }
    },
    (error) => {
      console.error("유저 프로필 구독 오류:", error);
      onError?.(error);
    }
  );
  return unsubscribe;
}
