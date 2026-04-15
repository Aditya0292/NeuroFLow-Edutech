import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_MODEL = "gemini-2.0-flash"
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export type QuizQuestion = {
  question: string
  options: [string, string, string, string]
  correct: number
  explanation: string
}

export type SimulationResult = {
  label: "Spam" | "Not Spam"
  confidence: number
  explanation: string
  features: string[]
}

type ProviderName = "gemini" | "openrouter" | "grok"

type LlmProvider = {
  name: ProviderName
  isEnabled: () => boolean
  generateText: (prompt: string) => Promise<string>
}

const geminiProvider: LlmProvider = {
  name: "gemini",
  isEnabled: () => Boolean(GEMINI_API_KEY),
  async generateText(prompt: string) {
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing")
    const client = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = client.getGenerativeModel({ model: GEMINI_MODEL })
    const response = await model.generateContent(prompt)
    return response.response.text()
  }
}

// Future fallback slots. Implement when keys/providers are added.
const openrouterProvider: LlmProvider = {
  name: "openrouter",
  isEnabled: () => Boolean(process.env.OPENROUTER_API_KEY),
  async generateText() {
    throw new Error("OPENROUTER_NOT_IMPLEMENTED")
  }
}

const grokProvider: LlmProvider = {
  name: "grok",
  isEnabled: () => Boolean(process.env.GROK_API_KEY),
  async generateText() {
    throw new Error("GROK_NOT_IMPLEMENTED")
  }
}

const providers: LlmProvider[] = [geminiProvider, openrouterProvider, grokProvider]

function isTransientError(err: unknown): boolean {
  const message = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase()
  return (
    message.includes("429") ||
    message.includes("rate limit") ||
    message.includes("quota") ||
    message.includes("timeout") ||
    message.includes("temporar") ||
    message.includes("unavailable") ||
    message.includes("503")
  )
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function generateFromAvailableProviders(prompt: string): Promise<string> {
  const enabled = providers.filter((p) => p.isEnabled())
  if (enabled.length === 0) throw new Error("No AI provider configured")

  let lastError: unknown = new Error("Unknown generation failure")

  for (const provider of enabled) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await provider.generateText(prompt)
      } catch (error) {
        lastError = error
        const retryable = isTransientError(error)
        if (retryable && attempt === 0) {
          await sleep(600)
          continue
        }
        // Try next provider when this one fails or is rate-limited.
        break
      }
    }
  }

  throw lastError
}

