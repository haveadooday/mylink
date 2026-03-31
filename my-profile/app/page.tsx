import { Mail, Globe, MapPin, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 font-sans">
      {/* Main Profile Card - Neobrutalism Style */}
      <div className="bg-[#FEF08A] border-[3px] border-black shadow-[6px_6px_0px_black] rounded-[12px] relative z-10 w-full md:w-[768px] lg:w-[1024px] max-w-full p-8 md:p-12 lg:p-16 flex flex-col items-center transition-all duration-300">
        
        {/* Profile Info */}
        <div className="space-y-6 text-center mb-10 w-full flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter text-black uppercase">
            오태호
          </h1>
          <p className="text-base md:text-xl lg:text-2xl font-bold text-black border-[3px] border-black px-5 py-3 bg-white inline-block shadow-[4px_4px_0px_black]">
            안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-sm md:text-lg lg:text-xl font-bold text-black">
            <span className="flex items-center gap-2 bg-[#FF90E8] px-4 md:px-5 py-2 border-[3px] border-black shadow-[4px_4px_0px_black]"><MapPin size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" /> 대한민국</span>
            <span className="flex items-center gap-2 bg-[#9BF6FF] px-4 md:px-5 py-2 border-[3px] border-black shadow-[4px_4px_0px_black]"><Briefcase size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" /> Student</span>
          </div>
        </div>

        {/* Links Array */}
        <div className="w-full space-y-5 md:space-y-6 lg:space-y-8 max-w-[100%] md:max-w-[80%] lg:max-w-[70%]">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between p-4 md:p-6 bg-white border-[3px] border-black text-black shadow-[6px_6px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 24 24" className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 fill-current" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path>
              </svg>
              <span className="font-black text-xl md:text-3xl lg:text-4xl uppercase tracking-wider">GitHub</span>
            </div>
            <span className="font-bold text-black/80 text-base md:text-xl lg:text-2xl border-l-[3px] border-black pl-4">@taeho</span>
          </a>

          <a
            href="#"
            className="flex w-full items-center justify-between p-4 md:p-6 bg-[#A7F3D0] border-[3px] border-black text-black shadow-[6px_6px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            <div className="flex items-center gap-4">
              <Globe className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12" />
              <span className="font-black text-xl md:text-3xl lg:text-4xl uppercase tracking-wider">Blog</span>
            </div>
            <span className="font-bold text-black/80 text-base md:text-xl lg:text-2xl border-l-[3px] border-black pl-4">Read my posts</span>
          </a>

          <a
            href="mailto:example@email.com"
            className="flex w-full items-center justify-between p-4 md:p-6 bg-[#FDBA74] border-[3px] border-black text-black shadow-[6px_6px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            <div className="flex items-center gap-4">
              <Mail className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12" />
              <span className="font-black text-xl md:text-3xl lg:text-4xl uppercase tracking-wider">Email</span>
            </div>
            <span className="font-bold text-black/80 text-base md:text-xl lg:text-2xl border-l-[3px] border-black pl-4">Contact me</span>
          </a>
        </div>
      </div>
    </main>
  );
}
