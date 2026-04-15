import { NextResponse } from "next/server"
import { geminiGenerate } from "@/lib/gemini"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const prompt = typeof body?.prompt === "string" ? body.prompt : ""
  const result = await geminiGenerate(prompt)
  return NextResponse.json({ result })
}

