"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const verify = async () => {
      if (!token || !id) {
        setStatus("error");
        return;
      }

      const { data, error } = await supabase
        .from("resumes")
        .select("verification_token")
        .eq("id", id)
        .single();

      if (error || !data || data.verification_token !== token) {
        setStatus("error");
        return;
      }

      const { error: updateError } = await supabase
        .from("resumes")
        .update({ verified: true })
        .eq("id", id);

      if (updateError) {
        setStatus("error");
        return;
      }

      setStatus("success");
    };

    verify();
  }, [token, id]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6">
        {status === "verifying" && (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold mb-2">Verifying your submission...</h1>
            <p className="text-gray-500">Just a moment</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold mb-2">You're verified!</h1>
            <p className="text-gray-500 mb-8">Your resume now has a verified badge on landr.fyi</p>
            <a href="/browse" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition">
              Browse Resumes
            </a>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-2">Verification failed</h1>
            <p className="text-gray-500 mb-8">This link may have expired or is invalid.</p>
            <a href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition">
              Go Home
            </a>
          </>
        )}
      </div>
    </main>
  );
}
