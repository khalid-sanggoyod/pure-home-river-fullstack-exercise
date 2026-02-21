export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentInput {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

export interface UpdateAgentInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
}

export interface AgentSearchParams {
  search?: string;
  createdFrom?: string;
  createdTo?: string;
}
