import { createMemoryHistory, createRouter, type RouteRecordRaw } from "vue-router";

// Layout
import UserLayout from "../layout/UserLayout.vue";
import PublicLayout from "../layout/PublicLayout.vue";

// Views
import UserHome from "../views/User/UserHome.vue";
import LoginView from "../views/Auth/Login.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: UserLayout,
    meta: {
      title: 'Fudmaster | lleva tu cocina al siguiente nivel',
      requiresAuth: true
    },
    children: [
      {
        path: '',
        component: UserHome,
        meta: {
          title: 'Aquí empieza tu éxito gastronómico'
        } 
      }
    ]
  },
  {
    path: '/login',
    component: PublicLayout,
    meta: { title: 'Iniciar sesión' },
    children: [
      { path: '', component: LoginView }
    ]
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

router.beforeEach((to) => {
  const hasToken = !!localStorage.getItem('access_token')
  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)

  if (requiresAuth && !hasToken) {
    return { path: '/login', replace: true }
  }

  if (to.path === '/login' && hasToken) {
    return { path: '/', replace: true }
  }
})

export default router
