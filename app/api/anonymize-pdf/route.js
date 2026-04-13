import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(request) {
  try {
    const { resumeText, fileName } = await request.json();

    // Step 1: Anonymize text with Claude
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

    const anonymizedText = message.content[0].text;

    // Step 2: Generate a clean PDF from anonymized text
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = 612;
    const pageHeight = 792;
    const margin = 60;
    const fontSize = 10;
    const lineHeight = 16;
    const maxWidth = pageWidth - margin * 2;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    // Add header
    page.drawText("landr.fyi — Anonymized Resume", {
      x: margin,
      y: y,
      size: 8,
      font,
      color: rgb(0.6, 0.6, 0.6),
    });
    y -= 24;

    // Split text into lines and wrap
    const lines = anonymizedText.split("\n");

    for (const line of lines) {
      if (!line.trim()) {
        y -= lineHeight * 0.5;
        continue;
      }

      // Word wrap long lines
      const words = line.split(" ");
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (textWidth > maxWidth && currentLine) {
          // Check if new page needed
          if (y < margin + lineHeight) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }

          const isHeader = currentLine === currentLine.toUpperCase() && currentLine.length > 3;
          page.drawText(currentLine, {
            x: margin,
            y,
            size: isHeader ? fontSize + 1 : fontSize,
            font: isHeader ? boldFont : font,
            color: rgb(0.1, 0.1, 0.1),
          });
          y -= lineHeight;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }

        const isHeader = currentLine === currentLine.toUpperCase() && currentLine.length > 3;
        page.drawText(currentLine, {
          x: margin,
          y,
          size: isHeader ? fontSize + 1 : fontSize,
          font: isHeader ? boldFont : font,
          color: rgb(0.1, 0.1, 0.1),
        });
        y -= lineHeight;
      }
    }

    const pdfBytes = await pdfDoc.save();
    const base64 = Buffer.from(pdfBytes).toString("base64");

    return NextResponse.json({
      anonymizedText,
      pdfBase64: base64,
      fileName: `anonymized-${fileName || "resume"}.pdf`
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to anonymize PDF. Please try again." }, { status: 500 });
  }
}
