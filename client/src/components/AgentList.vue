<script setup lang="ts">
import type { Agent } from '../types/agent';

defineProps<{
  agents: Agent[];
  loading: boolean;
}>();

const emit = defineEmits<{
  edit: [agent: Agent];
  delete: [agent: Agent];
}>();

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>

<template>
  <div class="agent-list">
    <h2>Property Agents</h2>

    <div v-if="loading" class="loading">Loading agents...</div>

    <div v-else-if="agents.length === 0" class="empty-state">
      <p>No agents found. Add your first agent using the form above.</p>
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="agent in agents" :key="agent.id">
          <td>{{ agent.firstName }} {{ agent.lastName }}</td>
          <td>
            <a :href="`mailto:${agent.email}`">{{ agent.email }}</a>
          </td>
          <td>{{ agent.mobileNumber }}</td>
          <td>{{ formatDate(agent.createdAt) }}</td>
          <td class="actions">
            <button class="btn btn-edit" @click="emit('edit', agent)">Edit</button>
            <button class="btn btn-delete" @click="emit('delete', agent)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.agent-list {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.loading,
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

tr:hover {
  background-color: #f9fafb;
}

a {
  color: #3b82f6;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-edit {
  background-color: #10b981;
  color: white;
}

.btn-edit:hover {
  background-color: #059669;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
}
</style>
