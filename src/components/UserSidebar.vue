<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCoursesStore } from '@/stores/courses'
import { useCareersStore } from '@/stores/careers'
import UpgradeBanner from '@/components/UpgradeBanner.vue'

const userStore = useUserStore()
const coursesStore = useCoursesStore()
const careersStore = useCareersStore()
const router = useRouter()

const isDark = ref(false)
const props = defineProps({
  menuIsOpen: { type: Boolean, default: false }
})

const enrolledCount = computed(() => {
  return Array.isArray(coursesStore.enrolledCourses) ? coursesStore.enrolledCourses.length : 0
})

const careersCount = computed(() => {
  return Array.isArray(careersStore.careers) ? careersStore.careers.length : 0
})

const menu = [
  { name: 'Inicio', link: '/', icon: 'fa-solid fa-house' },
  { name: 'Mis Cursos', link: '/courses', icon: 'fa-solid fa-book-open' },
  { name: 'Explorar', link: '/courses/all', icon: 'fa-solid fa-compass' },
  { name: 'Escuelas', link: '/careers', icon: 'fa-solid fa-graduation-cap' },
  { name: 'Certificados', link: '/certificates', icon: 'fa-solid fa-award' },
  { name: 'Mi Perfil', link: '/profile/edit', icon: 'fa-solid fa-user-gear' },
]

function isSelected(link: string) {
  return router.currentRoute.value.path === link || (link !== '/' && router.currentRoute.value.path.startsWith(link))
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

function toggleTheme() { isDark.value = !isDark.value; localStorage.setItem('theme', isDark.value ? 'dark' : 'light'); applyTheme() }
onMounted(async () => {
  const t = localStorage.getItem('theme'); isDark.value = t === 'dark'; applyTheme()
  try { await careersStore.fetchAll() } catch {}
  try { userStore.hydrate(); const uid = userStore.id || localStorage.getItem('user_id'); if (uid) await coursesStore.fetchEnrolled(String(uid)) } catch {}
})
</script>

<template>
  <div class="user-sidebar" :class="{ 'active': menuIsOpen }">
    <div class="user-sidebar-wrapper">
      <ul class="user-menu">
        <li
          v-for="item in menu"
          :key="item.name"
          :class="{ 'active': !menuIsOpen, 'selected': isSelected(item.link) }">
          <i :class="item.icon" class="icon" />
          <RouterLink :to="item.link" :class="{ 'active': menuIsOpen, 'selected': isSelected(item.link) }">{{ item.name }}</RouterLink>
          <span v-if="item.link === '/careers' && careersCount > 0" class="menu-badge">{{ careersCount }}</span>
          <span v-if="item.link === '/courses' && enrolledCount > 0" class="menu-badge">{{ enrolledCount }}</span>
        </li>
      </ul>

      <!-- CTA para usuarios Free en el Sidebar -->
      <UpgradeBanner variant="sidebar" />
    </div>
    <button class="setting-button" type="button" @click="toggleTheme">
      <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.user {
  &-sidebar {
    background-color: var(--bg);
    height: 100%;
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
    width: 260px;
    transition: width 0.3s ease, transform 0.3s ease;
    
    // Mobile logic
    @media (max-width: 1024px) {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
      transform: translateX(-100%);
      
      &.active {
        transform: translateX(0);
      }
    }
    
    &-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
}

.user-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  li {
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 8px;
    transition: all 0.2s;
    padding: 10px 12px;
    color: var(--text);
    
    .icon {
      font-size: 18px;
      margin-right: 12px;
      color: color-mix(in oklab, var(--text), transparent 40%);
      width: 24px;
      text-align: center;
    }
    
    a {
      text-decoration: none;
      color: inherit;
      font-weight: 500;
      font-size: 14px;
      flex: 1;
    }
    
    &:hover {
      background-color: color-mix(in oklab, var(--text), transparent 94%);
      color: var(--text);
      .icon { color: var(--accent); }
    }
    
    &.selected {
      background-color: color-mix(in oklab, var(--accent), transparent 90%);
      color: var(--accent);
      .icon { color: var(--accent); }
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60%;
        background-color: var(--accent);
        border-radius: 0 4px 4px 0;
      }
    }
  }
}

.menu-badge {
  background-color: var(--accent);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 99px;
  min-width: 20px;
  text-align: center;
}

.setting-button {
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  color: var(--text);
  font-size: 18px;
  transition: all 0.2s;
  
  &:hover {
    background-color: color-mix(in oklab, var(--text), transparent 94%);
  }
}
</style>
