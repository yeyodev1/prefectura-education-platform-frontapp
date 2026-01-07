<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToCheckout() { router.push('/checkout') }
</script>

<template>
  <div class="urgent" @click="goToCheckout">
    <h3>
      ¡Es la única oportunidad de conseguir este acceso de por vida a $297!
    </h3>
  </div>
</template>

<style lang="scss" scoped>
.urgent {
  background-color: var(--accent);
  color: #111613;
  text-decoration: underline;
  text-align: center;
  padding: 10px 20px;
  font-weight: 800;
  cursor: pointer;
  z-index: 1000;
}
</style>
