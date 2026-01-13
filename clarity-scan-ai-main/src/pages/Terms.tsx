import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - NeuroScan AI</title>
        <meta name="description" content="Read NeuroScan AI's terms of service to understand the rules and guidelines for using our AI-powered brain tumor detection platform." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />

        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
              <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
              <p className="text-muted-foreground mb-8">Last updated: December 2025</p>

              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing or using NeuroScan AI's services, you agree to be bound by these Terms of Service. 
                    If you do not agree to these terms, please do not use our platform.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                  <p className="text-muted-foreground">
                    NeuroScan AI provides an AI-powered brain tumor detection platform that analyzes MRI scans 
                    to identify potential abnormalities. Our service is intended to assist medical professionals 
                    and is not a replacement for professional medical diagnosis.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
                  <p className="text-muted-foreground mb-3">As a user of our platform, you agree to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Provide accurate and complete information when creating an account</li>
                    <li>Maintain the confidentiality of your account credentials</li>
                    <li>Use the platform only for lawful purposes</li>
                    <li>Not upload inappropriate or non-medical content</li>
                    <li>Respect the intellectual property rights of NeuroScan AI</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">4. Medical Disclaimer</h2>
                  <p className="text-muted-foreground">
                    NeuroScan AI is designed to assist in the detection of brain tumors but should NOT be used 
                    as the sole basis for medical decisions. Always consult with qualified healthcare professionals 
                    for diagnosis and treatment. Our AI analysis is provided for informational purposes only.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
                  <p className="text-muted-foreground">
                    All content, features, and functionality of the NeuroScan AI platform are owned by us and 
                    are protected by international copyright, trademark, and other intellectual property laws. 
                    You may not reproduce, distribute, or create derivative works without our permission.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
                  <p className="text-muted-foreground">
                    NeuroScan AI and its affiliates shall not be liable for any indirect, incidental, special, 
                    consequential, or punitive damages arising from your use of our services. Our liability is 
                    limited to the maximum extent permitted by law.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">7. Privacy</h2>
                  <p className="text-muted-foreground">
                    Your use of NeuroScan AI is also governed by our Privacy Policy. Please review it to 
                    understand how we collect, use, and protect your information.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">8. Modifications</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these Terms of Service at any time. We will notify users 
                    of significant changes via email or through our platform. Continued use of the service 
                    after changes constitutes acceptance of the new terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
                  <p className="text-muted-foreground">
                    We may terminate or suspend your account and access to our services at our sole discretion, 
                    without notice, for conduct that we believe violates these Terms of Service or is harmful 
                    to other users or us.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
                  <p className="text-muted-foreground">
                    For questions about these Terms of Service, please contact us at:
                  </p>
                  <p className="text-muted-foreground mt-3">
                    <strong>Email:</strong> m.dinesh.it27@gmail.com<br />
                    <strong>Address:</strong> Chennai, Tamil Nadu, India
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
