<template>
  <section class="roadmap-section">
    <div class="container">
      <h3>📅 No compras un curso estático. Compras una <span class="highlight">Academia Viva.</span></h3>
      <p>Esto es lo que estamos cocinando para las próximas semanas:</p>

      <div class="timeline">
        <div class="event past">
          <span class="date">Semana Pasada</span>
          <span class="title">Lanzamiento: Finanzas Blindadas 1.0 ✅</span>
        </div>
        <div class="event current">
          <span class="date">Esta Semana</span>
          <span class="title">Nuevo: Matriz de Ingeniería de Menú con IA 🔥</span>
        </div>
        <div class="event future">
          <span class="date">Próxima Semana</span>
          <span class="title">Próximamente: Automatización de WhatsApp Avanzada</span>
        </div>
      </div>
      
      <p class="note">*Al ser Miembro Fundador, recibes todo esto sin pagar un centavo extra.*</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.roadmap-section {
  background: var(--bg-card);
  padding: 4rem 1rem;
  text-align: center;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.highlight {
  color: var(--accent);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;

  @media(min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
}

.event {
  background: var(--bg-main);
  padding: 1rem;
  border-radius: 8px;
  flex: 1;
  border: 1px solid var(--border);

  &.current {
    border-color: var(--accent);
    background: rgba(134, 239, 172, 0.1);
  }
}

.date {
  display: block;
  font-size: 0.8rem;
  color: var(--text-sec);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.title {
  font-weight: bold;
  font-size: 1rem;
  color: var(--text-main);
}

.note {
  font-size: 0.9rem;
  color: var(--text-sec);
  font-style: italic;
}
</style>