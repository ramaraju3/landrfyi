"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Eye,
  Award,
  MessageSquare,
} from "lucide-react";
import { supabase } from "../lib/supabase";

/* ------------------------------------------------------------------ */
/* Resume data                                                         */
/* ------------------------------------------------------------------ */


/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Button({ children, href, variant = "primary", size = "md", className = "", onClick }) {
  const base = "inline-flex items-center justify-center font-medium rounded-full transition-all whitespace-nowrap";
  const sizes = { md: "h-10 px-5 text-sm", lg: "h-14 px-8 text-base" };
  const variants = {
    primary: "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-lg hover:opacity-90",
    outline: "border border-[hsl(var(--border))] bg-[hsl(var(--background))]/50 backdrop-blur text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50",
    ghost: "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50",
    link: "text-[hsl(var(--primary))] font-semibold hover:underline",
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  if (onClick) return <button onClick={onClick} className={cls}>{children}</button>;
  return <Link href={href} className={cls}>{children}</Link>;
}

function Badge({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function Card({ children, className = "", style }) {
  return (
    <div
      className={`rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

function Nav({ onFeedback }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--background))]/80 backdrop-blur-md border-b border-[hsl(var(--border))]/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <FileText className="w-5 h-5 text-[hsl(var(--primary))]" />
          <span className="font-serif font-bold text-xl tracking-tight">landr.fyi</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/browse" className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
            Browse Resumes
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
            How it works
          </Link>
          <Link href="/submit" className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
            Submit
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onFeedback}
            className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors hidden sm:flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" /> Feedback
          </button>
          <Link href="/login" className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors hidden sm:block">
            Sign in
          </Link>
          <Button href="/browse" size="md">Browse Resumes</Button>
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Resume card mock                                                    */
/* ------------------------------------------------------------------ */

function ResumeCard({ data, className = "", style }) {
  const bullets = data.resume_text
    ? data.resume_text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("•") || l.startsWith("-") || l.startsWith("·"))
        .slice(0, 3)
    : [];

  return (
    <Card className={`w-full max-w-lg shadow-xl overflow-hidden ${className}`} style={style}>
      <div className="p-8 sm:p-10 flex flex-col gap-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="w-48 h-8 bg-[hsl(var(--muted))]/80 rounded-md" />
            <div className="text-[hsl(var(--muted-foreground))] font-medium text-sm sm:text-base flex items-center gap-2">
              {data.role} <span className="text-[hsl(var(--muted-foreground))]/50">·</span> {data.years_of_experience} yrs exp
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-semibold py-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Hired at {data.company_name}
            </Badge>
            <span className="text-xs text-[hsl(var(--muted-foreground))] font-medium">{data.year_hired}</span>
          </div>
        </div>

        <div className="w-full h-px bg-[hsl(var(--border))]/50 my-2" />

        <div className="space-y-2">
          {bullets.length > 0 ? bullets.map((b, i) => (
            <div key={i} className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed flex items-start gap-2">
              <span className="text-[hsl(var(--primary))]/60 mt-0.5 shrink-0">·</span>
              <span>{b.replace(/^[•\-·]\s*/, "")}</span>
            </div>
          )) : (
            <div className="space-y-2">
              <div className="w-full h-3 bg-[hsl(var(--muted))]/50 rounded" />
              <div className="w-5/6 h-3 bg-[hsl(var(--muted))]/50 rounded" />
              <div className="w-4/6 h-3 bg-[hsl(var(--muted))]/50 rounded" />
            </div>
          )}
        </div>

        <div className="w-full h-px bg-[hsl(var(--border))]/50 my-2" />

        <div>
          <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2 block">Industry</span>
          <div className="text-sm font-medium">{data.industry}</div>
        </div>
      </div>
    </Card>
  );
}

function SwipeableResumeStack({ resumes }) {
  const [{ current, direction }, setState] = useState({ current: 0, direction: 0 });
  const total = resumes.length;

  const go = (dir) => setState(prev => ({
    current: (prev.current + 1) % total,
    direction: dir,
  }));

  const variants = {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1, x: 0, rotate: 0 },
    exit: (dir) => ({ x: dir * 450, opacity: 0, rotate: dir * 12, transition: { duration: 0.35 } }),
  };

  const next1 = (current + 1) % total;
  const next2 = (current + 2) % total;

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center select-none">
      {/* Back cards (decorative) */}
      <div className="absolute inset-0 transform translate-x-8 -translate-y-8 rotate-6 scale-95 opacity-30 blur-[1px] pointer-events-none">
        <ResumeCard data={resumes[next2]} />
      </div>
      <div className="absolute inset-0 transform translate-x-4 -translate-y-4 rotate-3 scale-[0.98] opacity-60 pointer-events-none">
        <ResumeCard data={resumes[next1]} />
      </div>

      {/* Front card — draggable */}
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={current}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={(_, { offset, velocity }) => {
            if (offset.x > 80 || velocity.x > 400) go(1);
            else if (offset.x < -80 || velocity.x < -400) go(-1);
          }}
          whileDrag={{ scale: 1.02 }}
        >
          <ResumeCard data={resumes[current]} className="shadow-2xl shadow-[hsl(var(--primary))]/10" />
        </motion.div>
      </AnimatePresence>

      {/* Dots + swipe hint */}
      <div className="absolute -bottom-8 left-0 right-0 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {resumes.map((_, i) => (
            <button
              key={i}
              onClick={() => setState({ current: i, direction: i > current ? 1 : -1 })}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-[hsl(var(--primary))]" : "w-1.5 bg-[hsl(var(--muted-foreground))]/30"}`}
            />
          ))}
        </div>
        <p className="text-xs text-[hsl(var(--muted-foreground))]/60">swipe to browse</p>
      </div>
    </div>
  );
}

