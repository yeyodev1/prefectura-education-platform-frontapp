import { defineStore } from 'pinia'

export interface UserState {
  id: string | number | null
  name: string | null
  email: string | null
  isAuthenticated: boolean
  teachableUserId?: string | number | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: null,
    name: null,
    email: null,
    isAuthenticated: false,
    teachableUserId: null,
  }),
  actions: {
    hydrate() {
      const token = localStorage.getItem('access_token')
      const id = localStorage.getItem('user_id')
      const t = localStorage.getItem('teachable_user_id')
      this.isAuthenticated = !!token
      this.id = id || null
      this.teachableUserId = t || null
    },
    setUser(payload: { id?: string | number; name?: string; email?: string; teachableUserId?: string | number }) {
      if (payload?.id !== undefined && payload?.id !== null) {
        this.id = payload.id
        try { localStorage.setItem('user_id', String(payload.id)) } catch {}
      }
      if (payload?.name) this.name = payload.name
      if (payload?.email) this.email = payload.email
      if (payload?.teachableUserId !== undefined && payload?.teachableUserId !== null) {
        this.teachableUserId = payload.teachableUserId
        try { localStorage.setItem('teachable_user_id', String(payload.teachableUserId)) } catch {}
      }
      this.isAuthenticated = true
    },
    clear() {
      this.id = null
      this.name = null
      this.email = null
      this.isAuthenticated = false
      this.teachableUserId = null
      try { localStorage.removeItem('user_id') } catch {}
      try { localStorage.removeItem('teachable_user_id') } catch {}
    }
  }
})
