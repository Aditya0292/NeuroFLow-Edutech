import type { LeaderboardEntry, User } from "@/types"

const seededUsers = new Map<string, User>([
  [
    "seed1",
    {
      id: "seed1",
      name: "Arjun S.",
      email: "arjun@demo.com",
      xp: 1850,
      level: "Engineer",
      streak: 7,
      badges: ["First Step", "Code Breaker", "Game On", "On Fire"],
      completedModules: ["linear-regression", "neural-networks", "decision-trees"],
      lastLogin: new Date().toISOString()
    }
  ],
  [
    "seed2",
    {
      id: "seed2",
      name: "Priya M.",
      email: "priya@demo.com",
      xp: 1200,
      level: "Practitioner",
      streak: 4,
      badges: ["First Step", "On Fire"],
      completedModules: ["linear-regression", "decision-trees"],
      lastLogin: new Date().toISOString()
    }
  ],
  [
    "seed3",
    {
      id: "seed3",
      name: "Rohan K.",
      email: "rohan@demo.com",
      xp: 900,
      level: "Practitioner",
      streak: 2,
      badges: ["First Step", "Code Breaker"],
      completedModules: ["linear-regression"],
      lastLogin: new Date().toISOString()
    }
  ],
  [
    "seed4",
    {
      id: "seed4",
      name: "Sneha P.",
      email: "sneha@demo.com",
      xp: 550,
      level: "Learner",
      streak: 1,
      badges: ["First Step"],
      completedModules: [],
      lastLogin: new Date().toISOString()
    }
  ],
  [
    "seed5",
    {
      id: "seed5",
      name: "Dev T.",
      email: "dev@demo.com",
      xp: 280,
      level: "Learner",
      streak: 1,
      badges: ["Game On"],
      completedModules: [],
      lastLogin: new Date().toISOString()
    }
  ]
])

declare global {
  // eslint-disable-next-line no-var
  var __vibeathonUsers: Map<string, User> | undefined
}

const users = globalThis.__vibeathonUsers ?? new Map<string, User>(seededUsers)
if (!globalThis.__vibeathonUsers) {
  globalThis.__vibeathonUsers = users
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function cloneUser(user: User): User {
  return {
    ...user,
    badges: [...user.badges],
    completedModules: [...user.completedModules]
  }
}

export function getUser(id: string): User | undefined {
  const user = users.get(id)
  return user ? cloneUser(user) : undefined
}

export function getUserByEmail(email: string): User | undefined {
  const normalized = normalizeEmail(email)
  for (const user of users.values()) {
    if (normalizeEmail(user.email) === normalized) return cloneUser(user)
  }
  return undefined
}

export function createUser(user: User): User {
  users.set(user.id, cloneUser(user))
  return cloneUser(user)
}

export function updateUser(id: string, updates: Partial<User>): User {
  const existing = users.get(id)
  if (!existing) throw new Error("USER_NOT_FOUND")
  const updated: User = {
    ...existing,
    ...updates,
    badges: updates.badges ? [...updates.badges] : [...existing.badges],
    completedModules: updates.completedModules
      ? [...updates.completedModules]
      : [...existing.completedModules]
  }
  users.set(id, updated)
  return cloneUser(updated)
}

export function getAllUsers(): User[] {
  return Array.from(users.values()).map(cloneUser)
}

export function getLeaderboard(): LeaderboardEntry[] {
  return getAllUsers()
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({
      rank: index + 1,
      name: user.name,
      xp: user.xp,
      level: user.level,
      badges: [...user.badges]
    }))
}

