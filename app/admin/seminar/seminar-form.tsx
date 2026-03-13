'use client';

import React, { useMemo, useState } from 'react';
import { message } from 'antd';

type SeminarDTO = {
  id?: string; // present in edit mode
  title: string;
  description?: string;
  location: string;
  startsAt: string;        // datetime-local string
  endsAt: string;          // datetime-local string
  registrationUrl?: string;
  slug: string;
  excerpt?: string;
  heroImage?: string;
  thumbnail?: string;
  speakerName?: string;
  speakerTitle?: string;
  speakerOrg?: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s\_]+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^\-+|\-+$/g, '');
}

function toLocalDT(value?: string | Date) {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  // YYYY-MM-DDTHH:mm (no seconds)
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export default function SeminarForm({
  initial,
  onSaved,
}: {
  /** optional: when provided, form becomes "Edit" mode */
  initial?: {
    id: string;
    title: string;
    description?: string | null;
    location: string;
    startsAt: string | Date;
    endsAt: string | Date;
    registrationUrl?: string | null;
    slug: string;
    excerpt?: string | null;
    heroImage?: string | null;
    thumbnail?: string | null;
    speakerName?: string | null;
    speakerTitle?: string | null;
    speakerOrg?: string | null;
  } | null;
  /** optional: called after create/update/delete to allow parent to refresh list */
  onSaved?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<SeminarDTO>(() => ({
    id: initial?.id,
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    location: initial?.location ?? '',
    startsAt: toLocalDT(initial?.startsAt) || '',
    endsAt: toLocalDT(initial?.endsAt) || '',
    registrationUrl: initial?.registrationUrl ?? '',
    slug: initial?.slug ?? '',
    excerpt: initial?.excerpt ?? '',
    heroImage: initial?.heroImage ?? '',
    thumbnail: initial?.thumbnail ?? '',
    speakerName: initial?.speakerName ?? '',
    speakerTitle: initial?.speakerTitle ?? '',
    speakerOrg: initial?.speakerOrg ?? '',
  }));

  // Convenience: auto-generate slug from title when slug is empty or matches the previous auto value
  const autoSlug = useMemo(() => slugify(form.title), [form.title]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return 'Title is required.';
    if (!form.location.trim()) return 'Location is required.';
    if (!form.startsAt) return 'Start date/time is required.';
    if (!form.endsAt) return 'End date/time is required.';
    const starts = new Date(form.startsAt);
    const ends = new Date(form.endsAt);
    if (isNaN(starts.getTime()) || isNaN(ends.getTime())) return 'Invalid start/end date.';
    if (ends < starts) return 'End must be after start.';
    const slug = (form.slug || autoSlug).trim();
    if (!slug) return 'Slug is required.';
    if (!/^[a-z0-9-]+$/.test(slug)) return 'Slug can contain only lower-case letters, numbers and dashes.';
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      message.error(err);
      return;
    }
    setBusy(true);
    try {
      const payload = {
        ...form,
        slug: (form.slug || autoSlug).trim(),
        // Convert to ISO strings for the API
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
      };

      let res: Response;
      if (isEdit && form.id) {
        res = await fetch(`/api/admin/seminars/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/seminars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Request failed');
      }

      message.success(isEdit ? 'Seminar updated.' : 'Seminar created.');
      onSaved?.();

      if (!isEdit) {
        // reset to blank when creating
        setForm({
          title: '',
          description: '',
          location: '',
          startsAt: '',
          endsAt: '',
          registrationUrl: '',
          slug: '',
          excerpt: '',
          heroImage: '',
          thumbnail: '',
          speakerName: '',
          speakerTitle: '',
          speakerOrg: '',
        });
      }
    } catch (err: any) {
      console.error(err);
      message.error(err?.message ?? 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!isEdit || !form.id) return;
    if (!confirm('Delete this seminar?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/seminars/${form.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Delete failed');
      }
      message.success('Seminar deleted.');
      onSaved?.();
    } catch (err: any) {
      console.error(err);
      message.error(err?.message ?? 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid gap-1">
        <label className="text-sm font-medium">Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. 特定技能 介護 勉強会"
          className="rounded border px-3 py-2"
          required
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Location *</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Tokyo, Online, etc."
          className="rounded border px-3 py-2"
          required
        />
      </div>

      <div className="grid gap-1 md:grid-cols-2 md:gap-3">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Starts at *</label>
          <input
            type="datetime-local"
            name="startsAt"
            value={form.startsAt}
            onChange={handleChange}
            className="rounded border px-3 py-2"
            required
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Ends at *</label>
          <input
            type="datetime-local"
            name="endsAt"
            value={form.endsAt}
            onChange={handleChange}
            className="rounded border px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Registration URL</label>
        <input
          name="registrationUrl"
          value={form.registrationUrl ?? ''}
          onChange={handleChange}
          placeholder="https://…"
          className="rounded border px-3 py-2"
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Slug *</label>
        <div className="flex items-center gap-2">
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="auto-from-title"
            className="flex-1 rounded border px-3 py-2"
          />
          <button
            type="button"
            className="rounded border px-3 py-1 text-xs"
            onClick={() => setForm((s) => ({ ...s, slug: autoSlug }))}
            title="Use auto slug"
          >
            Use “{autoSlug || '…'}”
          </button>
        </div>
        <p className="text-xs text-slate-500">Lowercase letters, numbers and dashes only.</p>
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Excerpt</label>
        <textarea
          name="excerpt"
          value={form.excerpt ?? ''}
          onChange={handleChange}
          rows={2}
          className="rounded border px-3 py-2"
          placeholder="Short teaser shown in lists"
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={form.description ?? ''}
          onChange={handleChange}
          rows={5}
          className="rounded border px-3 py-2"
          placeholder="Full description / agenda / notes"
        />
      </div>

      <div className="grid gap-1 md:grid-cols-2 md:gap-3">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Hero image URL</label>
          <input
            name="heroImage"
            value={form.heroImage ?? ''}
            onChange={handleChange}
            className="rounded border px-3 py-2"
            placeholder="/images/seminars/hero.avif"
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Thumbnail URL</label>
          <input
            name="thumbnail"
            value={form.thumbnail ?? ''}
            onChange={handleChange}
            className="rounded border px-3 py-2"
            placeholder="/images/seminars/thumb.avif"
          />
        </div>
      </div>

      <div className="grid gap-1 md:grid-cols-3 md:gap-3">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Speaker name</label>
          <input
            name="speakerName"
            value={form.speakerName ?? ''}
            onChange={handleChange}
            className="rounded border px-3 py-2"
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Speaker title</label>
          <input
            name="speakerTitle"
            value={form.speakerTitle ?? ''}
            onChange={handleChange}
            className="rounded border px-3 py-2"
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Speaker org</label>
          <input
            name="speakerOrg"
            value={form.speakerOrg ?? ''}
            onChange={handleChange}
            className="rounded border px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isEdit ? 'Update seminar' : 'Create seminar'}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="rounded border border-red-500 px-4 py-2 text-red-600 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
