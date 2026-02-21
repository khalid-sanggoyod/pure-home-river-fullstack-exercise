<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AgentForm from './components/AgentForm.vue';
import AgentList from './components/AgentList.vue';
import PropertyForm from './components/PropertyForm.vue';
import PropertyList from './components/PropertyList.vue';
import FamilyForm from './components/FamilyForm.vue';
import FamilyList from './components/FamilyList.vue';
import TenantForm from './components/TenantForm.vue';
import TenantList from './components/TenantList.vue';
import NoteForm from './components/NoteForm.vue';
import NoteList from './components/NoteList.vue';
import { agentApi, propertyApi, familyApi, tenantApi, noteApi, ApiError } from './services/api';
import type { Agent, Property, Family, Tenant, Note, CreateAgentInput, CreatePropertyInput, CreateFamilyInput, CreateTenantInput, CreateNoteInput } from './types';

type Tab = 'agents' | 'properties' | 'families' | 'tenants' | 'notes';

const activeTab = ref<Tab>('agents');
const loading = ref(true);
const errorMessage = ref('');

// Data
const agents = ref<Agent[]>([]);
const properties = ref<Property[]>([]);
const families = ref<Family[]>([]);
const tenants = ref<Tenant[]>([]);
const notes = ref<Note[]>([]);

// Editing state
const editingAgent = ref<Agent | null>(null);
const editingProperty = ref<Property | null>(null);
const editingFamily = ref<Family | null>(null);
const editingTenant = ref<Tenant | null>(null);
const editingNote = ref<Note | null>(null);

// Form refs
const agentFormRef = ref<InstanceType<typeof AgentForm> | null>(null);
const propertyFormRef = ref<InstanceType<typeof PropertyForm> | null>(null);
const familyFormRef = ref<InstanceType<typeof FamilyForm> | null>(null);
const tenantFormRef = ref<InstanceType<typeof TenantForm> | null>(null);
const noteFormRef = ref<InstanceType<typeof NoteForm> | null>(null);

async function fetchAll() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const [agentsData, propertiesData, familiesData, tenantsData, notesData] = await Promise.all([
      agentApi.getAll(),
      propertyApi.getAll(),
      familyApi.getAll(),
      tenantApi.getAll(),
      noteApi.getAll(),
    ]);
    agents.value = agentsData;
    properties.value = propertiesData;
    families.value = familiesData;
    tenants.value = tenantsData;
    notes.value = notesData;
  } catch (error) {
    errorMessage.value = 'Failed to load data. Please try again.';
    console.error('Failed to fetch data:', error);
  } finally {
    loading.value = false;
  }
}

// Agent handlers
async function handleAgentSubmit(data: CreateAgentInput) {
  errorMessage.value = '';
  try {
    if (editingAgent.value) {
      await agentApi.update(editingAgent.value.id, data);
    } else {
      await agentApi.create(data);
    }
    editingAgent.value = null;
    agentFormRef.value?.resetForm();
    await fetchAll();
  } catch (error) {
    if (error instanceof ApiError && error.data.errors) {
      agentFormRef.value?.setErrors(error.data.errors);
    } else {
      errorMessage.value = 'Failed to save agent.';
    }
  }
}

async function handleAgentDelete(agent: Agent) {
  if (!confirm(`Delete ${agent.firstName} ${agent.lastName}?`)) return;
  try {
    await agentApi.delete(agent.id);
    await fetchAll();
  } catch (error) {
    errorMessage.value = 'Failed to delete agent.';
  }
}

// Property handlers
async function handlePropertySubmit(data: CreatePropertyInput) {
  errorMessage.value = '';
  try {
    if (editingProperty.value) {
      await propertyApi.update(editingProperty.value.id, data);
    } else {
      await propertyApi.create(data);
    }
    editingProperty.value = null;
    propertyFormRef.value?.resetForm();
    await fetchAll();
  } catch (error) {
    if (error instanceof ApiError && error.data.errors) {
      propertyFormRef.value?.setErrors(error.data.errors);
    } else {
      errorMessage.value = 'Failed to save property.';
    }
  }
}

async function handlePropertyDelete(property: Property) {
  if (!confirm(`Delete property at ${property.address}?`)) return;
  try {
    await propertyApi.delete(property.id);
    await fetchAll();
  } catch (error) {
    errorMessage.value = 'Failed to delete property.';
  }
}

// Family handlers
async function handleFamilySubmit(data: CreateFamilyInput) {
  errorMessage.value = '';
  try {
    if (editingFamily.value) {
      await familyApi.update(editingFamily.value.id, data);
    } else {
      await familyApi.create(data);
    }
    editingFamily.value = null;
    familyFormRef.value?.resetForm();
    await fetchAll();
  } catch (error) {
    if (error instanceof ApiError && error.data.errors) {
      familyFormRef.value?.setErrors(error.data.errors);
    } else {
      errorMessage.value = 'Failed to save family.';
    }
  }
}

async function handleFamilyDelete(family: Family) {
  if (!confirm(`Delete ${family.name}?`)) return;
  try {
    await familyApi.delete(family.id);
    await fetchAll();
  } catch (error) {
    errorMessage.value = 'Failed to delete family.';
  }
}

