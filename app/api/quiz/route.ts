import { NextResponse } from "next/server"
import type { QuizResult } from "@/types"
import { awardXp } from "@/lib/xp"

export async function POST(req: Request) {
  // Placeholder backend: wire your quiz evaluation here.
  const body = await req.json().catch(() => ({}))
  const score = typeof body?.score === "number" ? body.score : 0

  const result: QuizResult = {
    score,
    xp_earned: awardXp({ kind: "quiz", score }),
    explanation: ""
  }

  return NextResponse.json(result)
}

