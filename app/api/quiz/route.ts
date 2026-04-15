import { NextResponse } from "next/server"
import { generateQuiz, type QuizQuestion } from "@/lib/gemini"

const QUIZ_TOPICS = [
  "Linear Regression",
  "Decision Trees",
  "Neural Networks",
  "K-Means Clustering",
  "Random Forest",
  "SVM",
  "Gradient Descent",
  "Overfitting",
  "Data Preprocessing",
  "Backpropagation"
]

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const topic = searchParams.get("topic")?.trim()
    const difficulty = searchParams.get("difficulty")?.trim() || "Beginner"

    if (!topic) {
      return NextResponse.json({
        topics: QUIZ_TOPICS,
        questions: [] as QuizQuestion[]
      })
    }

    const questions = await generateQuiz(topic, difficulty)
    return NextResponse.json({ questions })
  } catch (error) {
    console.error("GET /api/quiz failed:", error)
    return NextResponse.json(
      {
        questions: [] as QuizQuestion[],
        topics: QUIZ_TOPICS,
        error: "Unable to fetch quiz data"
      },
      { status: 500 }
    )
  }
}

