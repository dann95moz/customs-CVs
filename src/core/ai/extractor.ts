import { extractCandidateName } from '../parser';
import { restoreOriginalHeader } from './privacy-guard';

export interface ExtractedCvAndGap {
  cvMarkdown: string;
  gapMarkdown: string;
  score: number;
  keywords: string[];
}

/**
 * Pure function: Extracts and separates Part 1 (Gap Analysis) and Part 2 (Tailored CV) from LLM output.
 */
export function extractCvAndGap(
  rawText: string,
  masterData: string = '',
  company: string = '',
  targetRole: string = ''
): ExtractedCvAndGap {
  let gapContent = '';
  let cvContent = rawText;

  // Extract Gap Analysis
  const gapRegex = /(?:#\s*(?:PART\s*1\s*:?\s*)?(?:MATCHING & TAILORING|GAP ANALYSIS|MATCHING STRATEGY|REPORTE DE MATCHING)[\s\S]*?)(?=(?:#\s*(?:PART\s*2\s*:?\s*)?(?:TAILORED CV|CV OPTIMIZADO)|#\s+[A-ZÁÉÍÓÚÑ]{3,}\s+[A-ZÁÉÍÓÚÑ]{3,}|\n---\s*\n#))/i;
  const gapMatch = rawText.match(gapRegex);

  if (gapMatch) {
    gapContent = gapMatch[0]
      .replace(/```markdown/gi, '')
      .replace(/```/g, '')
      .trim();
  }

  // Extract CV Content cleanly (find where candidate header starts)
  const candidateHeaderRegex = /(?:#\s+(?:PART\s*2\s*:?\s*)?(?:TAILORED CV|CV OPTIMIZADO)\s*)?(#\s+[A-ZÁÉÍÓÚÑ\s\[\]]{4,}[\r\n]+[\s\S]*)$/i;
  const cvMatch = rawText.match(candidateHeaderRegex);

  if (cvMatch && cvMatch[1]) {
    cvContent = cvMatch[1];
  } else if (gapMatch) {
    cvContent = rawText.replace(gapMatch[0], '');
  }

  // Clean markdown backticks and labels
  cvContent = cvContent
    .replace(/^#\s*(?:PART\s*2\s*:?\s*)?(?:TAILORED CV|CV OPTIMIZADO)\s*/i, '')
    .replace(/```markdown\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Restore candidate real header deterministically (name, target role, contacts)
  cvContent = restoreOriginalHeader(cvContent, masterData, targetRole);

  // Extract Match Score
  let score = 90;
  const scoreMatch = (gapContent || rawText).match(/Estimated Match Score:\*{0,2}\s*(\d{1,3})/i);
  if (scoreMatch) {
    score = Math.min(100, Math.max(50, parseInt(scoreMatch[1], 10)));
  }

  // Extract Keywords
  let keywords: string[] = [];
  const kwMatch = (gapContent || rawText).match(/Critical Integrated Keywords:\*{0,2}\s*\[?([^\]\r\n]+)\]?/i);
  if (kwMatch) {
    keywords = kwMatch[1].split(/[,|•]/).map(k => k.trim()).filter(Boolean);
  }

  if (keywords.length === 0) {
    keywords = ['TypeScript', 'React', 'Component Architecture', 'CI/CD', 'State Management', 'Performance Optimization'];
  }

  return {
    cvMarkdown: cvContent,
    gapMarkdown: gapContent,
    score,
    keywords
  };
}
