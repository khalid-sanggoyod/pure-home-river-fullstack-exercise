import type { Agent, CreateAgentInput, UpdateAgentInput, ApiErrorResponse } from '../types/agent';

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

export const agentApi = {
  async getAll(): Promise<Agent[]> {
    const response = await fetch(`${API_BASE}/agents`);
    return handleResponse<Agent[]>(response);
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
