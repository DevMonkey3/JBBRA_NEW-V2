// app/jbbc/useful-information/page.tsx
import { title } from "@/components/primitives";

export const metadata = {
  title: "Useful information | Jbbra",
};

export default function Page() {
  return (
    <main>
      <h1 className={title()}>Useful information</h1>

      {/* Placeholder content */}
      <p className="mt-6 text-gray-600">
        （このページは準備中です）ノウハウ記事、ダウンロード資料、FAQ などを掲載します。
      </p>
    </main>
  );
}
