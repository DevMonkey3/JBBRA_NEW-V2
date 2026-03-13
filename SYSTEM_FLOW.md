# Newsletter System - Flow Diagrams

## 📧 Newsletter Subscription Flow

```
User visits website
       │
       ▼
Scrolls to footer
       │
       ▼
Enters email in subscription form
       │
       ▼
Clicks "送信" (Submit)
       │
       ▼
Frontend validates email
       │
       ├─── Invalid? ──→ Show error message
       │
       ▼ Valid
POST /api/subscribe
       │
       ▼
Backend checks database
       │
       ├─── Already subscribed? ──→ Return 409 error
       │
       ├─── Previously unsubscribed? ──→ Re-subscribe (set unsubscribedAt=null)
       │
       ▼ New subscriber
Create new Subscription record
       │
       ▼
Return success (201)
       │
       ▼
Show success message to user
       │
       ▼
✅ User is now subscribed!
```

---

## 📰 Newsletter Creation & Sending Flow

```
Admin logs in to /admin/login
       │
       ▼
Navigates to "Newsletters"
       │
       ▼
Clicks "Create Newsletter"
       │
       ▼
Fills form:
  - Title: "Monthly Update"
  - Slug: "monthly-update-2025"
  - Excerpt: "Latest news..."
  - Body: "<h2>Hello...</h2>"
       │
       ▼
Clicks "Create & Send"
       │
       ▼
POST /api/admin/newsletters
       │
       ▼
Backend validates auth (NextAuth)
       │
       ├─── Not authenticated? ──→ Return 401
       │
       ▼ Authenticated
Validate form data
       │
       ├─── Invalid data? ──→ Return 400
       │
       ├─── Slug exists? ──→ Return 409
       │
       ▼ Valid
Create Newsletter record in database
       │
       ▼
Fetch all active subscribers
  WHERE unsubscribedAt IS NULL
       │
       ▼
Split into batches of 100
       │
       ▼
Send emails asynchronously ─────┐
       │                         │
       ▼                         ▼
Return success (201)      For each batch:
       │                    - Send via Resend API
       ▼                    - Log Notification records
Show success message             │
       │                         │
       ▼                         ▼
✅ Newsletter created!    📧 Emails delivered!
```

---

## 🔔 Announcement Creation Flow

```
Admin navigates to "Announcements"
       │
       ▼
Clicks "Create Announcement"
       │
       ▼
Fills form with announcement details
       │
       ▼
Clicks "Create & Send"
       │
       ▼
POST /api/admin/announcements
       │
       ▼
[Same flow as Newsletter]
       │
       ▼
Create Announcement record
       │
       ▼
Fetch subscribers
       │
       ▼
Send announcement emails (orange theme)
       │
       ▼
✅ Announcement sent!
```

---

## 📋 Viewing Notices Flow

```
User visits /notices
       │
       ▼
Frontend calls GET /api/notices
       │
       ▼
Backend queries database in parallel:
  ├─ Fetch Newsletters (latest 50)
  ├─ Fetch Seminars (latest 50)
  └─ Fetch Announcements (latest 50)
       │
       ▼
Combine all with type labels:
  - Newsletter → type: 'newsletter'
  - Seminar → type: 'seminar'
  - Announcement → type: 'announcement'
       │
       ▼
Sort by publishedAt DESC
       │
       ▼
Return combined list
       │
       ▼
Frontend displays in cards with:
  🔵 Blue badge = Newsletter
  🟢 Green badge = Seminar
  🟠 Orange badge = Announcement
       │
       ▼
User can:
  - Search by title/excerpt
  - Filter by type
  - Click to view details
       │
       ▼
✅ All notices displayed!
```

---

## 📄 Viewing Individual Notice

```
User clicks on notice card
       │
       ▼
Navigate to /notices/[slug]
  Example: /notices/monthly-update-2025
       │
       ▼
Server-side data fetching:
       │
       ▼
Query database in parallel:
  ├─ findUnique Newsletter WHERE slug
  ├─ findUnique Seminar WHERE slug
  └─ findUnique Announcement WHERE slug
       │
       ▼
Use first match found
       │
       ├─── No match? ──→ Show 404 page
       │
       ▼ Match found
Determine type and render:
       │
       ├─ Newsletter ──→ Show title, date, body
       │
       ├─ Seminar ──→ Show + date/time, location, speaker
       │
       └─ Announcement ──→ Show title, date, body
       │
       ▼
Generate SEO metadata
  - Open Graph tags
  - Twitter Cards
  - Canonical URL
       │
       ▼
Render page with type-specific styling
       │
       ▼
✅ Full notice details displayed!
```

