export interface User {
  id: string
  name: string
  xp: number
  level: string
  streak: number
  badges: string[]
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
  name: string
  xp: number
  level: string
  badges: string[]
}

