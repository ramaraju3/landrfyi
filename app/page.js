"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [resumeCount, setResumeCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [feedback, setFeedback] = useState({ name: "", email: "", message: "" });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
  const fetchCount = async () => {
    const { count } = await supabase
      .from("resumes")
      .select("*", { count: "exact", head: true });
    setResumeCount(count);
  };
  fetchCount();
}, []);

  useEffect(() => {
  const trackAndFetchVisitors = async () => {
    // Insert a new visit
    await supabase.from("page_views").insert([{}]);

    // Get total count
    const { count } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true });

    setVisitorCount(count);
  };
  trackAndFetchVisitors();
}, []);


  const handleFeedback = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);
    setFeedbackError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackSubmitted(true);
        setShowFeedbackModal(false);
        setFeedback({ name: "", email: "", message: "" });
      } else {
        setFeedbackError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setFeedbackError("Something went wrong. Please try again.");
    }
    setFeedbackLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
        <span className="text-3xl font-bold text-indigo-600">landr.fyi</span>
        <div className="flex items-center gap-4">
          <a href="/browse" className="text-sm text-gray-500 hover:text-indigo-600 transition">
            Browse Resumes
          </a>
          <a href="/submit" className="text-sm text-gray-500 hover:text-indigo-600 transition">
            Share Yours
          </a>
          <a href="/login" className="text-sm text-gray-500 hover:text-indigo-600 transition">
            Sign in
          </a>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="text-sm text-gray-500 hover:text-indigo-600 transition"
          >
            💬 Feedback
          </button>
          <a href="/browse" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
            Browse Resumes
          </a>
        </div>
    </nav>

      {/* Hero */}
      <section className="text-center px-6 py-28 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          See the resumes that <span className="text-indigo-600">actually got people hired.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-4 max-w-2xl mx-auto">
  landr.fyi is a community-driven library of real, anonymized resumes from people who landed the job. No more guessing what the bar looks like.
</p>
<p className="text-indigo-600 font-semibold text-lg mb-10">
  🗂 {resumeCount} resumes shared so far
</p>
        <a href="/browse" className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition">
          Browse Resumes
        </a>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold mb-2">You land the job</h3>
              <p className="text-gray-500">You worked hard and got the offer. Congrats.</p>
            </div>
            <div>
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">You share your resume</h3>
              <p className="text-gray-500">We strip out your name, company details, and anything personally identifiable.</p>
            </div>
            <div>
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Community levels up</h3>
              <p className="text-gray-500">Job seekers finally see what a winning resume looks like for their target role.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">The bar has always been hidden. Until now.</h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Levels.fyi made salary data transparent. Glassdoor opened up company reviews. landr.fyi does the same for resumes — real signal, from real people, for real jobs.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-24 px-6 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to land your next role?</h2>
        <p className="text-indigo-200 mb-10">Browse real resumes from people who got hired. See the bar. Clear it.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/browse" className="bg-white text-indigo-600 font-semibold px-8 py-4 rounded-full hover:bg-indigo-50 transition">
            Browse Resumes
          </a>
          <a href="/submit" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-indigo-500 transition">
            Share Yours
          </a>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16 px-6 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Have feedback or found a bug?</h2>
        <p className="text-gray-500 mb-8">We're actively improving landr.fyi. Let us know what you think.</p>
        {feedbackSubmitted ? (
          <p className="text-green-500 font-medium">✅ Thanks for your feedback!</p>
        ) : (
          <form onSubmit={handleFeedback} className="flex flex-col gap-4 text-left">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={feedback.name}
                onChange={(e) => setFeedback(f => ({ ...f, name: e.target.value }))}
                className="flex-1 border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="email"
                required
                placeholder="Your email"
                value={feedback.email}
                onChange={(e) => setFeedback(f => ({ ...f, email: e.target.value }))}
                className="flex-1 border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <textarea
              required
              rows={4}
              placeholder="What's on your mind? Bug reports, feature requests, general feedback..."
              value={feedback.message}
              onChange={(e) => setFeedback(f => ({ ...f, message: e.target.value }))}
              className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
            {feedbackError && <p className="text-red-400 text-sm">{feedbackError}</p>}
            <button
              type="submit"
              disabled={feedbackLoading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
            >
              {feedbackLoading ? "Sending..." : "Send Feedback"}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        <p>👀 {visitorCount.toLocaleString()} visits and counting</p>
        <p className="mt-1">© 2026 landr.fyi — Built for job seekers, by job seekers.</p>
        <p className="mt-2">
          <a href="/legal" className="hover:text-indigo-600 transition">Terms · Privacy · Disclaimer</a>
        </p>
      </footer>
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Send Feedback</h2>
              <button onClick={() => setShowFeedbackModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
            </div>
            {feedbackSubmitted ? (
              <p className="text-green-500 font-medium text-center py-8">✅ Thanks for your feedback!</p>
            ) : (
              <form onSubmit={handleFeedback} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={feedback.name}
                  onChange={(e) => setFeedback(f => ({ ...f, name: e.target.value }))}
                  className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={feedback.email}
                  onChange={(e) => setFeedback(f => ({ ...f, email: e.target.value }))}
                  className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="What's on your mind? Bug reports, feature requests, general feedback..."
                  value={feedback.message}
                  onChange={(e) => setFeedback(f => ({ ...f, message: e.target.value }))}
                  className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                />
                {feedbackError && <p className="text-red-400 text-sm">{feedbackError}</p>}
                <button
                  type="submit"
                  disabled={feedbackLoading}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
                >
                  {feedbackLoading ? "Sending..." : "Send Feedback"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}