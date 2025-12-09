<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import { useUserStore } from '@/stores/user'

const store = useCoursesStore()
const userStore = useUserStore()

function sanitizeUrl(url?: string) {
  return (url || '').toString().replace(/`/g, '').trim()
}

function coverOf(course: any) {
  return sanitizeUrl(course.image_url) || sanitizeUrl(course.coverUrl) || '/src/assets/fudmaster-color.png'
}

const userId = computed(() => {
  if (!userStore.id) userStore.hydrate()
  return (userStore.id as any) || ''
})

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
      <h2 class="title"><i class="fa-solid fa-book" /> Mis cursos</h2>
      <p class="subtitle">Aquí verás los cursos que tienes disponibles en tu cuenta.</p>

      <div v-if="store.loading" class="loading">
        <i class="fa-solid fa-spinner fa-spin" /> Cargando cursos...
      </div>

      <div v-else-if="store.error" class="error">
        <i class="fa-solid fa-triangle-exclamation" /> {{ store.error }}
      </div>

      <div v-else>
        <div v-if="(store.enrolledCourses.length || store.courses.length) === 0" class="empty">
          <i class="fa-regular fa-face-smile" />
          <span>Aún no tienes cursos asignados.</span>
        </div>
        <div v-else class="cards">
          <RouterLink v-for="c in (store.enrolledCourses.length ? store.enrolledCourses : store.courses)" :key="c._id || c.id" class="card" :to="`/courses/${c.id}`">
            <div class="cover">
              <img :src="coverOf(c)" alt="cover" />
            </div>
            <div class="info">
              <h3 class="name">{{ c.name || c.title || 'Curso sin título' }}</h3>
              <p class="desc">{{ c.heading || c.description || c.shortDescription || 'Detalles próximamente.' }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-courses {
  width: 100%;
  padding: 24px 16px;
}

.container {
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  gap: 12px;
}

.title {
  color: $FUDMASTER-DARK;
  font-size: 24px;
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.subtitle {
  color: rgba($FUDMASTER-DARK, 0.6);
  margin: 0;
}

.loading,
.error,
.empty {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgba($FUDMASTER-DARK, 0.6);
  background: $FUDMASTER-LIGHT;
  border: 1px solid rgba($FUDMASTER-DARK, 0.08);
  border-radius: 10px;
  padding: 12px 14px;
}

.error {
  color: $alert-error;
  background: $alert-error-bg;
  border-color: rgba($alert-error, 0.3);
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

.card {
  background: $white;
  border: 1px solid rgba($FUDMASTER-DARK, 0.08);
  border-radius: 16px;
  overflow: hidden;
  display: grid;
  text-decoration: none;
}

.cover img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.info {
  display: grid;
  gap: 6px;
  padding: 12px;
}

.name {
  color: $FUDMASTER-DARK;
  margin: 0;
  font-size: 18px;
}

.desc {
  color: rgba($FUDMASTER-DARK, 0.6);
  margin: 0;
  font-size: 14px;
}
</style>
