"use client";

import { getAnalytics, isSupported } from "firebase/analytics";
import app from "./config";

/**
 * Analytics는 브라우저 환경에서만 동작합니다.
 * isSupported()로 환경 체크 후 초기화합니다.
 */
export async function initAnalytics() {
  const supported = await isSupported();
  if (supported) {
    return getAnalytics(app);
  }
  return null;
}
