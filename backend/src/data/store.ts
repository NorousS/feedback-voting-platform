import { randomUUID } from 'node:crypto'
import type { Feedback, Survey, SurveyResults, SurveySummary } from '../types.js'

const seeds: Survey[] = [
  {
    id: '1',
    title: 'Какую функцию добавить следующей?',
    description: 'Выберите наиболее полезную функцию для платформы',
    options: [
      { id: '1a', text: 'Экспорт результатов', votes: 4 },
      { id: '1b', text: 'Анонимное голосование', votes: 7 },
      { id: '1c', text: 'Новые диаграммы', votes: 3 }
    ]
  },
  {
    id: '2',
    title: 'Как вам новый интерфейс?',
    description: 'Оцените удобство навигации',
    options: [
      { id: '2a', text: 'Удобный', votes: 8 },
      { id: '2b', text: 'Нужно доработать', votes: 2 }
    ]
  }
]

export function percent(votes: number, total: number): number {
  return total === 0 ? 0 : Math.round(votes / total * 100)
}

export function createStore(initial: Survey[] = seeds) {
  const surveys: Survey[] = structuredClone(initial)
  const feedback: Feedback[] = []

  function getSurvey(id: string): Survey | undefined {
    return surveys.find((survey) => survey.id === id)
  }

  function summary(survey: Survey): SurveySummary {
    return {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      totalVotes: survey.options.reduce((total, option) => total + option.votes, 0)
    }
  }

  return {
    list(): SurveySummary[] {
      return surveys.map(summary)
    },
    get(id: string): Survey | undefined {
      return getSurvey(id)
    },
    results(id: string): SurveyResults | undefined {
      const survey = getSurvey(id)
      if (!survey) return undefined
      const info = summary(survey)

      return {
        ...info,
        options: survey.options.map((option) => ({
          ...option,
          percent: percent(option.votes, info.totalVotes)
        }))
      }
    },
    addSurvey(title: string, description: string, options: string[]): Survey {
      const survey: Survey = {
        id: randomUUID(),
        title,
        description,
        options: options.map((text) => ({ id: randomUUID(), text, votes: 0 }))
      }
      surveys.push(survey)
      return survey
    },
    vote(surveyId: string, optionId: string): boolean {
      const option = getSurvey(surveyId)?.options.find((item) => item.id === optionId)
      if (!option) return false
      option.votes += 1
      return true
    },
    addFeedback(name: string, message: string): Feedback {
      const entry: Feedback = { id: randomUUID(), name, message, createdAt: new Date().toISOString() }
      feedback.push(entry)
      return entry
    }
  }
}

export type Store = ReturnType<typeof createStore>
