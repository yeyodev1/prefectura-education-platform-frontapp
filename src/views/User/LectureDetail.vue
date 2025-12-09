<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import CommentsThread from '@/components/CommentsThread.vue'
import LectureVideoPlayer from '@/components/lecture/LectureVideoPlayer.vue'
import LectureAttachments from '@/components/lecture/LectureAttachments.vue'

const route = useRoute()
const router = useRouter()
const store = useCoursesStore()

const courseId = computed(() => route.params.id as string)
const lectureId = computed(() => route.params.lectureId as string)

function sanitizeUrl(url?: string) {
  return (url || '').toString().replace(/`/g, '').trim()
}

function findVideoUrl() {
  const att = (store.currentLecture?.attachments || []).find((a: any) => a?.kind === 'video' && a?.url)
  return sanitizeUrl(att?.url)
}

const currentUrl = computed(() => findVideoUrl())

function goBack() { router.back() }

onMounted(async () => {
  if (courseId.value && lectureId.value) {
    await store.fetchLecture(courseId.value, lectureId.value)
  }
})
</script>

<template>
  <div class="lecture-detail-view">
    <div class="container">
      <div class="header">
        <button class="back" type="button" @click="goBack"><i class="fa-solid fa-arrow-left" /> Volver</button>
        <h2 class="title"><i class="fa-solid fa-chalkboard" /> {{ store.currentLecture?.name || 'Clase' }}</h2>
        <p class="meta">Posición {{ store.currentLecture?.position ?? '-' }} · {{ store.currentLecture?.is_published ? 'Publicada' : 'Borrador' }}</p>
      </div>

      <div v-if="store.loading" class="loading"><i class="fa-solid fa-spinner fa-spin" /> Cargando clase...</div>
      <div v-else-if="store.error" class="error"><i class="fa-solid fa-triangle-exclamation" /> {{ store.error }}</div>
      <div v-else-if="!store.currentLecture" class="empty"><i class="fa-regular fa-face-meh" /> No se encontró la clase.</div>

      <div v-else class="player-card">
        <div class="left">
          <LectureVideoPlayer :video-url="currentUrl" />
          <LectureAttachments v-if="Array.isArray(store.currentLecture?.attachments) && store.currentLecture.attachments.length" :attachments="store.currentLecture.attachments" />
        </div>
        <div class="right">
          <CommentsThread :course-id="Number(courseId)" :lecture-id="Number(lectureId)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lecture-detail-view { width: 100%; padding: 24px 16px; }
.container { max-width: 100%; margin: 0 auto; display: grid; gap: 16px; }
.header { display: grid; gap: 8px; }
.back { background: none; border: none; color: $FUDMASTER-GREEN; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; }
.title { color: $FUDMASTER-DARK; margin: 0; font-size: 24px; display: inline-flex; align-items: center; gap: 10px; }
.meta { color: rgba($FUDMASTER-DARK, 0.6); margin: 0; font-size: 14px; }
.loading, .error, .empty { display: inline-flex; align-items: center; gap: 10px; color: rgba($FUDMASTER-DARK, 0.6); background: $FUDMASTER-LIGHT; border: 1px solid rgba($FUDMASTER-DARK, 0.08); border-radius: 10px; padding: 12px 14px; }
.error { color: $alert-error; background: $alert-error-bg; border-color: rgba($alert-error, 0.3); }
.player-card { background: $white; border: 1px solid rgba($FUDMASTER-DARK, 0.08); border-radius: 16px; padding: 16px; display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 960px) {
  .player-card { grid-template-columns: 1.6fr 1fr; }
}
@media (min-width: 1280px) {
  .player-card { grid-template-columns: 2fr 1fr; }
}
.left { display: grid; gap: 16px; }
.right { display: grid; gap: 16px; }
</style>
