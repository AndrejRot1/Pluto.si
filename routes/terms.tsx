import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - Pluto</title>
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
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p class="text-gray-600 mb-8">Last updated: January 2025</p>

          <div class="prose max-w-none space-y-6 text-gray-700">
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Pluto ("the Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to these Terms of Service, please do 
                not use the Service.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p>
                Pluto is an AI-powered math tutoring platform that provides:
              </p>
              <ul class="list-disc list-inside ml-4 space-y-2">
                <li>Personalized math tutoring powered by artificial intelligence</li>
                <li>Progressive difficulty exercises (1-5 levels)</li>
                <li>Step-by-step solutions with LaTeX rendering</li>
                <li>Visual graph rendering</li>
                <li>Image OCR for solving math from photos</li>
                <li>Multi-language support (8 languages)</li>
                <li>Exercise generation system</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
              <p>To access certain features, you must register for an account. You agree to:</p>
              <ul class="list-disc list-inside ml-4 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information</li>
                <li>Maintain the security of your account</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">4. Free Trial</h2>
              <p>
                We offer a 3-day free trial period. During this time, you have full access to all features. 
                After the trial expires, you must subscribe to continue using the Service. Only one free trial 
                per email address is allowed.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">5. Subscription and Billing</h2>
              <p>
                Subscriptions are billed at €9.99 per month through Stripe. By subscribing, you authorize 
                us to charge your payment method on a recurring monthly basis. You may cancel your subscription 
                at any time through your account settings.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">6. Refund Policy</h2>
              <p>
                We do not offer refunds for monthly subscriptions. If you are unsatisfied, please cancel 
                before your next billing cycle to avoid being charged.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">7. Acceptable Use</h2>
              <p>You agree NOT to:</p>
              <ul class="list-disc list-inside ml-4 space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Upload malicious content or files</li>
                <li>Attempt to reverse engineer or decompile the Service</li>
                <li>Share your account credentials with others</li>
                <li>Create multiple accounts to abuse the free trial</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">8. Intellectual Property</h2>
              <p>
                All content, features, and functionality of the Service are owned by TeachMath AI and are 
                protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
              <p>
                TeachMath AI shall not be liable for any indirect, incidental, special, consequential, or 
                punitive damages arising out of your use of the Service.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Your continued use of the Service 
                constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-3">11. Contact</h2>
              <p>
                If you have any questions about these Terms, please contact us at{" "}
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