// Tenant handlers
async function handleTenantSubmit(data: CreateTenantInput) {
  errorMessage.value = '';
  try {
    if (editingTenant.value) {
      await tenantApi.update(editingTenant.value.id, data);
    } else {
      await tenantApi.create(data);
    }
    editingTenant.value = null;
    tenantFormRef.value?.resetForm();
    await fetchAll();
  } catch (error) {
    if (error instanceof ApiError && error.data.errors) {
      tenantFormRef.value?.setErrors(error.data.errors);
    } else {
      errorMessage.value = 'Failed to save tenant.';
    }
  }
}

async function handleTenantDelete(tenant: Tenant) {
  if (!confirm(`Delete ${tenant.firstName} ${tenant.lastName}?`)) return;
  try {
    await tenantApi.delete(tenant.id);
    await fetchAll();
  } catch (error) {
    errorMessage.value = 'Failed to delete tenant.';
  }
}

// Note handlers
async function handleNoteSubmit(data: CreateNoteInput) {
  errorMessage.value = '';
  try {
    if (editingNote.value) {
      await noteApi.update(editingNote.value.id, data);
    } else {
      await noteApi.create(data);
    }
    editingNote.value = null;
    noteFormRef.value?.resetForm();
    await fetchAll();
  } catch (error) {
    if (error instanceof ApiError && error.data.errors) {
      noteFormRef.value?.setErrors(error.data.errors);
    } else {
      errorMessage.value = 'Failed to save note.';
    }
  }
}

async function handleNoteDelete(note: Note) {
  if (!confirm(`Delete "${note.title}"?`)) return;
  try {
    await noteApi.delete(note.id);
    await fetchAll();
  } catch (error) {
    errorMessage.value = 'Failed to delete note.';
  }
}

function switchTab(tab: Tab) {
  activeTab.value = tab;
  editingAgent.value = null;
  editingProperty.value = null;
  editingFamily.value = null;
  editingTenant.value = null;
  editingNote.value = null;
}

onMounted(fetchAll);
</script>

<template>
  <div class="app">
    <header>
      <h1>PURE Home River</h1>
      <p>Property Management System</p>
    </header>

    <nav class="tabs">
      <button :class="{ active: activeTab === 'agents' }" @click="switchTab('agents')">Agents</button>
      <button :class="{ active: activeTab === 'properties' }" @click="switchTab('properties')">Properties</button>
      <button :class="{ active: activeTab === 'families' }" @click="switchTab('families')">Families</button>
      <button :class="{ active: activeTab === 'tenants' }" @click="switchTab('tenants')">Tenants</button>
      <button :class="{ active: activeTab === 'notes' }" @click="switchTab('notes')">Notes</button>
    </nav>

    <main>
      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
        <button @click="errorMessage = ''">Dismiss</button>
      </div>

      <!-- Agents Tab -->
      <template v-if="activeTab === 'agents'">
        <AgentForm
          ref="agentFormRef"
          :agent="editingAgent"
          @submit="handleAgentSubmit"
          @cancel="editingAgent = null"
        />
        <AgentList
          :agents="agents"
          :loading="loading"
          @edit="editingAgent = $event"
          @delete="handleAgentDelete"
        />
      </template>

      <!-- Properties Tab -->
      <template v-if="activeTab === 'properties'">
        <PropertyForm
          ref="propertyFormRef"
          :property="editingProperty"
          :agents="agents"
          @submit="handlePropertySubmit"
          @cancel="editingProperty = null"
        />
        <PropertyList
          :properties="properties"
          :agents="agents"
          :loading="loading"
          @edit="editingProperty = $event"
          @delete="handlePropertyDelete"
        />
      </template>

      <!-- Families Tab -->
      <template v-if="activeTab === 'families'">
        <FamilyForm
          ref="familyFormRef"
          :family="editingFamily"
          :properties="properties"
          @submit="handleFamilySubmit"
          @cancel="editingFamily = null"
        />
        <FamilyList
          :families="families"
          :properties="properties"
          :loading="loading"
          @edit="editingFamily = $event"
          @delete="handleFamilyDelete"
        />
      </template>

      <!-- Tenants Tab -->
      <template v-if="activeTab === 'tenants'">
        <TenantForm
          ref="tenantFormRef"
          :tenant="editingTenant"
          :families="families"
          @submit="handleTenantSubmit"
          @cancel="editingTenant = null"
        />
        <TenantList
          :tenants="tenants"
          :families="families"
          :loading="loading"
          @edit="editingTenant = $event"
          @delete="handleTenantDelete"
        />
      </template>

      <!-- Notes Tab -->
      <template v-if="activeTab === 'notes'">
        <NoteForm
          ref="noteFormRef"
          :note="editingNote"
          :agents="agents"
          :properties="properties"
          @submit="handleNoteSubmit"
          @cancel="editingNote = null"
        />
        <NoteList
          :notes="notes"
          :agents="agents"
          :properties="properties"
          :loading="loading"
          @edit="editingNote = $event"
          @delete="handleNoteDelete"
        />
      </template>
    </main>

    <footer>
      <p>PURE Home River Take-Home Exercise</p>
    </footer>
  </div>
</template>

<style>
.app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  text-align: center;
  margin-bottom: 1.5rem;
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

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tabs button {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.tabs button:hover {
  background: #f3f4f6;
}

.tabs button.active {
  background: #3b82f6;
  color: white;
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
