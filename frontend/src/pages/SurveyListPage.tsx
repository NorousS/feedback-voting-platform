import { useEffect, useState } from 'react'
import { Button, PageTitle, Panel } from '@feedback/ui'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { Alert } from '../components/Alert'
import type { SurveySummary } from '../types'

export function SurveyListPage() {
  const [surveys, setSurveys] = useState<SurveySummary[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.listSurveys().then((data) => { if (active) setSurveys(data) })
      .catch(() => { if (active) setError('Не удалось загрузить опросы. Проверьте, запущен ли API.') })
    return () => { active = false }
  }, [])

  return (
    <>
      <div className="heading-row">
        <PageTitle title="Опросы" description="Выберите опрос и поделитесь своим мнением." />
        <Link to="/surveys/new"><Button>+ Создать опрос</Button></Link>
      </div>
      {error && <Alert message={error} />}
      <div className="cards-grid">
        {surveys.map((survey) => (
          <Panel key={survey.id}>
            <div className="card-label">ОПРОС · {survey.totalVotes} голосов</div>
            <h2>{survey.title}</h2>
            <p>{survey.description}</p>
            <div className="card-actions">
              <Link to={`/surveys/${survey.id}`}>Проголосовать</Link>
              <Link to={`/surveys/${survey.id}/results`}>Результаты</Link>
            </div>
          </Panel>
        ))}
      </div>
    </>
  )
}
