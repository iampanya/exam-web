<template>
  <div class="space-y-6 max-w-4xl mx-auto py-8 px-4 sm:px-0">
    
    <!-- Header & Search -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">CISM Exam Practice</h1>
          <p class="text-slate-500 mt-1">ทดสอบและเตรียมความพร้อมด้วยข้อสอบ CISM</p>
        </div>
        
        <div class="w-full sm:w-72 relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search class="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="block w-full rounded-xl border-0 py-2.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
            placeholder="ค้นหาโจทย์, เลขข้อ..." 
          />
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <X class="h-4 w-4 text-slate-400 hover:text-slate-600" />
          </button>
        </div>
      </div>
    </div>

    <!-- Top Pagination -->
    <PaginationBar 
      v-if="filteredQuestions.length > 0"
      :current-page="currentPage" 
      :total-pages="totalPages"
      :start-index="startIndex"
      :end-index="endIndex"
      :total-items="filteredQuestions.length"
      :is-searching="searchQuery.trim().length > 0"
      @update:page="handlePageChange"
    />

    <!-- Questions -->
    <div class="space-y-6">
      <ClientOnly>
        <div v-if="filteredQuestions.length === 0" class="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <SearchX class="mx-auto h-12 w-12 text-slate-300" />
          <h3 class="mt-2 text-sm font-semibold text-slate-900">ไม่พบข้อมูล</h3>
          <p class="mt-1 text-sm text-slate-500">ไม่พบข้อสอบที่ตรงกับการค้นหา: "{{ searchQuery }}"</p>
        </div>

        <QuestionCard 
          v-else
          v-for="question in paginatedQuestions" 
          :key="question.id" 
          :question="question" 
        />
      </ClientOnly>
    </div>

    <!-- Bottom Pagination -->
    <PaginationBar 
      v-if="filteredQuestions.length > 0 && totalPages > 1"
      :current-page="currentPage" 
      :total-pages="totalPages"
      :start-index="startIndex"
      :end-index="endIndex"
      :total-items="filteredQuestions.length"
      :is-searching="searchQuery.trim().length > 0"
      @update:page="handlePageChange"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuestions } from '../composables/useQuestions'
import { Search, SearchX, X } from 'lucide-vue-next'
import PaginationBar from '../components/PaginationBar.vue'

const { allQuestions } = useQuestions()

const currentPage = ref(1)
const searchQuery = ref('')
const itemsPerPage = 5

// Computed Filtered Data
const filteredQuestions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return allQuestions
  
  return allQuestions.filter(q => {
    return q.id.toString().includes(query) ||
           q.question.toLowerCase().includes(query) ||
           (q.questionTh && q.questionTh.toLowerCase().includes(query)) ||
           (q.explanation && q.explanation.toLowerCase().includes(query))
  })
})

// Computed Pagination Data
const totalPages = computed(() => Math.ceil(filteredQuestions.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)

const paginatedQuestions = computed(() => {
  return filteredQuestions.value.slice(startIndex.value, endIndex.value)
})

// Handlers
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Reset page to 1 when search query changes
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>
