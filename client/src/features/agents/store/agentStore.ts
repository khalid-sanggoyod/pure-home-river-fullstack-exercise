import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { agentApi } from '../api/agentApi';
import { ApiError } from '../../../services/httpClient';
import type { Agent, CreateAgentInput, AgentSearchParams, PaginationInfo } from '../../../types/agent';

export const useAgentStore = defineStore('agents', () => {
  // State
  const agents = ref<Agent[]>([]);
  const pagination = ref<PaginationInfo | undefined>();
  const editingAgent = ref<Agent | null>(null);
  const currentSearchParams = ref<AgentSearchParams>({});

  // Loading states
  const isLoadingAgents = ref(false);
  const isSaving = ref(false);
  const isDeleting = ref(false);

  // Error state
  const errorMessage = ref('');
  const errorCode = ref('');

  // AbortController for canceling requests
  let fetchAbortController: AbortController | null = null;

  // Computed
  const hasAgents = computed(() => agents.value.length > 0);
  const isLoading = computed(() => isLoadingAgents.value || isSaving.value || isDeleting.value);

  // Actions
  function clearError() {
    errorMessage.value = '';
    errorCode.value = '';
  }

  function setError(error: ApiError) {
    errorMessage.value = error.message;
    errorCode.value = error.code;
  }

  function cancelPendingFetch() {
    if (fetchAbortController) {
      fetchAbortController.abort();
      fetchAbortController = null;
    }
  }

  async function fetchAgents(params?: AgentSearchParams) {
    cancelPendingFetch();
    fetchAbortController = new AbortController();

    isLoadingAgents.value = true;
    clearError();

    try {
      const result = await agentApi.getAll(params, fetchAbortController.signal);
      agents.value = result.data;
      pagination.value = result.pagination;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was canceled, don't update state
      }
      if (error instanceof ApiError) {
        setError(error);
      } else {
        errorMessage.value = 'Failed to load agents. Please try again.';
      }
      console.error('Failed to fetch agents:', error);
    } finally {
      isLoadingAgents.value = false;
      fetchAbortController = null;
    }
  }

  async function search(params: AgentSearchParams) {
    currentSearchParams.value = { ...params, page: 1 };
    await fetchAgents(currentSearchParams.value);
  }

  async function goToPage(page: number) {
    currentSearchParams.value = { ...currentSearchParams.value, page };
    await fetchAgents(currentSearchParams.value);
  }

  async function createAgent(data: CreateAgentInput): Promise<boolean> {
    isSaving.value = true;
    clearError();

    try {
      await agentApi.create(data);
      await fetchAgents(currentSearchParams.value);
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error);
      } else {
        errorMessage.value = 'Failed to create agent. Please try again.';
      }
      console.error('Failed to create agent:', error);
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function updateAgent(id: string, data: CreateAgentInput): Promise<boolean> {
    isSaving.value = true;
    clearError();

    try {
      await agentApi.update(id, data);
      editingAgent.value = null;
      await fetchAgents(currentSearchParams.value);
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error);
      } else {
        errorMessage.value = 'Failed to update agent. Please try again.';
      }
      console.error('Failed to update agent:', error);
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function saveAgent(data: CreateAgentInput): Promise<boolean> {
    if (editingAgent.value) {
      return updateAgent(editingAgent.value.id, data);
    }
    return createAgent(data);
  }

  async function deleteAgent(agent: Agent): Promise<boolean> {
    isDeleting.value = true;
    clearError();

    try {
      await agentApi.delete(agent.id);
      await fetchAgents(currentSearchParams.value);
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error);
      } else {
        errorMessage.value = 'Failed to delete agent. Please try again.';
      }
      console.error('Failed to delete agent:', error);
      return false;
    } finally {
      isDeleting.value = false;
    }
  }

  function startEditing(agent: Agent) {
    editingAgent.value = agent;
  }

  function cancelEditing() {
    editingAgent.value = null;
  }

  return {
    // State
    agents,
    pagination,
    editingAgent,
    currentSearchParams,
    isLoadingAgents,
    isSaving,
    isDeleting,
    errorMessage,
    errorCode,

    // Computed
    hasAgents,
    isLoading,

    // Actions
    clearError,
    fetchAgents,
    search,
    goToPage,
    createAgent,
    updateAgent,
    saveAgent,
    deleteAgent,
    startEditing,
    cancelEditing,
  };
});
