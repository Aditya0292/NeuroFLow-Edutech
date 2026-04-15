import { NextResponse } from "next/server"
import type { LeaderboardEntry } from "@/types"
import { store } from "@/lib/store"

export async function GET() {
  const entries: LeaderboardEntry[] = store.getLeaderboard()
  return NextResponse.json(entries)
}

