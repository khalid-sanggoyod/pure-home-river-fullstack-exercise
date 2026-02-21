import type { Agent, CreateAgentInput, UpdateAgentInput, AgentSearchParams, PaginatedResult, ApiErrorResponse } from '../types/agent';

const API_BASE = '/api';

class ApiError extends Error {
  constructor(
    public status: number,
    public data: ApiErrorResponse
  ) {
    super(data.error || 'An error occurred');
    this.name = 'ApiError';
  }
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

export const agentApi = {
  async getAll(params?: AgentSearchParams): Promise<PaginatedResult<Agent>> {
    const query = params ? buildQueryString(params as Record<string, string | number | undefined>) : '';
    const response = await fetch(`${API_BASE}/agents${query}`);
    return handleResponse<PaginatedResult<Agent>>(response);
  },

  async getById(id: string): Promise<Agent> {
    const response = await fetch(`${API_BASE}/agents/${id}`);
    return handleResponse<Agent>(response);
  },

  async create(input: CreateAgentInput): Promise<Agent> {
    const response = await fetch(`${API_BASE}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Agent>(response);
  },

  async update(id: string, input: UpdateAgentInput): Promise<Agent> {
    const response = await fetch(`${API_BASE}/agents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Agent>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/agents/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

export { ApiError };
