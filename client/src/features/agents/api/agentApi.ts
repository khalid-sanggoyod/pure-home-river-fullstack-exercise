import { httpClient } from '../../../services/httpClient';
import type {
  Agent,
  CreateAgentInput,
  UpdateAgentInput,
  AgentSearchParams,
  PaginatedResult,
} from '../../../types/agent';

export const agentApi = {
  async getAll(params?: AgentSearchParams, signal?: AbortSignal): Promise<PaginatedResult<Agent>> {
    return httpClient.get<PaginatedResult<Agent>>(
      '/agents',
      params as Record<string, string | number | undefined>,
      { signal }
    );
  },

  async getById(id: string, signal?: AbortSignal): Promise<Agent> {
    return httpClient.get<Agent>(`/agents/${id}`, undefined, { signal });
  },

  async create(input: CreateAgentInput, signal?: AbortSignal): Promise<Agent> {
    return httpClient.post<Agent>('/agents', input, { signal });
  },

  async update(id: string, input: UpdateAgentInput, signal?: AbortSignal): Promise<Agent> {
    return httpClient.put<Agent>(`/agents/${id}`, input, { signal });
  },

  async delete(id: string, signal?: AbortSignal): Promise<void> {
    return httpClient.delete<void>(`/agents/${id}`, { signal });
  },
};
