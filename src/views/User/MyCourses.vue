<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import { useUserStore } from '@/stores/user'
import { RouterLink } from 'vue-router'
import CourseCard from '@/components/CourseCard.vue'

const store = useCoursesStore()
const userStore = useUserStore()

/* helpers no longer needed here */

/* presentation handled by CourseCard */

const userId = computed(() => {
  if (!userStore.id) userStore.hydrate()
  return (userStore.id as any) || ''
})

const query = ref('')

const sourceCourses = computed(() => {
  const base = store.enrolledCourses.length ? store.enrolledCourses : store.courses
  return base.filter((c: any) => !c?.is_published)
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = sourceCourses.value
  if (!q) return list
  return list.filter((c: any) => {
    const text = [c?.name, c?.title, c?.heading, c?.description, c?.shortDescription].join(' ').toLowerCase()
    return text.includes(q)
  })
})

const liveList = computed(() => Array.isArray(filtered.value) ? filtered.value : [])

onMounted(() => {
  if (userId.value) {
    store.fetchEnrolled(userId.value)
  } else {
    store.fetchAll({ scope: 'mine' })
  }
})
</script>

<template>
  <div class="my-courses">
    <div class="container">
      <div class="header">
        <h2 class="title"><i class="fa-solid fa-book" /> Mis cursos</h2>
      <div class="actions">
        <input v-model="query" type="search" placeholder="Buscar cursos" class="search" />
      </div>
      </div>
      <p class="subtitle">Explora y continúa tu aprendizaje. Usa el buscador para encontrar cursos.</p>

      <div v-if="store.loading" class="loading">
        <i class="fa-solid fa-spinner fa-spin" /> Cargando cursos...
      </div>

      <div v-else-if="store.error" class="error">
        <i class="fa-solid fa-triangle-exclamation" /> {{ store.error }}
      </div>

      <div v-else>
        <div v-if="liveList.length === 0" class="empty-state">
          <div class="empty-content">
            <i class="fa-regular fa-face-smile" />
            <h3>No tienes cursos asignados</h3>
            <p>Explora nuestro catálogo y comienza a aprender hoy mismo.</p>
            <RouterLink to="/courses/all" class="explore-btn">
              Explorar cursos
            </RouterLink>
          </div>
        </div>
        <div v-else class="cards">
          <CourseCard
            v-for="c in liveList"
            :key="c._id || c.id"
            :course="c"
            :to="`/courses/${c._id || c.id}`"
            :show-published-badge="true"
            :show-classes-count="true"
            :disabled="false"
            :isUpcoming="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-courses {
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

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.title {
  color: var(--text-main);
  padding: 24px 0;
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

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-main);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  width: 220px;
}

.search::placeholder {
  color: var(--text-sec);
  opacity: 0.5;
}


.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-align: center;
  min-height: 380px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 400px;

  i {
    font-size: 64px;
    color: var(--accent);
    margin-bottom: 8px;
  }

  h3 {
    margin: 0;
    font-size: 22px;
    color: var(--text-main);
  }

  p {
    margin: 0;
    color: var(--text-sec);
    line-height: 1.5;
  }
}

.explore-btn {
  margin-top: 12px;
  background: var(--accent);
  color: #FFFFFF;
  padding: 12px 32px;
  border-radius: 99px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px color-mix(in oklab, var(--accent), transparent 70%);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px color-mix(in oklab, var(--accent), transparent 60%);
  }
}

.loading,
.error {
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


.cards {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
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

/* cards now use CourseCard component styling */
</style>
