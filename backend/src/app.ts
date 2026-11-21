
import express, { type Express, type Request, type Response } from 'express'
import { createStore, type Store } from './data/store.js'

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function createApp(store: Store = createStore()): Express {
  const app = express()
  app.use(express.json())

  app.get('/api/health', (_request: Request, response: Response) => {
    response.json({ status: 'ok' })
  })

  app.get('/api/surveys', (_request: Request, response: Response) => {
    response.json(store.list())
  })

  app.get('/api/surveys/:id', (request: Request<{ id: string }>, response: Response) => {
    const survey = store.get(request.params.id)
    if (!survey) {
      response.status(404).json({ error: 'Опрос не найден' })
      return
    }
    response.json(survey)
  })

  app.get('/api/surveys/:id/results', (request: Request<{ id: string }>, response: Response) => {
    const results = store.results(request.params.id)
    if (!results) {
      response.status(404).json({ error: 'Опрос не найден' })
      return
    }
    response.json(results)
  })

  app.post('/api/surveys', (request: Request, response: Response) => {
    const { title, description, options } = request.body as Record<string, unknown>
    if (!isText(title) || !Array.isArray(options) || options.length < 2 ||
        options.some((value: unknown) => !isText(value))) {
      response.status(400).json({ error: 'Укажите вопрос и не менее двух вариантов' })
      return
    }
    const survey = store.addSurvey(title.trim(), typeof description === 'string' ? description.trim() : '', options)
    response.status(201).json(survey)
  })

  app.post('/api/surveys/:id/votes', (request: Request<{ id: string }>, response: Response) => {
    const { optionId } = request.body as Record<string, unknown>
    if (!isText(optionId) || !store.vote(request.params.id, optionId)) {
      response.status(400).json({ error: 'Неверный опрос или вариант ответа' })
      return
    }
    response.status(201).json({ success: true })
  })

  app.post('/api/feedback', (request: Request, response: Response) => {
    const { name, message } = request.body as Record<string, unknown>
    if (!isText(message)) {
      response.status(400).json({ error: 'Текст отзыва обязателен' })
      return
    }
    const feedback = store.addFeedback(typeof name === 'string' && name.trim() ? name.trim() : 'Анонимно', message.trim())
    response.status(201).json(feedback)
  })

  return app
}
