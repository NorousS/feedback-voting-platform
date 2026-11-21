# Архитектура платформы сбора отзывов и голосований

## 1. Назначение

Платформа позволяет создавать опросы, голосовать, смотреть агрегированные результаты и отправлять текстовые отзывы. Тема курсовой работы — «Разработка платформы для сбора отзывов и голосований с аналитикой результатов с использованием Node.js».

## 2. Структура монорепозитория

В одном репозитории размещены **три отдельных проекта** в корневых папках `frontend`, `ui-library` и `backend`. Это npm workspaces, поэтому у каждого проекта свой `package.json`, но зависимости устанавливаются одной командой в корне:

```text
feedback-voting-platform/
├── frontend/                       # React 19 + TypeScript (основное приложение)
│   ├── src/
│   │   ├── components/              # Layout, SurveyLayout, Alert
│   │   ├── pages/                   # страницы опросов, отзывов и аналитики
│   │   ├── App.tsx                  # вложенные маршруты React Router
│   │   ├── api.ts                   # клиент для Node.js API
│   │   ├── types.ts                 # типы ответов API
│   │   ├── main.tsx                 # точка входа
│   │   └── styles.css               # стили приложения и UI-компонентов
│   ├── index.html
│   ├── vite.config.ts               # Vite и proxy /api
│   ├── tsconfig.json
│   └── package.json
├── ui-library/                     # библиотека общих React-компонентов
│   ├── src/
│   │   ├── components/              # Button, Panel, PageTitle, StatCard
│   │   │   └── Button.test.tsx      # юнит-тесты Button
│   │   ├── index.ts                 # публичное API библиотеки
│   │   └── setupTests.ts
│   ├── tsconfig.build.json
│   ├── vitest.config.ts             # покрытие Button >= 70% по 4 метрикам
│   └── package.json
├── backend/                        # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── data/store.ts            # временные опросы, голоса, отзывы
│   │   ├── app.ts                   # API-маршруты Express
│   │   ├── app.test.ts              # тесты API
│   │   ├── index.ts                 # HTTP-сервер
│   │   └── types.ts                 # серверные типы
│   ├── tsconfig.json
│   └── package.json
├── docs/screenshots/               # сюда добавить реальные скриншоты
├── .gitignore                      # node_modules, coverage, dist
├── .nvmrc
├── eslint.config.mjs
├── package.json                    # npm workspaces и общие команды
├── architecture.md
├── mvp.md
└── README.md
```

## 3. Библиотеки

Версии указаны как ориентир для начальной установки и зафиксированы в `package.json`.

| Проект | Библиотека | Версия | Назначение |
|---|---|---|---|
| frontend | React и React DOM | 19.3.1 | пользовательский интерфейс |
| frontend | React Router DOM | 7.18.6 | клиентская маршрутизация |
| frontend | Vite | 8.2.6 | dev-сервер и сборка |
| frontend | @vitejs/plugin-react | 6.2.1 | обработка React-компонентов |
| backend | Express | 5.3.0 | HTTP API на Node.js |
| backend | tsx | 4.20.6 | запуск TypeScript при разработке |
| все проекты | TypeScript | 5.9.3 | типизация исходного кода |
| все проекты | Vitest | 5.1.1 | автоматические тесты |
| все проекты | @vitest/coverage-v8 | 5.1.1 | расчёт покрытия тестами |
| ui-library | @testing-library/react | 16.3.0 | тестирование React-компонентов |
| ui-library | @testing-library/jest-dom | 6.9.1 | DOM-матчеры тестирования |
| корень | ESLint | 9.39.1 | единые правила качества кода |
| корень | typescript-eslint | 8.73.0 | правила ESLint для TypeScript |

## 4. Разрабатываемые компоненты

### Библиотека `ui-library`

- `Button` — кнопка с primary/secondary вариантами и поддержкой стандартных событий.
- `Panel` — универсальный контейнер для содержимого страниц.
- `PageTitle` — заголовок страницы с необязательным описанием.
- `StatCard` — карточка числового показателя.

