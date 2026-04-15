import { NextResponse } from "next/server"
import { generateRoadmap } from "@/lib/gemini"
import { getUser, updateUser } from "@/lib/store"

type OnboardingBody = {
  userId: string
  level: string
  goals: string[]
  topics: string[]
}

const FALLBACK_ROADMAP = {
  steps: [
    {
      week: 1,
      title: "AI Foundations",
      topics: ["What is AI", "ML vs DL", "Data basics"],
      mini_challenge: "Summarize one real-world AI use case."
    },
    {
      week: 2,
      title: "Core ML Algorithms",
      topics: ["Linear Regression", "Decision Trees", "Model Evaluation"],
      mini_challenge: "Train a simple regression model on sample data."
    },
    {
      week: 3,
      title: "Neural Network Basics",
      topics: ["Perceptron", "Activation Functions", "Backpropagation"],
      mini_challenge: "Build a tiny neural network for classification."
    },
    {
      week: 4,
      title: "Practical AI Workflow",
      topics: ["Feature Engineering", "Overfitting", "Deployment basics"],
      mini_challenge: "Package and explain a mini end-to-end ML pipeline."
    }
  ]
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as OnboardingBody | null
    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
    }

    const userId = typeof body.userId === "string" ? body.userId.trim() : ""
    const level = typeof body.level === "string" ? body.level.trim() : ""
    const goals = Array.isArray(body.goals) ? body.goals.filter((g): g is string => typeof g === "string") : []
    const topics = Array.isArray(body.topics)
      ? body.topics.filter((t): t is string => typeof t === "string")
      : []

    if (!userId || !level || goals.length === 0) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const user = getUser(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    let roadmap: object = FALLBACK_ROADMAP
    try {
      const generated = await generateRoadmap(level, goals)
      const validRoadmap =
        typeof generated === "object" &&
        generated !== null &&
        "steps" in (generated as Record<string, unknown>) &&
        Array.isArray((generated as Record<string, unknown>).steps)
      roadmap = validRoadmap ? generated : FALLBACK_ROADMAP
    } catch (geminiError) {
      console.error("generateRoadmap failed; using fallback:", geminiError)
      roadmap = FALLBACK_ROADMAP
    }

    updateUser(user.id, {
      level,
      completedModules:
        topics.length > 0 ? Array.from(new Set([...user.completedModules, ...topics])) : user.completedModules,
      lastLogin: new Date().toISOString()
    })

    return NextResponse.json({
      roadmap,
      welcomeMessage: "Your custom AI learning path is ready!"
    })
  } catch (error) {
    console.error("POST /api/onboarding failed:", error)
    return NextResponse.json({ error: "Failed to complete onboarding." }, { status: 500 })
  }
}

