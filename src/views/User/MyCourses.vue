<script setup lang="ts">
</script>

<template>
  <div class="my-courses">
    <div class="container">
      <h2 class="title"><i class="fa-solid fa-book" /> Mis cursos</h2>
      <p class="subtitle">Aquí verás los cursos que tienes disponibles en tu cuenta.</p>
      <div class="empty">
        <i class="fa-regular fa-face-smile" />
        <span>Pronto verás tus cursos activos aquí.</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-courses { width: 100%; padding: 24px 16px; }
.container { max-width: 1080px; margin: 0 auto; display: grid; gap: 12px; }
.title { color: $FUDMASTER-DARK; font-size: 24px; margin: 0; display: inline-flex; align-items: center; gap: 10px; }
.subtitle { color: #777; margin: 0; }
.empty { display: inline-flex; align-items: center; gap: 10px; color: #555; background: $FUDMASTER-LIGHT; border: 1px solid #e6e6e6; border-radius: 10px; padding: 12px 14px; }
</style>

