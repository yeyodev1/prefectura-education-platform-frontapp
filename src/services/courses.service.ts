import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import APIBase from './httpBase'

export interface EnrollUserBody extends Record<string, unknown> { }
export interface CompleteLectureBody extends Record<string, unknown> { }

class CoursesService extends APIBase {
  async list<T>(params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.get<T>('courses', undefined, { ...(config || {}), params })
  }

  async getById<T>(courseId: string | number, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.get<T>(`courses/${courseId}`, undefined, config)
  }

  async getEnrollments<T>(courseId: string | number, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.get<T>(`courses/${courseId}/enrollments`, undefined, { ...(config || {}), params })
  }

  async enroll<T>(courseId: string | number, body: EnrollUserBody, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.post<T>(`courses/${courseId}/enroll`, body, undefined, config)
  }

  async getLecture<T>(courseId: string | number, lectureId: string | number, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.get<T>(`courses/${courseId}/lectures/${lectureId}`, undefined, config)
  }

  async completeLecture<T>(courseId: string | number, lectureId: string | number, body: CompleteLectureBody, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.post<T>(`courses/${courseId}/lectures/${lectureId}/complete`, body, undefined, config)
  }

  async getProgress<T>(courseId: string | number, userId: string | number, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.get<T>(`courses/${courseId}/progress/${userId}`, undefined, config)
  }

  async getLectureQuizzes<T>(courseId: string | number, lectureId: string | number, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.get<T>(`courses/${courseId}/lectures/${lectureId}/quizzes`, undefined, config)
  }

  async getQuiz<T>(courseId: string | number, lectureId: string | number, quizId: string | number, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.get<T>(`courses/${courseId}/lectures/${lectureId}/quizzes/${quizId}`, undefined, config)
  }

  async getQuizResponses<T>(courseId: string | number, lectureId: string | number, quizId: string | number, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.get<T>(`courses/${courseId}/lectures/${lectureId}/quizzes/${quizId}/responses`, undefined, config)
  }

  async getVideo<T>(courseId: string | number, lectureId: string | number, videoId: string | number, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.get<T>(`courses/${courseId}/lectures/${lectureId}/videos/${videoId}`, undefined, config)
  }

  async getEnrolledByUser<T>(userId: string | number, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.get<T>(`courses/enrolled/${userId}`, undefined, { ...(config || {}), params })
  }
}

const coursesService = new CoursesService()

export default coursesService
