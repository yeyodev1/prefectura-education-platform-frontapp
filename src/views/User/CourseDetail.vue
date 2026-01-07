<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { useUserStore } from '@/stores/user'
import PlaylistSidebar from '@/components/lecture/PlaylistSidebar.vue'

const route = useRoute()
const router = useRouter()
const store = useCoursesStore()
const userStore = useUserStore()

const id = computed(() => route.params.id as string)

const userId = computed(() => {
  if (!userStore.id) userStore.hydrate()
  const uid = userStore.id
  return typeof uid === 'number' ? String(uid) : (uid || '')
})

const progressPercent = computed(() => Number(store.progress?.percent || 0))
const progressText = computed(() => {
  const c = Number(store.progress?.completed || 0)
  const t = Number(store.progress?.total || 0)
  return `${c}/${t}`
})


function sanitizeUrl(url?: string) {
  return (url || '').toString().replace(/`/g, '').trim()
}

function coverOf(course: any) {
  return sanitizeUrl(course?.image_url) || sanitizeUrl(course?.coverUrl) || '/src/assets/logos/logo-prefectura.png'
}

function flattenLectures(course: any): any[] {
  const sections = Array.isArray(course?.lecture_sections) ? course.lecture_sections : []
  const list: any[] = []
  for (const s of sections) {
    const lectures = Array.isArray(s?.lectures) ? s.lectures : []
    for (const l of lectures) list.push(l)
  }
  return list.sort((a, b) => Number(a?.position || 0) - Number(b?.position || 0))
}

const firstLectureId = computed(() => {
  const course = store.currentCourse
  if (!course) return null as any
  const all = flattenLectures(course)
  return all[0]?.id || null
})

onMounted(async () => {
  if (id.value) {
    try {
      await store.fetchById(id.value)
      if (userId.value) {
        await store.fetchProgress(id.value, userId.value)
      }
    } catch (e) {
      console.error('Error loading course details', e)
    }
  }
})



function openLecture(lectureId: number | string) {
  if (!id.value) return
  router.push(`/courses/${id.value}/lectures/${lectureId}`)
}

function goBack() { router.back() }

async function startQuiz() {
  if (!id.value) return
  router.push(`/courses/${id.value}/quiz`)
}
</script>

<template>
  <div class="course-detail">
    <div class="container">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
        <div class="progress-meta">Progreso: {{ progressPercent }}% · {{ progressText }}</div>
      </div>
      <div v-if="store.loading" class="loading">
        <i class="fa-solid fa-spinner fa-spin" /> Cargando curso...
      </div>

      <div v-else-if="store.errorCode === 404 || store.error === 'Not Found'" class="no-access">
        <div class="no-access-icon">
          <i class="fa-solid fa-lock" />
        </div>
        <h3>Whoops, no tienes acceso aquí</h3>
        <p>Pero puedes acceder a la plataforma y desbloquear todo el contenido.</p>
        <button class="cta-start" type="button" @click="router.push('/checkout')">
          <i class="fa-solid fa-crown" />
          <span>Ir al Checkout</span>
        </button>
      </div>

      <div v-else-if="store.error" class="error">
        <i class="fa-solid fa-triangle-exclamation" /> {{ store.error }}
      </div>

      <div v-else-if="!store.currentCourse" class="empty">
        <i class="fa-regular fa-face-meh" /> No se encontró el curso.
      </div>

      <div v-else>
        <div class="header">
          <button class="back" type="button" @click="goBack"><i class="fa-solid fa-arrow-left" /> Volver</button>
          <h2 class="title"><i class="fa-solid fa-graduation-cap" /> {{ store.currentCourse.name || store.currentCourse.title }}</h2>
        </div>
        <div class="content">
          <div class="left">
            <div class="cover">
              <img :src="coverOf(store.currentCourse)" alt="course cover" />
            </div>
            <div class="info">
              <p class="subtitle">{{ store.currentCourse.heading || store.currentCourse.shortDescription || store.currentCourse.description }}</p>
              <div class="author" v-if="store.currentCourse.author_bio">
                <span class="author-name"><i class="fa-solid fa-user" /> {{ store.currentCourse.author_bio.name }}</span>
              </div>
              <div class="actions">
                <button class="cta-start" type="button" :disabled="!firstLectureId" @click="firstLectureId && openLecture(firstLectureId)">
                  <i class="fa-solid fa-play" /> 
                  <span>Iniciar clase</span>
                </button>
                <button class="cta-quiz" type="button" @click="startQuiz">
                  <i class="fa-solid fa-list-check" /> 
                  <span>Iniciar quiz</span>
                </button>
              </div>
            </div>
          </div>
          <div class="right" v-if="Array.isArray(store.currentCourse.lecture_sections) && store.currentCourse.lecture_sections.length">
            <PlaylistSidebar :sections="store.currentCourse.lecture_sections" :course-id="String(id)" :completed-lecture-ids="store.progress.completedLectureIds" />
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.course-detail {
  width: 100%;
  padding: 24px 16px;
  background: var(--bg-main);
  color: var(--text-main);
}

.container {
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 16px;
}

.progress {
  display: grid;
  gap: 6px;
}

.progress-bar {
  height: 8px;
  background: var(--accent);
  width: 0%;
  transition: width 0.3s ease;
  border-radius: 999px;
}

.progress-meta {
  color: var(--text-sec);
  font-size: 12px;
}


.no-access {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px;
  background: color-mix(in oklab, var(--bg), var(--text) 2%);
  border: 1px dashed var(--border);
  border-radius: 24px;
  gap: 16px;
  margin-top: 24px;

  .no-access-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, color-mix(in oklab, var(--accent), transparent 80%) 0%, color-mix(in oklab, var(--accent), transparent 90%) 100%);
    color: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin-bottom: 8px;
    box-shadow: 0 10px 20px -5px color-mix(in oklab, var(--accent), transparent 85%);
  }

  h3 {
    font-size: 24px;
    margin: 0;
    color: var(--text);
    font-weight: 700;
  }

  p {
    margin: 0;
    color: color-mix(in oklab, var(--text), transparent 40%);
    max-width: 400px;
    line-height: 1.6;
    font-size: 16px;
  }

  .cta-start {
    margin-top: 8px;
  }
}

.header {
  display: grid;
  gap: 8px;
}

.back {
  background: none;
  border: none;
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.loading,
.error,
.empty {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: color-mix(in oklab, var(--text), transparent 40%);
  background: color-mix(in oklab, var(--bg), var(--text) 6%);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
}

.error {
  color: $alert-error;
  background: $alert-error-bg;
  border-color: rgba($alert-error, 0.3);
}

.content {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 960px) {
  .content {
    grid-template-columns: 1.4fr 1fr;
  }
}

@media (min-width: 1280px) {
  .content {
    grid-template-columns: 1.8fr 1fr;
  }
}

.left {
  display: grid;
  gap: 12px;
}

.right {
  display: grid;
  gap: 12px;
}

.cover img {
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  display: block;
  box-shadow: var(--shadow);
}


.info {
  display: grid;
  gap: 8px;
}

.title {
  color: var(--text);
  margin: 0;
  font-size: 26px;
  padding: 24px 0;
}

.subtitle {
  color: color-mix(in oklab, var(--text), transparent 40%);
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
}

.author {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: color-mix(in oklab, var(--text), transparent 60%);
  font-size: 14px;
}

.author-name {
  color: var(--accent);
}

.actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cta-start,
.cta-quiz {
  border: none;
  border-radius: 999px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.cta-start {
  background: var(--accent);
  color: #111613;
  box-shadow: 0 4px 12px rgba(134, 239, 172, 0.3);

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: var(--bg-card);
    color: var(--text-sec);
    border: 1px solid var(--border);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
}

.cta-quiz {
  background: transparent;
  color: var(--text-main);
  border: 1px solid var(--border);

  &:hover {
    background: rgba(134, 239, 172, 0.05);
    border-color: var(--accent);
    color: var(--accent);
  }
}


.quiz-section {
  margin-top: 16px;
}
</style>
