import { NextResponse } from 'next/server';
import { geminiGenerate } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { code, challenge } = await req.json();

    const prompt = `
ROLE: You are an Elite tactical AI unit named "SYN_INTEL" operating in NeuroFlow.
TASK: Review the following Python neural network code for the mission "${challenge}" submitted by Operator 01.
Analyze the code and determine if it represents a valid step toward building or optimizing a neural network or algorithm.
Keep your response concise (2-3 sentences maximum). 
Use a tactical, cyber-military tone (e.g. "Operator, your logic...", "Synthesis optimal...", "Sub-optimal thresholds..."). 
If the code looks mostly correct or is a good attempt, state "STATUS: APPROVED". If it has critical syntax errors or logic flaws, state "STATUS: REJECTED".

CODE:
${code}
    `;

    const result = await geminiGenerate(prompt);
    
    return NextResponse.json({ message: result.text || "NO RESPONSE FROM SYN_INTEL_CORE" });
  } catch (error: any) {
    return NextResponse.json({ message: "COMMS_ERROR_DETECTED: " + error.message }, { status: 500 });
  }
}
