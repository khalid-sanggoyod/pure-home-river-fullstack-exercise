<script setup lang="ts">
import type { Note, Agent, Property } from '../types';

const props = defineProps<{
  notes: Note[];
  agents: Agent[];
  properties: Property[];
  loading: boolean;
}>();

const emit = defineEmits<{
  edit: [note: Note];
  delete: [note: Note];
}>();

function getAgentName(agentId: string): string {
  const agent = props.agents.find(a => a.id === agentId);
  return agent ? `${agent.firstName} ${agent.lastName}` : 'Unknown';
}

function getPropertyAddress(propertyId: string | null): string {
  if (!propertyId) return '-';
  const property = props.properties.find(p => p.id === propertyId);
  return property ? property.address : 'Unknown';
}

function formatDate(date: string | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
}
</script>

<template>
  <div class="list-card">
    <h3>Notes</h3>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="notes.length === 0" class="empty">No notes found.</div>
    <table v-else>
      <thead>
        <tr>
          <th>Title</th>
          <th>Agent</th>
          <th>Property</th>
          <th>Due Date</th>
          <th>Reminder</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="note in notes" :key="note.id">
          <td>{{ note.title }}</td>
          <td>{{ getAgentName(note.agentId) }}</td>
          <td>{{ getPropertyAddress(note.propertyId) }}</td>
          <td>{{ formatDate(note.dueDate) }}</td>
          <td>{{ note.isReminder ? 'Yes' : 'No' }}</td>
          <td class="actions">
            <button class="btn btn-edit" @click="emit('edit', note)">Edit</button>
            <button class="btn btn-delete" @click="emit('delete', note)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.list-card { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
h3 { margin-bottom: 1rem; color: #2c3e50; }
.loading, .empty { padding: 2rem; text-align: center; color: #6b7280; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
th { background: #f9fafb; font-weight: 600; }
.actions { display: flex; gap: 0.5rem; }
.btn { padding: 0.375rem 0.75rem; border: none; border-radius: 4px; font-size: 0.875rem; cursor: pointer; }
.btn-edit { background: #10b981; color: white; }
.btn-delete { background: #ef4444; color: white; }
</style>
