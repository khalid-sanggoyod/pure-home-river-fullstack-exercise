<script setup lang="ts">
import { onMounted } from 'vue';
import AgentForm from './features/agents/components/AgentForm.vue';
import AgentList from './features/agents/components/AgentList.vue';
import { useAgentStore } from './features/agents/store/agentStore';

const store = useAgentStore();

onMounted(() => store.fetchAgents());
</script>

<template>
  <div class="app">
    <header>
      <h1>PURE Home River</h1>
      <p>Property Agent Management System</p>
    </header>

    <main>
      <div v-if="store.errorMessage" class="error-banner">
        {{ store.errorMessage }}
        <button @click="store.clearError()">Dismiss</button>
      </div>

      <AgentForm />
      <AgentList />
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
