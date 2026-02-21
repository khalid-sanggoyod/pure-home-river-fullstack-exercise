<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Agent, CreateAgentInput, ValidationError } from '../types/agent';

const props = defineProps<{
  agent?: Agent | null;
}>();

const emit = defineEmits<{
  submit: [data: CreateAgentInput];
  cancel: [];
}>();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const mobileNumber = ref('');
const errors = ref<ValidationError[]>([]);

const isEditing = computed(() => !!props.agent);

watch(
  () => props.agent,
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

function validateForm(): boolean {
  errors.value = [];

  if (!firstName.value.trim()) {
    errors.value.push({ field: 'firstName', message: 'First name is required' });
  }

  if (!lastName.value.trim()) {
    errors.value.push({ field: 'lastName', message: 'Last name is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    errors.value.push({ field: 'email', message: 'Email is required' });
  } else if (!emailRegex.test(email.value)) {
    errors.value.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  const phoneRegex = /^[\d\s\-+()]+$/;
  const digitsOnly = mobileNumber.value.replace(/[\s\-+()]/g, '');
  if (!mobileNumber.value.trim()) {
    errors.value.push({ field: 'mobileNumber', message: 'Mobile number is required' });
  } else if (!phoneRegex.test(mobileNumber.value) || digitsOnly.length < 7 || digitsOnly.length > 15) {
    errors.value.push({ field: 'mobileNumber', message: 'Please enter a valid phone number (7-15 digits)' });
  }

  return errors.value.length === 0;
}

function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  emit('submit', {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim().toLowerCase(),
    mobileNumber: mobileNumber.value.trim(),
  });
}

function handleCancel() {
  resetForm();
  emit('cancel');
}

defineExpose({ resetForm, setErrors: (errs: ValidationError[]) => (errors.value = errs) });
</script>

<template>
  <div class="agent-form">
    <h2>{{ isEditing ? 'Edit Agent' : 'Add New Agent' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input
          id="firstName"
          v-model="firstName"
          type="text"
          :class="{ error: getFieldError('firstName') }"
          placeholder="Enter first name"
        />
        <span v-if="getFieldError('firstName')" class="error-message">
          {{ getFieldError('firstName') }}
        </span>
      </div>

      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input
          id="lastName"
          v-model="lastName"
          type="text"
          :class="{ error: getFieldError('lastName') }"
          placeholder="Enter last name"
        />
        <span v-if="getFieldError('lastName')" class="error-message">
          {{ getFieldError('lastName') }}
        </span>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          :class="{ error: getFieldError('email') }"
          placeholder="Enter email address"
        />
        <span v-if="getFieldError('email')" class="error-message">
          {{ getFieldError('email') }}
        </span>
      </div>

      <div class="form-group">
        <label for="mobileNumber">Mobile Number</label>
        <input
          id="mobileNumber"
          v-model="mobileNumber"
          type="tel"
          :class="{ error: getFieldError('mobileNumber') }"
          placeholder="Enter mobile number"
        />
        <span v-if="getFieldError('mobileNumber')" class="error-message">
          {{ getFieldError('mobileNumber') }}
        </span>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? 'Update Agent' : 'Add Agent' }}
        </button>
        <button type="button" class="btn btn-secondary" @click="handleCancel">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.agent-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #374151;
}

input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}
</style>
