import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
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
 * displayname으로 Firestore 유저 프로필을 검색합니다.
 * 방문자 페이지(공개 URL)에서 사용합니다.
 */
export async function getUserProfileByDisplayname(
  displayname: string
): Promise<UserProfile | null> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("displayname", "==", displayname));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as UserProfile;
}

/**
 * 특정 displayname이 다른 유저에 의해 이미 사용 중인지 확인합니다.
 * @param displayname 확인할 displayname
 * @param currentUid 현재 로그인한 유저의 uid (본인 제외)
 * @returns true면 이미 사용 중 (중복), false면 사용 가능
 */
export async function checkDisplaynameAvailable(
  displayname: string,
  currentUid: string
): Promise<boolean> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("displayname", "==", displayname));
  const snapshot = await getDocs(q);
  // 본인 계정을 제외한 다른 유저가 이 displayname을 사용 중인지 확인
  const isDuplicated = snapshot.docs.some((d) => d.id !== currentUid);
  return !isDuplicated;
}

export interface UpdateProfileData {
  displayname?: string;
  bio?: string;
}

/**
 * 유저 프로필 정보를 부분 업데이트합니다.
 * @param uid 업데이트할 유저의 uid
 * @param data 업데이트할 필드 (displayname, bio)
 */
export async function updateUserProfile(
  uid: string,
  data: UpdateProfileData
): Promise<void> {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, data, { merge: true });
}
