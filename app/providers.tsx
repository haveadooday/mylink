"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // QueryClient를 useState로 생성해 SSR 환경에서 요청 간 상태 공유를 방지합니다
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 창 포커스 시 자동 refetch 비활성화 (Firebase 앱에서 불필요)
            refetchOnWindowFocus: false,
            // 30초 동안 데이터를 fresh로 간주
            staleTime: 30_000,
            // 실패 시 1회 재시도
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
