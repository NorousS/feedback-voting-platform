import { useState, type FormEvent } from 'react'
import { Button, PageTitle, Panel } from '@feedback/ui'
import { api } from '../api'
import { Alert } from '../components/Alert'

export function FeedbackPage() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setError('')
    setStatus('')
    if (!message.trim()) { setError('Введите отзыв'); return }

    try {
      await api.addFeedback(name, message)
      setStatus('Спасибо! Ваш отзыв принят.')
      setMessage('')
    } catch {
      setError('Не удалось отправить отзыв')
    }
  }

  return (
    <>
      <PageTitle title="Обратная связь" description="Напишите, что можно улучшить в проекте." />
      <Panel>
        <form className="form-stack" onSubmit={submit}>
          <label>Ваше имя<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Необязательно" /></label>
          <label>Ваш отзыв<textarea rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ваше мнение..." /></label>
          {error && <Alert message={error} />}
          {status && <p className="success" role="status">{status}</p>}
          <Button type="submit">Отправить отзыв</Button>
        </form>
      </Panel>
    </>
  )
}
