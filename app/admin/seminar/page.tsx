// app/(admin)/admin/seminar/page.tsx
import Link from 'next/link';
import SeminarForm from './seminar-form';
import { prisma } from '@/lib/prisma';

// ---------- Page ----------
type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SeminarsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  // If ?id=<seminarId> is provided, we'll fetch it for edit mode
  const id = typeof params?.id === 'string' ? params?.id : undefined;

  const [list, initial] = await Promise.all([
    prisma.seminar.findMany({
      orderBy: { startsAt: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        location: true,
        startsAt: true,
        endsAt: true,
        slug: true,
      },
    }),
    id
      ? prisma.seminar.findUnique({
          where: { id },
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            startsAt: true,
            endsAt: true,
            registrationUrl: true,
            slug: true,
            excerpt: true,
            heroImage: true,
            thumbnail: true,
            speakerName: true,
            speakerTitle: true,
            speakerOrg: true,
          },
        })
      : null,
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left: Create / Edit */}
      <div className="rounded border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">
          {initial ? 'Edit seminar' : 'Create seminar'}
        </h2>

        {/* NOTE:
           - When you open /admin/seminar?id=<id>, `initial` is filled and the form
             becomes "Edit" mode.
           - Without id, this is a blank "Create" form.
        */}
        <SeminarForm
          initial={
            initial
              ? {
                  ...initial,
                  // Ensure we pass strings or Date accepted values—form will convert
                  startsAt: initial.startsAt,
                  endsAt: initial.endsAt,
                }
              : undefined
          }
          // To auto-refresh the list after save/delete, you can switch this to a tiny client wrapper
          // that calls router.refresh(). Ping me and I’ll add that.
        />
      </div>

      {/* Right: Recent list */}
      <div className="rounded border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Recent seminars</h2>

        {list.length === 0 ? (
          <p className="text-sm text-slate-500">No seminars yet.</p>
        ) : (
          <ul className="divide-y">
            {list.map((s) => (
              <li key={s.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-slate-500">
                      {fmt(s.startsAt)} → {fmt(s.endsAt)}
                    </div>
                    <div className="text-sm text-slate-700">{s.location}</div>
                    <div className="mt-1 text-xs text-slate-400">/seminar/{s.slug}</div>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/admin/seminar?id=${s.id}`}
                      className="rounded border px-3 py-1 text-sm hover:bg-slate-50"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ---------- helpers ----------
function fmt(d: Date) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return '';
  }
}
