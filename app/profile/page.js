"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      setUser(session.user);
      fetchResumes(session.user.id);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        window.location.href = "/login";
      } else if (session) {
        setUser(session.user);
        fetchResumes(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchResumes = async (userId) => {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setResumes(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", id);

    if (!error) {
      setResumes(resumes.filter(r => r.id !== id));
    } else {
      alert("Failed to delete. Please try again.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400">Loading your profile...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto border-b">
        <a href="/" className="text-2xl font-bold text-indigo-600">landr.fyi</a>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-red-500 transition"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-2">Your Submissions</h1>
        <p className="text-gray-500 mb-10">Resumes you've shared on landr.fyi. You can delete them at any time.</p>

        {resumes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="text-xl font-bold mb-2">No submissions yet</h2>
            <p className="text-gray-500 mb-6">Share your resume to help others land their dream job.</p>
            <a href="/submit" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition">
              Share Your Resume
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {resumes.map((resume) => (
              <div key={resume.id} className="border rounded-2xl p-6 flex justify-between items-start">
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
                    {resume.verified && (
                      <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">✅ Verified</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{resume.company_name || "Company"} · {resume.industry} · {resume.year_hired}</p>
                  <p className="text-gray-400 text-xs mt-1">Submitted {new Date(resume.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`/resume/${resume.id}`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="text-sm text-red-400 hover:text-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
