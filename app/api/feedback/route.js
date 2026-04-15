import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, message } = await request.json();

    // Block fake/disposable domains
    const blockedDomains = ["abc.com", "test.com", "example.com", "fake.com", "temp.com", "mailinator.com", "guerrillamail.com", "throwaway.email", "yopmail.com", "sharklasers.com", "spam4.me"];
    const emailDomain = email?.split("@")[1]?.toLowerCase();
    if (!email || !emailDomain || blockedDomains.includes(emailDomain)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    await resend.emails.send({
      from: "landr.fyi <verify@mg.landr.fyi>",
      to: "feedback.document257@passmail.net",
      subject: `New Feedback from ${name || "Anonymous"} — landr.fyi`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #4f46e5; font-size: 24px; margin-bottom: 8px;">landr.fyi Feedback</h1>
          <hr style="margin-bottom: 24px;" />
          <p><strong>Name:</strong> ${name || "Not provided"}</p>
          <p><strong>Email:</strong> ${email || "Not provided"}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f9fafb; padding: 16px; border-radius: 8px; line-height: 1.6;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 });
  }
}
