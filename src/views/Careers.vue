<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCareersStore } from '@/stores/careers'
import { useUserStore } from '@/stores/user'
import { useCoursesStore } from '@/stores/courses'

const store = useCareersStore()
const userStore = useUserStore()
const coursesStore = useCoursesStore()
const router = useRouter()

onMounted(async () => {
  await store.fetchAll()
  userStore.hydrate()
  const uid = userStore.id || localStorage.getItem('user_id')
  if (uid) await store.fetchUserCareers(String(uid))
  if (coursesStore.courses.length === 0) await coursesStore.fetchAll()
})

const isFreeUser = computed(() => {
  if (!userStore.id) userStore.hydrate()
  return userStore.accountType === 'free'
})

const careers = computed(() => store.careers)
const loading = computed(() => store.loading)
const error = computed(() => store.error)

const upcomingCareers = computed(() => {
  const courses = coursesStore.courses
  // Prioritize using real course images if available
  const getImg = (idx: number) => {
    if (courses && courses[idx]) return courses[idx].imageUrl
    // Different fallbacks to keep variety
    const fallbacks = [
      'https://images.unsplash.com/photo-1509228468518-180dd482180c',
      'https://images.unsplash.com/photo-1636466484292-713cf81ea445',
      'https://images.unsplash.com/photo-1532187875605-2fe358a77e82'
    ]
    return fallbacks[idx] || fallbacks[0]
  }

  return [
    {
      _id: 'up-math',
      name: 'Ruta de Matemáticas Puras',
      description: 'Domina desde el álgebra básica hasta el cálculo avanzado con nuestra ruta especializada.',
      imageUrl: getImg(0),
      courseIds: [1, 2, 3, 4, 5]
    },
    {
      _id: 'up-physics',
      name: 'Física Moderna y Clásica',
      description: 'Explora las leyes que rigen el universo, desde la mecánica hasta la física cuántica.',
      imageUrl: getImg(1),
      courseIds: [1, 2, 3, 4]
    },
    {
      _id: 'up-chemistry',
      name: 'Química Aplicada',
      description: 'Aprende los fundamentos de la materia, reacciones químicas y bioquímica de vanguardia.',
      imageUrl: getImg(2),
      courseIds: [1, 2, 3]
    }
  ]
})

const userCareerIds = computed(() => {
  const list = Array.isArray(store.userCareers) ? store.userCareers : []
  const base = list.map((c: any) => String(c?.info?._id || c?.access?.careerId || ''))
  return new Set(base)
})

const myCareers = computed(() => {
  const list = Array.isArray(store.userCareers) ? store.userCareers : []
  return list.map((c: any) => c?.info || c?.access).filter(Boolean)
})

