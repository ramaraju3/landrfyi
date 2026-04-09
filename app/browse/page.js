"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import ShareButton from "../components/ShareButton";

export default function Browse() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ industry: "", company_tier: "", role: "" });
  const router = useRouter();
  useEffect(() => {
    fetchResumes();
  }, [filter]);

  const fetchResumes = async () => {
    setLoading(true);
    let query = supabase.from("resumes").select("*");

    if (filter.industry) query = query.eq("industry", filter.industry);
    if (filter.company_tier) query = query.eq("company_tier", filter.company_tier);
    if (filter.role) query = query.ilike("role", `%${filter.role}%`);

    const { data, error } = await query;
    if (!error) setResumes(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto border-b">
        <a href="/" className="text-2xl font-bold text-indigo-600">landr.fyi</a>
        <a href="/#waitlist" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
          Join Waitlist
        </a>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-2">Browse Resumes</h1>
        <p className="text-gray-500 mb-10">Real resumes from people who landed the job. All personal info removed.</p>

        {/* Filters */}
<div className="flex gap-4 mb-10 flex-wrap">
  <input
    type="text"
    placeholder="Search by role..."
    className="border px-4 py-2 rounded-full text-sm outline-none flex-1 min-w-48"
    onChange={(e) => setFilter(f => ({ ...f, role: e.target.value }))}
  />

  <select
    className="border px-4 py-2 rounded-full text-sm outline-none"
    onChange={(e) => setFilter(f => ({ ...f, industry: e.target.value }))}
  >
    <option value="">All Industries</option>
    <option value="Tech">Tech</option>
    <option value="Finance">Finance</option>
    <option value="Consulting">Consulting</option>
    <option value="Healthcare">Healthcare</option>
  </select>

  <select
    className="border px-4 py-2 rounded-full text-sm outline-none"
    onChange={(e) => setFilter(f => ({ ...f, company_tier: e.target.value }))}
  >
    <option value="">All Company Tiers</option>
    <option value="FAANG">FAANG</option>
    <option value="Big Tech">Big Tech</option>
    <option value="Startup">Startup</option>
    <option value="Consulting">Consulting</option>
  </select>
</div>

        {/* Resume Cards */}
        {loading ? (
          <p className="text-gray-400">Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <p className="text-gray-400">No resumes found for these filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumes.map((resume) => (
<div key={resume.id} onClick={() => router.push(`/resume/${resume.id}`)} className="block border rounded-2xl p-6 hover:shadow-md transition cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{resume.role}</h2>
                    <p className="text-gray-500 text-sm">{resume.company_tier} · {resume.industry} · {resume.year_hired}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {resume.years_of_experience} yrs exp
                    </span>
                    <ShareButton url={`/resume/${resume.id}`} title={`Check out this ${resume.role} resume that landed a job at a ${resume.company_tier} company on landr.fyi`} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{resume.resume_text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}