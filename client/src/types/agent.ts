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
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  errors?: ValidationError[];
  error?: string;
}
