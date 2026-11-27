import type { Survey, SurveyResults, SurveySummary } from './types'

type RequestOptions = { method?: 'GET' | 'POST', body?: object }

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: options.method ?? 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined
  })

  if (!response.ok) {
    throw new Error(`Ошибка сервера (${response.status})`)
  }

  return response.json() as Promise<T>
}

export const api = {
  listSurveys(): Promise<SurveySummary[]> {
    return request('/surveys')
  },
  getSurvey(id: string): Promise<Survey> {
    return request(`/surveys/${id}`)
  },
  getResults(id: string): Promise<SurveyResults> {
    return request(`/surveys/${id}/results`)
  },
  vote(id: string, optionId: string): Promise<{ success: boolean }> {
    return request(`/surveys/${id}/votes`, { method: 'POST', body: { optionId } })
  },
  addSurvey(title: string, description: string, options: string[]): Promise<Survey> {
    return request('/surveys', { method: 'POST', body: { title, description, options } })
  },
  addFeedback(name: string, message: string): Promise<{ id: string }> {
    return request('/feedback', { method: 'POST', body: { name, message } })
  }
}
