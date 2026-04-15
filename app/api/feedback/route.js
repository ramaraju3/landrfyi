import { NextResponse } from "next/server";
const SibApiV3Sdk = require("@getbrevo/brevo");

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Block fake/disposable domains
    const blockedDomains = ["abc.com", "test.com", "example.com", "fake.com", "temp.com", "mailinator.com", "guerrillamail.com", "throwaway.email", "yopmail.com", "sharklasers.com", "spam4.me"];
    const emailDomain = email?.split("@")[1]?.toLowerCase();
    if (!email || !emailDomain || blockedDomains.includes(emailDomain)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = `New Feedback from ${name || "Anonymous"} — landr.fyi`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #4f46e5; font-size: 24px; margin-bottom: 8px;">landr.fyi Feedback</h1>
        <hr style="margin-bottom: 24px;" />
        <p><strong>Name:</strong> ${name || "Not provided"}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f9fafb; padding: 16px; border-radius: 8px; line-height: 1.6;">${message}</p>
      </div>
    `;
    sendSmtpEmail.sender = { name: "landr.fyi", email: "noreply@mg.landr.fyi" };
    sendSmtpEmail.to = [{ email: "feedback.document257@passmail.net" }];
    sendSmtpEmail.replyTo = { email: email, name: name || "Anonymous" };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 });
  }
}
