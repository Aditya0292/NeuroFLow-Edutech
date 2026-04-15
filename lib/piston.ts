type PistonRunInput = {
  language: string
  source: string
}

export async function runOnPiston(input: PistonRunInput): Promise<string> {
  // Backend stub: integrate with Piston API (remote code execution) here.
  // For now, return empty output.
  void input
  return ""
}

