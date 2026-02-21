<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Note, CreateNoteInput, Agent, Property, ValidationError } from '../types';

const props = defineProps<{
  note?: Note | null;
  agents: Agent[];
  properties: Property[];
}>();

const emit = defineEmits<{
  submit: [data: CreateNoteInput];
  cancel: [];
}>();

const title = ref('');
const content = ref('');
const agentId = ref('');
const propertyId = ref('');
const dueDate = ref('');
const isReminder = ref(false);
const errors = ref<ValidationError[]>([]);

const isEditing = computed(() => !!props.note);

watch(
  () => props.note,
  (newNote) => {
    if (newNote) {
      title.value = newNote.title;
      content.value = newNote.content || '';
      agentId.value = newNote.agentId;
      propertyId.value = newNote.propertyId || '';
      dueDate.value = newNote.dueDate ? newNote.dueDate.split('T')[0] : '';
      isReminder.value = newNote.isReminder;
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

function resetForm() {
  title.value = '';
  content.value = '';
  agentId.value = '';
  propertyId.value = '';
  dueDate.value = '';
  isReminder.value = false;
  errors.value = [];
}

function getFieldError(field: string): string | undefined {
  return errors.value.find((e) => e.field === field)?.message;
}

function validateForm(): boolean {
  errors.value = [];

  if (!title.value.trim()) {
    errors.value.push({ field: 'title', message: 'Title is required' });
  }

  if (!agentId.value) {
    errors.value.push({ field: 'agentId', message: 'Agent is required' });
  }

  return errors.value.length === 0;
}

function handleSubmit() {
  if (!validateForm()) return;

  emit('submit', {
    title: title.value.trim(),
    content: content.value.trim() || null,
    agentId: agentId.value,
    propertyId: propertyId.value || null,
    dueDate: dueDate.value ? new Date(dueDate.value).toISOString() : null,
    isReminder: isReminder.value,
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
    <h3>{{ isEditing ? 'Edit Note' : 'Add Note' }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input id="title" v-model="title" type="text" :class="{ error: getFieldError('title') }" />
        <span v-if="getFieldError('title')" class="error-message">{{ getFieldError('title') }}</span>
      </div>

      <div class="form-group">
        <label for="content">Content (optional)</label>
        <textarea id="content" v-model="content" rows="3"></textarea>
      </div>

      <div class="form-row">
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
        <div class="form-group">
          <label for="propertyId">Property (optional)</label>
          <select id="propertyId" v-model="propertyId">
            <option value="">None</option>
            <option v-for="property in properties" :key="property.id" :value="property.id">
              {{ property.address }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="dueDate">Due Date (optional)</label>
          <input id="dueDate" v-model="dueDate" type="date" />
        </div>
        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" v-model="isReminder" />
            Is Reminder
          </label>
        </div>
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
.checkbox-group { display: flex; align-items: center; padding-top: 1.5rem; }
.checkbox-group label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
.checkbox-group input[type="checkbox"] { width: auto; }
label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
input, select, textarea { width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 1rem; font-family: inherit; }
input:focus, select:focus, textarea:focus { outline: none; border-color: #3b82f6; }
input.error, select.error { border-color: #ef4444; }
.error-message { color: #ef4444; font-size: 0.875rem; }
.form-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
.btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
.btn-primary { background: #3b82f6; color: white; }
.btn-secondary { background: #6b7280; color: white; }
</style>
