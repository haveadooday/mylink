import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";

// ─── 타입 정의 ──────────────────────────────────────────────

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  order: number;
  isActive: boolean;
  createdAt?: unknown;
}

export interface UserProfile {
  uid: string;
  username: string; // 고유 URL slug (예: /taehoo)
  displayName: string;
  bio: string;
  photoURL?: string;
  links: LinkItem[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

// ─── 유저 프로필 ─────────────────────────────────────────────

/**
 * uid로 유저 프로필 조회
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

/**
 * username(slug)으로 유저 프로필 조회 (방문자 화면용)
 */
export async function getUserProfileByUsername(
  username: string,
): Promise<UserProfile | null> {
  const q = query(
    collection(db, "users"),
    where("username", "==", username),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as UserProfile;
}

/**
 * 유저 프로필 생성 (최초 로그인 시)
 */
export async function createUserProfile(
  profile: Omit<UserProfile, "createdAt" | "updatedAt">,
): Promise<void> {
  const ref = doc(db, "users", profile.uid);
  await setDoc(ref, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * 유저 프로필 업데이트
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, "uid" | "createdAt">>,
): Promise<void> {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  } as DocumentData);
}

/**
 * username 중복 확인
 * @returns true이면 사용 가능
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const q = query(
    collection(db, "users"),
    where("username", "==", username),
  );
  const snap = await getDocs(q);
  return snap.empty;
}

export { db };
