type AwardXpInput =
  | { kind: "quiz"; score: number }
  | { kind: "code-lab"; passed: boolean }
  | { kind: "game"; score: number }

export function awardXp(input: AwardXpInput): number {
  switch (input.kind) {
    case "quiz":
      return Math.max(0, Math.round(input.score * 10))
    case "code-lab":
      return input.passed ? 50 : 0
    case "game":
      return Math.max(0, Math.round(input.score))
  }
}

export function levelFromXp(xp: number): string {
  if (xp >= 2000) return "Legend"
  if (xp >= 1000) return "Expert"
  if (xp >= 500) return "Intermediate"
  return "Beginner"
}

