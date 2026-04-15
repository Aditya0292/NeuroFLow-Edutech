import type { User } from "@/types"

export const XP_ACTIONS = {
  QUIZ_CORRECT: 50,
  GAME_WIN: 100,
  CODE_SOLVE: 150,
  DAILY_STREAK: 20,
  MODULE_COMPLETE: 75,
  SIMULATION_RUN: 30
}

export const LEVELS = [
  { name: "Beginner", min: 0, max: 200 },
  { name: "Learner", min: 201, max: 500 },
  { name: "Practitioner", min: 501, max: 1000 },
  { name: "Engineer", min: 1001, max: 2000 },
  { name: "ML Expert", min: 2001, max: Infinity }
]

export const BADGES = [
  { id: "first_step", name: "First Step", condition: "Complete your first quiz", icon: "🎯" },
  { id: "code_breaker", name: "Code Breaker", condition: "Solve first code challenge", icon: "💻" },
  { id: "game_on", name: "Game On", condition: "Win first mini game", icon: "🎮" },
  { id: "on_fire", name: "On Fire", condition: "Maintain 3 day streak", icon: "🔥" },
  { id: "module_master", name: "Module Master", condition: "Complete 3 modules", icon: "📚" },
  { id: "top_gun", name: "Top Gun", condition: "Reach top 3 on leaderboard", icon: "🏆" },
  { id: "simulator", name: "Simulator", condition: "Run 5 simulations", icon: "🔬" }
]

export function calculateLevel(xp: number): string {
  const normalizedXP = Math.max(0, Math.floor(xp))
  const level = LEVELS.find((l) => normalizedXP >= l.min && normalizedXP <= l.max)
  return level?.name ?? LEVELS[LEVELS.length - 1].name
}

export function awardXP(
  currentXP: number,
  action: keyof typeof XP_ACTIONS
): { newXP: number; levelUp: boolean; newLevel: string; xpGained: number } {
  const safeCurrent = Math.max(0, Math.floor(currentXP))
  const xpGained = XP_ACTIONS[action] ?? 0
  const newXP = safeCurrent + xpGained
  const oldLevel = calculateLevel(safeCurrent)
  const newLevel = calculateLevel(newXP)
  return {
    newXP,
    levelUp: oldLevel !== newLevel,
    newLevel,
    xpGained
  }
}

export function checkAndAwardBadges(user: User): string[] {
  const earned = new Set(user.badges)
  const newlyEarned: string[] = []

  const grant = (badgeId: string) => {
    if (!earned.has(badgeId)) {
      earned.add(badgeId)
      newlyEarned.push(badgeId)
    }
  }

  if (user.xp > 0) grant("first_step")
  if (user.completedModules.length >= 1) grant("code_breaker")
  if (user.streak >= 1) grant("game_on")
  if (user.streak >= 3) grant("on_fire")
  if (user.completedModules.length >= 3) grant("module_master")
  if (user.xp >= 1500) grant("top_gun")
  if (user.completedModules.length >= 5) grant("simulator")

  return newlyEarned
}

export function calculateStreak(lastLogin: string): number {
  const previous = new Date(lastLogin)
  if (Number.isNaN(previous.getTime())) return 1

  const now = new Date()
  const previousDay = new Date(previous.getFullYear(), previous.getMonth(), previous.getDate())
  const currentDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.floor((currentDay.getTime() - previousDay.getTime()) / 86_400_000)

  if (diffDays <= 0) return 1
  if (diffDays === 1) return 2
  return 1
}

export function getProgressToNextLevel(
  xp: number
): { current: number; needed: number; percentage: number } {
  const safeXP = Math.max(0, Math.floor(xp))
  const currentLevelIndex = LEVELS.findIndex((level) => safeXP >= level.min && safeXP <= level.max)
  const index = currentLevelIndex === -1 ? LEVELS.length - 1 : currentLevelIndex
  const currentLevel = LEVELS[index]
  const nextLevel = LEVELS[index + 1]

  if (!nextLevel) {
    return { current: safeXP, needed: 0, percentage: 100 }
  }

  const span = nextLevel.min - currentLevel.min
  const progressed = safeXP - currentLevel.min
  const needed = Math.max(0, nextLevel.min - safeXP)
  const percentage = Math.max(0, Math.min(100, (progressed / span) * 100))
  return { current: safeXP, needed, percentage }
}

// Backward-compatible aliases used elsewhere in project.
type AwardXpInput =
  | { kind: "quiz"; score: number }
  | { kind: "code-lab"; passed: boolean }
  | { kind: "game"; score: number }

export function awardXp(input: AwardXpInput): number {
  if (input.kind === "quiz") return XP_ACTIONS.QUIZ_CORRECT
  if (input.kind === "code-lab") return input.passed ? XP_ACTIONS.CODE_SOLVE : 0
  return input.score > 0 ? XP_ACTIONS.GAME_WIN : 0
}

export function levelFromXp(xp: number): string {
  return calculateLevel(xp)
}

