import { NextResponse } from "next/server"
import { getAllUsers } from "@/lib/store"

export async function GET() {
  // Placeholder: returns top user from in-memory store.
  const user = getAllUsers()[0] ?? null
  return NextResponse.json(user)
}

