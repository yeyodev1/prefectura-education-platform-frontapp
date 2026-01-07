import type { AxiosResponse } from 'axios'
import APIBase from './httpBase'

export interface AdminStatsResponse {
  message: string
  stats: {
    totalUsers: number
    totalCertificates: number
    cityDistribution: Array<{ _id: string | null; count: number }>
    accountTypeDistribution: Array<{ _id: string; count: number }>
    topUsers: Array<{
      name: string
      email: string
      points: number
      city: string | null
    }>
  }
}

class AdminService extends APIBase {
  /**
   * Seeds mock data into the database.
   * Only accessible by admin users.
   */
  async seedMockData<T = { message: string }>(): Promise<AxiosResponse<T>> {
    return this.post<T>('admin/seed', {})
  }

  /**
   * Retrieves platform statistics.
   * Only accessible by admin users.
   */
  async getAdminStats<T = AdminStatsResponse>(): Promise<AxiosResponse<T>> {
    return this.get<T>('admin/stats')
  }
}

const adminService = new AdminService()

export default adminService
