import { NextResponse } from "next/server"
import crypto from "crypto"
import { createUser, getUserByEmail } from "@/lib/store"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const name = typeof body?.name === "string" ? body.name.trim() : ""
  const email = typeof body?.email === "string" ? body.email.trim() : ""
  const password = typeof body?.password === "string" ? body.password : ""

  if (!name || !email || !password) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 })
  }

  // Validate email not already taken
  if (getUserByEmail(email)) {
    return NextResponse.json({ success: false, error: "EMAIL_TAKEN" }, { status: 409 })
  }

  const userId = crypto.randomUUID()

  createUser({
    id: userId,
    name,
    email,
    xp: 0,
    level: "Beginner",
    streak: 1,
    badges: [],
    completedModules: [],
    lastLogin: new Date().toISOString()
  })

  return NextResponse.json({ success: true, userId })
}

