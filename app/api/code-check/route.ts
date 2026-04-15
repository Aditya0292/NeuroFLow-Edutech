import { NextResponse } from 'next/server';
import { geminiGenerate } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { code, challenge, output, error } = await req.json();

    const prompt = `
ROLE: You are an Elite tactical AI unit named "SYN_INTEL" operating in NeuroFlow.
TASK: Review the following Python neural network code and its execution results for the mission "${challenge}" submitted by Operator 01.

CODE SUBMITTED:
${code}

EXECUTION OUTPUT:
${output || "None"}

EXECUTION ERRORS:
${error || "None"}

INSTRUCTIONS:
1. Analyze if the code logic is correct for a machine learning context.
2. Review the execution output. If there were errors, explain them tactically.
3. Keep your response concise (2-3 sentences maximum). 
4. Use a tactical, cyber-military tone (e.g. "Operator, your logic...", "Synthesis optimal...", "Sub-optimal thresholds..."). 
5. Start or end with "STATUS: APPROVED" if it's correct/successful, or "STATUS: REJECTED" if failed/erroneous.

RESPONSE:
    `;

    const result = await geminiGenerate(prompt);
    
    return NextResponse.json({ message: result.text || "NO RESPONSE FROM SYN_INTEL_CORE" });
  } catch (error: any) {
    return NextResponse.json({ message: "COMMS_ERROR_DETECTED: " + error.message }, { status: 500 });
  }
}
