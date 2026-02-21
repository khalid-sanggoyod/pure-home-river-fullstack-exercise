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

// API Response Types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorData {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorData;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
