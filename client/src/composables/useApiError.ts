import { ref } from 'vue';
import { ApiError } from '../services/httpClient';
import type { ValidationError } from '../types/agent';

export function useApiError() {
  const errorMessage = ref('');
  const validationErrors = ref<ValidationError[]>([]);

  function clearError() {
    errorMessage.value = '';
    validationErrors.value = [];
  }

  function setError(message: string) {
    errorMessage.value = message;
  }

  function handleError(error: unknown, fallbackMessage: string) {
    if (error instanceof ApiError) {
      if (error.data.errors) {
        validationErrors.value = error.data.errors;
      } else {
        errorMessage.value = error.message || fallbackMessage;
      }
    } else {
      errorMessage.value = fallbackMessage;
      console.error(fallbackMessage, error);
    }
  }

  function getFieldError(field: string): string | undefined {
    return validationErrors.value.find((e) => e.field === field)?.message;
  }

  function hasValidationErrors(): boolean {
    return validationErrors.value.length > 0;
  }

  return {
    errorMessage,
    validationErrors,
    clearError,
    setError,
    handleError,
    getFieldError,
    hasValidationErrors,
  };
}
