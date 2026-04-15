import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET() {
  // Placeholder: returns current user state from in-memory store.
  return NextResponse.json(store.getUser())
}

