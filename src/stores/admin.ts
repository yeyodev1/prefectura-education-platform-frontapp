import { defineStore } from 'pinia'
import adminService, { type AdminStatsResponse } from '@/services/admin.service'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    stats: null as AdminStatsResponse['stats'] | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    /**
     * Fetches platform statistics from the backend.
     */
    async fetchStats() {
      this.loading = true
      this.error = null
      try {
        const response = await adminService.getAdminStats()
        this.stats = response.data.stats
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error fetching admin stats'
        console.error('AdminStore fetchStats error:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * Triggers the mock data seeding process.
     */
    async seedData() {
      this.loading = true
      this.error = null
      try {
        const response = await adminService.seedMockData()
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error seeding data'
        console.error('AdminStore seedData error:', err)
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