---

## 🚫 Unsubscribe Flow

```
User clicks unsubscribe link in email
  OR visits /unsubscribe
       │
       ▼
Lands on unsubscribe page
       │
       ▼
Enters email address
       │
       ▼
Clicks "配信停止" (Unsubscribe)
       │
       ▼
POST /api/unsubscribe
       │
       ▼
Backend finds subscription
       │
       ├─── Not found? ──→ Return 404
       │
       ▼ Found
Update Subscription record:
  SET unsubscribedAt = NOW()
       │
       ▼
Return success (200)
       │
       ▼
Show success page
       │
       ▼
✅ User unsubscribed!
  (Can re-subscribe later)
```

---

## 📧 Email Sending Process (Detailed)

```
Newsletter/Announcement created
       │
       ▼
Fetch active subscribers:
  SELECT email
  FROM Subscription
  WHERE unsubscribedAt IS NULL
       │
       ▼
Example: 350 subscribers found
       │
       ▼
Split into batches of 100:
  Batch 1: emails[0-99]
  Batch 2: emails[100-199]
  Batch 3: emails[200-299]
  Batch 4: emails[300-349]
       │
       ▼
For each batch (sequential):
       │
       ├─→ Build HTML email
       │    ├─ Header (colored by type)
       │    ├─ Title
       │    ├─ Excerpt
       │    ├─ Body content
       │    ├─ "Read more" button
       │    └─ Footer with unsubscribe link
       │
       ├─→ Build plain text version
       │    └─ Strip HTML tags
       │
       ├─→ Send via Resend API
       │    POST https://api.resend.com/emails
       │    Headers: Authorization: Bearer {API_KEY}
       │    Body: {
       │      from: "JBBC <noreply@jbbc.jp>",
       │      to: [emails in batch],
       │      subject: "【JBBC】Title",
       │      html: htmlContent,
       │      text: textContent
       │    }
       │
       └─→ Handle response
            ├─ Success? → Continue
            └─ Error? → Log error
       │
       ▼
After all batches sent:
       │
       ▼
Create Notification records:
  INSERT INTO Notification
  (type, refId, email, sentAt)
  VALUES for each email
       │
       ▼
✅ All emails sent and logged!
```

---

## 🔐 Admin Authentication Flow

```
Admin visits /admin/newsletters or /admin/announcements
       │
       ▼
NextAuth checks session
       │
       ├─── Not logged in? ──→ Redirect to /admin/login
       │
       ▼ Logged in
Check user in database
       │
       ├─── User not found? ──→ Redirect to /admin/login
       │
       ▼ Valid session
Render admin page
       │
       ▼
User can manage content
       │
       ▼
On API requests:
  getServerSession(authOptions)
       │
       ├─── No session? ──→ Return 401 Unauthorized
       │
       ▼ Valid session
Process request
       │
       ▼
✅ Authorized!
```

---

## 🗄️ Database Schema Relationships

```
┌─────────────────┐
│  Subscription   │
│─────────────────│
│ id              │──┐
│ email (unique)  │  │
│ verifiedAt      │  │
│ unsubscribedAt  │  │
│ createdAt       │  │
└─────────────────┘  │
                     │
                     │ One-to-Many
                     │
                     │
┌─────────────────┐  │
│  Notification   │  │
│─────────────────│  │
│ id              │  │
│ type            │  │
│ refId           │──┼──→ Points to Newsletter/Announcement/Seminar
│ email           │  │
│ sentAt          │  │
│ subscriptionId  │──┘
└─────────────────┘


┌─────────────────┐
│   Newsletter    │
│─────────────────│
│ id              │←─── Referenced by Notification.refId
│ title           │     (when type='newsletter')
│ body            │
│ excerpt         │
│ slug (unique)   │
│ publishedAt     │
└─────────────────┘


┌─────────────────┐
│  Announcement   │
│─────────────────│
│ id              │←─── Referenced by Notification.refId
│ title           │     (when type='announcement')
│ body            │
│ excerpt         │
│ slug (unique)   │
│ publishedAt     │
└─────────────────┘


┌─────────────────┐
│    Seminar      │
│─────────────────│
│ id              │←─── Referenced by Notification.refId
│ title           │     (when type='seminar')
│ description     │
│ location        │
│ startsAt        │
│ endsAt          │
│ slug (unique)   │
│ publishedAt     │
└─────────────────┘
```