function sanitizeUrl(url?: string) {
  return (url || '').toString().replace(/`/g, '').trim()
}

function coverOf(career: any) {
  return sanitizeUrl(career?.imageUrl) || '/src/assets/logos/logo-prefectura.png'
}


function coursesCount(career: any) {
  const ids = Array.isArray(career?.courseIds) ? career.courseIds : []
  return ids.length
}

function isInMyCareers(career: any) {
  return userCareerIds.value.has(String(career?._id))
}

async function addToMyCareers(career: any) {
  const uid = userStore.id || localStorage.getItem('user_id')
  if (!uid || !career?._id) return
  const res = await store.assignToUser(String(career._id), String(uid), { autoEnroll: true, teachableUserId: userStore.teachableUserId || undefined })
  if (res) {
    await store.fetchUserCareers(String(uid))
    await coursesStore.fetchEnrolled(String(uid))
  }
}
</script>

<template>
  <div class="careers-view">
    <div class="container">
      <div class="head">
        <h2 class="title"><i class="fa-solid fa-graduation-cap" /> Rutas de Aprendizaje</h2>
      </div>

      <!-- CTA para usuarios Free -->
      <div v-if="isFreeUser" class="upgrade-banner" @click="router.push('/checkout')">
        <div class="upgrade-content">
          <div class="upgrade-icon">
            <i class="fa-solid fa-crown" />
          </div>
          <div class="upgrade-text">
            <h3>Hazte Founder</h3>
            <p>Accede a todas las rutas y contenido exclusivo.</p>
          </div>
        </div>
        <button class="upgrade-btn">
          Obtener Acceso
          <i class="fa-solid fa-arrow-right" />
        </button>
      </div>

      <div v-if="loading" class="hint">Cargando carreras…</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <template v-else>
        <h3 class="subtitle">Mis rutas</h3>
        <div class="grid">
          <div v-if="myCareers.length === 0" class="empty">Aún no tienes rutas asignadas.</div>
          <div v-for="c in myCareers" :key="c._id || c.careerId" class="card">
            <RouterLink :to="`/careers/${c._id || c.careerId}`">
              <img class="cover" :src="coverOf(c)" alt="cover" />
              <h3 class="name">{{ c.name }}</h3>
              <p class="desc">{{ c.description || 'Detalles próximamente.' }}</p>
            </RouterLink>
            <div class="meta">
              <span class="badge">{{ coursesCount(c) }} curso(s)</span>
              <span class="badge" :class="{ active: c.isActive }">{{ c.isActive ? 'Activa' : 'Inactiva' }}</span>
              <button class="add-button" disabled>Agregada</button>
            </div>
          </div>
        </div>

        <h3 class="subtitle">Todas las rutas</h3>
        <div class="grid">
          <div v-for="c in careers" :key="c._id" class="card">
            <RouterLink :to="`/careers/${c._id}`">
              <img class="cover" :src="coverOf(c)" alt="cover" />
              <h3 class="name">{{ c.name }}</h3>
              <p class="desc">{{ c.description || 'Detalles próximamente.' }}</p>
            </RouterLink>
            <div class="meta">
              <span class="badge">{{ coursesCount(c) }} curso(s)</span>
              <span class="badge" :class="{ active: c.isActive }">{{ c.isActive ? 'Activa' : 'Inactiva' }}</span>
              <button class="add-button" :disabled="isInMyCareers(c)" @click="addToMyCareers(c)">
                {{ isInMyCareers(c) ? 'Agregada' : 'Agregar a mis rutas' }}
              </button>
            </div>
          </div>
        </div>

        <h3 class="subtitle">Próximamente</h3>
        <div class="grid">
          <div v-for="c in upcomingCareers" :key="c._id" class="card">
            <div>
              <img class="cover blur" :src="coverOf(c)" alt="cover" />
              <h3 class="name">{{ c.name }}</h3>
              <p class="desc">{{ c.description || 'Detalles próximamente.' }}</p>
            </div>
            <div class="meta">
              <span class="badge">{{ coursesCount(c) }} curso(s)</span>
              <span class="badge">Inactiva</span>
              <button class="add-button" disabled>Próximamente</button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
  </template>

<style lang="scss" scoped>
.careers-view {
  width: 100%;
  padding: 24px 16px;
  background: var(--bg-main);
  color: var(--text-main);
}

.container {
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 16px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 24px;
  margin: 0;
  color: var(--text-main);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.upgrade-banner {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);

    .upgrade-btn {
      transform: scale(1.05);
    }
  }
}

.upgrade-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upgrade-icon {
  width: 48px;
  height: 48px;
  background: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #111613;
  flex-shrink: 0;
}

.upgrade-text {
  h3 {
    margin: 0;
    font-size: 18px;
    color: var(--text-main);
  }

  p {
    margin: 4px 0 0;
    font-size: 14px;
    color: var(--text-sec);
  }
}

.upgrade-btn {
  background: var(--accent);
  color: #111613;
  border: none;
  border-radius: 99px;
  padding: 10px 20px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
  white-space: nowrap;
}

.subtitle {
  color: var(--text-main);
  margin: 8px 0;
  font-size: 20px;
}

.hint {
  color: var(--text-sec);
}

.error {
  color: var(--accent);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  box-shadow: var(--shadow);
  display: grid;
  gap: 8px;
}

.cover {
  width: 100%;
  height: 130px;
  border-radius: 8px;
  object-fit: cover;
}

.cover.blur {
  filter: blur(10px);
}

.name {
  color: var(--text-main);
  font-weight: 700;
  margin: 0;
}

.desc {
  color: var(--text-sec);
  margin: 0;
  font-size: 14px;
}

.meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.badge {
  background: rgba(134, 239, 172, 0.1);
  color: var(--text-main);
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 12px;
  border: 1px solid var(--border);
}

.badge.active {
  background: rgba(134, 239, 172, 0.2);
  font-weight: 700;
  border-color: var(--accent);
}

.add-button {
  background: var(--accent);
  color: #111613;
  border: none;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.add-button[disabled] {
  background: var(--bg-card);
  color: var(--text-sec);
  border: 1px solid var(--border);
  cursor: default;
}

.empty {
  color: var(--text-sec);
}
</style>
