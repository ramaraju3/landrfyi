"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: "https://landr.fyi/auth/callback",
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto border-b">
        <a href="/" className="text-2xl font-bold text-indigo-600">landr.fyi</a>
      </nav>

      <div className="max-w-md mx-auto px-6 py-20">
        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-3xl font-extrabold mb-2">Check your email</h1>
            <p className="text-gray-500 mb-2">We sent a magic link to <span className="font-medium text-gray-700">{email}</span></p>
            <p className="text-gray-400 text-sm">Click the link in the email to sign in. You can close this tab.</p>
            <button
              onClick={() => setSent(false)}
              className="mt-8 text-sm text-gray-400 hover:text-gray-600 transition"
            >
              ← Use a different email
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold mb-2">Sign in</h1>
            <p className="text-gray-500 mb-8">Enter your email and we'll send you a magic link. No password needed.</p>

            <form onSubmit={handleSendLink} className="flex flex-col gap-4">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
