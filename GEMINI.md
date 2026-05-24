# 마이링크 (MyLink) 프로젝트 가이드 (GEMINI.md)

이 파일은 마이링크 프로젝트의 아키텍처, 개발 컨벤션 및 주요 워크플로우를 정의합니다. 모든 AI 에이전트와 개발자는 이 가이드를 준수해야 합니다.

## 1. 프로젝트 개요
마이링크는 SNS 채널, 포트폴리오, 블로그 등 다양한 링크를 하나의 페이지로 통합하여 공유할 수 있는 멀티 링크 프로필 서비스입니다.

### 핵심 기술 스택
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui, Radix UI, Lucide React
- **Theming:** next-themes (Light/Dark 모드 지원)
- **State Management/Backend:** Firebase (Authentication, Firestore - 도입 예정)

## 2. 프로젝트 구조
```text
C:\Users\오태호\Desktop\학교\대학\바이브코딩\my-link\
├── app/               # Next.js App Router (Layouts, Pages, Globals CSS)
├── components/        # 공통 컴포넌트
│   ├── ui/           # shadcn/ui 컴포넌트
│   └── theme-provider.tsx # 테마 설정 관련
├── docs/              # 기획 및 설계 문서 (PRD, 유저 시나리오 등)
├── hooks/             # 커스텀 훅
├── lib/               # 유틸리티 함수 (utils.ts)
├── public/            # 정적 자산
└── package.json       # 의존성 및 스크립트
```

## 3. 개발 및 빌드 명령어
- `npm run dev`: 개발 서버 실행 (Turbopack 사용)
- `npm run build`: 프로덕션 빌드
- `npm run start`: 빌드된 애플리케이션 실행
- `npm run lint`: ESLint 코드 분석
- `npm run format`: Prettier 코드 포맷팅 (`ts`, `tsx` 대상)
- `npm run typecheck`: TypeScript 타입 체크

## 4. UI 설계 원칙 및 화면 구조 (Wireframes 참고)

### 설계 원칙
- **모바일 퍼스트:** 모바일 화면(반응형)을 최우선으로 설계하며, 깔끔하고 직관적인 UI를 유지합니다.
- **파비콘 자동화:** 링크 등록 시 Google Favicon API를 통해 자동으로 아이콘을 추출하여 사용자 경험을 향상시킵니다.
- **실시간성:** 관리자 화면에서의 변경 사항(정렬, 토글 등)은 프로필 페이지에 즉시 반영되도록 설계합니다.

### 주요 화면 구성
1. **방문자 화면 (Visitor View):**
   - 상단: 프로필 정보(닉네임, Bio), 공유하기 버튼.
   - 중단: 소셜 퀵 링크 아이콘 뱃지.
   - 하단: 파비콘이 포함된 일반 링크 버튼 리스트.
2. **관리자 화면 (Admin Dashboard):**
   - 상단: 로그아웃, 내 프로필 바로가기.
   - 중단: 프로필 정보 수정 필드, "새로운 링크 추가" 버튼.
   - 리스트 영역: 드래그 핸들([≡]), 링크 타이틀/URL 입력창, 노출 활성화 토글, 삭제 버튼([x]).

## 5. 개발 컨벤션 및 가이드라인

### UI 및 스타일링
- **shadcn/ui 사용:** 새로운 UI 컴포넌트가 필요하면 `npx shadcn@latest add [component-name]` 명령어를 사용합니다. 컴포넌트는 `components/ui/` 폴더에 생성됩니다.
- **Tailwind CSS v4:** 최신 Tailwind CSS 문법을 사용하며, 테마 설정은 `app/globals.css`의 `@theme` 블록에서 관리합니다.
- **다크 모드:** `next-themes`를 활용하며, CSS 변수(`oklch` 기반)를 통해 테마별 색상을 정의합니다.

### 코드 작성 규칙
- **TypeScript 우선:** 모든 코드는 타입 안정성을 위해 TypeScript로 작성합니다. `any` 사용을 지양하고 명확한 타입을 정의합니다.
- **App Router 활용:** 서버 컴포넌트와 클라이언트 컴포넌트의 역할을 명확히 구분하여 작성합니다.
- **유틸리티:** 클래스 병합 등 반복되는 로직은 `lib/utils.ts`의 `cn` 함수를 활용합니다.

### 협업 및 의사소통 (Collaboration & Communication)
- **언어 (Language):** 모든 계획(plans), 데스크(desks), 워크스루(walkthroughs) 및 답변은 항상 **한국어**로 작성해야 합니다.
- **파일 참조:** 파일이나 디렉토리 이름 앞에는 항상 `@`를 붙입니다 (예: `@package.json`, `@app/page.tsx`).
- **커밋 메시지:** 변경 이유와 내용을 자세히 설명하여 한국어로 작성합니다 (예: `feat: Firebase 기반 Google 소셜 로그인 기능 추가`). 사용자가 명시적으로 요청할 때만 커밋합니다.
- **검증:** 개발 완료 후에는 항상 `npm run build` 또는 `npm run lint`를 실행하여 오류가 없는지 확인합니다.

## 5. 주요 기능 구현 참고 (PRD 요약)
- **인증:** Firebase Auth 기반 구글 로그인.
- **프로필:** 닉네임(고유 URL로 사용), 한 줄 소개.
- **링크 에디터:** 링크 추가/수정/삭제, 드래그 앤 드롭 정렬, 활성화 토글.
- **자동 파비콘:** Google Favicon API (`https://www.google.com/s2/favicons?domain=[URL]`) 사용.
- **확장 블록:** YouTube 임베드, 텍스트 블록 지원.

---
*이 가이드는 프로젝트의 발전과 함께 지속적으로 업데이트되어야 합니다.*
