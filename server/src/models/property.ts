export interface Property {
  id: string;
  address: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyInput {
  address: string;
  agentId: string;
}

export interface UpdatePropertyInput {
  address?: string;
  agentId?: string;
}
