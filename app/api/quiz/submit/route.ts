import { NextResponse } from "next/server"
import { explainAnswer, type QuizQuestion } from "@/lib/gemini"
import { getLeaderboard, getUser, updateUser } from "@/lib/store"
import { awardXP, checkAndAwardBadges } from "@/lib/xp"

type SubmitBody = {
  answers: number[]
  questions: QuizQuestion[]
  userId: string
}

type WrongExplanation = {
  questionIndex: number
  explanation: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as SubmitBody | null
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const answers = Array.isArray(body.answers) ? body.answers : []
    const questions = Array.isArray(body.questions) ? body.questions : []
    const userId = typeof body.userId === "string" ? body.userId : ""

    if (!userId || questions.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = getUser(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let score = 0
    let newXP = user.xp
    let levelUp = false
    let newLevel = user.level
    let xpEarned = 0
    const wrongAnswers: WrongExplanation[] = []

    for (let i = 0; i < questions.length; i += 1) {
      const question = questions[i]
      const userAnswer = answers[i]
      if (typeof userAnswer !== "number") continue

      if (userAnswer === question.correct) {
        score += 1
        const xpResult = awardXP(newXP, "QUIZ_CORRECT")
        newXP = xpResult.newXP
        xpEarned += xpResult.xpGained
        if (xpResult.levelUp) levelUp = true
        newLevel = xpResult.newLevel
      } else {
        const selectedOption = question.options[userAnswer] ?? `option ${userAnswer}`
        const correctOption = question.options[question.correct] ?? "correct option"
        const explanation = await explainAnswer(question.question, selectedOption, correctOption)
        wrongAnswers.push({ questionIndex: i, explanation })
      }
    }

    const simulatedUpdatedUser = {
      ...user,
      xp: newXP,
      level: newLevel
    }
    const badgesEarned = checkAndAwardBadges(simulatedUpdatedUser)

    updateUser(user.id, {
      xp: newXP,
      level: newLevel,
      badges: Array.from(new Set([...user.badges, ...badgesEarned])),
      lastLogin: new Date().toISOString()
    })

    // Leaderboard is computed from store users; evaluating it ensures latest order is ready.
    getLeaderboard()

    return NextResponse.json({
      score,
      total: questions.length,
      xp_earned: xpEarned,
      new_total_xp: newXP,
      level_up: levelUp,
      new_level: newLevel,
      badges_earned: badgesEarned,
      explanations: wrongAnswers
    })
  } catch (error) {
    console.error("POST /api/quiz/submit failed:", error)
    return NextResponse.json(
      {
        score: 0,
        total: 0,
        xp_earned: 0,
        new_total_xp: 0,
        level_up: false,
        new_level: "Beginner",
        badges_earned: [],
        explanations: [],
        error: "Failed to submit quiz"
      },
      { status: 500 }
    )
  }
}

