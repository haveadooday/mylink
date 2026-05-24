import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/app/providers"
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

const defaultTitle = "MyLink — 나만의 멀티 프로필 링크"
const defaultDescription =
  "SNS, 포트폴리오, 블로그 등 흩어져 있는 나만의 링크들을 하나의 매력적인 페이지로 모아보세요. 무료로 만드는 멀티 프로필 링크 서비스, MyLink."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "MyLink",
  title: {
    default: defaultTitle,
    template: "%s · MyLink",
  },
  description: defaultDescription,
  keywords: [
    "MyLink",
    "마이링크",
    "멀티 프로필 링크",
    "프로필 링크",
    "링크 모음",
    "링크인바이오",
    "link in bio",
    "SNS 링크",
    "포트폴리오",
    "linktree",
  ],
  authors: [{ name: "MyLink" }],
  creator: "MyLink",
  publisher: "MyLink",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "MyLink",
    locale: "ko_KR",
    url: siteUrl,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  category: "technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
