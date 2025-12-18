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
        <img src="/src/assets/fudmaster-color.png" alt="fudmaster-logo" />
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
  background: $white;
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);

  .brand {
    margin-bottom: 24px;
    img {
      height: 32px;
      width: auto;
    }
  }

  .icon-box {
    font-size: 64px;
    color: $FUDMASTER-ORANGE;
    margin-bottom: 20px;
    animation: bounce 1s infinite alternate;
  }

  .title {
    font-size: 24px;
    font-weight: 800;
    color: $FUDMASTER-DARK;
    margin-bottom: 12px;
  }

  .message {
    font-size: 16px;
    color: rgba($FUDMASTER-DARK, 0.7);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .debug-info {
    margin-bottom: 24px;
    color: #999;
    font-family: monospace;
    font-size: 12px;
  }

  .actions {
    .cta-retry {
      background: $FUDMASTER-ORANGE;
      color: $white;
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
        box-shadow: 0 8px 20px rgba($FUDMASTER-ORANGE, 0.3);
      }
    }
  }
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

// Dark Mode Support
:global([data-theme='dark']) {
  .card {
    background: #0b1629;
    border-color: rgba(255, 255, 255, 0.1);
    
    .title { color: $white; }
    .message { color: rgba(255, 255, 255, 0.7); }
  }
}
</style>
