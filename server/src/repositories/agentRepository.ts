import { v4 as uuidv4 } from 'uuid';
import { Agent, CreateAgentInput, UpdateAgentInput, AgentSearchParams, PaginatedResult } from '../models/agent';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 2;

class AgentRepository {
  private agents: Map<string, Agent> = new Map();

  getAll(): Agent[] {
    return Array.from(this.agents.values());
  }

  search(params: AgentSearchParams): PaginatedResult<Agent> {
    let results = Array.from(this.agents.values());

    // Text search (name, email, phone)
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      results = results.filter(agent =>
        agent.firstName.toLowerCase().includes(searchLower) ||
        agent.lastName.toLowerCase().includes(searchLower) ||
        agent.email.toLowerCase().includes(searchLower) ||
        agent.mobileNumber.includes(params.search!)
      );
    }

    // Date range filter
    if (params.createdFrom) {
      const fromDate = new Date(params.createdFrom);
      results = results.filter(agent => new Date(agent.createdAt) >= fromDate);
    }

    if (params.createdTo) {
      const toDate = new Date(params.createdTo);
      toDate.setHours(23, 59, 59, 999);
      results = results.filter(agent => new Date(agent.createdAt) <= toDate);
    }

    // Sort by createdAt descending (newest first)
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const total = results.length;
    const page = params.page || DEFAULT_PAGE;
    const limit = params.limit || DEFAULT_LIMIT;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    const paginatedData = results.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  getById(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  create(input: CreateAgentInput): Agent {
    const now = new Date().toISOString();
    const agent: Agent = {
      id: uuidv4(),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      mobileNumber: input.mobileNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.agents.set(agent.id, agent);
    return agent;
  }

  update(id: string, input: UpdateAgentInput): Agent | undefined {
    const existing = this.agents.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Agent = {
      ...existing,
      ...(input.firstName !== undefined && { firstName: input.firstName }),
      ...(input.lastName !== undefined && { lastName: input.lastName }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.mobileNumber !== undefined && { mobileNumber: input.mobileNumber }),
      updatedAt: new Date().toISOString(),
    };

    this.agents.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.agents.delete(id);
  }
}

export const agentRepository = new AgentRepository();
