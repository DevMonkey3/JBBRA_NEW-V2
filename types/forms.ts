// Form types for admin operations

export interface NewsletterFormData {
  title: string;
  body: string;
  excerpt?: string;
  slug?: string;
}

export interface AnnouncementFormData {
  title: string;
  body: string;
  excerpt?: string;
  slug?: string;
}

export interface BlogPostFormData {
  title: string;
  content: string;
  slug: string;
  coverImage?: string;
  excerpt?: string;
}

export interface UserFormData {
  email: string;
  name?: string;
  password?: string;
}

export interface SeminarFormData {
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  registrationUrl?: string;
  slug: string;
  excerpt?: string;
  heroImage?: string;
  thumbnail?: string;
  speakerName?: string;
  speakerTitle?: string;
  speakerOrg?: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SeminarRegistrationForm {
  name: string;
  companyName?: string;
  phone: string;
  prefecture: string;
  email: string;
  consentPI: boolean;
}

export interface SubscribeForm {
  email: string;
}
