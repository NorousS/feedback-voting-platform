// @vitest-environment jsdom
import { act } from 'react'

import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from './api'
import { App } from './App'

import type { Survey, SurveyResults, SurveySummary } from './types'

const survey: Survey = {
  id: '1',
  title: 'Какой вариант выбрать?',
  description: 'Тестовое голосование',
  options: [
    { id: '1a', text: 'Первый', votes: 2 },
    { id: '1b', text: 'Второй', votes: 0 }
  ]
}

const summary: SurveySummary = {
  id: '1',
  title: survey.title,
  description: survey.description,
  totalVotes: 2
}

const results: SurveyResults = {
  ...summary,
  totalVotes: 3,
  options: [
    { id: '1a', text: 'Первый', votes: 3, percent: 100 },
    { id: '1b', text: 'Второй', votes: 0, percent: 0 }
  ]
}

let container: HTMLDivElement
let root: Root

async function openPage(path: string): Promise<void> {
  await act(async () => {
    root.render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
  })
}

async function click(element: Element | null): Promise<void> {
  if (!(element instanceof HTMLElement)) throw new Error('Не найден элемент для нажатия')
  await act(async () => { element.click() })
}

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => { root.unmount() })
  container.remove()
  vi.restoreAllMocks()
})

describe('UC-01: голосование и результаты', () => {
  it('проходит от списка опросов до результатов', async () => {
    vi.spyOn(api, 'listSurveys').mockResolvedValue([summary])
    vi.spyOn(api, 'getSurvey').mockResolvedValue(survey)
    const vote = vi.spyOn(api, 'vote').mockResolvedValue({ success: true })

    vi.spyOn(api, 'getResults').mockResolvedValue(results)

    await openPage('/surveys')
    expect(container.textContent).toContain('Какой вариант выбрать?')

    await click(container.querySelector('a[href="/surveys/1"]'))
    expect(container.textContent).toContain('Первый')

    await click(container.querySelector('input[value="1a"]'))
    await click(container.querySelector('button[type="submit"]'))

    expect(vote).toHaveBeenCalledWith('1', '1a')
    expect(container.textContent).toContain('Распределение ответов')
    expect(container.textContent).toContain('100%')
    expect(container.textContent).toContain('Всего голосов')
  })

  it('не отправляет голос без выбранного варианта', async () => {
    vi.spyOn(api, 'getSurvey').mockResolvedValue(survey)
    const vote = vi.spyOn(api, 'vote').mockResolvedValue({ success: true })

    await openPage('/surveys/1')
    await click(container.querySelector('button[type="submit"]'))

    expect(container.textContent).toContain('Сначала выберите вариант ответа.')
    expect(vote).not.toHaveBeenCalled()
  })

  it('показывает ошибку, если опрос не найден', async () => {
    vi.spyOn(api, 'getSurvey').mockRejectedValue(new Error('404'))

    await openPage('/surveys/missing')

    expect(container.textContent).toContain('Опрос не найден или сервер недоступен.')
    expect(container.querySelector('button[type="submit"]')).toBeNull()
  })
})
