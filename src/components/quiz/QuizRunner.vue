<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuizzesStore } from '@/stores/quizzes'
import type { QuizPublic } from '@/services/quizzes.service'

const props = defineProps({
  courseId: { type: [String, Number], required: true },
  userId: { type: String, required: true },
  quiz: { type: Object as () => QuizPublic, required: true },
})

const emit = defineEmits<{
  (e: 'submitted', payload: { score: number; passed: boolean }): void
}>()

const store = useQuizzesStore()
const current = ref(0)
const answers = ref<number[]>(Array.from({ length: props.quiz.questions.length }, () => -1))
const reviewMode = ref(false)
const isComplete = computed(() => answers.value.every((a) => a >= 0))

watch(() => props.quiz, () => {
  current.value = 0
  answers.value = Array.from({ length: props.quiz.questions.length }, () => -1)
  reviewMode.value = false
})

function selectOption(qIndex: number, optIndex: number) {
  answers.value[qIndex] = optIndex
}

function prev() {
  if (reviewMode.value) return
  current.value = Math.max(0, current.value - 1)
}

function next() {
  if (reviewMode.value) return
  current.value = Math.min(props.quiz.questions.length - 1, current.value + 1)
}

function goTo(index: number) {
  reviewMode.value = false
  current.value = Math.min(Math.max(index, 0), props.quiz.questions.length - 1)
}

function openReview() {
  reviewMode.value = true
}

function selectedAnswer(idx: number): string | null {
  const s = answers.value[idx]
  if (typeof s === 'number' && s >= 0) {
    const opts = props.quiz.questions[idx]?.options || []
    const val = opts[s]
    return typeof val === 'string' ? val : null
  }
  return null
}

async function submit() {
  if (!isComplete.value) return
  console.log('[QuizRunner] submit start', { courseId: props.courseId, quizId: props.quiz._id, userId: props.userId, answers: answers.value })
  await store.submit(props.courseId, props.quiz._id, props.userId, answers.value)
  const res = store.lastResult
  console.log('[QuizRunner] submit result', { res, error: store.error, retryAfterMs: store.retryAfterMs, retryAvailableAt: store.retryAvailableAt, approvedAlready: store.approvedAlready })
  if (res) {
    console.log('[QuizRunner] emit submitted (result available)')
    emit('submitted', { score: res.score, passed: res.passed })
    return
  }
  if (store.approvedAlready || store.retryAfterMs || store.error) {
    console.log('[QuizRunner] emit submitted (fallback)')
    emit('submitted', { score: 0, passed: false })
  }
}
</script>

<template>
  <div class="quiz-runner">
    <div class="head">
      <h3><i class="fa-solid fa-list-check" /> {{ quiz.title }}</h3>
      <p v-if="quiz.description" class="desc">{{ quiz.description }}</p>
    </div>

    <div v-if="!reviewMode" class="question-card">
      <div class="steps">Pregunta {{ current + 1 }} de {{ quiz.questions.length }}</div>
      <div class="prompt">{{ quiz.questions[current]?.prompt || '' }}</div>

      <div class="options">
        <button
          v-for="(opt, i) in (quiz.questions[current]?.options || [])"
          :key="i"
          type="button"
          class="option"
          :class="{ selected: answers[current] === i }"
          @click="selectOption(current, i)"
        >
          {{ opt }}
        </button>
      </div>

      <div class="nav">
        <button type="button" class="btn secondary" :disabled="current === 0" @click="prev">
          <i class="fa-solid fa-chevron-left" /> Anterior
        </button>
        <div class="spacer" />
        <button
          v-if="current < quiz.questions.length - 1"
          type="button"
          class="btn primary"
          @click="next"
        >
          Siguiente <i class="fa-solid fa-chevron-right" />
        </button>
        <button
          v-else
          type="button"
          class="btn accent"
          :disabled="!isComplete"
          @click="openReview"
        >
          Revisar respuestas
        </button>
      </div>
    </div>

    <div v-else class="review">
      <h4><i class="fa-solid fa-clipboard-check" /> Revisión</h4>
      <ul class="review-list">
        <li v-for="(q, idx) in quiz.questions" :key="idx" class="review-item">
          <button type="button" class="qlink" @click="goTo(idx)">
            <span class="qindex">{{ idx + 1 }}.</span>
            <span class="qprompt">{{ q.prompt }}</span>
          </button>
          <div class="answer">
            <span v-if="selectedAnswer(idx)" class="answer-text">{{ selectedAnswer(idx) }}</span>
            <span v-else class="answer-missing">Sin respuesta</span>
          </div>
        </li>
      </ul>

      <div class="final-actions">
        <button type="button" class="btn secondary" @click="reviewMode = false">
          Cambiar respuestas
        </button>
        <div class="spacer" />
        <button type="button" class="btn success" :disabled="!isComplete || store.submitting" @click="submit">
          Enviar a calificación
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.quiz-runner {
  display: grid;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-card);
}

.head {
  display: grid;
  gap: 6px;
}

.head h3 {
  margin: 0;
  font-size: 20px;
  color: var(--text-main);
}

.desc {
  margin: 0;
  color: var(--text-sec);
  font-size: 14px;
}


.question-card {
  display: grid;
  gap: 12px;
}

.steps {
  font-size: 12px;
  color: var(--text-sec);
  opacity: 0.7;
}

.prompt {
  font-size: 16px;
  color: var(--text-main);
}

.options {
  display: grid;
  gap: 8px;
}

.option {
  text-align: left;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-main);
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--accent);
  }
}

.option.selected {
  border-color: var(--accent);
  background: rgba(134, 239, 172, 0.1);
  color: var(--text-main);
  font-weight: 700;
}

.nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spacer {
  flex: 1;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.btn.primary {
  background: var(--accent);
  color: #111613;
}

.btn.secondary {
  background: var(--bg-card);
  color: var(--text-main);
  border: 1px solid var(--border);

  &:hover {
    background: var(--bg-main);
  }
}

.btn.accent {
  background: #da4167;
  color: #ffffff;
}

.btn.success {
  background: var(--accent);
  color: #111613;
}

.review {
  display: grid;
  gap: 12px;
}

.review-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.review-item {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-main);
}

.qlink {
  background: none;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
  cursor: pointer;
  text-align: left;
}

.qindex {
  font-weight: 600;
  color: var(--accent);
}

.qprompt {
  opacity: 0.8;
}

.answer {
  font-size: 14px;
}

.answer-text {
  color: var(--text-main);
  font-weight: 600;
}

.answer-missing {
  color: #ef4444;
}

.final-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}


@media (min-width: 960px) {
  .quiz-runner {
    padding: 20px;
  }
}
</style>
