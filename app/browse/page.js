"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import ShareButton from "../components/ShareButton";

export default function Browse() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ industry: "", role: "", exp_level: "" });
  const [sortBy, setSortBy] = useState("created_at");
  const router = useRouter();
  useEffect(() => {
    fetchResumes();
  }, [filter, sortBy]);

  const fetchResumes = async () => {
    setLoading(true);
    let query = supabase.from("resumes").select("*");

    if (filter.industry) query = query.eq("industry", filter.industry);
if (filter.role) {
      query = query.or(`role.ilike.%${filter.role}%,company_name.ilike.%${filter.role}%`);
    }
    if (filter.exp_level) {
      if (filter.exp_level === "no_exp") query = query.eq("years_of_experience", 0);
      if (filter.exp_level === "early") query = query.gte("years_of_experience", 1).lte("years_of_experience", 3);
      if (filter.exp_level === "mid") query = query.gte("years_of_experience", 4).lte("years_of_experience", 7);
      if (filter.exp_level === "senior") query = query.gte("years_of_experience", 8).lte("years_of_experience", 12);
      if (filter.exp_level === "staff") query = query.gte("years_of_experience", 13);
    }

    query = query.order(sortBy, { ascending: false });
    const { data, error } = await query;
    if (!error) setResumes(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto border-b">
        <a href="/" className="text-3xl font-bold text-indigo-600">landr.fyi</a>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-sm text-gray-500 hover:text-indigo-600 transition">
            Sign in
          </a>
          <a href="/submit" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
            Share Yours
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-2">Browse Resumes</h1>
        <p className="text-gray-500 mb-10">Real resumes from people who landed the job. All personal info removed.</p>

        {/* Filters */}
<div className="flex gap-4 mb-10 flex-wrap">
  <input
    type="text"
    placeholder="Search by role or company..."
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
    <option value="Marketing">Marketing</option>
    <option value="Sales">Sales</option>
    <option value="Legal">Legal</option>
    <option value="Education">Education</option>
    <option value="Government">Government</option>
    <option value="Nonprofit">Nonprofit</option>
    <option value="Real Estate">Real Estate</option>
    <option value="Manufacturing">Manufacturing</option>
    <option value="Retail">Retail</option>
    <option value="Media">Media</option>
    <option value="Other">Other</option>
  </select>

  <select
    className="border px-4 py-2 rounded-full text-sm outline-none"
    onChange={(e) => setFilter(f => ({ ...f, exp_level: e.target.value }))}
  >
    <option value="">All Experience Levels</option>
    <option value="no_exp">No Experience (0 yrs)</option>
    <option value="early">Early Career (1–3 yrs)</option>
    <option value="mid">Mid Level (4–7 yrs)</option>
    <option value="senior">Senior (8–12 yrs)</option>
    <option value="staff">Staff / Principal (13+ yrs)</option>
  </select>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setSortBy("created_at")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${sortBy === "created_at" ? "bg-indigo-600 text-white" : "border text-gray-500 hover:border-indigo-300"}`}
            >
              🕒 Newest
            </button>
            <button
              onClick={() => setSortBy("view_count")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${sortBy === "view_count" ? "bg-indigo-600 text-white" : "border text-gray-500 hover:border-indigo-300"}`}
            >
              🔥 Most Viewed
            </button>
          </div>
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
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {resume.company_domain && (
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${resume.company_domain}&sz=64`}
                          alt={resume.company_name}
                          className="w-5 h-5 rounded object-contain"
                          onError={(e) => e.target.style.display = "none"}
                        />
                      )}
                      <h2 className="text-xl font-bold">{resume.role}</h2>
                    </div>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      {resume.company_name || "Company"} · {resume.industry} · {resume.year_hired}
                      {resume.verified && (
                        <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">✅ Verified</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      {resume.years_of_experience} yrs exp
                    </span>
                    <ShareButton url={`/resume/${resume.id}`} title={`Check out this ${resume.role} resume that landed a job at a ${resume.company_tier} company on landr.fyi`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
