import { useRef, useState, type FormEvent } from 'react'

import { Button, PageTitle, Panel } from '@feedback/ui'
import { Link, useNavigate } from 'react-router-dom'

import { api } from '../api'
import { Alert } from '../components/Alert'

type OptionField = {
  id: number
  text: string
}

export function CreateSurveyPage() {
  const navigate = useNavigate()
  const nextId = useRef(3)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState<OptionField[]>([
    { id: 1, text: '' },
    { id: 2, text: '' }
  ])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function addOption(): void {
    const id = nextId.current

    nextId.current += 1
    setOptions((current) => [...current, { id, text: '' }])
    setError('')
  }

  function removeOption(id: number): void {
    if (options.length <= 2) return

    setOptions((current) => current.filter((option) => option.id !== id))
    setError('')
  }

  function updateOption(id: number, text: string): void {
    setOptions((current) => current.map((option) =>
      option.id === id ? { ...option, text } : option
    ))
    setError('')
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    if (submitting) return

    setError('')

    const choices = options.map((option) => option.text.trim())

    if (!title.trim()) {
      setError('Введите вопрос')

      return
    }

    if (choices.length < 2 || choices.some((choice) => !choice)) {
      setError('Заполните все варианты ответа')

      return
    }

    setSubmitting(true)

    try {
      const survey = await api.addSurvey(
        title.trim(),
        description.trim(),
        choices
      )

      navigate(`/surveys/${survey.id}`)
    } catch {
      setError('Не удалось создать опрос')
      setSubmitting(false)
    }
  }

  return (
    <>
      <Link className="back-link" to="/surveys">
          ← Все опросы
      </Link>

      <PageTitle
        title="Новый опрос"
        description="Задайте вопрос и добавьте варианты ответа."
      />

      <Panel>
        <form className="form-stack" onSubmit={submit}>
          <label>
              Вопрос
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Введите вопрос"
              disabled={submitting}
            />
          </label>

          <label>
              Описание
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Необязательно"
              disabled={submitting}
            />
          </label>

          <h2>Варианты ответа</h2>

          {options.map((option, index) => (
            <div
              key={option.id}
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '10px'
              }}
            >
              <label style={{ flex: 1 }}>
                    Вариант {index + 1}
                <input
                  value={option.text}
                  placeholder={`Введите вариант ${index + 1}`}
                  onChange={(event) =>
                    updateOption(option.id, event.target.value)
                  }
                  disabled={submitting}
                />
              </label>

              <Button
                type="button"
                variant="secondary"
                disabled={options.length <= 2 || submitting}
                onClick={() => removeOption(option.id)}
              >
                    Удалить
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={addOption}
            disabled={submitting}
          >
              + Добавить вариант
          </Button>

          {error && <Alert message={error} />}

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Сохранение...' : 'Создать опрос'}
          </Button>
        </form>
      </Panel>
    </>
  )
}
