import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request) {
  try {
    const { resumeText } = await request.json();

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a resume anonymizer. Remove all personally identifiable information (PII) from the following resume while keeping all professional content intact.

Remove and replace:
- Full name → [NAME]
- Email addresses → [EMAIL]
- Phone numbers → [PHONE]
- Physical addresses → [ADDRESS]
- LinkedIn URLs → [LINKEDIN]
- GitHub URLs → [GITHUB]
- Personal website URLs → [WEBSITE]
- Company names → [COMPANY]
- University/school names → [UNIVERSITY]
- Any other identifying information

Keep intact:
- Job titles and roles
- Skills and technologies
- Achievements and metrics
- Years of experience
- General industry context
- Education level and degree type

Return ONLY the anonymized resume text with no explanation or commentary.

Resume to anonymize:
${resumeText}`,
        },
      ],
    });

    const anonymized = message.content[0].text;
    return NextResponse.json({ anonymized });
  } catch (error) {
    console.error("Anonymize error:", JSON.stringify(error, null, 2));
    console.error("API Key exists:", !!process.env.ANTHROPIC_API_KEY);
    console.error("API Key prefix:", process.env.ANTHROPIC_API_KEY?.substring(0, 10));
    return NextResponse.json({ error: "Anonymization temporarily unavailable. Please try again in a moment." }, { status: 500 });
  }
}
