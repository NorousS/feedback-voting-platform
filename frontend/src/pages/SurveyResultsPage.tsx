import { useEffect, useState } from 'react'
import { PageTitle, Panel, StatCard } from '@feedback/ui'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import { Alert } from '../components/Alert'
import type { SurveyResults } from '../types'

export function SurveyResultsPage() {
  const { surveyId = '' } = useParams()
  const [results, setResults] = useState<SurveyResults | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.getResults(surveyId).then((data) => { if (active) setResults(data) })
      .catch(() => { if (active) setError('Не удалось получить результаты') })
    return () => { active = false }
  }, [surveyId])

  return (
    <>
      <Link className="back-link" to="/surveys">← Все опросы</Link>
      <PageTitle title="Результаты опроса" description={results?.title ?? 'Загрузка...'} />
      {error && <Alert message={error} />}
      {results && <>
        <div className="small-stats"><StatCard value={results.totalVotes} label="Всего голосов" /></div>
        <Panel>
          <h2>Распределение ответов</h2>
          <div className="results">
            {results.options.map((option) => (
              <div key={option.id} className="result-item">
                <div className="result-label"><span>{option.text}</span><strong>{option.percent}%</strong></div>
                <div className="result-track"><div className="result-fill" style={{ width: `${option.percent}%` }} /></div>
                <small>{option.votes} голосов</small>
              </div>
            ))}
          </div>
        </Panel>
        <p><Link to={`/surveys/${surveyId}`}>Вернуться к голосованию</Link></p>
      </>}
    </>
  )
}
