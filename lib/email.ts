// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendNewsletterEmailParams {
  to: string[];
  subject: string;
  html: string;
  text?: string;
}

interface NewsletterData {
  title: string;
  excerpt?: string;
  body: string;
  slug: string;
}

/**
 * Send newsletter email to subscribers
 */
export async function sendNewsletterEmail(
  subscribers: string[],
  newsletter: NewsletterData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://jbbc.co.jp';
    const newsletterUrl = `${baseUrl}/notices/${newsletter.slug}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1890ff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button {
              display: inline-block;
              background: #1890ff;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Jbbra ニュースレター</h1>
            </div>
            <div class="content">
              <h2>${newsletter.title}</h2>
              ${newsletter.excerpt ? `<p><strong>${newsletter.excerpt}</strong></p>` : ''}
              <div>${newsletter.body}</div>
              <a href="${newsletterUrl}" class="button">続きを読む</a>
            </div>
            <div class="footer">
              <p>このメールは Jbbra のニュースレターサービスから送信されています。</p>
              <p><a href="${baseUrl}/unsubscribe">配信を停止する</a></p>
              <p>© ${new Date().getFullYear()} Japan Bangla Bridge Corporation Ltd.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
${newsletter.title}

${newsletter.excerpt || ''}

${newsletter.body.replace(/<[^>]*>/g, '')}

続きを読む: ${newsletterUrl}

---
このメールは Jbbra のニュースレターサービスから送信されています。
配信を停止: ${baseUrl}/unsubscribe
© ${new Date().getFullYear()} Japan Bangla Bridge Corporation Ltd.
    `;

    // Send in batches to avoid rate limits and reduce RAM usage
    const batchSize = 100;
    const totalBatches = Math.ceil(subscribers.length / batchSize);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * batchSize;
      const end = Math.min(start + batchSize, subscribers.length);
      const batch = subscribers.slice(start, end);

      await resend.emails.send({
        from: 'Jbbra <noreply@jbbc.co.jp>',
        to: batch,
        subject: `【Jbbra】${newsletter.title}`,
        html: htmlContent,
        text: textContent,
      });

      // Clear batch from memory immediately after sending
      batch.length = 0;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to send newsletter email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send announcement email to subscribers
 */
export async function sendAnnouncementEmail(
  subscribers: string[],
  announcement: {
    title: string;
    excerpt?: string;
    body: string;
    slug: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://jbbc.co.jp';
    const announcementUrl = `${baseUrl}/notices/${announcement.slug}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #fa8c16; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button {
              display: inline-block;
              background: #fa8c16;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📢 Jbbra お知らせ</h1>
            </div>
            <div class="content">
              <h2>${announcement.title}</h2>
              ${announcement.excerpt ? `<p><strong>${announcement.excerpt}</strong></p>` : ''}
              <div>${announcement.body}</div>
              <a href="${announcementUrl}" class="button">詳細を見る</a>
            </div>
            <div class="footer">
              <p>このメールは Jbbra のニュースレターサービスから送信されています。</p>
              <p><a href="${baseUrl}/unsubscribe">配信を停止する</a></p>
              <p>© ${new Date().getFullYear()} Japan Bangla Bridge Corporation Ltd.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
${announcement.title}

${announcement.excerpt || ''}

${announcement.body.replace(/<[^>]*>/g, '')}

詳細を見る: ${announcementUrl}

---
このメールは Jbbra のニュースレターサービスから送信されています。
配信を停止: ${baseUrl}/unsubscribe
© ${new Date().getFullYear()} Japan Bangla Bridge Corporation Ltd.
    `;

    // Send in batches to avoid rate limits and reduce RAM usage
    const batchSize = 100;
    const totalBatches = Math.ceil(subscribers.length / batchSize);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * batchSize;
      const end = Math.min(start + batchSize, subscribers.length);
      const batch = subscribers.slice(start, end);

      await resend.emails.send({
        from: 'Jbbra <noreply@jbbc.co.jp>',
        to: batch,
        subject: `【Jbbra お知らせ】${announcement.title}`,
        html: htmlContent,
        text: textContent,
      });

      // Clear batch from memory immediately after sending
      batch.length = 0;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to send announcement email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send seminar notification email
 */
export async function sendSeminarNotificationEmail(
  subscribers: string[],
  seminar: {
    title: string;
    description: string;
    startsAt: Date | string;
    location: string;
    slug: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://jbbc.co.jp';
    const seminarUrl = `${baseUrl}/seminar/${seminar.slug}`;
    const startDate = new Date(seminar.startsAt);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #52c41a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #52c41a; }
            .button {
              display: inline-block;
              background: #52c41a;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 新しいセミナーのお知らせ</h1>
            </div>
            <div class="content">
              <h2>${seminar.title}</h2>
              <div class="info-box">
                <p><strong>📅 日時:</strong> ${startDate.toLocaleString('ja-JP')}</p>
                <p><strong>📍 場所:</strong> ${seminar.location}</p>
              </div>
              <p>${seminar.description}</p>
              <a href="${seminarUrl}" class="button">詳細を見る・申し込む</a>
            </div>
            <div class="footer">
              <p>このメールは Jbbra のニュースレターサービスから送信されています。</p>
              <p><a href="${baseUrl}/unsubscribe">配信を停止する</a></p>
              <p>© ${new Date().getFullYear()} Japan Bangla Bridge Corporation Ltd.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send in batches to avoid rate limits and reduce RAM usage
    const batchSize = 100;
    const totalBatches = Math.ceil(subscribers.length / batchSize);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * batchSize;
      const end = Math.min(start + batchSize, subscribers.length);
      const batch = subscribers.slice(start, end);

      await resend.emails.send({
        from: 'Jbbra <noreply@jbbc.co.jp>',
        to: batch,
        subject: `【Jbbra】新しいセミナー: ${seminar.title}`,
        html: htmlContent,
      });

      // Clear batch from memory immediately after sending
      batch.length = 0;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to send seminar email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send blog post notification email
 */
export async function sendBlogEmail(
  subscribers: string[],
  blog: {
    title: string;
    excerpt?: string;
    content: string;
    slug: string;
    coverImage?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://jbbc.co.jp';
    const blogUrl = `${baseUrl}/blog/${blog.slug}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #cf1322; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .cover-image {
              width: 100%;
              max-height: 300px;
              object-fit: cover;
              border-radius: 8px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: #cf1322;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📝 新しいブログ記事</h1>
            </div>
            <div class="content">
              <h2>${blog.title}</h2>
              ${blog.coverImage ? `<img src="${blog.coverImage}" alt="${blog.title}" class="cover-image" />` : ''}
              ${blog.excerpt ? `<p><strong>${blog.excerpt}</strong></p>` : ''}
              <div>${blog.content.substring(0, 300)}${blog.content.length > 300 ? '...' : ''}</div>
              <a href="${blogUrl}" class="button">続きを読む</a>
            </div>
            <div class="footer">
              <p>このメールは Jbbra のニュースレターサービスから送信されています。</p>
              <p><a href="${baseUrl}/unsubscribe">配信を停止する</a></p>
              <p>© ${new Date().getFullYear()} Japan Bangla Bridge Corporation Ltd.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
新しいブログ記事

${blog.title}

${blog.excerpt || ''}

${blog.content.replace(/<[^>]*>/g, '').substring(0, 300)}${blog.content.length > 300 ? '...' : ''}

続きを読む: ${blogUrl}

---
このメールは Jbbra のニュースレターサービスから送信されています。
配信を停止: ${baseUrl}/unsubscribe
© ${new Date().getFullYear()} Japan Bangla Bridge Corporation Ltd.
    `;

    // Send in batches to avoid rate limits and reduce RAM usage
    const batchSize = 100;
    const totalBatches = Math.ceil(subscribers.length / batchSize);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * batchSize;
      const end = Math.min(start + batchSize, subscribers.length);
      const batch = subscribers.slice(start, end);

      await resend.emails.send({
        from: 'Jbbra <noreply@jbbc.co.jp>',
        to: batch,
        subject: `【Jbbra ブログ】${blog.title}`,
        html: htmlContent,
        text: textContent,
      });

      // Clear batch from memory immediately after sending
      batch.length = 0;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to send blog email:', error);
    return { success: false, error: error.message };
  }
}