function parseJsonResponse<T>(raw: string): T {
  const trimmed = raw.trim()
  try {
    return JSON.parse(trimmed) as T
  } catch {
    // Try to recover from wrapped responses like markdown or text wrappers.
    const start = trimmed.search(/[\[{]/)
    const endBrace = trimmed.lastIndexOf("}")
    const endBracket = trimmed.lastIndexOf("]")
    const end = Math.max(endBrace, endBracket)
    if (start === -1 || end === -1 || end <= start) throw new Error("No JSON body found")
    const slice = trimmed.slice(start, end + 1)
    return JSON.parse(slice) as T
  }
}

function toQuizQuestions(value: unknown): QuizQuestion[] {
  if (!Array.isArray(value)) return []
  const result: QuizQuestion[] = []
  for (const item of value) {
    const record = item as Record<string, unknown>
    const question = typeof record.question === "string" ? record.question : ""
    const explanation = typeof record.explanation === "string" ? record.explanation : ""
    const optionsRaw = Array.isArray(record.options) ? record.options : []
    const options = optionsRaw.filter((o): o is string => typeof o === "string")
    const correct = typeof record.correct === "number" ? record.correct : -1

    if (question && explanation && options.length === 4 && correct >= 0 && correct <= 3) {
      result.push({
        question,
        options: [options[0], options[1], options[2], options[3]],
        correct,
        explanation
      })
    }
  }
  return result
}

export async function geminiGenerate(prompt: string) {
  try {
    const text = await generateFromAvailableProviders(prompt)
    return { prompt, text }
  } catch (error) {
    console.error("geminiGenerate failed:", error)
    return { prompt, text: "" }
  }
}

export async function generateQuiz(topic: string, difficulty: string): Promise<QuizQuestion[]> {
  try {
    const prompt = `Generate exactly 5 MCQ questions about ${topic} for ${difficulty} level AIML students.
Return ONLY a valid JSON array, no markdown, no explanation:
[{ question: string, options: [string,string,string,string], correct: number (0-3), explanation: string }]`
    const text = await generateFromAvailableProviders(prompt)
    const parsed = parseJsonResponse<unknown>(text)
    return toQuizQuestions(parsed)
  } catch (error) {
    console.error("generateQuiz failed:", error)
    return []
  }
}

export async function explainAnswer(
  question: string,
  userAnswer: string,
  correctAnswer: string
): Promise<string> {
  try {
    const prompt = `The student answered '${userAnswer}' but the correct answer was '${correctAnswer}' for: ${question}
Give a 2 sentence explanation using a real-world analogy. Be encouraging.`
    const text = await generateFromAvailableProviders(prompt)
    return text.trim() || "Great effort. Review the core concept once more and you will get it."
  } catch (error) {
    console.error("explainAnswer failed:", error)
    return "Great effort. Review the core concept once more and you will get it."
  }
}

export async function generateRoadmap(level: string, goals: string[]): Promise<object> {
  try {
    const prompt = `Create a 4-week AIML learning roadmap for a ${level} student with goals: ${goals.join(", ")}.
Return ONLY valid JSON:
{ steps: [{ week: number, title: string, topics: string[], mini_challenge: string }] }`
    const text = await generateFromAvailableProviders(prompt)
    const parsed = parseJsonResponse<object>(text)
    return parsed
  } catch (error) {
    console.error("generateRoadmap failed:", error)
    return { steps: [] }
  }
}

export async function reviewCode(
  code: string,
  challenge: string,
  output: string,
  passed: boolean
): Promise<string> {
  try {
    const prompt = `A student solving '${challenge}' wrote this Python code and got output: '${output}'.
Passed: ${passed}.
Give ONE sentence of feedback like a senior ML engineer. If passed, compliment the approach. If failed, give the key hint without giving away the answer.

Code:
${code}`
    const text = await generateFromAvailableProviders(prompt)
    return text.trim() || "Solid attempt; tighten your logic around edge cases and test again."
  } catch (error) {
    console.error("reviewCode failed:", error)
    return "Solid attempt; tighten your logic around edge cases and test again."
  }
}

export async function classifySpam(text: string): Promise<SimulationResult> {
  try {
    const prompt = `Analyze this text for spam: '${text}'
Return ONLY valid JSON:
{ label: 'Spam' or 'Not Spam', confidence: number (0.0-1.0), explanation: string (2 sentences), features: string[] (3 features that influenced decision) }`
    const raw = await generateFromAvailableProviders(prompt)
    const parsed = parseJsonResponse<Record<string, unknown>>(raw)

    const label = parsed.label === "Spam" || parsed.label === "Not Spam" ? parsed.label : "Not Spam"
    const confidenceRaw = typeof parsed.confidence === "number" ? parsed.confidence : 0
    const confidence = Math.max(0, Math.min(1, confidenceRaw))
    const explanation =
      typeof parsed.explanation === "string" && parsed.explanation.trim().length > 0
        ? parsed.explanation
        : "The message appears normal based on common spam indicators."
    const featuresRaw = Array.isArray(parsed.features) ? parsed.features : []
    const features = featuresRaw.filter((f): f is string => typeof f === "string").slice(0, 3)

    return {
      label,
      confidence,
      explanation,
      features
    }
  } catch (error) {
    console.error("classifySpam failed:", error)
    return {
      label: "Not Spam",
      confidence: 0,
      explanation: "Unable to classify at the moment. Please try again with a shorter input.",
      features: []
    }
  }
}

