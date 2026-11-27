import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { createApp } from './app.js'
import { createStore, percent } from './data/store.js'

describe('API платформы', () => {
  it('выполняет основной сценарий: список, опрос, голос, результаты', async () => {
    const app = createApp(createStore())

    const list = await request(app).get('/api/surveys')

    expect(list.status).toBe(200)
    expect(list.body).toHaveLength(2)

    const surveyId: string = list.body[0].id
    const detail = await request(app).get(`/api/surveys/${surveyId}`)

    expect(detail.status).toBe(200)
    expect(detail.body.options.length).toBeGreaterThanOrEqual(2)

    const optionId: string = detail.body.options[0].id
    const previousVotes: number = detail.body.options[0].votes
    const voted = await request(app).post(`/api/surveys/${surveyId}/votes`).send({ optionId })

    expect(voted.status).toBe(201)
    expect(voted.body.success).toBe(true)

    const results = await request(app).get(`/api/surveys/${surveyId}/results`)

    expect(results.status).toBe(200)
    expect(results.body.options[0].votes).toBe(previousVotes + 1)
    expect(results.body.totalVotes).toBe(15)
    expect(results.body.options[0].percent).toBe(Math.round((previousVotes + 1) / 15 * 100))
  })

  it('создаёт новый опрос и считает первый голос', async () => {
    const app = createApp(createStore())
    const created = await request(app).post('/api/surveys').send({
      title: 'Тестовый опрос', description: '', options: ['Да', 'Нет']
    })

    expect(created.status).toBe(201)

    const surveyId: string = created.body.id
    const optionId: string = created.body.options[0].id
    const emptyResults = await request(app).get(`/api/surveys/${surveyId}/results`)

    expect(emptyResults.body.totalVotes).toBe(0)
    expect(emptyResults.body.options[0].percent).toBe(0)

    const voted = await request(app).post(`/api/surveys/${surveyId}/votes`).send({ optionId })

    expect(voted.status).toBe(201)

    const results = await request(app).get(`/api/surveys/${surveyId}/results`)

    expect(results.body.totalVotes).toBe(1)
    expect(results.body.options[0].percent).toBe(100)
  })

  it('отклоняет неверный вариант и неизвестный опрос', async () => {
    const app = createApp(createStore())

    expect((await request(app).post('/api/surveys/1/votes').send({ optionId: 'wrong' })).status).toBe(400)
    expect((await request(app).get('/api/surveys/missing')).status).toBe(404)
    expect((await request(app).get('/api/surveys/missing/results')).status).toBe(404)
    expect((await request(app).post('/api/surveys/missing/votes').send({ optionId: '1a' })).status).toBe(404)
  })

  it('проверяет ввод при создании опроса и отправке отзыва', async () => {
    const app = createApp(createStore())

    expect((await request(app).post('/api/surveys').send({ title: '' })).status).toBe(400)
    expect((await request(app).post('/api/surveys').send({ title: 'Вопрос', options: ['Да'] })).status).toBe(400)
    expect((await request(app).post('/api/feedback').send({ message: '' })).status).toBe(400)
    expect((await request(app).post('/api/feedback').send({ message: 'Хороший проект' })).status).toBe(201)
  })

  it('возвращает статус сервера', async () => {
    const app = createApp(createStore())
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('ok')
  })

  it('считает проценты и обрабатывает ноль голосов', () => {
    expect(percent(0, 0)).toBe(0)
    expect(percent(3, 4)).toBe(75)
  })
})
