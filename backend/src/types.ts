export type Choice = {
  id: string
  text: string
  votes: number
}

export type Survey = {
  id: string
  title: string
  description: string
  options: Choice[]
}

export type SurveySummary = {
  id: string
  title: string
  description: string
  totalVotes: number
}

export type SurveyResults = SurveySummary & {
  options: Array<Choice & { percent: number }>
}

export type Feedback = {
  id: string
  name: string
  message: string
  createdAt: string
}
