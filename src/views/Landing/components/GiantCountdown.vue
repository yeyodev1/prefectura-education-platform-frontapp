<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useEvergreenTimer } from '@/composables/useEvergreenTimer'

const router = useRouter()
const { remaining } = useEvergreenTimer()

function goToCheckout() {
  router.push('/checkout')
}
</script>

<template>
  <div class="giant-countdown">
    <div class="container">
      <h2 class="title">🔥 OFERTA FINALIZA EN:</h2>
      
      <div class="timer-grid">
        <div class="time-block">
          <span class="number">{{ remaining.d }}</span>
          <span class="label">DÍAS</span>
        </div>
        <div class="separator">:</div>
        <div class="time-block">
          <span class="number">{{ remaining.h < 10 ? '0' + remaining.h : remaining.h }}</span>
          <span class="label">HRS</span>
        </div>
        <div class="separator">:</div>
        <div class="time-block">
          <span class="number">{{ remaining.m < 10 ? '0' + remaining.m : remaining.m }}</span>
          <span class="label">MIN</span>
        </div>
        <div class="separator">:</div>
        <div class="time-block">
          <span class="number">{{ remaining.s < 10 ? '0' + remaining.s : remaining.s }}</span>
          <span class="label">SEG</span>
        </div>
      </div>

      <p class="subtitle">El precio subirá cuando el contador llegue a cero.</p>
      
      <button @click="goToCheckout" class="cta-button">
        ¡ASEGURAR MI CUPO AHORA! <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.giant-countdown {
  width: 100%;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); // Rojo intenso urgente
  color: white;
  padding: 40px 20px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  // Efecto de brillo/urgencia
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
}

.container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.title {
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0 0 20px;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: pulse 2s infinite;

  @media(min-width: 768px) {
    font-size: 2rem;
  }
}

.timer-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;

  @media(min-width: 768px) {
    gap: 20px;
  }
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 8px;
  min-width: 70px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media(min-width: 768px) {
    min-width: 100px;
    padding: 15px;
  }

  .number {
    font-size: 2.5rem;
    font-weight: 900;
    line-height: 1;
    font-variant-numeric: tabular-nums;

    @media(min-width: 768px) {
      font-size: 4rem;
    }
  }

  .label {
    font-size: 0.7rem;
    font-weight: 700;
    margin-top: 5px;
    opacity: 0.9;
    letter-spacing: 1px;

    @media(min-width: 768px) {
      font-size: 0.9rem;
    }
  }
}

.separator {
  font-size: 2rem;
  font-weight: 900;
  margin-top: -20px; // Alinear con los números
  opacity: 0.6;

  @media(min-width: 768px) {
    font-size: 3rem;
  }
}

.subtitle {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
  font-style: italic;

  @media(min-width: 768px) {
    font-size: 1.1rem;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.cta-button {
  margin-top: 25px;
  background: #ffeb3b; // Yellow
  color: #d32f2f; // Red text
  border: none;
  padding: 16px 32px;
  font-size: 1.2rem;
  font-weight: 800;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    background: #fff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }

  i {
    font-size: 1.1em;
  }

  @media(min-width: 768px) {
    font-size: 1.5rem;
    padding: 20px 40px;
  }
}
</style>
