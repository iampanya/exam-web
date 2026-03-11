<template>
  <div class="space-y-8 max-w-4xl mx-auto py-8">
    <div class="space-y-6">
      <ClientOnly>
        <QuestionCard 
          v-for="question in paginatedQuestions" 
          :key="question.id" 
          :question="question" 
        />
      </ClientOnly>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-2xl shadow-sm border border-slate-200">
      
      <!-- Mobile Pagination Controls -->
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ก่อนหน้า
        </button>
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ถัดไป
        </button>
      </div>

      <!-- Desktop Pagination Controls -->
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-slate-700">
            แสดง <span class="font-medium">{{ startIndex + 1 }}</span> ถึง <span class="font-medium">{{ Math.min(endIndex, allQuestions.length) }}</span> จากทั้งหมด <span class="font-medium">{{ allQuestions.length }}</span> ข้อ
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">ก่อนหน้า</span>
              <ChevronLeft class="h-5 w-5" aria-hidden="true" />
            </button>

            <template v-for="pageNumber in totalPages" :key="pageNumber">
              <!-- First, Last, Current, +/- 1 -->
              <button
                v-if="pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)"
                @click="handlePageChange(pageNumber)"
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0"
                :class="[
                  currentPage === pageNumber
                    ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50'
                ]"
              >
                {{ pageNumber }}
              </button>
              
              <!-- Ellipsis (Before) -->
              <span
                v-else-if="pageNumber === currentPage - 2 || pageNumber === currentPage + 2"
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300"
              >
                ...
              </span>
            </template>

            <button
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">ถัดไป</span>
              <ChevronRight class="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuestions } from '../composables/useQuestions'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { getPaginatedQuestions, totalPages, allQuestions } = useQuestions()

const currentPage = ref(1)

const itemsPerPage = 5
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)

const paginatedQuestions = computed(() => {
  return getPaginatedQuestions(currentPage.value)
})

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>
