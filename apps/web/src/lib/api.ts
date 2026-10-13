import type {
  Comment,
  Conversation,
  Message,
  Page,
  Post,
  User,
  UserProfile,
} from './types';

export const API_BASE = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
).replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  userId: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      'x-user-id': userId,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { message?: string | string[] };
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
      }
    } catch {
      /* keep default */
    }
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/**
 * A per-user API client. Every call carries the mock auth header so the
 * backend can resolve identity — swapping this for a real session cookie later
 * touches only this file.
 */
export function createApi(userId: string) {
  return {
    async listUsers(query = ''): Promise<Page<User>> {
      return request(`/users?limit=50${query}`, userId);
    },
    async me(): Promise<UserProfile> {
      return request('/users/me', userId);
    },
    async getProfile(id: string): Promise<UserProfile> {
      return request(`/users/${id}`, userId);
    },
    async follow(id: string) {
      return request<{ following: boolean; followerCount: number }>(
        `/users/${id}/follow`,
        userId,
        { method: 'POST' },
      );
    },
    async unfollow(id: string) {
      return request<{ following: boolean; followerCount: number }>(
        `/users/${id}/follow`,
        userId,
        { method: 'DELETE' },
      );
    },
    async getFeed(cursor?: string | null): Promise<Page<Post>> {
      const q = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
      return request(`/feed?limit=20${q}`, userId);
    },
    async createPost(body: string): Promise<Post> {
      return request('/posts', userId, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });
    },
    async likePost(id: string) {
      return request<{ liked: boolean; likeCount: number }>(
        `/posts/${id}/like`,
        userId,
        { method: 'POST' },
      );
    },
    async unlikePost(id: string) {
      return request<{ liked: boolean; likeCount: number }>(
        `/posts/${id}/like`,
        userId,
        { method: 'DELETE' },
      );
    },
    async getComments(id: string): Promise<Comment[]> {
      return request(`/posts/${id}/comments`, userId);
    },
    async addComment(id: string, body: string): Promise<Comment> {
      return request(`/posts/${id}/comments`, userId, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });
    },
    async getUserPosts(id: string, cursor?: string | null): Promise<Page<Post>> {
      const q = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
      return request(`/users/${id}/posts?limit=20${q}`, userId);
    },
    async getConversations(): Promise<Conversation[]> {
      return request('/conversations', userId);
    },
    async startDirect(otherUserId: string) {
      return request<{ id: string }>('/conversations/direct', userId, {
        method: 'POST',
        body: JSON.stringify({ userId: otherUserId }),
      });
    },
    async getMessages(
      conversationId: string,
      cursor?: string | null,
    ): Promise<Page<Message>> {
      const q = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
      return request(`/conversations/${conversationId}/messages?limit=30${q}`, userId);
    },
    async markRead(conversationId: string, seq: number) {
      return request(`/conversations/${conversationId}/read`, userId, {
        method: 'POST',
        body: JSON.stringify({ seq }),
      });
    },
  };
}

export type Api = ReturnType<typeof createApi>;

/**
 * Mock-auth bootstrap: fetches the list of pre-registered identities without a
 * session, so the UI can offer a user switcher. Real auth would replace this
 * with a tokens endpoint.
 */
export async function listIdentities(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/api/session/identities`);
  if (!res.ok) {
    throw new ApiError(`Failed to load identities (${res.status})`, res.status);
  }
  return (await res.json()) as User[];
}
