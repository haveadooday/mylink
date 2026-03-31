import { Mail, Globe, MapPin, Briefcase } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-animate-gradient p-6 overflow-hidden">
      {/* Dynamic Background Overlay for contrast */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      {/* Main Profile Card */}
      <div className="glass-card relative z-10 w-full max-w-md rounded-3xl p-8 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out flex flex-col items-center">
        
        {/* Avatar Section */}
        <div className="relative h-28 w-28 mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 animate-pulse blur-lg opacity-60"></div>
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-zinc-800 border-2 border-white/20">
             <Image
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Taeho"
                alt="Profile photo"
                width={112}
                height={112}
                className="object-cover"
                unoptimized
             />
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
            오태호
          </h1>
          <p className="text-sm font-medium text-zinc-200">
            안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-zinc-300">
            <span className="flex items-center gap-1"><MapPin size={14} /> 대한민국</span>
            <span className="flex items-center gap-1"><Briefcase size={14} /> Student</span>
          </div>
        </div>

        {/* Links Array */}
        <div className="w-full space-y-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-link flex w-full items-center justify-between rounded-xl p-4 text-white shadow-sm"
          >
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path>
              </svg>
              <span className="font-semibold">GitHub</span>
            </div>
            <span className="text-zinc-400 text-sm">@taeho</span>
          </a>

          <a
            href="#"
            className="glass-link flex w-full items-center justify-between rounded-xl p-4 text-white shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5" />
              <span className="font-semibold">Blog</span>
            </div>
            <span className="text-zinc-400 text-sm">Read my posts</span>
          </a>

          <a
            href="mailto:example@email.com"
            className="glass-link flex w-full items-center justify-between rounded-xl p-4 text-white shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5" />
              <span className="font-semibold">Email</span>
            </div>
            <span className="text-zinc-400 text-sm">Contact me</span>
          </a>
        </div>
      </div>
    </main>
  );
}
