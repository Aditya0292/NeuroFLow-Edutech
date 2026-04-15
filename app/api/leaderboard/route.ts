import { NextResponse } from "next/server"
import type { LeaderboardEntry } from "@/types"
import { getLeaderboard, getUser } from "@/lib/store"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")?.trim()

    const leaderboard: LeaderboardEntry[] = getLeaderboard()
      .slice()
      .sort((a, b) => b.xp - a.xp)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))

    if (!userId) {
      return NextResponse.json({ leaderboard })
    }

    const user = getUser(userId)
    const userRank = user ? leaderboard.find((entry) => entry.name === user.name)?.rank : undefined
    return NextResponse.json(
      userRank ? { leaderboard, userRank } : { leaderboard }
    )
  } catch (error) {
    console.error("GET /api/leaderboard failed:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard." }, { status: 500 })
  }
}

