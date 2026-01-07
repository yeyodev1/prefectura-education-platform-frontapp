<script setup lang="ts">
import { ref, onMounted } from 'vue'
import videoSrc from '@/assets/videos/video.mp4'

const emit = defineEmits(['close'])
const videoRef = ref<HTMLVideoElement | null>(null)

function close() {
  emit('close')
}

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.play().catch(error => {
      console.warn('Auto-play was prevented. Interaction may be required.', error)
    })
  }
})
</script>

<template>
  <div class="welcome-modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn-top" @click="close" aria-label="Cerrar">
        <i class="fa-solid fa-xmark" />
      </button>
      
      <div class="header">
        <span class="badge">Mensaje Especial</span>
        <h2 class="title">Nuestra Prefecta tiene un mensaje para ti</h2>
      </div>

      <div class="video-container">
        <video 
          ref="videoRef"
          class="welcome-video" 
          controls 
          autoplay
          playsinline
          :src="videoSrc"
        >
          Tu navegador no soporta el formato de video.
        </video>
      </div>

      <div class="footer">
        <button class="action-btn" @click="close">
          Entendido
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 24px;
  width: min(720px, 100%);
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-appear 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.close-btn-top {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
}

.header {
  padding: 32px 32px 24px;
  text-align: center;

  .badge {
    display: inline-block;
    background: var(--accent);
    color: #FFFFFF;
    padding: 6px 12px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }

  .title {
    margin: 0;
    font-size: 24px;
    color: var(--text-main);
    font-weight: 800;
    line-height: 1.2;
  }
}

.video-container {
  width: 100%;
  background: #000;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.5);
}

.welcome-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.footer {
  padding: 24px 32px 32px;
  display: flex;
  justify-content: center;
}

.action-btn {
  background: var(--accent);
  color: #FFFFFF;
  border: none;
  border-radius: 99px;
  padding: 14px 48px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 10px 15px -3px color-mix(in oklab, var(--accent), transparent 70%);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px color-mix(in oklab, var(--accent), transparent 60%);
  }

  &:active {
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .header {
    padding: 24px 20px 16px;

    .title {
      font-size: 20px;
    }
  }

  .footer {
    padding: 16px 20px 24px;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
