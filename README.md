# 마이링크 (MyLink)

> 흩어져 있는 나만의 모든 링크를 하나의 페이지로.

**마이링크(MyLink)** 는 SNS 채널, 포트폴리오, 블로그, 유튜브 등 여러 곳에 흩어진 링크들을 하나의 매력적인 프로필 페이지로 모아 공유할 수 있는 **멀티 링크 프로필 서비스** 입니다. 구글 계정으로 30초 만에 가입하고, 내 닉네임 그대로 된 고유 URL(`마이링크.com/닉네임`)을 발급받아 즉시 공유할 수 있습니다.

## ✨ 주요 기능

- **🔐 간편 로그인** — Firebase Auth 기반 구글 원클릭 로그인. 별도의 가입 절차가 필요 없습니다.
- **👤 나만의 프로필** — 닉네임과 한 줄 소개(Bio)를 자유롭게 설정하고, 닉네임 그대로 고유 URL로 사용합니다.
- **🔗 링크 에디터** — 링크 블록을 자유롭게 추가/수정/삭제하고, 노출 여부를 토글로 즉시 제어합니다.
- **🎨 자동 파비콘** — Google Favicon API와 연동해 등록한 URL의 아이콘을 자동으로 추출, 깔끔한 디자인을 유지합니다.
- **📊 클릭 통계** — 각 링크의 클릭 수를 자동 기록하고, 통계 페이지에서 인기 링크를 차트로 한눈에 확인합니다.
- **📱 모바일 퍼스트** — 반응형 디자인으로 모바일·데스크톱 모두에서 자연스럽게 동작합니다.
- **🔎 SEO 최적화** — 공개 프로필 페이지마다 자동으로 OG 이미지와 메타데이터를 생성해 어디에 공유해도 보기 좋습니다.

## 🛠 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) |
| **State & Data** | [TanStack Query v5](https://tanstack.com/query), [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Backend** | [Firebase](https://firebase.google.com/) (Authentication, Firestore, Analytics) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) (Light / Dark) |

## 📁 프로젝트 구조

```text
my-link/
├── app/                    # Next.js App Router
│   ├── [displayName]/      # 공개 프로필 페이지 (마이링크.com/닉네임)
│   ├── _components/        # 랜딩 전용 컴포넌트
│   ├── _og/                # OG 이미지 에셋
│   ├── stats/              # 클릭 통계 대시보드
│   ├── layout.tsx          # 루트 레이아웃 + SEO 메타데이터
│   ├── opengraph-image.tsx # 동적 OG 이미지
│   └── page.tsx            # 로그인 / 관리자 메인 페이지
├── components/             # 공통 컴포넌트 (Header, theme-provider)
│   └── ui/                 # shadcn/ui 컴포넌트
├── hooks/                  # 커스텀 훅 (useAuth, useLinks, useProfile)
├── lib/                    # 유틸리티
│   ├── firebase/           # Firebase 클라이언트 모듈 (auth, firestore, links, user)
│   ├── queryKeys.ts        # TanStack Query 키 팩토리
│   └── utils.ts            # cn() 등 공용 헬퍼
├── docs/                   # 기획 문서 (PRD, 유저 시나리오, 와이어프레임)
├── firestore.rules         # Firestore 보안 규칙
└── public/                 # 정적 자산
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 Firebase 콘솔에서 발급받은 키를 입력하세요.

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# 배포 환경 URL (OG, canonical에 사용)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📜 npm 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 (Turbopack) |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run start` | 빌드된 앱 실행 |
| `npm run lint` | ESLint 정적 분석 |
| `npm run format` | Prettier로 `ts`/`tsx` 포맷팅 |
| `npm run typecheck` | TypeScript 타입 체크 (`tsc --noEmit`) |

## 📄 더 자세히

자세한 기획 배경과 설계는 [docs/](docs/) 폴더에서 확인할 수 있습니다.

- [docs/prd.md](docs/prd.md) — 서비스 기획서
- [docs/user_scenarios.md](docs/user_scenarios.md) — 유저 시나리오
- [docs/wireframes.md](docs/wireframes.md) — 화면 설계
- [GEMINI.md](GEMINI.md) — 개발 컨벤션 및 아키텍처 가이드
