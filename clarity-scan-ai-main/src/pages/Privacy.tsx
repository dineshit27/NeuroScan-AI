import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - NeuroScan AI</title>
        <meta name="description" content="Read NeuroScan AI's privacy policy to understand how we collect, use, and protect your personal information and medical data." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />

        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
              <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
              <p className="text-muted-foreground mb-8">Last updated: December 2025</p>

              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                  <p className="text-muted-foreground">
                    At NeuroScan AI, we take your privacy seriously. This Privacy Policy explains how we collect, 
                    use, disclose, and safeguard your information when you use our brain tumor detection platform.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                  <p className="text-muted-foreground mb-3">We may collect the following types of information:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Personal Information:</strong> Name, email address, and contact information you provide when creating an account.</li>
                    <li><strong>Medical Images:</strong> MRI scans and other medical images you upload for analysis.</li>
                    <li><strong>Usage Data:</strong> Information about how you interact with our platform, including analysis history.</li>
                    <li><strong>Device Information:</strong> Browser type, IP address, and device identifiers.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                  <p className="text-muted-foreground mb-3">We use the collected information for:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Providing and improving our AI analysis services</li>
                    <li>Processing and analyzing uploaded MRI scans</li>
                    <li>Communicating with you about our services</li>
                    <li>Maintaining and improving platform security</li>
                    <li>Complying with legal obligations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures to protect your data, including:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
                    <li>End-to-end encryption for data transmission</li>
                    <li>Secure cloud storage with access controls</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Employee training on data protection</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
                  <p className="text-muted-foreground">
                    We retain your personal information and medical images only as long as necessary to provide 
                    our services and comply with legal requirements. You may request deletion of your data at any time.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                  <p className="text-muted-foreground mb-3">You have the right to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to data processing</li>
                    <li>Data portability</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">7. Third-Party Services</h2>
                  <p className="text-muted-foreground">
                    We use trusted third-party services for AI processing (Google Gemini) and cloud infrastructure. 
                    These providers are bound by strict data protection agreements and comply with applicable privacy laws.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have questions about this Privacy Policy or our data practices, please contact us at:
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
