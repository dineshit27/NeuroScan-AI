import { Helmet } from 'react-helmet-async';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function Disclaimer() {
  return (
    <>
      <Helmet>
        <title>Medical Disclaimer - NeuroScan AI</title>
        <meta name="description" content="Important medical disclaimer for NeuroScan AI. Understand the limitations and intended use of our AI-powered brain tumor detection system." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />

        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-8">Medical Disclaimer</h1>
              <p className="text-muted-foreground mb-8">Last updated: December 2025</p>

              <Alert className="mb-8 border-warning bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <AlertTitle className="text-warning">Important Notice</AlertTitle>
                <AlertDescription className="text-warning-foreground">
                  NeuroScan AI is designed for educational and research purposes only. It is NOT a substitute 
                  for professional medical advice, diagnosis, or treatment.
                </AlertDescription>
              </Alert>

              <section className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Purpose of This Tool</h2>
                  <p className="text-muted-foreground">
                    NeuroScan AI uses artificial intelligence to analyze brain MRI scans and provide preliminary 
                    assessments regarding the potential presence of tumors. This tool is intended to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
                    <li>Serve as an educational resource for understanding AI in medical imaging</li>
                    <li>Assist healthcare professionals as a supplementary screening tool</li>
                    <li>Provide rapid preliminary analysis to aid in prioritization</li>
                    <li>Support research and development in medical AI</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
                  <p className="text-muted-foreground mb-3">Users should be aware that:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>AI analysis may produce false positives or false negatives</li>
                    <li>The accuracy of results depends on image quality and format</li>
                    <li>Our AI cannot detect all types of brain abnormalities</li>
                    <li>Results should never be used as the sole basis for medical decisions</li>
                    <li>The system may not account for individual patient history or context</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Professional Medical Care</h2>
                  <p className="text-muted-foreground">
                    If you suspect you have a brain tumor or any neurological condition, please:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
                    <li>Consult with a licensed healthcare provider immediately</li>
                    <li>Seek proper diagnostic testing from certified medical facilities</li>
                    <li>Do not delay seeking medical attention based on our analysis results</li>
                    <li>Always follow the advice of qualified medical professionals</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">No Doctor-Patient Relationship</h2>
                  <p className="text-muted-foreground">
                    Use of NeuroScan AI does not create a doctor-patient relationship. The information provided 
                    through our platform is not personalized medical advice and should not be interpreted as such.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Liability Disclaimer</h2>
                  <p className="text-muted-foreground">
                    NeuroScan AI, its creators, developers, and affiliates are not liable for any decisions 
                    made or actions taken based on the information provided by our platform. Users assume 
                    full responsibility for the use of this tool and any consequences thereof.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Emergency Situations</h2>
                  <p className="text-muted-foreground">
                    If you are experiencing a medical emergency, please contact emergency services immediately. 
                    Do not use NeuroScan AI for emergency medical decisions.
                  </p>
                  <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/50">
                    <p className="font-semibold text-destructive">Emergency Numbers:</p>
                    <ul className="text-muted-foreground mt-2">
                      <li>India: 102</li>
                      <li>United States: 911</li>
                      <li>European Union: 112</li>
                      <li>United Kingdom: 999</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Acknowledgment</h2>
                  <p className="text-muted-foreground">
                    By using NeuroScan AI, you acknowledge that you have read, understood, and agree to this 
                    medical disclaimer. You understand that our AI analysis is for informational purposes only 
                    and should not replace professional medical evaluation.
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
