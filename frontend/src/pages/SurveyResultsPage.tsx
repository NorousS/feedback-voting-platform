import { useEffect, useState } from 'react'

import { PageTitle, Panel, StatCard } from '@feedback/ui'
import { Link, useParams } from 'react-router-dom'

import { api } from '../api'
import { Alert } from '../components/Alert'

import type { SurveyResults } from '../types'

export function SurveyResultsPage() {
  const { surveyId = '' } = useParams()

  return <SurveyResultsContent key={surveyId} surveyId={surveyId} />
}

function SurveyResultsContent({ surveyId }: { surveyId: string }) {
  const [results, setResults] = useState<SurveyResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load(): Promise<void> {
      try {
        const data = await api.getResults(surveyId)

        if (active) setResults(data)
      } catch {
        if (active) setError('Не удалось загрузить результаты. Проверьте опрос и соединение с API.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => { active = false }
  }, [surveyId])

  return (
    <>
      <Link className="back-link" to="/surveys">← Все опросы</Link>
      <PageTitle title="Результаты опроса" description={results?.title} />
      {loading && <p role="status">Загрузка результатов...</p>}
      {error && <Alert message={error} />}
      {results && (
        <>
          <div className="small-stats">
            <StatCard value={results.totalVotes} label="Всего голосов" />
          </div>
          <Panel>
            <h2>Распределение ответов</h2>
            <div className="results">
              {results.options.map((option) => (
                <div key={option.id} className="result-item">
                  <div className="result-label">
                    <span>{option.text}</span>
                    <strong>{option.percent}%</strong>
                  </div>
                  <div className="result-track">
                    <div
                      className="result-fill"
                      style={{ width: `${option.percent}%` }}
                      role="progressbar"
                      aria-label={`Результат: ${option.text}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={option.percent}
                    />
                  </div>
                  <small>{option.votes} голосов</small>
                </div>
              ))}
            </div>
          </Panel>
          <p><Link to={`/surveys/${surveyId}`}>Вернуться к голосованию</Link></p>
        </>
      )}
    </>
  )
}
