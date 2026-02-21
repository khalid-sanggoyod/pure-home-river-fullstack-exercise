import { ref, onUnmounted } from 'vue';
import { DEBOUNCE_DELAY_MS } from '../constants';

export function useDebouncedFn<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number = DEBOUNCE_DELAY_MS
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  onUnmounted(cancel);

  return { debouncedFn, cancel };
}

export function useDebouncedRef<T>(initialValue: T, delay: number = DEBOUNCE_DELAY_MS) {
  const value = ref(initialValue);
  const debouncedValue = ref(initialValue);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const updateDebouncedValue = (newValue: T) => {
    value.value = newValue as typeof value.value;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue as typeof debouncedValue.value;
      timeoutId = null;
    }, delay);
  };

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return { value, debouncedValue, updateDebouncedValue };
}
