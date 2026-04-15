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
    id: "ch_gd_01",
    title: "Gradient Descent Step",
    description: "Perform a single weight update using Gradient Descent. Current weight w=2.0, gradient g=0.5, learning rate lr=0.1. Print the unique updated weight rounded to 2 decimals.",
    starterCode: "w = 2.0\ng = 0.5\nlr = 0.1\n\n# Calculate updated weight: w = w - lr * g\n# Print result\n",
    expectedOutput: "1.95",
    difficulty: "Intermediate",
    xp: 250,
    hint: "New Value = Old Value - (Rate * Gradient)"
  },
  {
    id: "ch_loss_01",
    title: "Binary Cross-Entropy Loss",
    description: "Calculate BCE Loss for a prediction y_hat=0.8 given true label y=1. Formula: -[y*log(y_hat) + (1-y)*log(1-y_hat)]. Print result rounded to 4 decimals.",
    starterCode: "import math\ny = 1\ny_hat = 0.8\n\n# Calculate loss using natural log (math.log)\n",
    expectedOutput: "0.2231",
    difficulty: "Advanced",
    xp: 400,
    hint: "Recall that log(1-y) is irrelevant if y=1"
  },
  {
    id: "ch_neuron_01",
    title: "Neuron Forward Pass",
    description: "Compute the output of a single neuron. Inputs x=[0.5, 1.2], Weights w=[0.4, -0.6], Bias b=0.1. Use ReLU activation. Print final output.",
    starterCode: "x = [0.5, 1.2]\nw = [0.4, -0.6]\nb = 0.1\n\n# Calculate z = sum(x_i * w_i) + b\n# Apply ReLU(z) = max(0, z)\n",
    expectedOutput: "0.0",
    difficulty: "Intermediate",
    xp: 300,
    hint: "0.5*0.4 + 1.2*-0.6 + 0.1 = -0.42. ReLU(-0.42) = ?"
  },
  {
    id: "ch_softmax_01",
    title: "Softmax Probability",
    description: "Convert logit scores [2.0, 1.0, 0.1] into probabilities using Softmax. Print the probability of the first class rounded to 4 decimals.",
    starterCode: "import math\nlogits = [2.0, 1.0, 0.1]\n\n# formula: exp(logit_i) / sum(exp(logits))\n",
    expectedOutput: "0.659",
    difficulty: "Advanced",
    xp: 500,
    hint: "Calculate sum of exponentials first"
  },
  {
    id: "ch_mse_01",
    title: "MSE Gradient Calculation",
    description: "Calculate the gradient of Mean Squared Error with respect to prediction y_hat. y=5.0, y_hat=4.2. Formula for single point: 2 * (y_hat - y). Print the result.",
    starterCode: "y = 5.0\ny_hat = 4.2\n\n# Calculate gradient and print\n",
    expectedOutput: "-1.6",
    difficulty: "Intermediate",
    xp: 350,
    hint: "Derive loss = (y_hat - y)^2"
  }
]

type PistonRunInput = {
  language: string
  source: string
}

export async function runOnPiston(input: PistonRunInput): Promise<string> {
  const result = await executeCode(input.source)
  return result.output
}
