<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Family, CreateFamilyInput, Property, ValidationError } from '../types';

const props = defineProps<{
  family?: Family | null;
  properties: Property[];
}>();

const emit = defineEmits<{
  submit: [data: CreateFamilyInput];
  cancel: [];
}>();

const name = ref('');
const propertyId = ref('');
const errors = ref<ValidationError[]>([]);

const isEditing = computed(() => !!props.family);

watch(
  () => props.family,
  (newFamily) => {
    if (newFamily) {
      name.value = newFamily.name;
      propertyId.value = newFamily.propertyId;
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

function resetForm() {
  name.value = '';
  propertyId.value = '';
  errors.value = [];
}

function getFieldError(field: string): string | undefined {
  return errors.value.find((e) => e.field === field)?.message;
}

function validateForm(): boolean {
  errors.value = [];

  if (!name.value.trim()) {
    errors.value.push({ field: 'name', message: 'Family name is required' });
  }

  if (!propertyId.value) {
    errors.value.push({ field: 'propertyId', message: 'Property is required' });
  }

  return errors.value.length === 0;
}

function handleSubmit() {
  if (!validateForm()) return;

  emit('submit', {
    name: name.value.trim(),
    propertyId: propertyId.value,
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
    <h3>{{ isEditing ? 'Edit Family' : 'Add Family' }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Family Name</label>
        <input id="name" v-model="name" type="text" :class="{ error: getFieldError('name') }" />
        <span v-if="getFieldError('name')" class="error-message">{{ getFieldError('name') }}</span>
      </div>

      <div class="form-group">
        <label for="propertyId">Property</label>
        <select id="propertyId" v-model="propertyId" :class="{ error: getFieldError('propertyId') }">
          <option value="">Select a property</option>
          <option v-for="property in properties" :key="property.id" :value="property.id">
            {{ property.address }}
          </option>
        </select>
        <span v-if="getFieldError('propertyId')" class="error-message">{{ getFieldError('propertyId') }}</span>
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
