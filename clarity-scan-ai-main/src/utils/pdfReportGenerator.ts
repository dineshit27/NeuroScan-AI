import jsPDF from 'jspdf';
import { ClassificationResult, FOOD_RECOMMENDATIONS } from './brainTumorClassifier';

interface ReportData {
  result: ClassificationResult;
  imageUrl: string;
}

const getSeverityLabel = (sev: number): string => {
  if (sev < 30) return 'Low';
  if (sev < 60) return 'Moderate';
  return 'High';
};

const getSeverityColor = (sev: number): [number, number, number] => {
  if (sev < 30) return [34, 197, 94]; // green
  if (sev < 60) return [234, 179, 8]; // yellow
  return [239, 68, 68]; // red
};

export const generatePDFReport = async ({ result, imageUrl }: ReportData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  const reportId = `NS-${Date.now().toString(36).toUpperCase()}`;
  const reportDate = new Date().toLocaleString();

  const recommendations = result.foodRecommendations || 
    FOOD_RECOMMENDATIONS[result.tumorType] || 
    FOOD_RECOMMENDATIONS['No Tumor'];

  // Helper functions
  const addText = (text: string, x: number, y: number, options?: { 
    fontSize?: number; 
    fontStyle?: 'normal' | 'bold' | 'italic';
    color?: [number, number, number];
    align?: 'left' | 'center' | 'right';
  }) => {
    const { fontSize = 10, fontStyle = 'normal', color = [0, 0, 0], align = 'left' } = options || {};
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(...color);
    
    let adjustedX = x;
    if (align === 'center') {
      adjustedX = pageWidth / 2;
    } else if (align === 'right') {
      adjustedX = pageWidth - margin;
    }
    
    pdf.text(text, adjustedX, y, { align });
  };

  const addSection = (title: string, y: number): number => {
    pdf.setFillColor(59, 130, 246);
    pdf.rect(margin, y, contentWidth, 8, 'F');
    addText(title, margin + 3, y + 5.5, { fontSize: 11, fontStyle: 'bold', color: [255, 255, 255] });
    return y + 12;
  };

  const drawProgressBar = (x: number, y: number, width: number, height: number, percentage: number, color: [number, number, number]) => {
    // Background
    pdf.setFillColor(229, 231, 235);
    pdf.roundedRect(x, y, width, height, 2, 2, 'F');
    // Progress
    pdf.setFillColor(...color);
    const progressWidth = (percentage / 100) * width;
    if (progressWidth > 0) {
      pdf.roundedRect(x, y, progressWidth, height, 2, 2, 'F');
    }
  };

  // Header with gradient effect
  pdf.setFillColor(30, 64, 175);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 35, pageWidth, 10, 'F');

  // Logo area (brain icon simulation)
  pdf.setFillColor(255, 255, 255);
  pdf.circle(margin + 8, 20, 8, 'F');
  pdf.setFillColor(30, 64, 175);
  pdf.circle(margin + 8, 20, 5, 'F');

  // Title
  addText('NeuroScan AI', margin + 20, 18, { fontSize: 18, fontStyle: 'bold', color: [255, 255, 255] });
  addText('Brain Tumor Analysis Report', margin + 20, 26, { fontSize: 10, color: [219, 234, 254] });

  // Report info
  addText(`Report ID: ${reportId}`, pageWidth - margin, 18, { fontSize: 8, color: [219, 234, 254], align: 'right' });
  addText(`Date: ${reportDate}`, pageWidth - margin, 24, { fontSize: 8, color: [219, 234, 254], align: 'right' });

  yPos = 55;

  // Main Result Banner
  const resultColor: [number, number, number] = result.tumorDetected ? [239, 68, 68] : [34, 197, 94];
  pdf.setFillColor(...resultColor);
  pdf.roundedRect(margin, yPos, contentWidth, 20, 3, 3, 'F');
  
  const resultText = result.tumorDetected ? 'ABNORMALITY DETECTED' : 'NO ABNORMALITIES FOUND';
  addText(resultText, margin + 5, yPos + 8, { fontSize: 14, fontStyle: 'bold', color: [255, 255, 255] });
  addText(`Classification: ${result.tumorType}`, margin + 5, yPos + 15, { fontSize: 10, color: [255, 255, 255] });
  
  // Confidence badge
  const confidencePercent = Math.round(result.confidence * 100);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(pageWidth - margin - 35, yPos + 5, 30, 10, 2, 2, 'F');
  addText(`${confidencePercent}%`, pageWidth - margin - 20, yPos + 11.5, { fontSize: 10, fontStyle: 'bold', color: resultColor, align: 'center' });

  yPos += 28;

  // Two-column layout for image and stats
  const colWidth = (contentWidth - 10) / 2;
  
  // Left column - MRI Image
  addText('Analyzed MRI Scan', margin, yPos, { fontSize: 10, fontStyle: 'bold' });
  yPos += 5;

  try {
    // Load and add image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      
      const imgHeight = 50;
      const imgWidth = (img.width / img.height) * imgHeight;
      const actualWidth = Math.min(imgWidth, colWidth - 5);
      const actualHeight = (actualWidth / imgWidth) * imgHeight;
      
      pdf.addImage(imgData, 'JPEG', margin, yPos, actualWidth, actualHeight);
      
      // Border around image
      pdf.setDrawColor(209, 213, 219);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, yPos, actualWidth, actualHeight);
      
      if (result.tumorDetected) {
        pdf.setDrawColor(239, 68, 68);
        pdf.setLineWidth(1);
        pdf.rect(margin + 1, yPos + 1, actualWidth - 2, actualHeight - 2);
      }
    }
  } catch (error) {
    console.error('Error adding image to PDF:', error);
    pdf.setFillColor(243, 244, 246);
    pdf.rect(margin, yPos, colWidth - 5, 50, 'F');
    addText('Image unavailable', margin + 20, yPos + 25, { fontSize: 9, color: [107, 114, 128] });
  }

  // Right column - Statistics
  const statsX = margin + colWidth + 10;
  let statsY = yPos - 5;

  addText('Analysis Statistics', statsX, statsY, { fontSize: 10, fontStyle: 'bold' });
  statsY += 8;

  // Confidence meter
  addText('Confidence Level', statsX, statsY, { fontSize: 9, color: [107, 114, 128] });
  statsY += 5;
  drawProgressBar(statsX, statsY, colWidth - 10, 5, confidencePercent, [59, 130, 246]);
  addText(`${confidencePercent}%`, statsX + colWidth - 10, statsY + 4, { fontSize: 8, fontStyle: 'bold', align: 'right' });
  statsY += 12;

  if (result.tumorDetected) {
    // Severity meter
    addText('Severity Score', statsX, statsY, { fontSize: 9, color: [107, 114, 128] });
    statsY += 5;
    drawProgressBar(statsX, statsY, colWidth - 10, 5, result.severity, getSeverityColor(result.severity));
    addText(`${result.severity}/100 (${getSeverityLabel(result.severity)})`, statsX + colWidth - 10, statsY + 4, { fontSize: 8, fontStyle: 'bold', align: 'right' });
    statsY += 12;
  }

  // Probability breakdown
  addText('Probability Distribution', statsX, statsY, { fontSize: 9, color: [107, 114, 128] });
  statsY += 6;

  const colors: [number, number, number][] = [
    [59, 130, 246],
    [16, 185, 129],
    [245, 158, 11],
    [139, 92, 246]
  ];

  result.allPredictions.slice(0, 4).forEach((pred, i) => {
    const percent = Math.round(pred.score * 100);
    const labelText = pred.label.length > 12 ? pred.label.substring(0, 12) + '...' : pred.label;
    addText(labelText, statsX, statsY, { fontSize: 8 });
    addText(`${percent}%`, statsX + colWidth - 15, statsY, { fontSize: 8, fontStyle: 'bold' });
    statsY += 4;
    drawProgressBar(statsX, statsY, colWidth - 15, 3, percent, colors[i % colors.length]);
    statsY += 6;
  });

  yPos += 60;

  // AI Analysis Description (if available)
  if (result.description) {
    yPos = addSection('AI Analysis', yPos);
    
    const splitDescription = pdf.splitTextToSize(result.description, contentWidth - 6);
    addText(splitDescription, margin + 3, yPos, { fontSize: 9, color: [55, 65, 81] });
    yPos += splitDescription.length * 4.5 + 5;
  }

  // Recommendations from AI (if available)
  if (result.recommendations && result.recommendations.length > 0) {
    yPos = addSection('Medical Recommendations', yPos);
    
    result.recommendations.forEach((rec) => {
      const bullet = '\u2022 ';
      const splitRec = pdf.splitTextToSize(rec, contentWidth - 12);
      addText(bullet + splitRec[0], margin + 3, yPos, { fontSize: 9 });
      if (splitRec.length > 1) {
        for (let i = 1; i < splitRec.length; i++) {
          yPos += 4;
          addText('  ' + splitRec[i], margin + 3, yPos, { fontSize: 9 });
        }
      }
      yPos += 5;
    });
    yPos += 3;
  }

  // Check if we need a new page
  if (yPos > pageHeight - 80) {
    pdf.addPage();
    yPos = margin;
  }

  // Dietary Recommendations
  yPos = addSection('Dietary Recommendations', yPos);

  const dietColWidth = (contentWidth - 10) / 2;

  // Recommended foods
  pdf.setFillColor(220, 252, 231);
  pdf.roundedRect(margin, yPos, dietColWidth, 5, 1, 1, 'F');
  addText('Recommended Foods', margin + 3, yPos + 3.5, { fontSize: 9, fontStyle: 'bold', color: [22, 163, 74] });
  yPos += 8;

  const startYFoods = yPos;
  recommendations.foods.forEach((food) => {
    addText('\u2022 ' + food, margin + 3, yPos, { fontSize: 8, color: [55, 65, 81] });
    yPos += 4;
  });

  // Foods to avoid
  yPos = startYFoods - 8;
  const avoidX = margin + dietColWidth + 10;
  pdf.setFillColor(254, 226, 226);
  pdf.roundedRect(avoidX, yPos, dietColWidth, 5, 1, 1, 'F');
  addText('Foods to Limit', avoidX + 3, yPos + 3.5, { fontSize: 9, fontStyle: 'bold', color: [220, 38, 38] });
  yPos += 8;

  recommendations.avoid.forEach((food) => {
    addText('\u2022 ' + food, avoidX + 3, yPos, { fontSize: 8, color: [55, 65, 81] });
    yPos += 4;
  });

  yPos = Math.max(startYFoods + recommendations.foods.length * 4, startYFoods + recommendations.avoid.length * 4) + 5;

  // Check if we need a new page for disclaimer
  if (yPos > pageHeight - 45) {
    pdf.addPage();
    yPos = margin;
  }

  // Medical Disclaimer
  yPos += 5;
  pdf.setFillColor(254, 249, 195);
  pdf.roundedRect(margin, yPos, contentWidth, 30, 2, 2, 'F');
  pdf.setDrawColor(234, 179, 8);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(margin, yPos, contentWidth, 30, 2, 2, 'S');

  addText('Medical Disclaimer', margin + 5, yPos + 6, { fontSize: 10, fontStyle: 'bold', color: [161, 98, 7] });
  
  const disclaimerText = 'This AI-powered analysis is intended for educational and research purposes only. It should not be used as a substitute for professional medical diagnosis, treatment, or advice. Always consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health or treatment.';
  const splitDisclaimer = pdf.splitTextToSize(disclaimerText, contentWidth - 10);
  addText(splitDisclaimer, margin + 5, yPos + 12, { fontSize: 8, color: [113, 63, 18] });

  // Footer
  const footerY = pageHeight - 10;
  pdf.setDrawColor(209, 213, 219);
  pdf.setLineWidth(0.3);
  pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  
  addText('Generated by NeuroScan AI - Powered by 💙 (Gemini Pro Vision)', pageWidth / 2, footerY, { fontSize: 7, color: [156, 163, 175], align: 'center' });
  addText(`Page 1 of ${pdf.getNumberOfPages()}`, pageWidth - margin, footerY, { fontSize: 7, color: [156, 163, 175], align: 'right' });

  // Save the PDF
  pdf.save(`neuroscan-report-${reportId}.pdf`);
};