function MiniResumeThumbnail({ role, company, years }) {
  return (
    <Card className="p-4 sm:p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-[hsl(var(--card))]/50 backdrop-blur-sm">
      <div className="flex flex-col gap-3">
        <div className="w-16 h-3 bg-[hsl(var(--muted))] rounded" />
        <div className="space-y-1">
          <h5 className="font-semibold text-sm">{role}</h5>
          <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <Badge className="border border-[hsl(var(--border))] text-[10px] py-0 font-normal px-1.5">{company}</Badge>
            <span>{years}</span>
          </div>
        </div>
        <div className="space-y-1.5 mt-2">
          <div className="w-full h-1.5 bg-[hsl(var(--muted))]/50 rounded" />
          <div className="w-5/6 h-1.5 bg-[hsl(var(--muted))]/50 rounded" />
          <div className="w-4/6 h-1.5 bg-[hsl(var(--muted))]/50 rounded" />
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Feedback modal                                                      */
/* ------------------------------------------------------------------ */

function FeedbackModal({ onClose }) {
  const [feedback, setFeedback] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFeedback({ name: "", email: "", message: "" });
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div
        className="bg-[hsl(var(--card))] rounded-2xl max-w-lg w-full p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-serif">Send Feedback</h2>
          <button onClick={onClose} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] text-2xl font-light leading-none">×</button>
        </div>
        {submitted ? (
          <p className="text-emerald-600 font-medium text-center py-8">✅ Thanks for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={feedback.name}
              onChange={(e) => setFeedback(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-[hsl(var(--border))] px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/30 bg-[hsl(var(--background))]"
            />
            <input
              type="email"
              required
              placeholder="Your email"
              value={feedback.email}
              onChange={(e) => setFeedback(f => ({ ...f, email: e.target.value }))}
              className="w-full border border-[hsl(var(--border))] px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/30 bg-[hsl(var(--background))]"
            />
            <textarea
              required
              rows={4}
              placeholder="What's on your mind? Bug reports, feature requests, general feedback..."
              value={feedback.message}
              onChange={(e) => setFeedback(f => ({ ...f, message: e.target.value }))}
              className="w-full border border-[hsl(var(--border))] px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/30 resize-none bg-[hsl(var(--background))]"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button onClick={handleSubmit} variant="primary" size="md" className="w-full h-12">
              {loading ? "Sending..." : "Send Feedback"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const [resumeCount, setResumeCount] = useState(null);
  const [companyCount, setCompanyCount] = useState(null);
  const [visitorCount, setVisitorCount] = useState(null);
  const [heroResumes, setHeroResumes] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    supabase
      .from("resumes")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setResumeCount(count));

    supabase
      .from("resumes")
      .select("company_name")
      .then(({ data }) => {
        if (data) {
          const distinct = new Set(data.map(r => r.company_name).filter(Boolean)).size;
          setCompanyCount(distinct);
        }
      });

    supabase
      .from("resumes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) setHeroResumes(data);
      });
  }, []);

  useEffect(() => {
    const trackAndFetch = async () => {
      if (!localStorage.getItem("landrfyi_visited")) {
        const { error } = await supabase.from("page_views").insert([{}]);
        if (!error) localStorage.setItem("landrfyi_visited", "1");
      }
      const { count } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true });
      setVisitorCount(count);
    };
    trackAndFetch();
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans overflow-x-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Nav onFeedback={() => setShowFeedback(true)} />

      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[hsl(var(--primary))]/5 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/4" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <div className="space-y-8 z-10 max-w-2xl">
            <FadeIn>
              <Badge className="px-3 py-1.5 text-sm font-medium text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 mb-6">
                Stop guessing. Start landing.
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.1]">
                See the resumes that{" "}
                <span className="text-[hsl(var(--primary))] italic">actually</span>{" "}
                got them hired.
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xl">
                A community-driven library of real, anonymized resumes from people who landed roles at top companies. Transparency, finally.
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button href="/browse" size="lg">
                Browse Resumes <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button href="#how-it-works" size="lg" variant="outline">
                How it works
              </Button>
            </FadeIn>

            <FadeIn delay={0.3} className="pt-8 border-t border-[hsl(var(--border))]/60">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-[hsl(var(--background))] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--primary))]/30"
                    >
                      <Eye className="w-4 h-4 text-[hsl(var(--primary))]/60" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-medium">
                  <span className="font-bold">{resumeCount ? `${resumeCount.toLocaleString()}+` : "..."} resumes</span>
                  <br />
                  <span className="text-[hsl(var(--muted-foreground))]">
                    across {companyCount ? `${companyCount}+` : "..."} companies
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Swipeable resume cards */}
          <div className="relative z-10 w-full max-w-xl mx-auto lg:ml-auto lg:mr-0 pb-12">
            <FadeIn delay={0.4}>
              {heroResumes.length >= 3 && <SwipeableResumeStack resumes={heroResumes} />}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SNEAK PEEK */}
      <section className="py-20 bg-[hsl(var(--muted))]/30 border-y border-[hsl(var(--border))]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">What you&rsquo;ll see inside</h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
              Browse verified resumes across engineering, design, product, and data.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FadeIn delay={0.1}><MiniResumeThumbnail role="Software Engineer" company="Stripe" years="2 yrs" /></FadeIn>
            <FadeIn delay={0.2}><MiniResumeThumbnail role="Senior UX Designer" company="Airbnb" years="6 yrs" /></FadeIn>
            <FadeIn delay={0.3}><MiniResumeThumbnail role="Data Scientist" company="Netflix" years="7 yrs" /></FadeIn>
            <FadeIn delay={0.4}><MiniResumeThumbnail role="Senior Consultant" company="McKinsey" years="7 yrs" /></FadeIn>
          </div>
          <div className="mt-12 text-center">
            <Button href="/browse" variant="link" size="md">
              View all {resumeCount ? `${resumeCount.toLocaleString()}+` : ""} resumes <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
              Levels.fyi did it for salaries.<br />
              Glassdoor did it for reviews.<br />
              <span className="text-[hsl(var(--primary))] italic">We&rsquo;re doing it for resumes.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-[hsl(var(--muted-foreground))] leading-relaxed">
              For too long, the &ldquo;perfect resume&rdquo; has been a black box guarded by generic advice articles and expensive coaches. We believe the best way to learn how to land a job is to look at the exact document that actually landed it.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* TRUST */}
      <section id="how-it-works" className="py-24 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <FadeIn>
              <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-[hsl(var(--primary-foreground))]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                Radically transparent. Strictly anonymous.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg opacity-80 leading-relaxed">
                We believe in sharing knowledge, not identities. Every resume submitted to landr.fyi goes through a rigorous sanitization process before it&rsquo;s published.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <ul className="space-y-4">
                {[
                  "Names and contact information are fully removed.",
                  "Previous employers are redacted or generalized.",
                  "Specific niche products or internal project names are scrubbed.",
                  "Dates can be generalized to year-only.",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--primary))] mt-0.5 shrink-0" />
                    <span className="opacity-90">{text}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          <div className="relative">
            <FadeIn delay={0.3}>
              <Card className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Badge className="bg-emerald-100 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Work Email Verified
                  </Badge>
                </div>
                <div className="space-y-6 mt-8">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">Before</div>
                    <div className="font-mono text-sm bg-[hsl(var(--muted))]/50 p-3 rounded-md line-through text-[hsl(var(--muted-foreground))]">
                      John Doe · john.doe@email.com · 555-0192
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">After (What we show)</div>
                    <div className="font-mono text-sm bg-[hsl(var(--primary))]/5 p-3 rounded-md border border-[hsl(var(--primary))]/20 flex items-center gap-2">
                      <span className="w-32 h-4 bg-[hsl(var(--muted))] rounded inline-block" /> ·{" "}
                      <span className="italic text-[hsl(var(--muted-foreground))]">[Contact Redacted]</span>
                    </div>
                  </div>
                </div>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 border-b border-[hsl(var(--border))]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold">The proof is in the offers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I spent months tweaking my bullet points based on blog posts. Seeing 5 actual Stripe SWE resumes made me realize my impact was buried. Rewrote it, got the interview.",
                author: "Backend SWE, hired at Stripe",
              },
              {
                quote: "As a career switcher, I had no idea what 'good' looked like for Product. landr.fyi gave me the exact blueprint. It's the highest ROI resource I found.",
                author: "Career switcher — PM at Spotify",
              },
              {
                quote: "Finally, concrete examples of how to quantify design impact. Seeing how a Senior UX Designer at Airbnb formatted their case studies changed my whole approach.",
                author: "Product Designer, hired at Figma",
              },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className="h-full p-8 bg-[hsl(var(--muted))]/20 hover:bg-[hsl(var(--card))] transition-colors">
                  <p className="text-lg font-serif italic mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                      <Award className="w-4 h-4 text-[hsl(var(--primary))]" />
                    </div>
                    <span className="font-medium text-sm text-[hsl(var(--muted-foreground))]">{t.author}</span>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[hsl(var(--primary))]/5 -z-10" />
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              You climbed the ladder.<br />Throw a rope down.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-[hsl(var(--muted-foreground))]">
              Help demystify the hiring process. Share your anonymized resume and help the next generation of talent land their dream role.
            </p>
          </FadeIn>
          <FadeIn delay={0.2} className="pt-4">
            <Button href="/submit" size="lg">Submit Your Resume</Button>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--background))] border-t border-[hsl(var(--border))] pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[hsl(var(--primary))]" />
              <span className="font-serif font-bold text-xl tracking-tight">landr.fyi</span>
            </Link>
            <p className="text-[hsl(var(--muted-foreground))] max-w-sm mb-6">
              A community-driven library of real, anonymized resumes from people who actually got hired at top companies.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
              <li><Link href="/browse" className="hover:text-[hsl(var(--foreground))] transition-colors">Browse Resumes</Link></li>
              <li><Link href="/submit" className="hover:text-[hsl(var(--foreground))] transition-colors">Submit Yours</Link></li>
              <li><Link href="#how-it-works" className="hover:text-[hsl(var(--foreground))] transition-colors">How it works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal & Trust</h4>
            <ul className="space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
              <li><Link href="/legal" className="hover:text-[hsl(var(--foreground))] transition-colors">Privacy & Terms</Link></li>
              <li>
                <button onClick={() => setShowFeedback(true)} className="hover:text-[hsl(var(--foreground))] transition-colors">
                  Send Feedback
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[hsl(var(--border))]/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[hsl(var(--muted-foreground))]">
          <p>© {new Date().getFullYear()} landr.fyi. Built for job seekers, by job seekers.</p>
          {visitorCount !== null && (
            <p className="mt-1 text-[hsl(var(--muted-foreground))]/60">{visitorCount.toLocaleString()} unique visitors</p>
          )}
        </div>
      </footer>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </div>
  );
}
