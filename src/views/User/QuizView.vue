<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizzesStore } from '@/stores/quizzes'
import { useUserStore } from '@/stores/user'
import QuizRunner from '@/components/quiz/QuizRunner.vue'

const route = useRoute()
const router = useRouter()
const quizzesStore = useQuizzesStore()
const userStore = useUserStore()

const courseId = computed(() => route.params.id as string)
const quizId = computed(() => route.params.quizId as (string | undefined))

const userId = computed(() => {
  if (!userStore.id) userStore.hydrate()
  const uid = userStore.id
  return typeof uid === 'number' ? String(uid) : (uid || '')
})

onMounted(async () => {
  if (!courseId.value) return
  quizzesStore.clear()
  console.log('[QuizView] init', { courseId: courseId.value, quizId: quizId.value })
  if (quizId.value) {
    await quizzesStore.loadById(courseId.value, quizId.value, { userId: userId.value })
    console.log('[QuizView] loadById done', { hasQuiz: !!quizzesStore.currentQuiz, error: quizzesStore.error })
  } else {
    await quizzesStore.loadByCourse(courseId.value)
    const first = quizzesStore.quizzes[0]
    if (first?._id) {
      await quizzesStore.loadById(courseId.value, first._id, { userId: userId.value })
      console.log('[QuizView] load first quiz done', { quizId: first?._id, hasQuiz: !!quizzesStore.currentQuiz, error: quizzesStore.error })
    }
  }
  window.addEventListener('auth:token-expired', () => console.warn('[QuizView] token expired'))
})

function goBack() { router.back() }

function onSubmitted() {
  const qid = quizId.value || (quizzesStore.currentQuiz?._id || '')
  if (!courseId.value || !qid) return
  console.log('[QuizView] onSubmitted → navigate', { courseId: courseId.value, quizId: qid })
  router.push(`/courses/${courseId.value}/quizzes/${qid}/result`)
}
</script>

<template>
  <div class="quiz-view">
    <div class="container">
      <div class="head">
        <button class="back" type="button" @click="goBack"><i class="fa-solid fa-arrow-left" /> Volver</button>
        <h2 class="title"><i class="fa-solid fa-clipboard-check" /> Quiz</h2>
      </div>

      <div v-if="quizzesStore.loading" class="loading"><i class="fa-solid fa-spinner fa-spin" /> Cargando quiz...</div>
      <div v-else>
        <div v-if="quizzesStore.error" class="error"><i class="fa-solid fa-triangle-exclamation" /> {{ quizzesStore.error }}</div>
        <div v-if="!quizzesStore.currentQuiz" class="empty"><i class="fa-regular fa-face-meh" /> No hay quiz disponible para este curso.</div>
        <QuizRunner v-else :course-id="courseId" :user-id="userId" :quiz="quizzesStore.currentQuiz" @submitted="onSubmitted" />
      </div>
    </div>
  </div>
  </template>

<style lang="scss" scoped>
.quiz-view { width: 100%; padding: 24px 16px; background: var(--bg); color: var(--text); }
.container { max-width: 100%; margin: 0 auto; display: grid; gap: 16px; }
.head { display: grid; gap: 8px; }
.title { color: var(--text); margin: 0; font-size: 22px; display: inline-flex; align-items: center; gap: 10px; }
.back { background: none; border: none; color: var(--accent); display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; }
.loading,
.error,
.empty { display: inline-flex; align-items: center; gap: 10px; color: color-mix(in oklab, var(--text), transparent 40%); background: color-mix(in oklab, var(--bg), var(--text) 6%); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; }
.error { color: $alert-error; background: $alert-error-bg; border-color: rgba($alert-error, 0.3); }
@media (min-width: 960px) { .container { max-width: 980px; } }
</style>
