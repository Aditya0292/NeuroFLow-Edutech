export interface User {
  id: string
  name: string
  email: string
  xp: number
  level: string
  streak: number
  badges: string[]
  completedModules: string[]
  lastLogin: string
}

export interface QuizResult {
  score: number
  xp_earned: number
  explanation: string
}

export interface CodeLabResult {
  output: string
  feedback: string
  xp_earned: number
  passed: boolean
}

export interface GameResult {
  game: string
  score: number
  xp_earned: number
}

export interface LeaderboardEntry {
  rank: number
  name: string
  xp: number
  level: string
  badges: string[]
}

export interface LearningModule {
  id: string
  title: string
  level: "Beginner" | "Intermediate" | "Advanced"
  description: string
  concepts: string[]
  examples: string[]
  quizTopic: string
}

