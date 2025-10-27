import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Pluto</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div class="min-h-screen bg-gray-50">
        {/* Header */}
        <header class="bg-white border-b border-gray-200 py-4">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🚀</span>
              <h1 class="text-xl font-bold text-gray-900">Pluto by TeachMath AI</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p class="text-gray-600 mb-8">Last updated: January 2025</p>

          <div class="prose max-w-none space-y-6 text-gray-700">
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p>We collect the following information:</p>
              <ul class="list-disc list-inside ml-4 space-y-2">
                <li><strong>Account Information:</strong> Email address, password (hashed)</li>
                <li><strong>Usage Data:</strong> Questions asked, topics selected, learning progress</li>
                <li><strong>Payment Information:</strong> Processed through Stripe (we don't store card details)</li>
                <li><strong>Subscription Status:</strong> Trial status, subscription dates</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul class="list-disc list-inside ml-4 space-y-2">
                <li>Provide and improve the Service</li>
                <li>Process your subscription payments</li>
                <li>Personalize your learning experience</li>
                <li>Send important service updates (via email)</li>
                <li>Respond to your support requests</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">3. Data Storage and Security</h2>
              <p>
                Your data is stored securely using:
              </p>
              <ul class="list-disc list-inside ml-4 space-y-2">
                <li><strong>Supabase:</strong> User authentication and database (GDPR compliant)</li>
                <li><strong>Stripe:</strong> Secure payment processing (PCI compliant)</li>
                <li><strong>Deno Deploy:</strong> Secure hosting with HTTPS encryption</li>
                <li><strong>DeepSeek AI:</strong> Processes your questions (data not stored)</li>
              </ul>
              <p class="mt-4">
                Passwords are hashed using bcrypt. We implement industry-standard security measures to 
                protect your data.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul class="list-disc list-inside ml-4 space-y-2">
                <li><strong>Supabase:</strong> Authentication and database</li>
                <li><strong>Stripe:</strong> Payment processing</li>
                <li><strong>DeepSeek AI:</strong> AI-powered math tutoring</li>
                <li><strong>OCR.space:</strong> Image text extraction (for photo math solving)</li>
                <li><strong>Deno Deploy:</strong> Hosting and deployment</li>
              </ul>
              <p class="mt-4">
                These services have their own privacy policies. We are not responsible for their practices.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">5. Cookies</h2>
              <p>
                We use cookies to:
              </p>
              <ul class="list-disc list-inside ml-4 space-y-2">
                <li>Maintain your login session (session cookies)</li>
                <li>Remember your language preference (localStorage)</li>
                <li>Track usage analytics (anonymized)</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul class="list-disc list-inside ml-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectify:</strong> Correct inaccurate data</li>
                <li><strong>Delete:</strong> Request account deletion (through Settings)</li>
                <li><strong>Portability:</strong> Export your data</li>
                <li><strong>Object:</strong> Object to processing your data</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">7. Data Retention</h2>
              <p>
                We retain your data as long as your account is active. After account deletion, data is 
                permanently removed within 30 days. Some data may be retained for legal compliance purposes.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">8. Children's Privacy</h2>
              <p>
                Pluto is intended for users aged 13 and above. We do not knowingly collect personal data 
                from children under 13. If you believe a child has provided data, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">9. International Transfers</h2>
              <p>
                Your data may be processed in the following locations:
              </p>
              <ul class="list-disc list-inside ml-4 space-y-2">
                <li>European Union (Supabase, EU hosting)</li>
                <li>United States (Stripe, DeepSeek AI)</li>
              </ul>
              <p class="mt-4">
                We ensure adequate safeguards are in place for international data transfers.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes via email or through the Service.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:support@teachmathai.com" class="text-blue-600 hover:underline">
                  support@teachmathai.com
                </a>
              </p>
            </section>
          </div>

          <div class="mt-12 text-center">
            <a 
              href="/" 
              class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
});

