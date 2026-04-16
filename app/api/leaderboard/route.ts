import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { LeaderboardEntry } from "@/types"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")?.trim()
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // 1. Fetch top 50 operators from Supabase
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("name, xp, level, badges")
      .order("xp", { ascending: false })
      .limit(50)

    if (error) throw error

    // 2. Map profiles to LeaderboardEntry types
    const leaderboard: LeaderboardEntry[] = (profiles || []).map((p, index) => ({
      rank: index + 1,
      name: p.name,
      xp: p.xp,
      level: p.level,
      badges: p.badges
    }))

    // 3. Find specific operator rank if userId provided
    let userRank: number | undefined = undefined
    if (userId) {
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("id", userId)
        .single()
      
      if (userProfile) {
        userRank = leaderboard.find(e => e.name === userProfile.name)?.rank
      }
    }

    return NextResponse.json({ leaderboard, userRank })
  } catch (error: any) {
    console.error("GET /api/leaderboard failed:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch leaderboard." }, { status: 500 })
  }
}

