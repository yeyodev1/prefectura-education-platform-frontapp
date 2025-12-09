import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import APIBase from './httpBase'

export interface CreateUserBody extends Record<string, unknown> { }
export interface LoginBody {
  email: string
  password: string
}
export interface LoginResponse {
  message: string
  token: string
  user: Record<string, unknown>
}

class UsersService extends APIBase {
  async create<T>(body: CreateUserBody, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.post<T>('users', body, undefined, config)
  }

  async login<T = LoginResponse>(body: LoginBody, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.post<T>('users/login', body, { 'Content-Type': 'application/json' }, config)
  }
}

const usersService = new UsersService()

export default usersService
