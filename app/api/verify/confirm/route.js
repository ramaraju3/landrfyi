import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service-role client so it can read the private token table and flip
// `verified` past RLS. The token comparison happens here, server-side —
// the secret never reaches the browser.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request) {
  try {
    const { resumeId, token } = await request.json();

    if (!resumeId || !token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("resume_private")
      .select("verification_token, token_created_at")
      .eq("resume_id", resumeId)
      .single();

    if (error || !data || !data.verification_token || data.verification_token !== token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const age = Date.now() - new Date(data.token_created_at).getTime();
    if (age > TOKEN_TTL_MS) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("resumes")
      .update({ verified: true })
      .eq("id", resumeId);

    if (updateError) throw updateError;

    // One-time use: clear the token so the link can't be replayed.
    await supabase
      .from("resume_private")
      .update({ verification_token: null })
      .eq("resume_id", resumeId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify confirm error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
