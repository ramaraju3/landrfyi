import { NextResponse } from "next/server";
import * as SibApiV3Sdk from "@getbrevo/brevo";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { resumeId, workEmail } = await request.json();

    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

    const { error } = await supabase
      .from("resumes")
      .update({ verification_token: token, work_email: workEmail })
      .eq("id", resumeId);

    if (error) throw error;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "Verify your resume submission on landr.fyi";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #4f46e5; font-size: 28px; margin-bottom: 8px;">landr.fyi</h1>
        <p style="color: #6b7280; margin-bottom: 32px;">Resume transparency for job seekers</p>
        <h2 style="font-size: 20px; margin-bottom: 16px;">Verify your resume submission</h2>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 24px;">
          Thanks for contributing to landr.fyi! Click the button below to verify your work email and get a verified badge on your resume.
        </p>
        <a href="https://landr.fyi/verify?token=${token}&id=${resumeId}"
           style="background: #4f46e5; color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 600; display: inline-block; margin-bottom: 24px;">
          ✅ Verify My Submission
        </a>
        <p style="color: #9ca3af; font-size: 14px;">
          This link expires in 24 hours. If you did not submit a resume to landr.fyi, you can safely ignore this email.
        </p>
      </div>
    `;
    sendSmtpEmail.sender = { name: "landr.fyi", email: "noreply@mg.landr.fyi" };
    sendSmtpEmail.to = [{ email: workEmail }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }
}
