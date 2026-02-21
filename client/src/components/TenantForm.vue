<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Tenant, CreateTenantInput, Family, ValidationError } from '../types';

const props = defineProps<{
  tenant?: Tenant | null;
  families: Family[];
}>();

const emit = defineEmits<{
  submit: [data: CreateTenantInput];
  cancel: [];
}>();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phone = ref('');
const familyId = ref('');
const errors = ref<ValidationError[]>([]);

const isEditing = computed(() => !!props.tenant);

watch(
  () => props.tenant,
  (newTenant) => {
    if (newTenant) {
      firstName.value = newTenant.firstName;
      lastName.value = newTenant.lastName;
      email.value = newTenant.email || '';
      phone.value = newTenant.phone || '';
      familyId.value = newTenant.familyId;
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
  phone.value = '';
  familyId.value = '';
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

  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!familyId.value) {
    errors.value.push({ field: 'familyId', message: 'Family is required' });
  }

  return errors.value.length === 0;
}

function handleSubmit() {
  if (!validateForm()) return;

  emit('submit', {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim() || null,
    phone: phone.value.trim() || null,
    familyId: familyId.value,
  });
}

function handleCancel() {
  resetForm();
  emit('cancel');
}

defineExpose({ resetForm, setErrors: (errs: ValidationError[]) => (errors.value = errs) });
</script>

<template>
  <div class="form-card">
    <h3>{{ isEditing ? 'Edit Tenant' : 'Add Tenant' }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input id="firstName" v-model="firstName" type="text" :class="{ error: getFieldError('firstName') }" />
          <span v-if="getFieldError('firstName')" class="error-message">{{ getFieldError('firstName') }}</span>
        </div>
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input id="lastName" v-model="lastName" type="text" :class="{ error: getFieldError('lastName') }" />
          <span v-if="getFieldError('lastName')" class="error-message">{{ getFieldError('lastName') }}</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="email">Email (optional)</label>
          <input id="email" v-model="email" type="email" :class="{ error: getFieldError('email') }" />
          <span v-if="getFieldError('email')" class="error-message">{{ getFieldError('email') }}</span>
        </div>
        <div class="form-group">
          <label for="phone">Phone (optional)</label>
          <input id="phone" v-model="phone" type="tel" :class="{ error: getFieldError('phone') }" />
          <span v-if="getFieldError('phone')" class="error-message">{{ getFieldError('phone') }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="familyId">Family</label>
        <select id="familyId" v-model="familyId" :class="{ error: getFieldError('familyId') }">
          <option value="">Select a family</option>
          <option v-for="family in families" :key="family.id" :value="family.id">
            {{ family.name }}
          </option>
        </select>
        <span v-if="getFieldError('familyId')" class="error-message">{{ getFieldError('familyId') }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Add' }}</button>
        <button type="button" class="btn btn-secondary" @click="handleCancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-card { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1rem; }
h3 { margin-bottom: 1rem; color: #2c3e50; }
.form-row { display: flex; gap: 1rem; }
.form-row .form-group { flex: 1; }
.form-group { margin-bottom: 0.75rem; }
label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
input, select { width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 1rem; }
input:focus, select:focus { outline: none; border-color: #3b82f6; }
input.error, select.error { border-color: #ef4444; }
.error-message { color: #ef4444; font-size: 0.875rem; }
.form-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
.btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
.btn-primary { background: #3b82f6; color: white; }
.btn-secondary { background: #6b7280; color: white; }
</style>
