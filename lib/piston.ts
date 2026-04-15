const PISTON_BASE_URL = "https://emkc.org/api/v2/piston"

export type ExecuteCodeResult = {
  output: string
  error: string | null
}

export type CodingChallenge = {
  id: string
  title: string
  description: string
  starterCode: string
  expectedOutput: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  xp: number
  hint: string
}

export async function executeCode(code: string): Promise<ExecuteCodeResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const response = await fetch(`${PISTON_BASE_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "python",
        version: "3.10.0",
        files: [{ content: code }]
      }),
      signal: controller.signal
    })

    if (!response.ok) {
      return {
        output: "",
        error: `Execution failed with status ${response.status}`
      }
    }

    const payload = (await response.json()) as {
      run?: { stdout?: string; stderr?: string }
      message?: string
    }

    return {
      output: payload.run?.stdout ?? "",
      error: payload.run?.stderr || payload.message || null
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        output: "",
        error: "Execution timed out. Check for infinite loops."
      }
    }

    console.error("executeCode failed:", error)
    return {
      output: "",
      error: "Execution failed. Please try again."
    }
  } finally {
    clearTimeout(timeout)
  }
}

export function validateChallenge(output: string, expected: string): boolean {
  return output.trim().toLowerCase() === expected.trim().toLowerCase()
}

export const challenges: CodingChallenge[] = [
  {
    id: "ch1",
    title: "Mean Calculator",
    description: "Calculate the mean of a list [1,2,3,4,5]. Print the result.",
    starterCode: "numbers = [1, 2, 3, 4, 5]\n# Calculate mean and print it\n",
    expectedOutput: "3.0",
    difficulty: "Beginner",
    xp: 100,
    hint: "Sum all numbers then divide by count"
  },
  {
    id: "ch2",
    title: "Train/Test Split",
    description:
      "Split a list of 10 items into 80% train and 20% test. Print the length of each.",
    starterCode:
      "data = list(range(10))\n# Split into train (80%) and test (20%)\n# Print: train length, test length\n",
    expectedOutput: "8\n2",
    difficulty: "Beginner",
    xp: 120,
    hint: "Use list slicing. Train = first 80%, Test = last 20%"
  },
  {
    id: "ch3",
    title: "Normalize Data",
    description:
      "Normalize the list [10, 20, 30, 40, 50] using min-max normalization. Print each value rounded to 1 decimal.",
    starterCode:
      "data = [10, 20, 30, 40, 50]\n# Apply min-max normalization\n# Print each normalized value\n",
    expectedOutput: "0.0\n0.2\n0.5\n0.8\n1.0",
    difficulty: "Intermediate",
    xp: 150,
    hint: "Formula: (x - min) / (max - min)"
  },
  {
    id: "ch4",
    title: "Euclidean Distance",
    description:
      "Calculate Euclidean distance between points (1,2) and (4,6). Print rounded to 2 decimals.",
    starterCode:
      "import math\np1 = (1, 2)\np2 = (4, 6)\n# Calculate and print Euclidean distance\n",
    expectedOutput: "5.0",
    difficulty: "Intermediate",
    xp: 150,
    hint: "sqrt((x2-x1)² + (y2-y1)²)"
  },
  {
    id: "ch5",
    title: "Sigmoid Function",
    description:
      "Implement sigmoid function and print sigmoid(0), sigmoid(1), sigmoid(-1). Round to 4 decimals.",
    starterCode:
      "import math\ndef sigmoid(x):\n    # implement sigmoid\n    pass\n\nprint(sigmoid(0))\nprint(sigmoid(1))\nprint(sigmoid(-1))\n",
    expectedOutput: "0.5\n0.7311\n0.2689",
    difficulty: "Advanced",
    xp: 200,
    hint: "sigmoid(x) = 1 / (1 + e^(-x))"
  }
]

type PistonRunInput = {
  language: string
  source: string
}

// Backward-compatible wrapper for existing callers.
export async function runOnPiston(input: PistonRunInput): Promise<string> {
  void input.language
  const result = await executeCode(input.source)
  return result.output
}

