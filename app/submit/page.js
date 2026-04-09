"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Submit() {
  const [form, setForm] = useState({
    role: "",
    company_tier: "",
    industry: "",
    years_of_experience: "",
    year_hired: "",
    resume_text: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("resumes").insert([{
      ...form,
      years_of_experience: parseInt(form.years_of_experience),
      year_hired: parseInt(form.year_hired),
    }]);

    if (!error) setSubmitted(true);
    else alert("Something went wrong, please try again.");

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto border-b">
        <a href="/" className="text-2xl font-bold text-indigo-600">landr.fyi</a>
        <a href="/browse" className="text-sm text-gray-500 hover:text-indigo-600 transition">
          Browse Resumes
        </a>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-2">Share Your Resume</h1>
        <p className="text-gray-500 mb-10">You landed the job — help others do the same. Remove your name, contact info, and any company-specific details before submitting.</p>

        {submitted ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Thank you for contributing!</h2>
            <p className="text-gray-500 mb-6">Your resume will help others land their dream job.</p>
            <a href="/browse" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition">
              Browse Resumes
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Role Title</label>
              <input
                type="text"
                name="role"
                required
                placeholder="e.g. Senior Product Manager"
                value={form.role}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company Tier</label>
              <select
                name="company_tier"
                required
                value={form.company_tier}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="">Select company tier</option>
                <option value="FAANG">FAANG</option>
                <option value="Big Tech">Big Tech</option>
                <option value="Startup">Startup</option>
                <option value="Consulting">Consulting</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <select
                name="industry"
                required
                value={form.industry}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="">Select industry</option>
                <option value="Tech">Tech</option>
                <option value="Finance">Finance</option>
                <option value="Consulting">Consulting</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Years of Experience</label>
                <input
                  type="number"
                  name="years_of_experience"
                  required
                  min="0"
                  max="40"
                  placeholder="e.g. 6"
                  value={form.years_of_experience}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Year Hired</label>
                <input
                  type="number"
                  name="year_hired"
                  required
                  min="2015"
                  max="2026"
                  placeholder="e.g. 2024"
                  value={form.year_hired}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Anonymized Resume</label>
              <p className="text-xs text-gray-400 mb-2">Remove your name, email, phone, LinkedIn, company names, and any identifying details before pasting.</p>
              <textarea
                name="resume_text"
                required
                rows={12}
                placeholder="Paste your anonymized resume here..."
                value={form.resume_text}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-4 rounded-full font-semibold hover:bg-indigo-700 transition"
            >
              {loading ? "Submitting..." : "Submit Resume"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}