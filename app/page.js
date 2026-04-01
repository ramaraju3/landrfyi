export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
        <span className="text-2xl font-bold text-indigo-600">landr.fyi</span>
        <a href="#waitlist" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
          Join Waitlist
        </a>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-28 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          See the resumes that <span className="text-indigo-600">actually got people hired.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          landr.fyi is a community-driven library of real, anonymized resumes from people who landed the job. No more guessing what the bar looks like.
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
        <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-5 py-3 rounded-full text-gray-900 outline-none"
          />
          <button type="submit" className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full hover:bg-indigo-50 transition">
            Join Waitlist
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        © 2026 landr.fyi — Built for job seekers, by job seekers.
      </footer>
    </main>
  );
}