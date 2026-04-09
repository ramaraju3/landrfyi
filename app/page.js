"use client";

import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeCount, setResumeCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbwAO5CX2LHWYkxAidn7fy7blb2ny6fpebQ2iHECrHSNDd1-38IE0ZT8GRxAyIME3KNk/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
        <span className="text-2xl font-bold text-indigo-600">landr.fyi</span>
        <div className="flex items-center gap-4">
        <a href="/browse" className="text-sm text-gray-500 hover:text-indigo-600 transition">
        Browse Resumes
      </a>
      <a href="/submit" className="text-sm text-gray-500 hover:text-indigo-600 transition">
      Share Yours
      </a>
      <a href="#waitlist" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
      Join Waitlist
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
        <a href="#waitlist" className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition">
          Get Early Access
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

      {/* Waitlist */}
      <section id="waitlist" className="bg-indigo-600 py-24 px-6 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Be the first to know when we launch.</h2>
        <p className="text-indigo-200 mb-10">Join the waitlist and get early access when landr.fyi goes live.</p>

        {submitted ? (
          <p className="text-2xl font-semibold">🎉 You're on the list! We'll be in touch.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3 rounded-full text-gray-900 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full hover:bg-indigo-50 transition"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        <p>👀 {visitorCount.toLocaleString()} visits and counting</p>
        <p className="mt-1">© 2026 landr.fyi — Built for job seekers, by job seekers.</p>
      </footer>
    </main>
  );
}