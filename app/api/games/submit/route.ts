import { NextResponse } from "next/server"
import { GAME_LEVELS } from "@/app/api/games/route"
import { getUser, updateUser } from "@/lib/store"
import { awardXP, checkAndAwardBadges } from "@/lib/xp"

type SubmitBody = {
  game: string
  levelId: string
  success: boolean
  userId: string
  metrics?: {
    accuracy?: number
    epochs?: number
  }
}

function findLevel(game: string, levelId: string) {
  if (game !== "knn" && game !== "neural_lite") return undefined
  return GAME_LEVELS[game].find((level) => level.id === levelId)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as SubmitBody | null
    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
    }

    const game = typeof body.game === "string" ? body.game : ""
    const levelId = typeof body.levelId === "string" ? body.levelId : ""
    const userId = typeof body.userId === "string" ? body.userId : ""
    const success = Boolean(body.success)
    void body.metrics

    if (!game || !levelId || !userId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const user = getUser(userId)
    if (!user) {
      return NextResponse.json({ error: "Invalid user." }, { status: 400 })
    }

    const level = findLevel(game, levelId)
    if (!level) {
      return NextResponse.json({ error: "Invalid game or levelId." }, { status: 400 })
    }

    if (!success) {
      return NextResponse.json({
        success: true,
        xp_earned: 0,
        new_total_xp: user.xp,
        level_up: false,
        new_level: user.level,
        badges_earned: []
      })
    }

    // Current XP system uses action-based constants; GAME_WIN is the default path.
    const xpResult = awardXP(user.xp, "GAME_WIN")
    const userAfterXp = {
      ...user,
      xp: xpResult.newXP,
      level: xpResult.newLevel
    }
    const badgesEarned = checkAndAwardBadges(userAfterXp)

    updateUser(user.id, {
      xp: xpResult.newXP,
      level: xpResult.newLevel,
      badges: Array.from(new Set([...user.badges, ...badgesEarned])),
      lastLogin: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      xp_earned: xpResult.xpGained,
      new_total_xp: xpResult.newXP,
      level_up: xpResult.levelUp,
      new_level: xpResult.newLevel,
      badges_earned: badgesEarned
    })
  } catch (error) {
    console.error("POST /api/games/submit failed:", error)
    return NextResponse.json({ error: "Failed to submit game result." }, { status: 500 })
  }
}

