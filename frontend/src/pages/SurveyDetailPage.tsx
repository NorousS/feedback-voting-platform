import { useEffect, useState, type FormEvent } from 'react'
import { Button, PageTitle, Panel } from '@feedback/ui'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { Alert } from '../components/Alert'
import type { Survey } from '../types'

export function SurveyDetailPage() {
  const { surveyId = '' } = useParams()
  const navigate = useNavigate()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [optionId, setOptionId] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    api.getSurvey(surveyId).then((data) => { if (active) setSurvey(data) })
      .catch(() => { if (active) setError('Опрос не найден или API недоступен') })
    return () => { active = false }
  }, [surveyId])

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (!optionId) { setError('Выберите вариант ответа'); return }
    setSubmitting(true)
    try {
      await api.vote(surveyId, optionId)
      navigate(`/surveys/${surveyId}/results`)
    } catch {
      setError('Не получилось сохранить голос')
      setSubmitting(false)
    }
  }

  return (
    <>
      <Link className="back-link" to="/surveys">← Все опросы</Link>
      <PageTitle title={survey?.title ?? 'Загрузка опроса...'} description={survey?.description} />
      {error && <Alert message={error} />}
      {survey && <Panel>
        <form onSubmit={submit} className="form-stack">
          <h2>Ваш ответ</h2>
          <div className="choices">
            {survey.options.map((option) => (
              <label key={option.id} className={`choice ${optionId === option.id ? 'selected' : ''}`}>
                <input type="radio" name="vote" value={option.id} checked={optionId === option.id}
                  onChange={() => setOptionId(option.id)} />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
          <Button type="submit" disabled={submitting}>{submitting ? 'Отправка...' : 'Проголосовать'}</Button>
          <Link to={`/surveys/${surveyId}/results`}>Посмотреть результаты</Link>
        </form>
      </Panel>}
    </>
  )
}
