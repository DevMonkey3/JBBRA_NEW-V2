export const metadata = { title: "Company Overview | Jbbra" };

export default function CompanyOverview() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <span className="inline-block bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded">Info</span>
        <h1 className="mt-3 text-2xl md:text-4xl font-extrabold">Company Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-8">
        <div className="rounded-2xl ring-1 ring-black/10 overflow-hidden">
          <div className="aspect-[3/4] bg-gray-100" />
        </div>

        <dl className="divide-y divide-gray-200 ring-1 ring-black/5 rounded-2xl overflow-hidden">
          {[
            ["Company Name", "Japan Bangla Bridge Corporation (Japan Bangla Bridge Corporation)"],
            ["Established", "December 1, 2018"],
            ["Headquarters", "7-22-3 Roppongi, Minato-ku, Tokyo 106-0032 Furei Tomisang Building 703"],
            ["Capital", "25 million JPY (including 35 million JPY)"],
            ["Representative Director", "Koyo Moinul"],
            ["Business Activities", "Manufacturing-focused personnel introduction, dispatch, reception support, recruitment support, etc."],
            ["Main Clients", "Manufacturing, logistics, hotels, agriculture, etc."],
            ["Contact", "03-xxxx-xxxx / info@jbbc.co.jp"],
          ].map(([term, desc]) => (
            <div key={term} className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
              <dt className="bg-gray-50 p-4 font-medium">{term}</dt>
              <dd className="p-4">{desc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}
