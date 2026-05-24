import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "./config";

export interface Link {
  id: string;
  title: string;
  url: string;
  clickCount?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Firestore 경로 생성 헬퍼 함수
const getCollectionPath = (userId: string) => `users/${userId}/links`;

/**
 * Firestore에서 특정 유저의 링크 목록을 가져옵니다 (생성 날짜 내림차순)
 */
export async function getLinks(userId: string): Promise<Link[]> {
  const q = query(
    collection(db, getCollectionPath(userId)),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Link, "id">),
  }));
}

/**
 * Firestore에서 특정 유저의 링크 목록을 클릭수 내림차순으로 가져옵니다.
 * 통계 페이지에서 사용합니다.
 */
export async function getLinksByClickCount(userId: string): Promise<Link[]> {
  const q = query(
    collection(db, getCollectionPath(userId)),
    orderBy("clickCount", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Link, "id">),
  }));
}

/**
 * Firestore에 특정 유저의 새로운 링크를 추가합니다
 */
export async function addLink(
  userId: string,
  link: Omit<Link, "id" | "createdAt" | "updatedAt">
): Promise<Link> {
  const docRef = await addDoc(collection(db, getCollectionPath(userId)), {
    ...link,
    createdAt: serverTimestamp(),
  });
  return {
    id: docRef.id,
    ...link,
  };
}

/**
 * Firestore에서 특정 유저의 링크를 수정합니다
 */
export async function updateLink(
  userId: string,
  linkId: string,
  link: Partial<Omit<Link, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  const docRef = doc(db, getCollectionPath(userId), linkId);
  await updateDoc(docRef, {
    ...link,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Firestore에서 특정 유저의 링크를 삭제합니다
 */
export async function deleteLink(userId: string, linkId: string): Promise<void> {
  await deleteDoc(doc(db, getCollectionPath(userId), linkId));
}

/**
 * 공개 프로필 페이지에서 링크가 클릭될 때 clickCount를 1 증가시킵니다.
 * 로그인 여부와 관계없이 누구나 호출할 수 있도록 Firestore 규칙에서 허용되어야 합니다.
 */
export async function incrementLinkClick(
  userId: string,
  linkId: string
): Promise<void> {
  const docRef = doc(db, getCollectionPath(userId), linkId);
  await updateDoc(docRef, { clickCount: increment(1) });
}

