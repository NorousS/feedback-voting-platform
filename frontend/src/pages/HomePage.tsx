
import { Button, PageTitle, Panel, StatCard } from '@feedback/ui'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <>
      <div className="hero">
        <div className="hero-content">
          <span className="eyebrow">ОПРОСЫ И ОБРАТНАЯ СВЯЗЬ</span>
          <PageTitle
            title="Платформа опросов и отзывов"
            description="Создавайте опросы, собирайте ответы и смотрите результаты голосования."
          />
          <div className="actions">
            <Link to="/surveys">
              <Button>Перейти к опросам</Button>
            </Link>
            <Link to="/surveys/new">
              <Button variant="secondary">Создать опрос</Button>
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <h2>Пример результатов</h2>
          <div className="demo-result">
            <div className="demo-label">
              <span>Вариант 1</span>
              <span>60%</span>
            </div>
            <div className="demo-track">
              <div className="demo-fill" style={{ width: '60%' }} />
            </div>
          </div>
          <div className="demo-result">
            <div className="demo-label">
              <span>Вариант 2</span>
              <span>30%</span>
            </div>
            <div className="demo-track">
              <div className="demo-fill" style={{ width: '30%' }} />
            </div>
          </div>
          <div className="demo-result">
            <div className="demo-label">
              <span>Вариант 3</span>
              <span>10%</span>
            </div>
            <div className="demo-track">
              <div className="demo-fill" style={{ width: '10%' }} />
            </div>
          </div>
          <small>Демонстрационный пример</small>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard value="01" label="Создание опросов" />
        <StatCard value="02" label="Голосование" />
        <StatCard value="03" label="Анализ результатов" />
      </div>

      <Panel>
        <h2>Возможности приложения</h2>
        <p>
                    В проекте можно создавать опросы, выбирать варианты ответа,
                    смотреть результаты в виде диаграмм и оставлять отзывы.
        </p>
        <p>
                    Пока все данные хранятся в памяти сервера и удаляются после его перезапуска.
        </p>
      </Panel>
    </>
  )
}
