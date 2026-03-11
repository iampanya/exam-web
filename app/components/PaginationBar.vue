<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
    
    <!-- Info -->
    <div class="text-sm text-slate-700 text-center sm:text-left">
      แสดง <span class="font-medium">{{ startIndex + 1 }}</span> ถึง <span class="font-medium">{{ Math.min(endIndex, totalItems) }}</span> จากทั้งหมด <span class="font-medium">{{ totalItems }}</span> ข้อ
      <span v-if="isSearching" class="text-indigo-600 ml-1">(ผลการค้นหา)</span>
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
      
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft class="h-4 w-4 sm:mr-1" />
        <span class="hidden sm:inline">ก่อนหน้า</span>
      </button>

      <div class="flex items-center gap-2">
        <span class="text-sm text-slate-600 hidden sm:inline">หน้า</span>
        <select 
          :value="currentPage"
          @change="onSelectChange"
          class="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white cursor-pointer"
        >
          <option v-for="p in totalPages" :key="p" :value="p">
            {{ p }}
          </option>
        </select>
        <span class="text-sm text-slate-600 hidden sm:inline">จาก {{ totalPages }}</span>
      </div>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="hidden sm:inline">ถัดไป</span>
        <ChevronRight class="h-4 w-4 sm:ml-1" />
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  totalItems: number
  isSearching: boolean
}>()

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

const changePage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:page', page)
  }
}

const onSelectChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  changePage(Number(target.value))
}
</script>
