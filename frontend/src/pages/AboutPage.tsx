import { PageTitle, Panel } from '@feedback/ui'

export function AboutPage() {
  return (
    <>
      <PageTitle title="О проекте" description="Платформа для опросов и сбора отзывов." />
      <Panel>
        <h2>Технологии</h2>
        <p>Интерфейс: React 19 и TypeScript. Сервер: Node.js и Express. Общие UI-компоненты вынесены в отдельную библиотеку.</p>
        <p>Для лабораторной № 5 создан каркас. Данные хранятся в оперативной памяти и не сохраняются между перезапусками.</p>
      </Panel>
    </>
  )
}
