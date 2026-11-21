import { useState, type FormEvent } from 'react'
import { Button, PageTitle, Panel } from '@feedback/ui'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { Alert } from '../components/Alert'

export function CreateSurveyPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState('Да\nНет')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const choices = options.split('\n').map((option) => option.trim()).filter(Boolean)
    if (!title.trim() || choices.length < 2) {
      setError('Введите вопрос и минимум два варианта на отдельных строках')
      return
    }
    setSubmitting(true)
    try {
      const survey = await api.addSurvey(title.trim(), description.trim(), choices)
      navigate(`/surveys/${survey.id}`)
    } catch {
      setError('Не удалось создать опрос')
      setSubmitting(false)
    }
  }

  return (
    <>
      <Link className="back-link" to="/surveys">← Все опросы</Link>
      <PageTitle title="Новый опрос" description="Задайте вопрос и варианты ответа." />
      <Panel>
        <form className="form-stack" onSubmit={submit}>
          <label>Вопрос<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Например, какой функционал важнее?" /></label>
          <label>Описание<input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Необязательно" /></label>
          <label>Варианты (по одному на строке)<textarea rows={5} value={options} onChange={(event) => setOptions(event.target.value)} /></label>
          {error && <Alert message={error} />}
          <Button disabled={submitting} type="submit">{submitting ? 'Сохранение...' : 'Создать опрос'}</Button>
        </form>
      </Panel>
    </>
  )
}
