import * as pdfjsLib from 'pdfjs-dist';
import { extractCandidateName, cleanMarkdownFormatting } from './parser';

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

interface ExtractedExpBlock {
  company: string;
  role: string;
  location?: string;
  date?: string;
  bullets: string[];
}

/**
 * Heuristically parses raw lines extracted from a PDF into structured experience blocks:
 * ### **Company** | Location
 * *Role* | Date
 * - Bullet 1
 * - Bullet 2
 */
export function reconstructExperienceFromPdfLines(lines: string[]): string {
  if (!lines || lines.length === 0) {
    return `### **Company Name** | City, Country\n*Senior Specialist* | **2022 – Present**\n- Led cross-functional initiatives improving operational efficiency and technical delivery.`;
  }

  const blocks: ExtractedExpBlock[] = [];
  let currentBlock: ExtractedExpBlock | null = null;

  const datePattern = /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\.?\s+)?\b(?:\d{4})\b\s*(?:[–—-]|to|a|hasta)\s*(?:(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\.?\s+)?\b(?:\d{4})\b|present|presente|current|actual)/i;
  const singleYearPattern = /\b(19\d\d|20\d\d)\b/;
  const titleKeywords = /\b(engineer|developer|architect|designer|lead|director|manager|head|consultant|analyst|specialist|officer|vp|vice president|founder|co-founder|cto|ceo|cpo|intern|fellow|administrator|coordinator|ingeniero|desarrollador|diseñador|gerente|director|consultor|analista|especialista|lider|líder)\b/i;

  function flushBlock() {
    if (currentBlock && (currentBlock.company || currentBlock.role || currentBlock.bullets.length > 0)) {
      if (!currentBlock.company && currentBlock.role) {
        currentBlock.company = currentBlock.role;
        currentBlock.role = 'Specialist';
      }
      blocks.push(currentBlock);
      currentBlock = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    const isExplicitBullet = /^[*•\-–—·]\s+/.test(rawLine);
    const cleanLine = cleanMarkdownFormatting(rawLine);

    const hasDate = datePattern.test(cleanLine) || singleYearPattern.test(cleanLine);
    const hasPipe = cleanLine.includes('|');
    const hasTitle = titleKeywords.test(cleanLine);

    if (!isExplicitBullet && (hasPipe || (hasDate && hasTitle) || (cleanLine.length < 70 && hasTitle))) {
      if (hasPipe) {
        flushBlock();
        const parts = cleanLine.split('|').map((p) => p.trim());
        let comp = parts[0];
        let role = parts[1] || 'Specialist';
        let datePart = parts[2] || '';

        if (datePattern.test(role) && !parts[2]) {
          datePart = role;
          role = 'Specialist';
        }

        currentBlock = {
          company: comp,
          role: role,
          date: datePart || undefined,
          bullets: []
        };
      } else if (hasDate) {
        flushBlock();
        const dateMatch = cleanLine.match(datePattern);
        const extractedDate = dateMatch ? dateMatch[0] : '';
        const titleWithoutDate = cleanLine.replace(datePattern, '').replace(/[|•–—]/g, ' ').trim();

        currentBlock = {
          company: titleWithoutDate || 'Organization',
          role: titleWithoutDate.length < 35 ? titleWithoutDate : 'Specialist',
          date: extractedDate || undefined,
          bullets: []
        };
      } else {
        if (!currentBlock || currentBlock.bullets.length > 0) {
          flushBlock();
          currentBlock = {
            company: cleanLine,
            role: 'Specialist',
            bullets: []
          };
        } else if (!currentBlock.role || currentBlock.role === 'Specialist') {
          currentBlock.role = cleanLine;
        }
      }
    } else {
      if (!currentBlock) {
        currentBlock = {
          company: 'Career Experience',
          role: 'Professional Specialist',
          bullets: []
        };
      }

      if (!isExplicitBullet && currentBlock.bullets.length > 0 && cleanLine.length > 0 && /^[a-z0-9]/.test(cleanLine)) {
        const lastIdx = currentBlock.bullets.length - 1;
        currentBlock.bullets[lastIdx] = `${currentBlock.bullets[lastIdx]} ${cleanLine}`;
      } else if (cleanLine.length > 0) {
        currentBlock.bullets.push(cleanLine);
      }
    }
  }

  flushBlock();

  if (blocks.length === 0) {
    return lines.map((l) => (l.startsWith('-') ? l : `- ${l}`)).join('\n');
  }

  return blocks
    .map((b) => {
      const compHeader = b.location ? `### **${b.company}** | ${b.location}` : `### **${b.company}**`;
      const roleLine = b.date ? `*${b.role}* | **${b.date}**` : `*${b.role}*`;
      const bullets = b.bullets.map((bullet) => `- ${bullet}`).join('\n');
      return `${compHeader}\n${roleLine}\n${bullets}`;
    })
    .join('\n\n---\n\n');
}

/**
 * Parses raw text extracted from a PDF into standard Master Profile Markdown using local heuristics.
 */
