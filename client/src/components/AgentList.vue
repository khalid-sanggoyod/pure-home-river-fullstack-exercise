<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Agent, AgentSearchParams, PaginationInfo } from '../types/agent';

const props = defineProps<{
  agents: Agent[];
  loading: boolean;
  pagination?: PaginationInfo;
}>();

const emit = defineEmits<{
  edit: [agent: Agent];
  delete: [agent: Agent];
  search: [params: AgentSearchParams];
  pageChange: [page: number];
}>();

const searchText = ref('');
const createdFrom = ref('');
const createdTo = ref('');
const showFilters = ref(false);

let debounceTimer: ReturnType<typeof setTimeout>;

function emitSearch() {
  emit('search', {
    search: searchText.value || undefined,
    createdFrom: createdFrom.value || undefined,
    createdTo: createdTo.value || undefined,
  });
}

function handleSearchInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(emitSearch, 300);
}

function clearFilters() {
  searchText.value = '';
  createdFrom.value = '';
  createdTo.value = '';
  emitSearch();
}

function goToPage(page: number) {
  if (props.pagination && page >= 1 && page <= props.pagination.totalPages) {
    emit('pageChange', page);
  }
}

watch([createdFrom, createdTo], emitSearch);

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
    <div class="list-header">
      <h2>Property Agents</h2>
      <button class="btn btn-filter" @click="showFilters = !showFilters">
        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="search-section">
      <div class="search-box">
        <input
          v-model="searchText"
          type="text"
          placeholder="Search by name, email, or phone..."
          @input="handleSearchInput"
        />
        <button v-if="searchText" class="clear-btn" @click="searchText = ''; emitSearch()">x</button>
      </div>

      <div v-if="showFilters" class="filters">
        <div class="filter-row">
          <div class="filter-group">
            <label>Created From</label>
            <input v-model="createdFrom" type="date" />
          </div>
          <div class="filter-group">
            <label>Created To</label>
            <input v-model="createdTo" type="date" />
          </div>
        </div>
        <button class="btn btn-clear" @click="clearFilters">Clear All Filters</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading agents...</div>

    <div v-else-if="agents.length === 0" class="empty-state">
      <p>No agents found.</p>
    </div>

    <template v-else>
      <table>
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

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="pagination">
        <button
          class="btn btn-page"
          :disabled="pagination.page <= 1"
          @click="goToPage(pagination.page - 1)"
        >
          Previous
        </button>

        <div class="page-numbers">
          <button
            v-for="pageNum in pagination.totalPages"
            :key="pageNum"
            class="btn btn-page"
            :class="{ active: pageNum === pagination.page }"
            @click="goToPage(pageNum)"
          >
            {{ pageNum }}
          </button>
        </div>

        <button
          class="btn btn-page"
          :disabled="pagination.page >= pagination.totalPages"
          @click="goToPage(pagination.page + 1)"
        >
          Next
        </button>
      </div>

      <div class="results-count">
        Showing {{ agents.length }} of {{ pagination?.total || agents.length }} agent(s)
        <span v-if="pagination && pagination.totalPages > 1">
          (Page {{ pagination.page }} of {{ pagination.totalPages }})
        </span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.agent-list {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h2 {
  margin: 0;
  color: #2c3e50;
}

.search-section {
  margin-bottom: 1rem;
}

.search-box {
  position: relative;
  margin-bottom: 0.75rem;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.search-box input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1;
}

.filters {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.filter-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.filter-group {
  flex: 1;
  min-width: 150px;
}

.filter-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.filter-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.btn-filter {
  background: #6366f1;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-filter:hover {
  background: #4f46e5;
}

.btn-clear {
  background: #6b7280;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-clear:hover {
  background: #4b5563;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.btn-page {
  background: #f3f4f6;
  color: #374151;
  padding: 0.5rem 0.75rem;
  min-width: 40px;
}

.btn-page:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-page.active {
  background: #3b82f6;
  color: white;
}

.results-count {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}
</style>
