<script setup lang="ts">
// Datos de comparación
const features = [
  { name: "Acceso a las 4 Rutas de Aprendizaje", founder: true, subscriber: true },
  { name: "Plantillas de Excel y Herramientas", founder: true, subscriber: true },
  { name: "Nuevos Cursos Todas las Semanas", founder: true, subscriber: true },
  { name: "Comunidad Privada de Dueños", founder: true, subscriber: true },
  { name: "Auditoría 1 a 1 si no tienes resultados", founder: true, subscriber: false }, // GOLPE BAJO
  { name: "Acceso a todos los cursos de por Vida", founder: true, subscriber: false },
];
</script>

<template>
  <section class="opportunity-section">
    <div class="container">
      <div class="header-text">
        <span class="badge-alert">⚠️ EL MODELO CAMBIA EN ENERO</span>
        <h2>¿Por qué esta es una <span class="highlight">Oportunidad Matemática?</span></h2>
        <p>En 2026 pasaremos a un modelo de suscripción mensual. Los números hablan solos:</p>
      </div>

      <div class="comparison-table">
        <div class="col subscriber">
          <div class="col-header">
            <h3>Cliente Suscriptor</h3>
            <p class="subtitle">A partir de Enero 2026</p>
          </div>
          <div class="price-box">
            <span class="amount">$1,188</span>
            <span class="period">/ año</span>
            <p class="detail">($99 al mes)</p>
          </div>
          <ul class="features-list">
            <li v-for="(feat, i) in features" :key="i" :class="{ 'missing': !feat.subscriber }">
              <span class="icon">{{ feat.subscriber ? '✅' : '❌' }}</span>
              {{ feat.name }}
            </li>
          </ul>
        </div>

        <div class="col founder">
          <div class="best-value-tag">MEJOR INVERSIÓN</div>
          <div class="col-header">
            <h3>Miembro Fundador</h3>
            <p class="subtitle">Solo 48 cupos restantes</p>
          </div>
          <div class="price-box">
            <span class="amount">$297</span>
            <span class="period">/ único pago</span>
            <p class="detail">Acceso de por vida (0 mensualidades)</p>
          </div>
          <ul class="features-list">
            <li v-for="(feat, i) in features" :key="i">
              <span class="icon">✅</span>
              <strong>{{ feat.name }}</strong>
            </li>
          </ul>
          <div class="savings-alert">
            ¡Te ahorras $891 USD cada año!
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
$bg-dark: var(--bg-main);
$card-bg: var(--bg-card);
$accent: var(--accent);
$text-white: var(--text-main);
$danger: #ef4444;

.opportunity-section {
  background-color: $bg-dark;
  padding: 5rem 1rem;
  color: $text-white;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.header-text {
  text-align: center;
  margin-bottom: 3rem;

  .badge-alert {
    background: $danger;
    color: white;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.9rem;
    display: inline-block;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;

    .highlight {
      color: $accent;
    }
  }
}

.comparison-table {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media(min-width: 768px) {
    grid-template-columns: 1fr 1.2fr; // La columna founder más grande
    align-items: center;
  }
}

.col {
  background: $card-bg;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  position: relative;

  &.founder {
    border: 3px solid $accent;
    background: var(--bg-card);
    box-shadow: 0 0 40px rgba(134, 239, 172, 0.15);
    transform: scale(1.05);
    z-index: 10;
  }

  .best-value-tag {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    background: $accent;
    color: #111613;
    font-weight: 900;
    padding: 0.5rem 1.5rem;
    border-radius: 99px;
    font-size: 0.9rem;
  }
}

.price-box {
  text-align: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;

  .amount {
    font-size: 3rem;
    font-weight: 900;
    display: block;
    line-height: 1;
    color: var(--text-main);
  }

  .period {
    color: var(--text-sec);
    font-size: 1.2rem;
  }

  .detail {
    color: $accent;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    font-weight: bold;
  }
}

.features-list {
  list-style: none;
  padding: 0;

  li {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1rem;
    color: var(--text-main);

    &.missing {
      color: var(--text-sec);
      text-decoration: line-through;

      .icon {
        filter: grayscale(100%);
      }
    }
  }
}

.savings-alert {
  background: rgba(134, 239, 172, 0.2);
  color: var(--accent);
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 2rem;
  font-weight: 800;
  border: 1px solid var(--accent);
}
</style>