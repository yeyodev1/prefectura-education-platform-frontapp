<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import UpgradeBanner from '@/components/UpgradeBanner.vue'
import CourseCard from '@/components/CourseCard.vue'
import { makePlaceholders } from '@/mocks/courses.mock'

const store = useCoursesStore()

function isActive(course: any) {
  return !!course?.is_published
}

const tick = ref<number>(Date.now())
const deadlines = ref<number[]>([])

function endOfNextSunday(): Date {
  const now = new Date()
  const day = now.getDay()
  const daysUntilSunday = (7 - day)
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 23, 59, 59)
}

function cycleDeadline(weeks: number): number {
  const base = endOfNextSunday()
  base.setDate(base.getDate() + 7 * (weeks - 1))
  return base.getTime()
}

function initDeadlines(count: number) {
  const pattern = [1, 2, 4] as const
  deadlines.value = Array.from({ length: count }, (_, i) => {
    const idx = (i % pattern.length) as 0 | 1 | 2
    return cycleDeadline(pattern[idx])
  })
}

function resetAllToOneWeek() {
  const t = cycleDeadline(1)
  deadlines.value = deadlines.value.map(() => t)
}

onMounted(() => {
  store.fetchAll()
})

const displayCourses = computed(() => {
  const list = Array.isArray(store.courses) ? store.courses : []
  const need = Math.max(0, 12 - list.length)
  const placeholders = makePlaceholders(need)
  return [...list, ...placeholders]
})

const modalOpen = ref(false)
const modalTitle = ref('')
function openUpcoming(c: any) { modalTitle.value = String(c?.name || c?.title || 'Próximamente'); modalOpen.value = true }
function closeModal() { modalOpen.value = false }

watch(displayCourses, (list) => {
  initDeadlines(Array.isArray(list) ? list.length : 0)
}, { immediate: true })

window.setInterval(() => {
  tick.value = Date.now()
  if (deadlines.value.some(ms => ms - tick.value <= 0)) {
    resetAllToOneWeek()
  }
}, 1000)
</script>

<template>
  <div class="all-courses">
    <div class="container">
      <h2 class="title"><i class="fa-solid fa-list" /> Todos los cursos</h2>
      <p class="subtitle">Explora y descubre todos nuestros cursos disponibles.</p>
      <div class="upcoming-notice">
        <i class="fa-regular fa-bell" /> Pronto estarán disponibles más cursos durante este mes.
      </div>
      
      <!-- CTA para usuarios Free -->
      <UpgradeBanner />

      <div v-if="store.loading" class="loading">
        <i class="fa-solid fa-spinner fa-spin" /> Cargando cursos...
      </div>

      <div v-else-if="store.error" class="error">
        <i class="fa-solid fa-triangle-exclamation" /> {{ store.error }}
      </div>

      <div v-else class="grid">
        <div v-if="store.courses.length === 0" class="empty">
          <i class="fa-regular fa-face-smile" />
          <span>No hay cursos disponibles por ahora.</span>
        </div>
        <div v-else class="cards">
          <CourseCard 
            v-for="(c, i) in displayCourses" 
            :key="c._id || c.id" 
            :course="c" 
            :disabled="!isActive(c)" 
            :isUpcoming="!isActive(c)" 
            :index="i" 
            :countdownTo="deadlines[i]" 
            @placeholder-click="openUpcoming(c)"
          />
        </div>
        <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal">
            <h3 class="modal-title"><i class="fa-solid fa-hourglass-half" /> {{ modalTitle }}</h3>
            <p class="modal-desc">Este curso estará disponible pronto. Gracias por tu interés.</p>
            <button class="modal-btn" type="button" @click="closeModal">Entendido</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.all-courses {
  width: 100%;
  padding: 24px 16px;
  background: var(--bg-main);
  color: var(--text-main);
}


.container {
  margin: 0 auto;
  display: grid;
  gap: 12px;
}

.title {
  color: var(--text);
  font-size: 24px;
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.subtitle {
  color: color-mix(in oklab, var(--text), transparent 40%);
  margin: 0;
}

.upcoming-notice {
  background: color-mix(in oklab, var(--accent), transparent 92%);
  color: var(--accent);
  border: 1px dashed var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.loading,
.error,
.empty {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-sec);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
}

.error {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}


.grid {
  width: 100%;
}

.cards {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 720px) {
  .cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1080px) {
  .cards {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

// Grid and Card Styles are now handled by CourseCard component

.cta.disabled {
  background: var(--bg-card);
  color: var(--text-sec);
  border: 1px solid var(--border);
}

.card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}


.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  width: min(480px, 92vw);
  display: grid;
  gap: 12px;
  color: var(--text-main);
  box-shadow: var(--shadow);
}

.modal-title {
  margin: 0;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
}

.modal-desc {
  margin: 0;
  color: var(--text-sec);
}

.modal-btn {
  background: var(--accent);
  color: #111613;
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  justify-self: end;
}
</style>
