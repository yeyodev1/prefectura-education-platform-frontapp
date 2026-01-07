<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useEvergreenTimer } from '@/composables/useEvergreenTimer'

const props = defineProps({
  course: { type: Object, required: true },
  to: { type: String, required: false },
  showPublishedBadge: { type: Boolean, required: false },
  showClassesCount: { type: Boolean, required: false },
  ctaText: { type: String, required: false },
  disabled: { type: Boolean, required: false },
  countdownTo: { type: Number, required: false },
  index: { type: Number, required: false, default: 0 },
  isUpcoming: { type: Boolean, required: false },
})

const emit = defineEmits(['placeholder-click'])

function sanitizeUrl(url?: string) { return (url || '').toString().replace(/`/g, '').trim() }
function coverOf(course: any): string | undefined {
  const url = sanitizeUrl(course?.image_url) || sanitizeUrl(course?.coverUrl)
  return url || undefined
}


function nameOf(course: any) { return course?.name || course?.title || 'Curso sin título' }
function descriptionOf(course: any) { return course?.heading || course?.description || course?.shortDescription || 'Detalles próximamente.' }

function classesCount(course: any) {
  const sections = Array.isArray(course?.lecture_sections) ? course.lecture_sections : []
  if (sections.length) {
    let total = 0
    for (const s of sections) total += (Array.isArray(s?.lectures) ? s.lectures.length : 0)
    return total
  }
  return Number(course?.lecturesCount ?? (Array.isArray(course?.lectures) ? course.lectures.length : 0) ?? 0)
}

function pixelStyle(i: number) {
  const hues = [120, 200, 20, 280]
  const h = hues[i % hues.length]
  return {
    '--c1': `hsla(${h}, 60%, 60%, 0.18)`,
    '--c2': `hsla(${h}, 40%, 40%, 0.14)`,
    '--c3': `hsla(${h}, 30%, 30%, 0.10)`,
  } as Record<string, string>
}

const linkTo = computed(() => props.to || `/courses/${(props.course as any)?.id}`)
const published = computed(() => !!(props.course as any)?.is_published)
const showPublished = computed(() => props.showPublishedBadge && published.value)
const showClasses = computed(() => !!props.showClassesCount)
const cta = computed(() => props.ctaText || (props.isUpcoming ? 'Muy pronto' : 'Ver curso'))

const showDesc = ref(false)
const expanded = ref(false)
function truncated(text: string, limit = 180) {
  const t = (text || '').trim()
  if (t.length <= limit) return { short: t, needs: false }
  const short = t.slice(0, limit).replace(/\s+\S*$/, '') + '…'
  return { short, needs: true }
}

function toggleShowDesc(e: Event) { e.preventDefault(); e.stopPropagation(); showDesc.value = !showDesc.value }
function toggleExpanded(e: Event) { e.preventDefault(); e.stopPropagation(); expanded.value = !expanded.value }

const { remaining } = useEvergreenTimer()

function onCardClick(e: Event) {
  if (!props.disabled) return
  e.preventDefault()
  e.stopPropagation()
  emit('placeholder-click')
}
</script>

<template>
  <component :is="props.disabled ? 'div' : RouterLink" :to="props.disabled ? undefined : linkTo" class="course-card" :class="{ disabled: props.disabled }" @click="onCardClick">
    <div v-if="!coverOf(course)" class="cover pixelated" :style="pixelStyle(props.index)"></div>
    <img v-else class="cover" :class="{ blur: props.disabled }" :src="coverOf(course)" alt="cover" />
    
    <h3 class="name">{{ nameOf(course) }}</h3>
    <div class="meta">
      <span class="badge" v-if="showPublished">Publicado</span>
      <span class="badge upcoming" v-if="props.isUpcoming">Próximamente</span>
      <span class="badge" v-if="showClasses"><i class="fa-solid fa-clapperboard" /> {{ classesCount(course) }} clases</span>
      <span class="cta" :class="{ disabled: props.isUpcoming }">
        {{ cta }} 
        <i class="fa-solid fa-arrow-right" v-if="!props.isUpcoming" />
      </span>
    </div>

    <button class="desc-toggle" @click="toggleShowDesc">{{ showDesc ? 'Ocultar descripción' : 'Ver descripción' }}</button>
    <transition name="fade">
      <div v-if="showDesc" class="desc-panel">
        <p class="desc">
          <span v-if="expanded">{{ descriptionOf(course) }}</span>
          <span v-else>{{ truncated(descriptionOf(course), 180).short }}</span>
        </p>
        <div class="desc-actions">
          <button class="read-more" v-if="truncated(descriptionOf(course), 180).needs || expanded" @click="toggleExpanded">
            {{ expanded ? 'Leer menos' : 'Leer más' }}
          </button>
        </div>
      </div>
    </transition>
    <div v-if="remaining && props.countdownTo" class="countdown">
      <span class="label">Disponible en:</span>
      <span class="unit">{{ String(remaining.d).padStart(2, '0') }}d</span>
      <span class="sep">:</span>
      <span class="unit">{{ String(remaining.h).padStart(2, '0') }}h</span>
      <span class="sep">:</span>
      <span class="unit">{{ String(remaining.m).padStart(2, '0') }}m</span>
      <span class="sep">:</span>
      <span class="unit">{{ String(remaining.s).padStart(2, '0') }}s</span>
    </div>
  </component>
</template>

<style lang="scss" scoped>
.course-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  box-shadow: var(--shadow);
  display: grid;
  gap: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.course-card:hover:not(.disabled) {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.course-card.disabled {
  opacity: 0.85;
}

.cover {
  width: 100%;
  height: 160px;
  border-radius: 8px;
  object-fit: cover;
}

.cover.blur {
  filter: blur(6px);
}

.cover.pixelated {
  // Base colors for repeating pattern (overwritten by :style)
  --c1: rgba(134, 239, 172, 0.15);
  --c2: rgba(26, 36, 33, 0.12);
  --c3: rgba(26, 36, 33, 0.06);
  background-image:
    repeating-linear-gradient(0deg, var(--c1) 0 12px, var(--c2) 12px 24px),
    repeating-linear-gradient(90deg, var(--c3) 0 12px, transparent 12px 24px);
  background-size: 24px 24px;
}

.name {
  color: var(--text-main);
  font-weight: 700;
  margin: 0;
  font-size: 18px;
}

.meta {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
}

.badge {
  background: rgba(134, 239, 172, 0.1);
  color: var(--text-main);
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &.upcoming {
    background: rgba(134, 239, 172, 0.05);
    color: var(--text-sec);
    border: 1px solid var(--border);
  }
}

.cta {
  background: var(--accent);
  color: #FFFFFF; // High contrast for blue accent
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(134, 239, 172, 0.2);
}

.desc-toggle {
  background: transparent;
  color: var(--accent);
  border: 1px dashed var(--border);
  border-radius: 8px;
  padding: 6px 8px;
  font-weight: 700;
  cursor: pointer;
  justify-self: start;
}

.desc-panel {
  background: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
}

.desc {
  color: var(--text-sec);
  margin: 0;
  font-size: 14px;
}

.desc-actions {
  display: flex;
  justify-content: flex-end;
}

.read-more {
  background: none;
  border: none;
  color: var(--accent);
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.countdown {
  padding: 12px;
  border-top: 1px dashed var(--border);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: monospace;
  font-weight: 700;
  color: var(--text-main);
}

.countdown .label {
  font-size: 12px;
  color: var(--text-sec);
  margin-right: 4px;
}

.countdown .unit {
  background: var(--bg-main);
  color: var(--text-main);
  border: 1px solid var(--border);
  padding: 4px 6px;
  border-radius: 6px;
  min-width: 36px;
  text-align: center;
}

.countdown .sep {
  color: var(--text-sec);
}
</style>
