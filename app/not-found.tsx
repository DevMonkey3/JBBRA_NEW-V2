// app/not-found.tsx
import Link from "next/link";

const M = {
  jp: {
    heading: "ページが見つかりません",
    body: "お探しのページは削除されたか、URLが変更された可能性があります。",
    home: "ホームへ戻る",
  },
  bd: {
    heading: "পৃষ্ঠা খুঁজে পাওয়া যায়নি",
    body: "আপনি যে পৃষ্ঠাটি খুঁজছেন তা মুছে ফেলা হয়েছে বা URL পরিবর্তিত হয়েছে।",
    home: "হোমে ফিরে যান",
  },
} as const;

export default function NotFound() {
  // pick one (or plug in your locale logic)
  const t = M.jp;

  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-sm text-sky-600 font-semibold mb-3">404</p>
      <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.heading}</h1>
      <p className="text-gray-600 mb-8">{t.body}</p>
      <Link
        href="/"
        className="inline-block rounded-lg bg-sky-600 px-5 py-2.5 text-white hover:bg-sky-700 transition"
      >
        {t.home}
      </Link>
    </main>
  );
}
