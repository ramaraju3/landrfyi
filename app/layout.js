import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "landr.fyi — See the resumes that actually got them hired",
  description:
    "A community-driven library of real, anonymized resumes from people who landed roles at top companies.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📄</text></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}<Analytics /></body>
    </html>
  );
}
