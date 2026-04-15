import { NextResponse } from "next/server"
import { classifySpam, type SimulationResult } from "@/lib/gemini"
import { getUser, updateUser } from "@/lib/store"
import { awardXP, checkAndAwardBadges } from "@/lib/xp"

type SimulationBody = {
  text: string
  userId: string
}

const FALLBACK_SIMULATION: SimulationResult = {
  label: "Spam",
  confidence: 0.85,
  explanation: "Fallback response: The message contains suspicious urgency patterns.",
  features: ["urgency", "unknown sender"]
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as SimulationBody | null
    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
    }

    const text = typeof body.text === "string" ? body.text.trim() : ""
    const userId = typeof body.userId === "string" ? body.userId.trim() : ""
    if (!text || !userId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const user = getUser(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    let simulation: SimulationResult = FALLBACK_SIMULATION
    try {
      const result = await classifySpam(text)
      const hasValidShape =
        (result.label === "Spam" || result.label === "Not Spam") &&
        typeof result.confidence === "number" &&
        typeof result.explanation === "string" &&
        Array.isArray(result.features)
      simulation = hasValidShape ? result : FALLBACK_SIMULATION
    } catch (geminiError) {
      console.error("classifySpam failed; using fallback:", geminiError)
      simulation = FALLBACK_SIMULATION
    }

    const xpResult = awardXP(user.xp, "SIMULATION_RUN")
    const userAfterXp = { ...user, xp: xpResult.newXP, level: xpResult.newLevel }
    const badgesEarned = checkAndAwardBadges(userAfterXp)

    updateUser(user.id, {
      xp: xpResult.newXP,
      level: xpResult.newLevel,
      badges: Array.from(new Set([...user.badges, ...badgesEarned])),
      lastLogin: new Date().toISOString()
    })

    return NextResponse.json({ ...simulation, xp_earned: xpResult.xpGained })
  } catch (error) {
    console.error("POST /api/simulation failed:", error)
    return NextResponse.json({ error: "Failed to run simulation." }, { status: 500 })
  }
}

