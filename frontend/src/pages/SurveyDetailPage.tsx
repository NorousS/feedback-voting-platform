import { useEffect, useState, type FormEvent } from 'react'

import { Button, PageTitle, Panel } from '@feedback/ui'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { api } from '../api'
import { Alert } from '../components/Alert'

import type { Survey } from '../types'

export function SurveyDetailPage() {
  const { surveyId = '' } = useParams()

  return <SurveyDetailContent key={surveyId} surveyId={surveyId} />
}

function SurveyDetailContent({ surveyId }: { surveyId: string }) {
  const navigate = useNavigate()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [optionId, setOptionId] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load(): Promise<void> {
      try {
        const data = await api.getSurvey(surveyId)

        if (active) setSurvey(data)
      } catch {
        if (active) setError('Опрос не найден или сервер недоступен.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => { active = false }
  }, [surveyId])

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (!survey || submitting) return

    if (!optionId) {
      setError('Сначала выберите вариант ответа.')

      return
    }

    setError('')
    setSubmitting(true)

    try {
      await api.vote(surveyId, optionId)
      navigate(`/surveys/${surveyId}/results`)
    } catch {
      setError('Не удалось сохранить голос. Попробуйте ещё раз.')
      setSubmitting(false)
    }
  }

  return (
    <>
      <Link className="back-link" to="/surveys">← Все опросы</Link>
      <PageTitle
        title={survey?.title ?? (loading ? 'Загрузка опроса...' : 'Опрос недоступен')}
        description={survey?.description}
      />
      {loading && <p role="status">Загружаем варианты ответа...</p>}
      {error && <Alert message={error} />}
      {survey && (
        <Panel>
          <form onSubmit={submit} className="form-stack">
            <h2>Ваш ответ</h2>
            <div className="choices" role="radiogroup" aria-label="Варианты ответа">
              {survey.options.map((option) => (
                <label key={option.id} className={`choice ${optionId === option.id ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="vote"
                    value={option.id}
                    checked={optionId === option.id}
                    disabled={submitting}
                    onChange={() => {
                      setOptionId(option.id)
                      setError('')
                    }}
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Отправка...' : 'Проголосовать'}
            </Button>
            <Link to={`/surveys/${surveyId}/results`}>Посмотреть результаты</Link>
          </form>
        </Panel>
      )}
    </>
  )
}
