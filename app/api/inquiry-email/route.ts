// app/api/inquiry-email/route.ts
import { Resend } from 'resend';

export const runtime = 'nodejs'; // safest for Resend
export const dynamic = 'force-dynamic';

type InquiryPayload = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string; // 都道府県
};

const OWNER_EMAIL = 'info@jbbc.co.jp';           // where YOU receive inquiries
const FROM_EMAIL  = 'Jbbra <noreply@jbbc.co.jp>'; // must be a verified domain in Resend

export async function POST(req: Request) {
  try {
    // Check if RESEND_API_KEY is set
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ ok: false, message: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = (await req.json()) as InquiryPayload;

    // Basic validation
    if (!data?.name || !data?.email) {
      return new Response(
        JSON.stringify({ ok: false, message: 'name and email are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Resend (env var set in .env.local)
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1) Send notification to owner
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      replyTo: data.email, // makes replying easy
      subject: `【セミナー申込】${data.name} 様よりお問い合わせ`,
      html: `
        <div>
          <p>セミナーのお申し込みが届きました。</p>
          <ul>
            <li><strong>お名前：</strong>${escapeHtml(data.name)}</li>
            <li><strong>メール：</strong>${escapeHtml(data.email)}</li>
            ${data.company ? `<li><strong>会社名：</strong>${escapeHtml(data.company)}</li>` : ''}
            ${data.phone ? `<li><strong>電話：</strong>${escapeHtml(data.phone)}</li>` : ''}
            ${data.address ? `<li><strong>住所（都道府県）：</strong>${escapeHtml(data.address)}</li>` : ''}
          </ul>
        </div>
      `,
    });

    // 2) Send thank-you to user
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.email],
      subject: '【Jbbra】お申し込みありがとうございます',
      html: `
        <div>
          <p>${escapeHtml(data.name)} 様</p>
          <p>この度は、Jbbraのセミナーへお申し込みいただき誠にありがとうございます。</p>
          <p>担当者より順次ご連絡させていただきますので、今しばらくお待ちください。</p>
          <p>— Jbbra</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Inquiry email error:', err);
    return new Response(
      JSON.stringify({ ok: false, message: 'failed to send' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// super small helper to avoid HTML injection
function escapeHtml(s = '') {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}