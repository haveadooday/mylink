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

// Firestore 경로: users/anonymous/links
const LINKS_COLLECTION = "users/anonymous/links";

/**
 * Firestore에서 링크 목록을 가져옵니다 (생성 날짜 내림차순)
 */
export async function getLinks(): Promise<Link[]> {
  const q = query(
    collection(db, LINKS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Link, "id">),
  }));
}

/**
 * Firestore 링크 목록을 실시간으로 구독합니다 (createdAt 내림차순)
 * @returns 구독 해제 함수 (unsubscribe)
 */
export function subscribeToLinks(
  onUpdate: (links: Link[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, LINKS_COLLECTION),
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
 * Firestore에 새로운 링크를 추가합니다
 */
export async function addLink(
  link: Omit<Link, "id" | "createdAt" | "updatedAt">
): Promise<Link> {
  const docRef = await addDoc(collection(db, LINKS_COLLECTION), {
    ...link,
    createdAt: serverTimestamp(),
  });
  return {
    id: docRef.id,
    ...link,
  };
}

/**
 * Firestore에서 링크를 수정합니다
 */
export async function updateLink(
  linkId: string,
  link: Partial<Omit<Link, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  const docRef = doc(db, LINKS_COLLECTION, linkId);
  await updateDoc(docRef, {
    ...link,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Firestore에서 링크를 삭제합니다
 */
export async function deleteLink(linkId: string): Promise<void> {
  await deleteDoc(doc(db, LINKS_COLLECTION, linkId));
}

