import { getCdnUrl } from "@/config/cdn";

export default function SeminarLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative animate-pulse">
          {/* Using getCdnUrl() — stays in sync if CDN domain changes */}
          <img
            src={getCdnUrl('/jbbra%20realated%20photo/jbbra%20logo.png')}
            alt="Jbbra"
            width={120}
            height={120}
            className="object-contain"
            loading="eager"
          />
        </div>
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#FF6F00] rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-[#FF6F00] mb-1">セミナー情報を読み込み中...</p>
          <p className="text-sm text-gray-500">しばらくお待ちください</p>
        </div>
      </div>
    </div>
  );
}
