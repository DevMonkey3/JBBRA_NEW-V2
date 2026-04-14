export const metadata = { title: "Company Overview | Jbbra" };

const rows = [
  ["Company Name", "Japan Bangla Bridge Corporation"],
  ["Established", "December 1, 2018"],
  ["Headquarters", "7-22-3 Roppongi, Minato-ku, Tokyo 106-0032 Furei Tomisang Building 703"],
  ["Capital", "25 million JPY"],
  ["Representative Director", "Koyo Moinul"],
  ["Business Activities", "Manufacturing-focused personnel introduction, dispatch, reception support, recruitment support, etc."],
  ["Main Clients", "Manufacturing, logistics, hotels, agriculture, etc."],
  ["Contact", <a href="mailto:info@jbbc.co.jp" className="text-sky-600 hover:underline">info@jbbc.co.jp</a>],
];

export default function CompanyOverview() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block bg-sky-100 text-sky-700 text-xs font-medium px-2 py-1 rounded">
          Info
        </span>
        <h1 className="mt-3 text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Company Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-8">

        {/* Left: image placeholder */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800" />
        </div>

        {/* Right: info table */}
        <dl className="rounded-2xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden shadow-sm">
          {rows.map(([term, desc]) => (
            <div key={term} className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
              <dt className="bg-gray-100 dark:bg-gray-800 px-5 py-4 font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-start">
                {term}
              </dt>
              <dd className="px-5 py-4 text-sm text-gray-800 dark:text-gray-100 leading-relaxed">
                {desc}
              </dd>
            </div>
          ))}
        </dl>

      </div>
    </main>
  );
}