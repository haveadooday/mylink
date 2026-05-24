import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";

export interface Link {
  id: string;
  title: string;
  url: string;
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
 * Firestore의 특정 유저 링크 목록을 실시간으로 구독합니다 (createdAt 내림차순)
 * @returns 구독 해제 함수 (unsubscribe)
 */
export function subscribeToLinks(
  userId: string,
  onUpdate: (links: Link[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, getCollectionPath(userId)),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const links = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Link, "id">),
      }));
      onUpdate(links);
    },
    (error) => {
      console.error("Firestore 구독 오류:", error);
      onError?.(error);
    }
  );

  return unsubscribe;
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