---

## 🎨 Component Architecture

```
┌─────────────────────────────────────────┐
│         App Layout (RootLayout)          │
│  ┌─────────────────────────────────┐   │
│  │         Header/Navbar           │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │         Page Content            │   │
│  │                                 │   │
│  │  ┌─────────────────────────┐   │   │
│  │  │   Client Component      │   │   │
│  │  │   (Interactive Forms)   │   │   │
│  │  └─────────────────────────┘   │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │           Footer                │   │
│  │  ┌─────────────────────────┐   │   │
│  │  │ Newsletter Subscription │   │   │
│  │  │   (Client Component)    │   │   │
│  │  └─────────────────────────┘   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘


Admin Panel Layout:
┌─────────────────────────────────────────┐
│         Admin Layout                     │
│  ┌────────┬──────────────────────────┐  │
│  │ Admin  │  Admin Page Content      │  │
│  │ Menu   │                          │  │
│  │        │  ┌────────────────────┐  │  │
│  │ • Dash │  │  Table/Form        │  │  │
│  │ • Users│  │  (Client Component)│  │  │
│  │ • News │  │                    │  │  │
│  │ • Anno │  └────────────────────┘  │  │
│  │ • Blog │                          │  │
│  │ • Semi │                          │  │
│  └────────┴──────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 🔄 State Management

### Frontend State (Client Components)

```
Footer Component:
  state: {
    subscribing: boolean,
    email: string
  }

Notices Page:
  state: {
    notices: Notice[],
    filteredNotices: Notice[],
    loading: boolean,
    searchQuery: string,
    typeFilter: string
  }

Admin Newsletter/Announcement:
  state: {
    items: Newsletter[] | Announcement[],
    loading: boolean,
    isModalVisible: boolean,
    editingItem: Newsletter | Announcement | null,
    form: FormInstance
  }

Unsubscribe Page:
  state: {
    loading: boolean,
    unsubscribed: boolean
  }
```

### Backend State (Database)

```
Subscription Table:
  - Active subscribers (unsubscribedAt = null)
  - Unsubscribed users (unsubscribedAt != null)
  - Verified users (verifiedAt != null)

Content Tables (Newsletter, Announcement, Seminar):
  - Published content (publishedAt set)
  - Ordered by publishedAt DESC

Notification Table:
  - Email delivery history
  - Grouped by type and refId
  - Tracks which subscribers received which content
```

---

## 📊 Data Flow Summary

```
User Action → Frontend → API Route → Database → Response → UI Update
     ↓
Triggers Email? → Background Job → Resend API → Email Sent → Log Notification
```

### Example: Creating Newsletter

```
Admin fills form
     ↓
Submit form data
     ↓
POST /api/admin/newsletters
     ↓
Create Newsletter record
     ↓                  ↓
Return success    Async: Send emails
     ↓                  ↓
Update UI         Batch process
                       ↓
                  Resend API
                       ↓
                  Log notifications
```

---

## 🎯 Key Features Summary

1. **Subscription**: Footer form → API → Database
2. **Newsletter Creation**: Admin form → API → Database + Emails
3. **Announcement Creation**: Admin form → API → Database + Emails
4. **Viewing Notices**: Public page → API → Database → Display
5. **Notice Details**: Dynamic page → Database → SEO + Display
6. **Unsubscribe**: Form → API → Update Database
7. **Email Delivery**: Background job → Batches → Resend → Logs

---

**All flows are optimized for:**
- ✅ Performance (indexed queries, batch processing)
- ✅ User experience (loading states, error handling)
- ✅ Security (authentication, validation)
- ✅ Scalability (async processing, connection pooling)
- ✅ Reliability (error logging, fallbacks)

---

**See also:**
- `IMPLEMENTATION_SUMMARY.md` - What was created
- `NEWSLETTER_SETUP.md` - Setup guide
- `QUICK_START.md` - Quick start guide
- `README_NEWSLETTER.md` - Feature overview