export function parsePdfToMasterMarkdownLocal(rawText: string, fallbackName = 'Candidate'): string {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Extract contact items via RegEx
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedin = linkedinMatch ? (linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`) : '';

  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const github = githubMatch ? (githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`) : '';

  // 2. Identify candidate name from top lines (skipping contact info or headers)
  let candidateName = fallbackName;
  let headline = 'Professional Specialist';

  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    const clean = cleanMarkdownFormatting(line);
    if (
      !clean.includes('@') &&
      !clean.includes('http') &&
      !clean.includes('linkedin') &&
      !clean.match(/^\+?\d/) &&
      clean.length >= 3 &&
      clean.length <= 40
    ) {
      candidateName = clean;
      if (lines[i + 1] && lines[i + 1].length < 60 && !lines[i + 1].includes('@')) {
        headline = cleanMarkdownFormatting(lines[i + 1]);
      }
      break;
    }
  }

  // 3. Section partitioner
  const experienceKeywords = /^(?:work\s+experience|experience|employment\s+history|career\s+history|professional\s+experience)/i;
  const educationKeywords = /^(?:education|academic\s+background|academic\s+history|qualifications)/i;
  const skillsKeywords = /^(?:skills|technical\s+skills|core\s+competencies|technologies|tools)/i;
  const summaryKeywords = /^(?:summary|profile|professional\s+summary|about\s+me|overview)/i;
  const certKeywords = /^(?:certifications|certificates|courses|licenses)/i;
  const languagesKeywords = /^(?:languages|idiomas|langues)/i;

  const sections: {
    summary: string[];
    experience: string[];
    education: string[];
    skills: string[];
    certifications: string[];
    languages: string[];
    other: string[];
  } = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    other: []
  };

  let currentSection: keyof typeof sections = 'other';

  for (const line of lines) {
    const clean = cleanMarkdownFormatting(line);
    if (summaryKeywords.test(clean)) {
      currentSection = 'summary';
      continue;
    } else if (experienceKeywords.test(clean)) {
      currentSection = 'experience';
      continue;
    } else if (educationKeywords.test(clean)) {
      currentSection = 'education';
      continue;
    } else if (skillsKeywords.test(clean)) {
      currentSection = 'skills';
      continue;
    } else if (certKeywords.test(clean)) {
      currentSection = 'certifications';
      continue;
    } else if (languagesKeywords.test(clean)) {
      currentSection = 'languages';
      continue;
    }

    if (currentSection) {
      sections[currentSection].push(clean);
    }
  }

  // 4. Format into clean Markdown
  const summaryText = sections.summary.length > 0
    ? sections.summary.join(' ')
    : `${headline} with a proven track record in delivering high-impact projects, solving complex engineering challenges, and collaborating effectively across multidisciplinary squads.`;

  const experienceText = reconstructExperienceFromPdfLines(sections.experience);

  const educationText = sections.education.length > 0
    ? sections.education.map((l) => (l.startsWith('-') ? l : `- ${l}`)).join('\n')
    : `- **Bachelor's Degree** – University / College, 2018 – 2022`;

  const skillsText = sections.skills.length > 0
    ? sections.skills.join(', ')
    : `JavaScript, TypeScript, React, HTML5, CSS3, Git, Problem Solving, Agile`;

  const certText = sections.certifications.length > 0
    ? sections.certifications.map((l) => (l.startsWith('-') ? l : `- ${l}`)).join('\n')
    : `- Professional Certificate / Training`;

  const langText = sections.languages.length > 0
    ? sections.languages.map((l) => (l.startsWith('-') ? l : `- **${l}**`)).join('\n')
    : `- **English:** Professional Working Proficiency\n- **Spanish:** Native`;

  // Build clean contact row
  const contactParts: string[] = [];
  contactParts.push('City, Country');
  if (email) contactParts.push(email);
  if (phone) contactParts.push(phone);
  if (linkedin) contactParts.push(linkedin);
  if (github) contactParts.push(github);

  return `# ${candidateName}
**${headline}**
${contactParts.join(' • ')}

## 👤 1. Personal & Contact Information
- **Full Name:** ${candidateName}
- **Primary Professional Title:** ${headline}
- **Location:** City, Country
- **Email:** ${email || 'candidate.email@example.com'}
- **Phone / WhatsApp:** ${phone || '+1 234 567 8900'}
- **LinkedIn:** ${linkedin || 'https://linkedin.com/in/username'}
- **GitHub / Portfolio:** ${github || 'https://github.com/username'}

---

## 🎯 2. Career Overview & Professional Pitch

${summaryText}

---

## 🛠️ 3. Master Stack & Competency Matrix

- **Core Skills & Technologies:** ${skillsText}

---

## 💼 4. Career History & Key Achievements

${experienceText}

---

## 🎓 5. Education & Academic Background

${educationText}

---

## 📜 6. Professional Certifications & Credentials

${certText}

---

## 🌍 7. Languages

${langText}
`;
}

/**
 * 100% Client-Side Local PDF import orchestrator.
 * Parses PDF documents locally in milliseconds with zero external API calls or token costs.
 */
export async function importResumePdf(file: File): Promise<PdfImportResult> {
  const rawText = await extractRawTextFromPdf(file);
  const markdown = parsePdfToMasterMarkdownLocal(rawText, file.name.replace(/\.pdf$/i, ''));
  const candidateName = extractCandidateName(markdown, file.name.replace(/\.pdf$/i, ''));

  return {
    markdown,
    candidateName,
    usedAI: false,
    rawText
  };
}
