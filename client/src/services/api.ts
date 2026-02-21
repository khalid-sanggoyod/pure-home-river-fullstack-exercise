import type {
  Agent, CreateAgentInput, UpdateAgentInput,
  Property, CreatePropertyInput, UpdatePropertyInput,
  Family, CreateFamilyInput, UpdateFamilyInput,
  Tenant, CreateTenantInput, UpdateTenantInput,
  Note, CreateNoteInput, UpdateNoteInput,
  ApiErrorResponse
} from '../types';

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

export const propertyApi = {
  async getAll(): Promise<Property[]> {
    const response = await fetch(`${API_BASE}/properties`);
    return handleResponse<Property[]>(response);
  },

  async getById(id: string): Promise<Property> {
    const response = await fetch(`${API_BASE}/properties/${id}`);
    return handleResponse<Property>(response);
  },

  async create(input: CreatePropertyInput): Promise<Property> {
    const response = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Property>(response);
  },

  async update(id: string, input: UpdatePropertyInput): Promise<Property> {
    const response = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Property>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

export const familyApi = {
  async getAll(): Promise<Family[]> {
    const response = await fetch(`${API_BASE}/families`);
    return handleResponse<Family[]>(response);
  },

  async getById(id: string): Promise<Family> {
    const response = await fetch(`${API_BASE}/families/${id}`);
    return handleResponse<Family>(response);
  },

  async create(input: CreateFamilyInput): Promise<Family> {
    const response = await fetch(`${API_BASE}/families`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Family>(response);
  },

  async update(id: string, input: UpdateFamilyInput): Promise<Family> {
    const response = await fetch(`${API_BASE}/families/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Family>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/families/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

export const tenantApi = {
  async getAll(): Promise<Tenant[]> {
    const response = await fetch(`${API_BASE}/tenants`);
    return handleResponse<Tenant[]>(response);
  },

  async getById(id: string): Promise<Tenant> {
    const response = await fetch(`${API_BASE}/tenants/${id}`);
    return handleResponse<Tenant>(response);
  },

  async create(input: CreateTenantInput): Promise<Tenant> {
    const response = await fetch(`${API_BASE}/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Tenant>(response);
  },

  async update(id: string, input: UpdateTenantInput): Promise<Tenant> {
    const response = await fetch(`${API_BASE}/tenants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Tenant>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/tenants/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

export const noteApi = {
  async getAll(): Promise<Note[]> {
    const response = await fetch(`${API_BASE}/notes`);
    return handleResponse<Note[]>(response);
  },

  async getById(id: string): Promise<Note> {
    const response = await fetch(`${API_BASE}/notes/${id}`);
    return handleResponse<Note>(response);
  },

  async create(input: CreateNoteInput): Promise<Note> {
    const response = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Note>(response);
  },

  async update(id: string, input: UpdateNoteInput): Promise<Note> {
    const response = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Note>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

export { ApiError };
