import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      status: "healthy",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("GET /api/health failed:", error)
    return NextResponse.json(
      {
        status: "healthy",
        geminiConfigured: false,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

