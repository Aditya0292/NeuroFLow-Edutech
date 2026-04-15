import type { LeaderboardEntry, User } from "@/types"
import { levelFromXp } from "@/lib/xp"

type StoreState = {
  user: User
  leaderboard: LeaderboardEntry[]
}

const state: StoreState = {
  user: {
    id: "local",
    name: "Player",
    xp: 0,
    level: "Beginner",
    streak: 0,
    badges: []
  },
  leaderboard: []
}

function recomputeUser() {
  state.user.level = levelFromXp(state.user.xp)
}

export const store = {
  getUser(): User {
    return { ...state.user, badges: [...state.user.badges] }
  },

  addXp(amount: number) {
    state.user.xp += Math.max(0, Math.floor(amount))
    recomputeUser()
  },

  getLeaderboard(): LeaderboardEntry[] {
    return state.leaderboard.map((e) => ({ ...e, badges: [...e.badges] }))
  },

  upsertLeaderboardEntry(entry: LeaderboardEntry) {
    const idx = state.leaderboard.findIndex((e) => e.name === entry.name)
    if (idx === -1) state.leaderboard.push(entry)
    else state.leaderboard[idx] = entry
    state.leaderboard.sort((a, b) => b.xp - a.xp)
  }
}

