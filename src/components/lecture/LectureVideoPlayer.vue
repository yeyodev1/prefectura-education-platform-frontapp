<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'

const props = defineProps<{ videoUrl?: string }>()

function sanitizeUrl(url?: string) {
  return (url || '').toString().replace(/`/g, '').trim()
}

function canPlay(url: string) {
  return /\.(mp4|webm|mov|m4v)$/i.test(url)
}

function videoMime(url: string) {
  const u = url.toLowerCase()
  if (u.endsWith('.mp4')) return 'video/mp4'
  if (u.endsWith('.webm')) return 'video/webm'
  if (u.endsWith('.mov')) return 'video/quicktime'
  if (u.endsWith('.m4v')) return 'video/mp4'
  return 'video/mp4'
}

function isSupported(url: string) {
  try {
    const mime = videoMime(url)
    const v = document.createElement('video')
    const res = v.canPlayType(mime)
    return !!res
  } catch {
    return false
  }
}

const playSrc = ref('')
const blobUrl = ref('')
const blobLoading = ref(false)
const videoReady = ref(false)

async function loadBlob(url: string) {
  blobLoading.value = true
  try {
    const res = await fetch(url, { mode: 'cors' })
    const b = await res.blob()
    blobUrl.value = URL.createObjectURL(b)
    playSrc.value = blobUrl.value
  } catch {
    playSrc.value = sanitizeUrl(url)
  } finally {
    blobLoading.value = false
  }
}

function resetBlob() {
  if (blobUrl.value) URL.revokeObjectURL(blobUrl.value)
  blobUrl.value = ''
}

const current = computed(() => sanitizeUrl(props.videoUrl))

watch(current, async (u) => {
  resetBlob()
  playSrc.value = ''
  videoReady.value = false
  if (!u) return
  const url = sanitizeUrl(u)
  const extMov = url.toLowerCase().endsWith('.mov')
  const supported = isSupported(url) && canPlay(url)
  if (supported && !extMov) {
    playSrc.value = url
    return
  }
  await loadBlob(url)
}, { immediate: true })

onUnmounted(() => { resetBlob() })
</script>

<template>
  <div class="player">
    <template v-if="current">
      <div v-if="blobLoading" class="loading-player"><i class="fa-solid fa-spinner fa-spin" /> Cargando video...</div>
      <template v-else-if="playSrc">
        <div class="player-box">
          <video controls controlsList="nodownload" playsinline preload="metadata" class="video" @loadedmetadata="videoReady = true" @canplay="videoReady = true" @canplaythrough="videoReady = true">
            <source :src="playSrc" :type="videoMime(playSrc)" />
          </video>
          <div v-if="!videoReady" class="loading-overlay"><i class="fa-solid fa-spinner fa-spin" /> Preparando video...</div>
        </div>
      </template>
      <template v-else>
        <div class="fallback">
          <i class="fa-solid fa-film" />
          <span>Formato no compatible para reproducción directa.</span>
          <a :href="current" target="_blank" rel="noopener noreferrer" class="open"><i class="fa-solid fa-play" /> Abrir video</a>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="empty-video"><i class="fa-regular fa-circle-play" /> Esta clase no tiene video disponible.</div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.player { background: #000; border-radius: 12px; overflow: hidden; }
.player-box { position: relative; }
.video { width: 100%; height: auto; display: block; aspect-ratio: 16 / 9; }
.loading-player { display: inline-flex; align-items: center; gap: 10px; color: #fff; padding: 16px; }
.loading-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #fff; background: rgba(0,0,0,0.25); }
.fallback { display: grid; gap: 8px; color: #fff; padding: 16px; }
.fallback .open { color: $FUDMASTER-GREEN; text-decoration: none; }
.empty-video { color: #fff; padding: 16px; }
</style>
