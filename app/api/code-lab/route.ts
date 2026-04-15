import { NextResponse } from "next/server"
import type { CodeLabResult } from "@/types"
import { runOnPiston } from "@/lib/piston"
import { awardXp } from "@/lib/xp"

export async function POST(req: Request) {
  // Placeholder backend: execute/evaluate user code here.
  const body = await req.json().catch(() => ({}))
  const language = typeof body?.language === "string" ? body.language : "javascript"
  const source = typeof body?.source === "string" ? body.source : ""

  const output = await runOnPiston({ language, source })

  const result: CodeLabResult = {
    output,
    feedback: "",
    xp_earned: awardXp({ kind: "code-lab", passed: true }),
    passed: true
  }

  return NextResponse.json(result)
}

