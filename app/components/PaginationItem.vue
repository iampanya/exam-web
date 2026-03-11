<template>
  <div class="flex justify-center items-center gap-2 my-8">
    <button 
      class="btn btn-outline" 
      :disabled="currentPage === 1"
      @click="$emit('page-change', currentPage - 1)"
      :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
    >
      Previous
    </button>
    
    <div class="flex gap-1" v-if="totalPages <= 7">
      <button 
        v-for="page in totalPages" 
        :key="page"
        class="btn w-10 h-10 p-0 rounded-full"
        :class="currentPage === page ? 'btn-primary' : 'btn-ghost'"
        @click="$emit('page-change', page)"
      >
        {{ page }}
      </button>
    </div>
    
    <div class="flex gap-1 items-center" v-else>
      <button class="btn w-10 h-10 p-0 rounded-full" :class="currentPage === 1 ? 'btn-primary' : 'btn-ghost'" @click="$emit('page-change', 1)">1</button>
      <span v-if="currentPage > 3" class="text-muted px-1">...</span>
      
      <template v-for="page in middlePages" :key="page">
        <button 
          class="btn w-10 h-10 p-0 rounded-full"
          :class="currentPage === page ? 'btn-primary' : 'btn-ghost'"
          @click="$emit('page-change', page)"
        >
          {{ page }}
        </button>
      </template>
      
      <span v-if="currentPage < totalPages - 2" class="text-muted px-1">...</span>
      <button class="btn w-10 h-10 p-0 rounded-full" :class="currentPage === totalPages ? 'btn-primary' : 'btn-ghost'" @click="$emit('page-change', totalPages)">{{ totalPages }}</button>
    </div>

    <button 
      class="btn btn-outline" 
      :disabled="currentPage === totalPages"
      @click="$emit('page-change', currentPage + 1)"
      :class="{'opacity-50 cursor-not-allowed': currentPage === totalPages}"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

defineEmits<{
  (e: 'page-change', page: number): void
}>()

const middlePages = computed(() => {
  const pages = []
  let start = Math.max(2, props.currentPage - 1)
  let end = Math.min(props.totalPages - 1, props.currentPage + 1)
  
  if (props.currentPage <= 3) {
    end = 4
  }
  if (props.currentPage >= props.totalPages - 2) {
    start = props.totalPages - 3
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>
