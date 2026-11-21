import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'

describe('маршрутизация', () => {
  it('renders the home page', () => {
    const html = renderToString(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>)
    expect(html).toContain('Платформа опросов и отзывов')
  })

  it('renders an about page', () => {
    const html = renderToString(<MemoryRouter initialEntries={['/about']}><App /></MemoryRouter>)
    expect(html).toContain('О проекте')
  })
})
