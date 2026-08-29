import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PageFormat } from '../types/theme';
import { getPageFormatConfig } from '../theme/dimensions';

export interface DirectPdfOptions {
  fileName?: string;
  pageFormat?: PageFormat;
  qualityScale?: number;
  onProgress?: (step: 'capturing' | 'rendering' | 'saving' | 'done') => void;
}

const PAGE_MM_DIMENSIONS: Record<PageFormat, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
};

/**
 * Generates and downloads a high-fidelity PDF directly in the browser
 * without opening the system print dialog.
 * 
 * Capabilities:
 * - 1-click automatic file download directly to the user's Downloads folder.
 * - Slices multi-page resumes cleanly into distinct PDF pages.
 * - Renders at 2x high-resolution scale (crisp typography & graphics).
 * - Full support for A4, US Letter, and US Legal dimensions.
 * - Works on mobile (iOS/Android) and desktop browsers.
 */
export async function generateDirectPdf(
  element: HTMLElement,
  options: DirectPdfOptions = {}
): Promise<void> {
  const {
    fileName = 'Resume.pdf',
    pageFormat = 'a4',
    qualityScale = 2,
    onProgress
  } = options;

  const targetFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  const formatConfig = getPageFormatConfig(pageFormat);
  const mmDimensions = PAGE_MM_DIMENSIONS[pageFormat] || PAGE_MM_DIMENSIONS.a4;

  if (onProgress) onProgress('capturing');

  // Temporarily reset zoom/scale transforms on the cloned element or during capture
  const originalTransform = element.style.transform;
  const originalTransformOrigin = element.style.transformOrigin;
  const originalMargin = element.style.margin;

  element.style.transform = 'none';
  element.style.transformOrigin = 'top center';
  element.style.margin = '0 auto';

  try {
    const canvas = await html2canvas(element, {
      scale: qualityScale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: formatConfig.widthPx,
      onclone: (clonedDoc) => {
        // Ensure cloned printable sheet has clean styling
        const clonedSheet = clonedDoc.querySelector('.paper-sheet') as HTMLElement;
        if (clonedSheet) {
          clonedSheet.style.transform = 'none';
          clonedSheet.style.margin = '0 auto';
          clonedSheet.style.boxShadow = 'none';
          clonedSheet.style.border = 'none';
        }
      }
    });

    if (onProgress) onProgress('rendering');

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [mmDimensions.width, mmDimensions.height],
      compress: true
    });

    const pdfPageWidth = mmDimensions.width;
    const pdfPageHeight = mmDimensions.height;

    // Calculate canvas image height in PDF mm units
    const imgWidth = pdfPageWidth;
    const imgHeight = (canvas.height * pdfPageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfPageHeight;

    // Add subsequent pages if document exceeds 1 page
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage([pdfPageWidth, pdfPageHeight], 'portrait');
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfPageHeight;
    }

    if (onProgress) onProgress('saving');

    // Trigger direct browser download
    pdf.save(targetFileName);

    if (onProgress) onProgress('done');
  } finally {
    // Restore original DOM styles safely
    element.style.transform = originalTransform;
    element.style.transformOrigin = originalTransformOrigin;
    element.style.margin = originalMargin;
  }
}
