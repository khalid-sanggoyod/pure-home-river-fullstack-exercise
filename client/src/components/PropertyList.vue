<script setup lang="ts">
import type { Property, Agent } from '../types';

const props = defineProps<{
  properties: Property[];
  agents: Agent[];
  loading: boolean;
}>();

const emit = defineEmits<{
  edit: [property: Property];
  delete: [property: Property];
}>();

function getAgentName(agentId: string): string {
  const agent = props.agents.find(a => a.id === agentId);
  return agent ? `${agent.firstName} ${agent.lastName}` : 'Unknown';
}
</script>

<template>
  <div class="list-card">
    <h3>Properties</h3>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="properties.length === 0" class="empty">No properties found.</div>
    <table v-else>
      <thead>
        <tr>
          <th>Address</th>
          <th>Agent</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="property in properties" :key="property.id">
          <td>{{ property.address }}</td>
          <td>{{ getAgentName(property.agentId) }}</td>
          <td class="actions">
            <button class="btn btn-edit" @click="emit('edit', property)">Edit</button>
            <button class="btn btn-delete" @click="emit('delete', property)">Delete</button>
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
