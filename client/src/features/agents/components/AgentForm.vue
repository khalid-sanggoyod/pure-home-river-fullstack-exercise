<script setup lang="ts">
import { watch, ref } from 'vue';
import { useAgentForm } from '../composables/useAgentForm';
import { useAgentStore } from '../store/agentStore';

const store = useAgentStore();

const {
  firstName,
  lastName,
  email,
  mobileNumber,
  isEditing,
  resetForm,
  getFieldError,
  validateForm,
  getFormData,
} = useAgentForm(() => store.editingAgent);

// Server-side error message
const serverError = ref('');

// Watch for server-side errors from the store
watch(
  () => store.errorMessage,
  (message) => {
    if (message && store.errorCode === 'VALIDATION_ERROR') {
      serverError.value = message;
    }
  }
);

async function handleSubmit() {
  serverError.value = '';

  if (!validateForm()) {
    return;
  }

  const success = await store.saveAgent(getFormData());
  if (success) {
    resetForm();
    serverError.value = '';
  }
}

function handleCancel() {
  resetForm();
  serverError.value = '';
  store.cancelEditing();
}

defineExpose({ resetForm });
</script>

<template>
  <div class="agent-form">
    <h2>{{ isEditing ? 'Edit Agent' : 'Add New Agent' }}</h2>

    <div v-if="serverError" class="server-error">
      {{ serverError }}
    </div>

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
        <button type="submit" class="btn btn-primary" :disabled="store.isSaving">
          {{ store.isSaving ? 'Saving...' : (isEditing ? 'Update Agent' : 'Add Agent') }}
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

.server-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
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
