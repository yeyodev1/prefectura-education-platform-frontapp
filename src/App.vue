<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '@unhead/vue'
import { useUserStore } from '@/stores/user'

useHead({
  title: 'Prefectura del Guayas | Educación Online',
  titleTemplate: (title) => title ? `${title} | Prefectura del Guayas` : 'Prefectura del Guayas',
  meta: [
    { name: 'description', content: 'Plataforma oficial de capacitación y formación de la Prefectura del Guayas.' },
    { property: 'og:title', content: 'Prefectura del Guayas | Educación Online' },
    { property: 'og:description', content: 'Accede a cursos y rutas de aprendizaje oficiales para potenciar tu futuro.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/favicon.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Prefectura del Guayas | Educación Online' },
    { name: 'twitter:description', content: 'Plataforma de formación ciudadana.' },
  ],
  link: [
    { rel: 'canonical', href: 'https://educacion.guayas.gob.ec' }
  ]
})

type ConfirmPayload = { title?: string; message?: string; confirmText?: string; cancelText?: string; onConfirm?: () => void }

const userStore = useUserStore()
const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmText = ref('Confirmar')
const cancelText = ref('Cancelar')
let confirmAction: (() => void) | null = null

function openConfirm(payload: ConfirmPayload = {}) {
  confirmTitle.value = payload.title || 'Confirmar'
  confirmMessage.value = payload.message || ''
  confirmText.value = payload.confirmText || 'Confirmar'
  cancelText.value = payload.cancelText || 'Cancelar'
  confirmAction = payload.onConfirm || null
  confirmOpen.value = true
}

function closeConfirm() { confirmOpen.value = false }
function doConfirm() { try { confirmAction?.() } finally { closeConfirm() } }

function onGlobalConfirm(e: Event) {
  const d = (e as CustomEvent).detail as ConfirmPayload
  openConfirm(d || {})
}

onMounted(() => { window.addEventListener('app:confirm', onGlobalConfirm as EventListener) })
onBeforeUnmount(() => { window.removeEventListener('app:confirm', onGlobalConfirm as EventListener) })

onMounted(() => {
  const t = localStorage.getItem('theme')
  if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t)

  // Hydrate user and fetch fresh data
  userStore.hydrate()
  if (userStore.isAuthenticated && userStore.id) {
    userStore.fetchUser(userStore.id)
  }
})
</script>

<template>
  <div class="app-container">
    <div class="app-container-view">
      <RouterView />
    </div>
    <Transition name="modal-fade">
      <div v-if="confirmOpen" class="global-modal" @click.self="closeConfirm">
        <div class="global-modal-panel">
          <h3 class="global-modal-title">{{ confirmTitle }}</h3>
          <p v-if="confirmMessage" class="global-modal-message">{{ confirmMessage }}</p>
          <div class="global-modal-actions">
            <button type="button" class="btn cancel" @click="closeConfirm">{{ cancelText }}</button>
            <button type="button" class="btn confirm" @click="doConfirm">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
@use '@/styles/global.scss' as *;

.app-container {
  background-color: var(--bg-main);
  color: var(--text-main);
  font-family: $font-principal;
  min-height: 100vh;
  width: 100%;

  &-view {
    width: 100%;
  }
}

.global-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: 16px;
}

.global-modal-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  border-radius: 12px;
  width: 100%;
  max-width: 440px;
  padding: 24px;
  display: grid;
  gap: 16px;
}

.global-modal-title {
  margin: 0;
  color: var(--text-main);
  font-size: 20px;
  font-weight: 600;
}

.global-modal-message {
  margin: 0;
  color: var(--text-sec);
  font-size: 15px;
  line-height: 1.5;
}

.global-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
}

.btn.cancel {
  background: transparent;
  color: var(--text-main);
  border: 1px solid var(--border);

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.btn.confirm {
  background: var(--accent);
  color: #111613; // Dark text on light accent

  &:hover {
    filter: brightness(1.1);
  }
}

[data-theme='dark'] .btn.confirm {
  color: #111613;
}


.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
