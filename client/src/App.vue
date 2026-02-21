<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AgentForm from './components/AgentForm.vue';
import AgentList from './components/AgentList.vue';
import { agentApi, ApiError } from './services/api';
import type { Agent, CreateAgentInput, AgentSearchParams } from './types/agent';

const agents = ref<Agent[]>([]);
const loading = ref(true);
const editingAgent = ref<Agent | null>(null);
const formRef = ref<InstanceType<typeof AgentForm> | null>(null);
const errorMessage = ref('');
const currentSearchParams = ref<AgentSearchParams>({});

async function fetchAgents(params?: AgentSearchParams) {
  loading.value = true;
  errorMessage.value = '';
  try {
    agents.value = await agentApi.getAll(params);
  } catch (error) {
    errorMessage.value = 'Failed to load agents. Please try again.';
    console.error('Failed to fetch agents:', error);
  } finally {
    loading.value = false;
  }
}

async function handleSearch(params: AgentSearchParams) {
  currentSearchParams.value = params;
  await fetchAgents(params);
}

async function handleSubmit(data: CreateAgentInput) {
  errorMessage.value = '';
  try {
    if (editingAgent.value) {
      await agentApi.update(editingAgent.value.id, data);
    } else {
      await agentApi.create(data);
    }
    editingAgent.value = null;
    formRef.value?.resetForm();
    await fetchAgents(currentSearchParams.value);
  } catch (error) {
    if (error instanceof ApiError && error.data.errors) {
      formRef.value?.setErrors(error.data.errors);
    } else {
      errorMessage.value = 'Failed to save agent. Please try again.';
      console.error('Failed to save agent:', error);
    }
  }
}

function handleEdit(agent: Agent) {
  editingAgent.value = agent;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function handleDelete(agent: Agent) {
  if (!confirm(`Are you sure you want to delete ${agent.firstName} ${agent.lastName}?`)) {
    return;
  }

  errorMessage.value = '';
  try {
    await agentApi.delete(agent.id);
    await fetchAgents(currentSearchParams.value);
  } catch (error) {
    errorMessage.value = 'Failed to delete agent. Please try again.';
    console.error('Failed to delete agent:', error);
  }
}

function handleCancel() {
  editingAgent.value = null;
}

onMounted(() => fetchAgents());
</script>

<template>
  <div class="app">
    <header>
      <h1>PURE Home River</h1>
      <p>Property Agent Management System</p>
    </header>

    <main>
      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
        <button @click="errorMessage = ''">Dismiss</button>
      </div>

      <AgentForm
        ref="formRef"
        :agent="editingAgent"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />

      <AgentList
        :agents="agents"
        :loading="loading"
        @edit="handleEdit"
        @delete="handleDelete"
        @search="handleSearch"
      />
    </main>

    <footer>
      <p>PURE Home River Take-Home Exercise</p>
    </footer>
  </div>
</template>

<style>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 8px;
}

header h1 {
  margin-bottom: 0.25rem;
}

header p {
  opacity: 0.9;
}

main {
  min-height: 400px;
}

.error-banner {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-banner button {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-weight: 500;
}

footer {
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
