import { Response } from 'express';

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AGENT_NOT_FOUND: 'AGENT_NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export function sendSuccess<T>(res: Response, data: T, status = 200, message?: string): void {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  res.status(status).json(response);
}

export function sendError(res: Response, code: string, message: string, status = 400): void {
  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };

  res.status(status).json(response);
}

export function sendValidationError(res: Response, message: string): void {
  sendError(res, ErrorCodes.VALIDATION_ERROR, message, 400);
}

export function sendNotFound(res: Response, message = 'Property Agent with the given ID does not exist'): void {
  sendError(res, ErrorCodes.AGENT_NOT_FOUND, message, 404);
}
