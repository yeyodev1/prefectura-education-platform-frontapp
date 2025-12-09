<script setup lang="ts">
  import UserSidebar from '../components/UserSidebar.vue';
  import UserHeader from '../components/UserHeader.vue';
</script>

<template>
  <div class="wrapper">
    <div class="header">
      <UserHeader />
    </div>
    <div class="layout">
      <div class="layout-menu-wrapper">
        <UserSidebar />
      </div>
      <div class="layout-view-wrapper">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    .header {
      width: 100%;
    }
    .layout {
      flex: 1;
      display: flex;
      &-menu-wrapper {
        width: 100%;
        max-width: fit-content;
        min-width: 24px;
      }
      &-view-wrapper {
        width: 100%;
        flex: 1;
      }
    }
  }
</style>