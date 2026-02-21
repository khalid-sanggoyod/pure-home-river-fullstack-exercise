import { ref } from 'vue';
import { ApiError } from '../services/httpClient';

export function useApiError() {
  const errorMessage = ref('');
  const errorCode = ref('');

  function clearError() {
    errorMessage.value = '';
    errorCode.value = '';
  }

  function setError(message: string, code = '') {
    errorMessage.value = message;
    errorCode.value = code;
  }

  function handleError(error: unknown, fallbackMessage: string) {
    if (error instanceof ApiError) {
      errorMessage.value = error.message;
      errorCode.value = error.code;
    } else {
      errorMessage.value = fallbackMessage;
      console.error(fallbackMessage, error);
    }
  }

  function isValidationError(): boolean {
    return errorCode.value === 'VALIDATION_ERROR';
  }

  return {
    errorMessage,
    errorCode,
    clearError,
    setError,
    handleError,
    isValidationError,
  };
}
