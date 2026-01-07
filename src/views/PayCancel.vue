<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const transactionId = ref('')

function goCheckout() {
  router.push('/checkout')
}

onMounted(() => {
  const ctId = (route.query.clientTransactionId as string) || ''
  if (ctId) {
    transactionId.value = ctId
  }
})
</script>

<template>
  <div class="pay-cancel-wrapper">
    <div class="card">
      <div class="brand">
        <img src="/src/assets/logos/logo-prefectura.png" alt="prefectura-logo" />
      </div>

      <div class="icon-box">
        <i class="fa-solid fa-circle-exclamation" />
      </div>

      <h2 class="title">¡Whoops! Algo salió mal</h2>
      
      <p class="message">
        Parece que el proceso de pago se canceló o no se pudo completar.
        <br />
        Pero tranquilo, puedes reintentarlo ahora mismo.
      </p>

      <div v-if="transactionId" class="debug-info">
        <small>Ref: {{ transactionId }}</small>
      </div>

      <div class="actions">
        <button class="cta-retry" @click="goCheckout">
          Reintentar pago <i class="fa-solid fa-arrow-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pay-cancel-wrapper {
  width: 100%;
  min-height: 80vh;
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
}

.card {
  background: var(--bg-card);
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);

  .brand {
    margin-bottom: 24px;

    img {
      height: 32px;
      width: auto;
    }
  }

  .icon-box {
    font-size: 64px;
    color: var(--accent);
    margin-bottom: 20px;
    animation: bounce 1s infinite alternate;
  }

  .title {
    font-size: 24px;
    font-weight: 800;
    color: var(--text-main);
    margin-bottom: 12px;
  }

  .message {
    font-size: 16px;
    color: var(--text-sec);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .debug-info {
    margin-bottom: 24px;
    color: var(--text-sec);
    font-family: monospace;
    font-size: 12px;
    opacity: 0.6;
  }

  .actions {
    .cta-retry {
      background: var(--accent);
      color: #111613;
      border: none;
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 700;
      border-radius: 12px;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(134, 239, 172, 0.3);
      }
    }
  }
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-10px);
  }
}
</style>
