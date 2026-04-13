export default function Legal() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto border-b">
        <a href="/" className="text-3xl font-bold text-indigo-600">landr.fyi</a>
        <a href="/browse" className="text-sm text-gray-500 hover:text-indigo-600 transition">
          Browse Resumes
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold mb-2">Legal</h1>
        <p className="text-gray-400 text-sm mb-16">Last updated: April 2026</p>

        {/* Terms of Service */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Terms of Service</h2>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h3>
              <p>By accessing or using landr.fyi, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. User Submitted Content</h3>
              <p>By submitting a resume to landr.fyi, you confirm that:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>The resume is your own and you have the right to share it</li>
                <li>You have removed all personally identifiable information (PII) including your name, contact details, address, and any other identifying information</li>
                <li>You have removed any confidential, proprietary, or trade secret information belonging to any employer or third party</li>
                <li>You grant landr.fyi a non-exclusive, royalty-free license to display the submitted content on the platform</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Prohibited Content</h3>
              <p>You may not submit content that contains confidential business information, trade secrets, personally identifiable information of any individual, or content that violates any applicable law or third-party rights.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Disclaimer of Liability</h3>
              <p>landr.fyi is not responsible for the accuracy, completeness, or legality of user-submitted content. We do not verify that submitted resumes have been properly anonymized. Users submit content at their own risk.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5. Intellectual Property</h3>
              <p>landr.fyi does not claim ownership of user-submitted resumes. However, by submitting content, you acknowledge that the platform may display it publicly for informational and reference purposes only. Users viewing resumes agree to use them for reference only and not to copy or reproduce the content.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6. Termination</h3>
              <p>We reserve the right to remove any content or suspend access to the platform at our discretion, without notice, for any reason including violation of these terms.</p>
            </div>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Privacy Policy</h2>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Information We Collect</h3>
              <p>We collect the following information:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Email addresses when you create an account or verify a resume submission</li>
                <li>Resume content submitted by users</li>
                <li>Anonymous page view data for analytics purposes</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. How We Use Your Information</h3>
              <p>Email addresses are used solely for account authentication and resume verification purposes. We do not sell, rent, or share your email address with third parties. Resume content is displayed publicly on the platform for reference purposes.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Data Storage</h3>
              <p>Data is stored securely using Supabase. Page analytics are processed by Vercel Analytics. We take reasonable measures to protect your data but cannot guarantee absolute security.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Cookies</h3>
              <p>We use minimal cookies necessary for the platform to function. We do not use advertising cookies or tracking cookies.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5. Your Rights</h3>
              <p>You may request removal of your submitted content or email address at any time by contacting us. We will process removal requests within 30 days.</p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Disclaimer</h2>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Informational Purposes Only</h3>
              <p>All resumes on landr.fyi are shared for informational and reference purposes only. They are not templates to be copied verbatim. landr.fyi makes no guarantees that using similar resume formats or content will result in employment.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">No Copyright Infringement Intended</h3>
              <p>landr.fyi does not knowingly host copyrighted or confidential material. If you believe content on this platform infringes on your rights, please contact us and we will remove it promptly.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">No Employment Guarantee</h3>
              <p>landr.fyi is a community reference tool. We do not guarantee job placement, interview success, or any employment outcome as a result of using this platform.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
              <p>For any legal concerns, content removal requests, or questions about these policies, please reach out via the platform.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm border-t">
        <a href="/" className="hover:text-indigo-600 transition">← Back to landr.fyi</a>
      </footer>
    </main>
  );
}
