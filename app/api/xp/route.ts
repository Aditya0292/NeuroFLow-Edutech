import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // 2. Automate Profile Creation on First Load
  if (error && error.code === "PGRST116") {
    const { data: newProfile, error: createError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        name: user.email?.split("@")[0] || "Operative",
        email: user.email,
        xp: 0,
        level: "Beginner",
        skill_vector: {
          python: 0.1,
          tf: 0.1,
          pytorch: 0.1,
          nlp: 0.1,
          cv: 0.1,
          data_eng: 0.1
        }
      })
      .select()
      .single()
    
    if (createError) return NextResponse.json({ error: createError.message }, { status: 500 })
    return NextResponse.json(newProfile)
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(profile)
}

export async function POST(req: Request) {
  try {
    const { xp_gained, mission_id } = await req.json()
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // 2. Tactical XP Pulse: Increment in database
    const { data, error } = await supabase.rpc('increment_xp', { 
      u_id: user.id, 
      xp_inc: xp_gained 
    })

    // Fallback if RPC isn't defined yet: Manual update
    if (error) {
      const { data: current } = await supabase.from("profiles").select("xp, completed_msns").eq("id", user.id).single()
      const new_msns = mission_id ? [...(current?.completed_msns || []), mission_id] : current?.completed_msns
      
      const { data: updated, error: updateError } = await supabase
        .from("profiles")
        .update({ 
          xp: (current?.xp || 0) + xp_gained,
          completed_msns: Array.from(new Set(new_msns)) // Remove duplicates
        })
        .eq("id", user.id)
        .select()
        .single()
      
      if (updateError) throw updateError
      return NextResponse.json(updated)
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

