import APIBase from './httpBase'
import type { AxiosResponse } from 'axios'

export interface ConfirmPaymentResponse {
  success: boolean
  message: string
  user: any
}

class PaymentService extends APIBase {
  /**
   * Confirms payment, saves to Mongo, and enrolls in Teachable
   * @param userId - User ID (or '0'/'new' if not exists)
   * @param transactionId - Payphone Transaction ID
   * @param clientTransactionId - Generated Client Transaction ID
   */
  async confirmPayment(
    userId: string | number,
    transactionId: string,
    clientTransactionId: string
  ): Promise<AxiosResponse<ConfirmPaymentResponse>> {
    return await this.post<ConfirmPaymentResponse>(`payment/${userId}/confirm`, {
      id: transactionId,
      clientTransactionId
    })
  }
}

export const paymentService = new PaymentService()
export default paymentService
