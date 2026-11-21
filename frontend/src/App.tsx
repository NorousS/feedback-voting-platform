import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { SurveyLayout } from './components/SurveyLayout'
import { AboutPage } from './pages/AboutPage'
import { CreateSurveyPage } from './pages/CreateSurveyPage'
import { FeedbackPage } from './pages/FeedbackPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SurveyDetailPage } from './pages/SurveyDetailPage'
import { SurveyListPage } from './pages/SurveyListPage'
import { SurveyResultsPage } from './pages/SurveyResultsPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="surveys" element={<SurveyLayout />}>
          <Route index element={<SurveyListPage />} />
          <Route path="new" element={<CreateSurveyPage />} />
          <Route path=":surveyId" element={<SurveyDetailPage />} />
          <Route path=":surveyId/results" element={<SurveyResultsPage />} />
        </Route>
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
