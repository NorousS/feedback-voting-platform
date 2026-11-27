import { Button, PageTitle } from '@feedback/ui'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <>
      <PageTitle title="Страница не найдена" description="Проверьте адрес или вернитесь на главную." />
      <Link to="/"><Button>На главную</Button></Link>
    </>
  )
}
