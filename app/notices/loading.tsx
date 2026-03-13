export default function NoticesLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="flex flex-col items-center gap-6">
        {/* Logo with pulse animation */}
        <div className="relative animate-pulse">
          <img
            src="https://bbc-images.sgp1.cdn.digitaloceanspaces.com/Jbbra%20realated%20photo/jbbra%20logo.png"
            alt="Jbbra"
            width={120}
            height={120}
            className="object-contain"
            loading="eager"
          />
        </div>

        {/* Spinning circle */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#1AA4DD] rounded-full animate-spin" />
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-xl font-semibold text-[#1AA4DD] mb-1">お知らせを読み込み中...</p>
          <p className="text-sm text-gray-500">しばらくお待ちください</p>
        </div>
      </div>
    </div>
  );
}
