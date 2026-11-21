import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from './app.js'
import { createStore, percent } from './data/store.js'

describe('API платформы', () => {
  it('returns survey list and results', async () => {
    const app = createApp(createStore())
    const list = await request(app).get('/api/surveys')
    expect(list.status).toBe(200)
    expect(list.body).toHaveLength(2)

    const result = await request(app).get('/api/surveys/1/results')
    expect(result.status).toBe(200)
    expect(result.body.totalVotes).toBe(14)
  })

  it('creates a survey and accepts a vote', async () => {
    const app = createApp(createStore())
    const created = await request(app).post('/api/surveys').send({
      title: 'Тестовый опрос', description: '', options: ['Да', 'Нет']
    })
    expect(created.status).toBe(201)

    const surveyId: string = created.body.id
    const optionId: string = created.body.options[0].id
    const voted = await request(app).post(`/api/surveys/${surveyId}/votes`).send({ optionId })
    expect(voted.status).toBe(201)

    const results = await request(app).get(`/api/surveys/${surveyId}/results`)
    expect(results.body.totalVotes).toBe(1)
  })

  it('rejects invalid requests', async () => {
    const app = createApp(createStore())
    expect((await request(app).post('/api/surveys').send({ title: '' })).status).toBe(400)
    expect((await request(app).post('/api/feedback').send({ message: '' })).status).toBe(400)
    expect((await request(app).get('/api/surveys/not-found')).status).toBe(404)
  })

  it('calculates percentages safely', () => {
    expect(percent(0, 0)).toBe(0)
    expect(percent(3, 4)).toBe(75)
  })
})
