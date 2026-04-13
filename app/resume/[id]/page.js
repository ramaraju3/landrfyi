"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import ShareButton from "../../components/ShareButton";

export default function ResumePage() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setResume(data);
      // Increment view count
      await supabase.rpc("increment_view_count", { resume_id: id });
      setLoading(false);
    };

    fetchResume();
  }, [id]);

  if (loading) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400">Loading resume...</p>
    </main>
  );

  if (!resume) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400">Resume not found.</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto border-b">
        <a href="/" className="text-3xl font-bold text-indigo-600">landr.fyi</a>
        <a href="/browse" className="text-sm text-gray-500 hover:text-indigo-600 transition">
          ← Back to Browse
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">{resume.role}</h1>
            <div className="flex items-center gap-2 mt-1">
              {resume.company_domain && (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${resume.company_domain}&sz=64`}
                  alt={resume.company_name}
                  className="w-6 h-6 rounded object-contain"
                  onError={(e) => e.target.style.display = "none"}
                />
              )}
              <p className="text-gray-500 flex items-center gap-2">
                {resume.company_name || "Company"} · {resume.industry} · Hired in {resume.year_hired}
                {resume.verified && (
                  <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">✅ Verified</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-600 text-sm font-semibold px-4 py-2 rounded-full">
              {resume.years_of_experience} yrs exp
            </span>
            <ShareButton url={`/resume/${resume.id}`} title={`Check out this ${resume.role} resume that landed a job at a ${resume.company_tier} company on landr.fyi`} />
          </div>
        </div>

        {/* Divider */}
        <hr className="mb-8" />

        {/* Resume Content */}
<div className="bg-gray-50 rounded-2xl p-8 select-none" onCopy={(e) => e.preventDefault()}>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Anonymized Resume</h2>

          {resume.display_mode === "file" && resume.file_url ? (
            <div className="w-full">
              {resume.file_url.endsWith(".pdf") ? (
                <iframe
                  src={resume.file_url}
                  className="w-full rounded-xl border"
                  style={{ height: "800px" }}
                />
              ) : resume.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={resume.file_url}
                  alt="Resume"
                  className="w-full rounded-xl border"
                />
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-4">📄</div>
                  <p className="font-medium text-gray-500">Preview not available for this file type</p>
                  <p className="text-sm mt-1">The contributor uploaded a Word document</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{resume.resume_text}</p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Did this help you? Pay it forward.</p>
          <a href="/submit" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition">
            Share Your Resume
          </a>
        </div>
      </div>
    </main>
  );
}