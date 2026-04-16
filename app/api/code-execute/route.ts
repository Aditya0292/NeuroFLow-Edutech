import { NextResponse } from "next/server";
import { executeCode } from "@/lib/piston";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const result = await executeCode(code);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API code-execute error:", error);
    return NextResponse.json({
      output: "",
      error: "INTERNAL_CORE_FAULT: Neural relay timed out."
    }, { status: 500 });
  }
}