### Основное приложение `frontend`

- `Layout` — шапка, навигация, основная область и подвал.
- `SurveyLayout` — вложенный контейнер раздела опросов (`Outlet`).
- `Alert` — сообщение об ошибке.
- `HomePage` — главная страница платформы.
- `SurveyListPage` — список доступных опросов.
- `CreateSurveyPage` — создание нового опроса.
- `SurveyDetailPage` — варианты и отправка голоса.
- `SurveyResultsPage` — аналитика по голосам с горизонтальными диаграммами.
- `FeedbackPage` — отправка текстового отзыва.
- `AboutPage` — информация о проекте.
- `NotFoundPage` — страница отсутствующего маршрута.

### Сервер `backend`

- `createApp` — конфигурация Express и обработчики запросов.
- `createStore` — временное хранилище и операции над данными.
- `percent` — расчёт процентов для аналитики.

## 5. Роутинг веб-приложения

Вложенные маршруты используют `Layout` (общая оболочка) и `SurveyLayout` (оболочка раздела опросов).

| Маршрут | Страница | Параметры/вложенность |
|---|---|---|
| `/` | `HomePage` | индексный маршрут внутри `Layout` |
| `/surveys` | `SurveyListPage` | внутри `SurveyLayout` |
| `/surveys/new` | `CreateSurveyPage` | внутри `SurveyLayout` |
| `/surveys/:surveyId` | `SurveyDetailPage` | динамический `surveyId`, вложенный |
| `/surveys/:surveyId/results` | `SurveyResultsPage` | динамический `surveyId`, вложенный |
| `/feedback` | `FeedbackPage` | внутри `Layout` |
| `/about` | `AboutPage` | внутри `Layout` |
| `*` | `NotFoundPage` | неизвестный путь |

Защищённые маршруты в данной версии **не предусмотрены**: регистрация и авторизация находятся за рамками MVP.

## 6. Как frontend использует ui-library

Библиотека объявлена в `ui-library/package.json` как пакет `@feedback/ui`, который подключён к `frontend/package.json` через npm workspaces. Публичные компоненты экспортируются из `ui-library/src/index.ts`. Например, страницы используют:

```tsx
import { Button, PageTitle, Panel, StatCard } from '@feedback/ui'
```

Перед запуском, сборкой или тестированием frontend библиотека компилируется через `npm run build -w @feedback/ui` (автоматические `predev`, `prebuild`, `pretest`). Таким образом клиент импортирует настоящие JS-модули и декларации типов из `ui-library/dist`, а не копии исходных файлов. React 19 является peer dependency библиотеки, чтобы не подключать вторую копию React.

## 7. API и данные

- `GET /api/health` — проверка сервера.
- `GET /api/surveys` — список опросов.
- `GET /api/surveys/:id` — опрос с вариантами ответа.
- `POST /api/surveys` — создание опроса.
- `POST /api/surveys/:id/votes` — добавление голоса.
- `GET /api/surveys/:id/results` — агрегированные результаты.
- `POST /api/feedback` — отправка отзыва.

На этапе каркаса вместо базы данных используется память процесса. При перезапуске API добавленные данные исчезают. В полноценной курсовой планируется постоянное хранение в БД и проверка уникальности голоса.

## 8. Запуск и связи проектов

- `npm install` из корня устанавливает зависимости всех трёх workspace-проектов.
- `npm run dev` запускает наблюдение за сборкой `ui-library`, React/Vite на порту 5173 и Node.js/Express на порту 3001.
- `frontend` импортирует `@feedback/ui` через npm workspaces. Библиотека имеет `react` как peer dependency для предотвращения двух копий React.
- Vite проксирует запросы `/api/*` на `backend`; backend возвращает JSON, а frontend отображает страницы и диаграммы.
- Каждый из трёх проектов имеет команды `dev`, `build`, `lint`, `lint:fix`, `test`, `test:coverage`.
- Пользовательская авторизация и защищённые маршруты не входят в MVP.
