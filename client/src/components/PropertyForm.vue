<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Property, CreatePropertyInput, Agent, ValidationError } from '../types';

const props = defineProps<{
  property?: Property | null;
  agents: Agent[];
}>();

const emit = defineEmits<{
  submit: [data: CreatePropertyInput];
  cancel: [];
}>();

const address = ref('');
const agentId = ref('');
const errors = ref<ValidationError[]>([]);

const isEditing = computed(() => !!props.property);

watch(
  () => props.property,
  (newProperty) => {
    if (newProperty) {
      address.value = newProperty.address;
      agentId.value = newProperty.agentId;
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

function resetForm() {
  address.value = '';
  agentId.value = '';
  errors.value = [];
}

function getFieldError(field: string): string | undefined {
  return errors.value.find((e) => e.field === field)?.message;
}

function validateForm(): boolean {
  errors.value = [];

  if (!address.value.trim()) {
    errors.value.push({ field: 'address', message: 'Address is required' });
  }

  if (!agentId.value) {
    errors.value.push({ field: 'agentId', message: 'Agent is required' });
  }

  return errors.value.length === 0;
}

function handleSubmit() {
  if (!validateForm()) return;

  emit('submit', {
    address: address.value.trim(),
    agentId: agentId.value,
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
    <h3>{{ isEditing ? 'Edit Property' : 'Add Property' }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="address">Address</label>
        <input id="address" v-model="address" type="text" :class="{ error: getFieldError('address') }" />
        <span v-if="getFieldError('address')" class="error-message">{{ getFieldError('address') }}</span>
      </div>

      <div class="form-group">
        <label for="agentId">Agent</label>
        <select id="agentId" v-model="agentId" :class="{ error: getFieldError('agentId') }">
          <option value="">Select an agent</option>
          <option v-for="agent in agents" :key="agent.id" :value="agent.id">
            {{ agent.firstName }} {{ agent.lastName }}
          </option>
        </select>
        <span v-if="getFieldError('agentId')" class="error-message">{{ getFieldError('agentId') }}</span>
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
