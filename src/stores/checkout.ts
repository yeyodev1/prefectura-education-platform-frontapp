import { defineStore } from 'pinia'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    name: '' as string,
    email: '' as string,
    clientTransactionId: '' as string,
  }),
  actions: {
    setFromForm(name: string, email: string) {
      this.name = name
      this.email = email
      try {
        localStorage.setItem('checkout_store', JSON.stringify({
          name: this.name,
          email: this.email,
          clientTransactionId: this.clientTransactionId,
        }))
      } catch {}
    },
    setClientTransactionId(ctId: string) {
      this.clientTransactionId = ctId
      try {
        localStorage.setItem('checkout_store', JSON.stringify({
          name: this.name,
          email: this.email,
          clientTransactionId: this.clientTransactionId,
        }))
      } catch {}
    },
    hydrate() {
      try {
        const raw = localStorage.getItem('checkout_store')
        if (raw) {
          const data = JSON.parse(raw)
          this.name = String(data?.name || '')
          this.email = String(data?.email || '')
          this.clientTransactionId = String(data?.clientTransactionId || '')
        }
      } catch {}
    },
    clear() {
      this.name = ''
      this.email = ''
      this.clientTransactionId = ''
      try { localStorage.removeItem('checkout_store') } catch {}
    }
  }
})
