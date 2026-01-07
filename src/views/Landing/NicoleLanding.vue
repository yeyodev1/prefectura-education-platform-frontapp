<script setup lang="ts">
import { useHead } from '@unhead/vue';
import logoUrl from '@/assets/logos/logo-prefectura.png';

useHead({
  title: 'Página Online de la Prefectura del Guayas',
  meta: [
    { name: 'description', content: 'Bienvenidos a la plataforma educativa oficial de la Prefectura del Guayas.' },
    { property: 'og:title', content: 'Prefectura del Guayas | Educación Online' },
    { property: 'og:description', content: 'Plataforma oficial de capacitación y formación ciudadana.' }
  ]
})
</script>

<template>
  <div class="prefectura-landing">
    <div class="content-wrapper">
      <img :src="logoUrl" alt="Logo Prefectura del Guayas" class="main-logo" />
      <h1 class="title">Esta es la página online de la <span class="highlight">Prefectura del Guayas</span></h1>
      <p class="description">Bienvenido a tu plataforma de aprendizaje. Inicia sesión para acceder a tus cursos y herramientas educativas.</p>
      
      <div class="actions">
        <RouterLink to="/login" class="btn-primary">
          <i class="fa-solid fa-right-to-bracket"></i>
          Iniciar Sesión
        </RouterLink>
        <RouterLink to="/verify-certificate" class="btn-secondary">
          <i class="fa-solid fa-certificate"></i>
          Verificar Certificado
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.prefectura-landing {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-main);
  padding: 32px 16px;
  text-align: center;

  .content-wrapper {
    max-width: 800px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    animation: fadeIn 0.8s ease-out;
  }

  .main-logo {
    width: 240px;
    height: auto;
    margin-bottom: 16px;
  }

  .title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    line-height: 1.2;
    color: var(--text-main);
    letter-spacing: -1px;

    .highlight {
      color: var(--accent);
    }
  }

  .description {
    font-size: 18px;
    color: var(--text-muted);
    max-width: 600px;
    line-height: 1.6;
  }

  .actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 16px;

    .btn-primary {
      background: var(--accent);
      color: #111;
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 700;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px color-mix(in oklab, var(--accent), transparent 70%);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px color-mix(in oklab, var(--accent), transparent 40%);
      }
    }

    .btn-secondary {
      background: transparent;
      color: var(--text-main);
      border: 2px solid var(--border);
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 700;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--accent);
        color: var(--accent);
        background: color-mix(in oklab, var(--accent), transparent 95%);
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .prefectura-landing {
    .main-logo {
      width: 180px;
    }

    .actions {
      flex-direction: column;
      width: 100%;

      .btn-primary,
      .btn-secondary {
        width: 100%;
        justify-content: center;
      }
    }
  }
}
</style>
