import { BrainDetector } from '@/components/BrainDetector';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>NeuroScan AI - Brain Tumor Detection</title>
        <meta name="description" content="AI-powered brain tumor detection system. Upload MRI scans for instant analysis using advanced deep learning technology." />
      </Helmet>
      <BrainDetector />
    </>
  );
};

export default Index;
