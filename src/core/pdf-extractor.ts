import * as pdfjsLib from 'pdfjs-dist';
import { extractCandidateName } from './parser';

// Configure pdfjs worker in browser environment
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  // Using unpkg CDN fallback matching installed pdfjs-dist version
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '6.3.289'}/build/pdf.worker.min.mjs`;
}

export interface PdfImportResult {
  markdown: string;
  candidateName: string;
  usedAI: boolean;
  rawText: string;
}

/**
 * Extracts raw textual content from all pages of an uploaded PDF file directly in the browser.
 */
export async function extractRawTextFromPdf(fileOrBuffer: File | ArrayBuffer): Promise<string> {
  let arrayBuffer: ArrayBuffer;

  if (fileOrBuffer instanceof File) {
    arrayBuffer = await fileOrBuffer.arrayBuffer();
  } else {
    arrayBuffer = fileOrBuffer;
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer)
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Group text items by vertical position (y coordinate)
    const items = textContent.items as Array<{ str?: string; transform?: number[] }>;
    const lineMap = new Map<number, Array<{ x: number; text: string }>>();

    for (const item of items) {
      if (!item.str || item.str.trim().length === 0) continue;
      const transform = item.transform || [1, 0, 0, 1, 0, 0];
      const x = Math.round(transform[4] || 0);
      // Round y coordinate to ~4px tolerance to group characters into identical lines
      const y = Math.round((transform[5] || 0) / 4) * 4;

      if (!lineMap.has(y)) {
        lineMap.set(y, []);
      }
      lineMap.get(y)!.push({ x, text: item.str });
    }

    // Sort lines by y descending (top of page to bottom), then words by x ascending (left to right)
    const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);
    const pageLines: string[] = [];

    for (const y of sortedY) {
      const lineItems = lineMap.get(y)!.sort((a, b) => a.x - b.x);
      const lineStr = lineItems.map((item) => item.text).join(' ').trim();
      if (lineStr) {
        pageLines.push(lineStr);
      }
    }

    pageTexts.push(pageLines.join('\n'));
  }

  const fullText = pageTexts.join('\n\n');
  if (!fullText || fullText.trim().length === 0) {
    throw new Error('No readable text found in PDF. The document may be a scanned image without OCR.');
  }

  return fullText;
}


/**
 * 100% Client-Side Local PDF import orchestrator.
 * Parses PDF documents locally in milliseconds with zero external API calls or token costs.
 */
export async function importResumePdf(file: File): Promise<PdfImportResult> {
  const rawText = await extractRawTextFromPdf(file);
  const candidateName = extractCandidateName(rawText, file.name.replace(/\.pdf$/i, ''));

  return {
    markdown: rawText,
    candidateName,
    usedAI: false,
    rawText
  };
}
