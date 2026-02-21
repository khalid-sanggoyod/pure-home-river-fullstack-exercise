import { ref, computed, watch } from 'vue';
import { VALIDATION_PATTERNS, PHONE_DIGIT_LIMITS } from '../../../constants';
import type { Agent, CreateAgentInput, ValidationError } from '../../../types/agent';

export function useAgentForm(agentToEdit?: () => Agent | null | undefined) {
  const firstName = ref('');
  const lastName = ref('');
  const email = ref('');
  const mobileNumber = ref('');
  const errors = ref<ValidationError[]>([]);

  const isEditing = computed(() => !!agentToEdit?.());

  if (agentToEdit) {
    watch(
      agentToEdit,
      (newAgent) => {
        if (newAgent) {
          firstName.value = newAgent.firstName;
          lastName.value = newAgent.lastName;
          email.value = newAgent.email;
          mobileNumber.value = newAgent.mobileNumber;
        } else {
          resetForm();
        }
      },
      { immediate: true }
    );
  }

  function resetForm() {
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    mobileNumber.value = '';
    errors.value = [];
  }

  function getFieldError(field: string): string | undefined {
    return errors.value.find((e) => e.field === field)?.message;
  }

  function setErrors(errs: ValidationError[]) {
    errors.value = errs;
  }

  function validateForm(): boolean {
    errors.value = [];

    if (!firstName.value.trim()) {
      errors.value.push({ field: 'firstName', message: 'First name is required' });
    }

    if (!lastName.value.trim()) {
      errors.value.push({ field: 'lastName', message: 'Last name is required' });
    }

    if (!email.value.trim()) {
      errors.value.push({ field: 'email', message: 'Email is required' });
    } else if (!VALIDATION_PATTERNS.EMAIL.test(email.value)) {
      errors.value.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    const digitsOnly = mobileNumber.value.replace(/[\s\-+()]/g, '');
    if (!mobileNumber.value.trim()) {
      errors.value.push({ field: 'mobileNumber', message: 'Mobile number is required' });
    } else if (
      !VALIDATION_PATTERNS.PHONE.test(mobileNumber.value) ||
      digitsOnly.length < PHONE_DIGIT_LIMITS.MIN ||
      digitsOnly.length > PHONE_DIGIT_LIMITS.MAX
    ) {
      errors.value.push({
        field: 'mobileNumber',
        message: `Please enter a valid phone number (${PHONE_DIGIT_LIMITS.MIN}-${PHONE_DIGIT_LIMITS.MAX} digits)`,
      });
    }

    return errors.value.length === 0;
  }

  function getFormData(): CreateAgentInput {
    return {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim().toLowerCase(),
      mobileNumber: mobileNumber.value.trim(),
    };
  }

  return {
    firstName,
    lastName,
    email,
    mobileNumber,
    errors,
    isEditing,
    resetForm,
    getFieldError,
    setErrors,
    validateForm,
    getFormData,
  };
}
