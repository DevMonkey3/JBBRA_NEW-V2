// Database model types matching Prisma schema

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

// AdminUser without sensitive fields (for client-side use)
export interface AdminUserSafe {
  id: string;
  email: string;
  name: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Newsletter {
  id: string;
  title: string;
  body: string;
  excerpt?: string | null;
  slug: string;
  publishedAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  excerpt?: string | null;
  slug: string;
  publishedAt: Date;
}

export interface Seminar {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: Date;
  endsAt: Date;
  registrationUrl?: string | null;
  publishedAt: Date;
  slug: string;
  excerpt?: string | null;
  heroImage?: string | null;
  thumbnail?: string | null;
  speakerName?: string | null;
  speakerTitle?: string | null;
  speakerOrg?: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string | null;
  excerpt?: string | null;
  publishedAt: Date;
  likeCount: number;
}

export interface Like {
  id: string;
  postId: string;
  userKey: string;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  email: string;
  verifiedAt: Date | null;
  unsubscribedAt: Date | null;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: string;
  refId: string;
  email: string;
  sentAt: Date;
  subscriptionId?: string | null;
}

export interface SeminarRegistration {
  id: string;
  seminarId: string;
  name: string;
  companyName?: string | null;
  phone: string;
  prefecture: string;
  email: string;
  consentPI: boolean;
  status: 'SUBMITTED' | 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
  ip?: string | null;
  userAgent?: string | null;
  notes?: string | null;
}

export interface UploadedImage {
  id: string;
  filename: string;
  mimeType: string;
  url?: string | null;
  data?: string | null;
  size: number;
  createdAt: Date;
}
