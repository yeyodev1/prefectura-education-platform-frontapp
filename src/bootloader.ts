import { createSSRApp } from "vue";
import { createPinia } from "pinia";
import { createHead } from "@unhead/vue";

import App from "./App.vue";

import router from './router'


async function createVueApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  const head = createHead()

  app.use(pinia)
  app.use(head)
  app.use(router)

  return app
}

export { createVueApp }