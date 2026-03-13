export const metadata = { title: "Company Overview | Jbbra" };

export default function CompanyOverview() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Company Overview</h1>

      <dl className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden shadow">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <dt className="bg-gray-50 p-4 font-medium">Company Name</dt>
          <dd className="p-4">
            Japan Bangla Bridge Corporation
            <br />
            Japan Bangla Bridge Corporation
          </dd>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <dt className="bg-gray-50 p-4 font-medium">Established</dt>
          <dd className="p-4">December 1, 2018</dd>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <dt className="bg-gray-50 p-4 font-medium">Headquarters</dt>
          <dd className="p-4">
            7-22-39 Nishi-Shinjuku, Shinjuku-ku, Tokyo 160-0023
            <br />
            Nishi-Shinjuku Dai-ni Building 703
          </dd>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <dt className="bg-gray-50 p-4 font-medium">Capital</dt>
          <dd className="p-4">25 million Taka (35 million JPY)</dd>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <dt className="bg-gray-50 p-4 font-medium">Representative Director</dt>
          <dd className="p-4">Tahmid Moinul</dd>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <dt className="bg-gray-50 p-4 font-medium">Chairman</dt>
          <dd className="p-4">Tahmid Tapashim</dd>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <dt className="bg-gray-50 p-4 font-medium">Business Activities</dt>
          <dd className="p-4 space-y-1">
            <p>Dispatching agency for technical interns and specific skilled support organizations</p>
            <p>Employment support and overseas human resources business operations</p>
            <p>Technical intern acceptance business</p>
            <p>Technical staff dispatch business (manufacturing, personnel, office work)</p>
            <p>Japanese language education business</p>
          </dd>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <dt className="bg-gray-50 p-4 font-medium">Affiliated Organizations</dt>
          <dd className="p-4 space-y-1">
            <p>Tokyo Southwest Rotary Club Member</p>
            <p>Tokyo Small and Medium Enterprise Association Member</p>
            <p>BAIRA Bangladesh International Human Resources Supply Related Cooperative Member</p>
            <p>BASIS Bangladesh Software Development Association Member</p>
            <p>BAYDIA Bangladesh Automobile Import/Export and Dealers Association Member</p>
          </dd>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <dt className="bg-gray-50 p-4 font-medium">Phone & FAX</dt>
          <dd className="p-4 space-y-1">
            <p>+8801707020644 (Dhaka office)</p>
            <p>03-6279-1289 (Japan headquarters phone number)</p>
            <p>FAX: 03-6279-1287 (Japan)</p>
          </dd>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <dt className="bg-gray-50 p-4 font-medium">Affiliated Companies</dt>
          <dd className="p-4 space-y-1">
            <p>System development business</p>
            <p>Picto Co., Ltd. (Japan corporation)</p>
            <p>pik.lp Job information site</p>
            <p>bhalojob.com Human resources introduction business</p>
          </dd>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <dt className="bg-gray-50 p-4 font-medium">Email</dt>
          <dd className="p-4">info@jbbc.co.jp</dd>
        </div>
      </dl>
    </main>
  );
}
