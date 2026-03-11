<template>
  <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
    <div class="p-6 sm:p-8">
      <div class="flex items-start justify-between gap-4 mb-6">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">
              {{ question.id }}
            </span>
            <button
              @click="showTranslation = !showTranslation"
              class="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 px-3 py-1 rounded-full transition-colors"
            >
              <Languages class="w-4 h-4" />
              {{ showTranslation ? "ซ่อนคำแปล" : "แสดงคำแปล" }}
            </button>
            <a
              v-if="question.referenceLink"
              :href="question.referenceLink"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 font-medium bg-slate-100 px-3 py-1 rounded-full transition-colors ml-auto"
            >
              <ExternalLink class="w-4 h-4" />
              อ้างอิง
            </a>
          </div>
          <h3 class="text-lg font-medium text-slate-900 leading-relaxed">
            {{ question.question }}
          </h3>
          <Transition name="expand">
            <p
              v-if="showTranslation"
              class="text-slate-600 font-medium mt-3"
            >
              {{ question.questionTh }}
            </p>
          </Transition>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="option in question.options" :key="option.id"
          class="p-4 rounded-xl border transition-all"
          :class="[
            showAnswer
              ? option.id === question.correctOptionId
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-slate-50 border-slate-200 opacity-60'
              : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
          ]"
        >
          <div class="flex items-start gap-3">
            <span
              class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mt-0.5"
              :class="[
                showAnswer
                  ? option.id === question.correctOptionId
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                  : 'bg-slate-100 text-slate-600'
              ]"
            >
              {{ option.id }}
            </span>
            <div class="flex-1">
              <p class="text-base" :class="showAnswer && option.id === question.correctOptionId ? 'text-emerald-900 font-medium' : 'text-slate-700'">
                {{ option.text }}
              </p>
              <Transition name="expand">
                <p
                  v-if="showTranslation"
                  class="text-sm mt-2"
                  :class="showAnswer && option.id === question.correctOptionId ? 'text-emerald-700' : 'text-slate-500'"
                >
                  {{ option.textTh }}
                </p>
              </Transition>

              <Transition name="expand">
                <div v-if="showAnswer && option.analysis" class="mt-3">
                  <div class="p-3 rounded-lg text-sm flex items-start gap-2" :class="option.id === question.correctOptionId ? 'bg-emerald-100/50 text-emerald-800' : 'bg-slate-100 text-slate-600'">
                    <CheckCircle2 v-if="option.id === question.correctOptionId" class="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
                    <XCircle v-else class="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                    <p>{{ option.analysis }}</p>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <Transition name="expand">
        <div v-if="showAnswer" class="mt-6">
          <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
            <h4 class="flex items-center gap-2 text-indigo-900 font-semibold mb-2">
              <BookOpen class="w-4 h-4" />
              คำอธิบายเพิ่มเติม
            </h4>
            <p class="text-indigo-800/80 text-sm leading-relaxed">
              {{ question.explanation }}
            </p>
            <div v-if="question.studyTechnique" class="mt-4 pt-4 border-t border-indigo-100">
              <h4 class="flex items-center gap-2 text-indigo-900 font-semibold mb-2">
                <BookOpen class="w-4 h-4" />
                เทคนิคการจำ
              </h4>
              <p class="text-indigo-800/80 text-sm leading-relaxed">
                {{ question.studyTechnique }}
              </p>
            </div>
          </div>
        </div>
      </Transition>

      <div class="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          @click="showAnswer = !showAnswer"
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all"
          :class="showAnswer ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow'"
        >
          <ChevronUp v-if="showAnswer" class="w-4 h-4" />
          <ChevronDown v-else class="w-4 h-4" />
          {{ showAnswer ? 'ซ่อนเฉลย' : 'ดูเฉลยและคำอธิบาย' }}
        </button>

        <Transition name="fade-slide">
          <div
            v-if="showAnswer"
            class="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl"
          >
            <BookOpen class="w-4 h-4" />
            <span class="text-sm font-medium">คำตอบที่ถูกต้อง: {{ question.correctOptionId }}</span>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Question } from '../composables/useQuestions'
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Languages, BookOpen, ExternalLink } from 'lucide-vue-next'

const props = defineProps<{
  question: Question
}>()

const showAnswer = ref(false)
const showTranslation = ref(false)
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
