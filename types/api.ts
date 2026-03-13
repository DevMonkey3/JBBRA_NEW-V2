// API response types
import type {
  AdminUser,
  AdminUserSafe,
  Newsletter,
  Announcement,
  BlogPost,
  Seminar,
  Subscription
} from './models';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

// Newsletter API responses
export interface NewsletterResponse {
  newsletter: Newsletter;
}

export interface UpdateNewsletterRequest {
  title?: string;
  body?: string;
  excerpt?: string;
  slug?: string;
}

export interface CreateNewsletterRequest {
  title: string;
  body: string;
  excerpt?: string;
  slug: string;
}

export interface GetNewslettersResponse {
  newsletters: Newsletter[];
}

export interface CreateNewsletterResponse {
  newsletter: Newsletter;
}

export interface UpdateNewsletterResponse {
  newsletter: Newsletter;
}

export interface DeleteNewsletterResponse {
  success: boolean;
}

// Announcement API responses
export interface GetAnnouncementsResponse {
  announcements: Announcement[];
}

export interface CreateAnnouncementResponse {
  announcement: Announcement;
}

export interface UpdateAnnouncementResponse {
  announcement: Announcement;
}

export interface DeleteAnnouncementResponse {
  success: boolean;
}

// Blog API responses
export interface GetBlogPostsResponse {
  posts: BlogPost[];
  total?: number;
}

export interface GetBlogPostResponse {
  post: BlogPost;
}

export interface CreateBlogPostResponse {
  post: BlogPost;
}

export interface UpdateBlogPostResponse {
  post: BlogPost;
}

export interface DeleteBlogPostResponse {
  success: boolean;
}

// User API responses
export interface GetUsersResponse {
  users: AdminUser[];
}

export interface GetAdminUsersResponse {
  users: AdminUserSafe[];
}

export interface CreateUserResponse {
  user: AdminUser;
}

export interface CreateAdminUserFormData {
  email: string;
  name?: string;
  password: string;
}

export interface CreateAdminUserRequest {
  email: string;
  name?: string;
  password: string;
}

export interface EditAdminUserFormData {
  id: string;
  email?: string;
  name?: string;
  password?: string;
}

export interface UpdateAdminUserRequest {
  email?: string;
  name?: string;
  password?: string;
}

export interface CreateAdminUserResponse {
  user: AdminUserSafe;
}

export interface UpdateAdminUserResponse {
  user: AdminUserSafe;
}

export interface DeleteAdminUserResponse {
  success: boolean;
}

export interface UpdateUserResponse {
  user: AdminUser;
}

export interface DeleteUserResponse {
  success: boolean;
}

// Seminar API responses
export interface GetSeminarsResponse {
  seminars: Seminar[];
}

export interface GetSeminarResponse {
  seminar: Seminar;
}

export interface CreateSeminarResponse {
  seminar: Seminar;
}

export interface UpdateSeminarResponse {
  seminar: Seminar;
}

export interface DeleteSeminarResponse {
  success: boolean;
}

// Auth API responses
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface ProfileUpdateResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

// Upload API response
export interface UploadResponse {
  url: string;
  filename: string;
}

// Subscribe API response
export interface SubscribeResponse {
  success: boolean;
  message?: string;
}

export interface CreateSubscriptionRequest {
  email: string;
}

export interface UnsubscribeRequest {
  email: string;
}

export interface SubscriptionResponse {
  success: boolean;
  subscription?: {
    id: string;
    email: string;
    verifiedAt: Date | null;
    unsubscribedAt: Date | null;
  };
  message?: string;
}

// Health check response
export interface HealthResponse {
  ok: boolean;
  subscriptions?: number;
  error?: string;
}
