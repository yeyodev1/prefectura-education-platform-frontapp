<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCareersStore } from '@/stores/careers'
import CourseCard from '@/components/CourseCard.vue'

const route = useRoute()
const store = useCareersStore()

const id = computed(() => String(route.params.id || ''))

onMounted(async () => {
  if (id.value) await store.fetchById(id.value)
})

const career = computed(() => store.currentCareer)
const courses = computed(() => store.currentCourses)
const loading = computed(() => store.loading)
const error = computed(() => store.error)

function normalizeCourse(c: any) {
  return c?.course ?? c
}

const orderedCourses = computed(() => {
  const list = Array.isArray(courses.value) ? courses.value.slice() : []
  const order = Array.isArray(career.value?.courseIds) ? career.value!.courseIds.map((n: any) => Number(n)) : []
  return list.sort((a: any, b: any) => {
    const aa = normalizeCourse(a)
    const bb = normalizeCourse(b)
    return order.indexOf(Number(aa?.id)) - order.indexOf(Number(bb?.id))
  }).map((c: any) => normalizeCourse(c))
})

/* navigation handled by RouterLink in CourseCard */
</script>

<template>
  <div class="career-detail">
    <div class="container">
      <div class="head">
        <h2 class="title"><i class="fa-solid fa-graduation-cap" /> Detalle de carrera</h2>
        <div v-if="career" class="summary">
          <h3 class="name">{{ career?.name }}</h3>
          <p class="desc">{{ career?.description || 'Detalles próximamente.' }}</p>
        </div>
      </div>

      <div v-if="loading" class="hint">Cargando cursos…</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else class="grid">
        <CourseCard
          v-for="c in orderedCourses"
          :key="c.id"
          :course="c"
          :to="`/courses/${c.id}`"
          :show-published-badge="true"
        />
      </div>
    </div>
  </div>
  </template>

<style lang="scss" scoped>
.career-detail { width: 100%; padding: 24px 16px; background: var(--bg); color: var(--text); }
.container { width: 100%; margin: 0 auto; display: grid; gap: 16px; }
.head { display: grid; gap: 8px; }
.title { display: inline-flex; align-items: center; gap: 10px; color: var(--text); margin: 0; font-size: 22px; }
.name { color: var(--text); font-weight: 700; margin: 0; font-size: 18px; }
.desc { color: color-mix(in oklab, var(--text), transparent 30%); margin: 0; font-size: 14px; }
.hint { color: color-mix(in oklab, var(--text), transparent 40%); }
.error { color: var(--accent); }
.grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 768px) { .grid { grid-template-columns: repeat(3, 1fr); } }
/* cards are rendered via CourseCard component */
</style>
