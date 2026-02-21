import { API_BASE } from '../constants';
import type { ApiErrorResponse } from '../types/agent';

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: ApiErrorResponse
  ) {
    super(data.error || 'An error occurred');
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  signal?: AbortSignal;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, data);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export const httpClient = {
  async get<T>(endpoint: string, params?: Record<string, string | number | undefined>, options?: RequestOptions): Promise<T> {
    const query = params ? buildQueryString(params) : '';
    const response = await fetch(`${API_BASE}${endpoint}${query}`, {
      method: 'GET',
      ...options,
    });
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      ...options,
    });
    return handleResponse<T>(response);
  },
};

export function createAbortController(): AbortController {
  return new AbortController();
}
