import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { generatePdfFromMarkdown } from './pdf-generator';
import {
  sanitizeFileName,
  extractCandidateName,
  extractTargetCompany,
  parseCvMarkdownToData
} from './parser';
import { generateQualityAuditReport } from './audit';
import { ThemeId } from '../types/cv';

dotenv.config();

interface TailorCvOptions {
  companyName?: string;
  theme?: ThemeId;
  modelName?: string;
  maxPages?: number;
  baseDir?: string;
}

function resolveWorkspaceDir(baseDir?: string): string {
  if (baseDir && fs.existsSync(baseDir)) return baseDir;
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'master-data.md'))) return cwd;
  return path.resolve(import.meta.dirname, '..', '..');
}

function loadReferenceFiles(baseDir?: string) {
  const root = resolveWorkspaceDir(baseDir);

  const masterDataPath = path.join(root, 'master-data.md');
  const targetJobPath = path.join(root, 'target-job.md');
  const rulesPath = path.join(root, 'rules.md');

  if (!fs.existsSync(masterDataPath)) {
    throw new Error(`Archivo master-data.md no encontrado en: ${masterDataPath}`);
  }
  if (!fs.existsSync(targetJobPath)) {
    throw new Error(`Archivo target-job.md no encontrado en: ${targetJobPath}`);
  }
  if (!fs.existsSync(rulesPath)) {
    throw new Error(`Archivo rules.md no encontrado en: ${rulesPath}`);
  }

  return {
    masterData: fs.readFileSync(masterDataPath, 'utf8'),
    targetJob: fs.readFileSync(targetJobPath, 'utf8'),
    rules: fs.readFileSync(rulesPath, 'utf8')
  };
}

export async function tailorCvWithGemini({
  companyName = 'Objetivo',
  theme = 'modern-tech',
  modelName = 'gemini-3.6-flash',
  maxPages = 1,
  baseDir
}: TailorCvOptions = {}) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error(
      '⚠️  GEMINI_API_KEY no encontrada.\n' +
      '   Crea un archivo .env en la raíz del proyecto con:\n' +
      '   GEMINI_API_KEY=tu_api_key_aqui'
    );
  }

  const root = baseDir || process.cwd();
  const { masterData, targetJob, rules } = loadReferenceFiles(root);

  const systemInstruction = `
You are an Executive Tech Headhunter, Career Consultant, and Expert ATS Resume Synthesizer.
Your mission is to analyze the candidate's comprehensive master knowledge base (MASTER-DATA.MD), cross-reference it with the target job posting (TARGET-JOB.MD), and rigorously apply all guidelines defined in RULES.MD to generate a high-impact, 100% tailored CV and matching strategy report.

=== CORE GUIDELINES & CONSTRAINTS (RULES.MD) ===
${rules}

=== PAGE FIT TARGET ===
${maxPages === 1 
  ? "- PAGE BUDGET: 1 PAGE EXACT (420–480 words). Fill 80%–90% of an A4 page harmoniously. Never omit experience or education if space is available."
  : "- PAGE BUDGET: 2 PAGES (750–850 words). Fill 2 full pages with extensive project and leadership details."}

=== REQUIRED OUTPUT FORMAT ===
Deliver your response in exactly two clearly delimited Markdown code blocks:

PART 1: GAP ANALYSIS
\`\`\`markdown
# MATCHING & TAILORING STRATEGY REPORT (Gap Analysis)
- **Estimated Match Score:** X/100
- **Critical Integrated Keywords:** [...]
- **Strategic Alignment Narrative:** [...]
- **Identified Gaps & Mitigation:** [...]
\`\`\`

PART 2: TAILORED CV
\`\`\`markdown
# [FULL NAME]
**[Target Role Title | Primary Specialization]**
[City, Country] • [Email] • [Phone]
[LinkedIn](...) • [GitHub](...) • [Portfolio](...)

---

## PROFESSIONAL SUMMARY
[3-4 lines zero-fluff summary ending with mandatory closing impact metrics]

## TECHNICAL SKILLS
- **Languages & Core Fundamentals:** ...
- **Frameworks, Architecture & Ecosystem:** ...
- **Tooling, Testing, CI/CD & AI Integrations:** ...

## PROFESSIONAL EXPERIENCE

**[Company Name]** | [Location]
*[Job Title]* | [Mon YYYY – Mon YYYY]
- **[Lead Verb & Core Action]** ...
- **[Action & Metric]** ...
- **[Action & Metric]** ...

## EDUCATION & CERTIFICATIONS
- **[Degree / Program]** – [Institution], [Year]
- **Certifications:** [Name] ([Issuer], [Year]) | ...

## LANGUAGES
- **[Language 1]:** [Level]
- **[Language 2]:** [Level]
- **[Language 3]:** [Level]
\`\`\`
`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTry = [modelName, 'gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3.6-flash'].filter((v, i, a) => a.indexOf(v) === i);

  const userPrompt = `
Please generate the tailored CV for target company "${companyName}" by analyzing the following reference files:

=== 1. MASTER-DATA.MD (Candidate Single Source of Truth) ===
${masterData}

=== 2. TARGET-JOB.MD (Target Job Description & Requirements) ===
${targetJob}
`;

  let result;
  let usedModel = modelName;
  let activeModel: any = null;

  for (const m of modelsToTry) {
    try {
      console.log(`📡 Enviando solicitud al modelo ${m}...`);
      const model = genAI.getGenerativeModel({ 
        model: m,
        systemInstruction,
        generationConfig: {
          temperature: 0.15
        }
      });
      result = await model.generateContent(userPrompt);
      usedModel = m;
      activeModel = model;
      break;
    } catch (err: any) {
      console.warn(`⏳ Modelo ${m} no disponible (${err.message}). Intentando siguiente modelo...`);
    }
  }

  if (!result) {
    throw new Error('No se pudo obtener respuesta de ningún modelo de Gemini tras varios intentos.');
  }

  const responseText = result.response.text();

  const outputsDir = path.join(root, 'outputs');
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }

  // Determine candidate and company names for filenames
  const inferredCompany = companyName !== 'Objetivo' ? companyName : extractTargetCompany(targetJob, 'Objetivo');
  const sanitizedCompany = sanitizeFileName(inferredCompany || 'Objetivo');

  let cvContent = responseText;
  let gapContent = '';

  // Extract Gap Analysis
  const gapRegex = /(?:#\s*(?:PARTE\s*1\s*:?\s*)?(?:REPORTE DE MATCHING|GAP ANALYSIS)[\s\S]*?)(?=(?:#\s*(?:PARTE\s*2\s*:?\s*)?CV\s+OPTIMIZADO|#\s+[A-ZÁÉÍÓÚÑ]{3,}\s+[A-ZÁÉÍÓÚÑ]{3,}|\n---\s*\n#))/i;
  const gapMatch = responseText.match(gapRegex);

  if (gapMatch) {
    gapContent = gapMatch[0]
      .replace(/```markdown/gi, '')
      .replace(/```/g, '')
      .trim();
  }

  // Extract CV Content cleanly (find where candidate header starts)
  const candidateHeaderRegex = /(?:#\s+(?:PARTE\s*2\s*:?\s*)?CV\s+OPTIMIZADO\s*)?(#\s+[A-ZÁÉÍÓÚÑ\s]{4,}[\r\n]+[\s\S]*)$/i;
  const cvMatch = responseText.match(candidateHeaderRegex);

  if (cvMatch && cvMatch[1]) {
    cvContent = cvMatch[1];
  } else if (gapMatch) {
    cvContent = responseText.replace(gapMatch[0], '');
  }

  // Clean remaining markdown fences and Part 2 artifacts
  cvContent = cvContent
    .replace(/^#\s*(?:PARTE\s*2\s*:?\s*)?CV\s+OPTIMIZADO\s*/i, '')
    .replace(/```markdown\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  let candidateName = extractCandidateName(masterData);
  if (!candidateName) {
    const parsed = parseCvMarkdownToData(cvContent);
    candidateName = sanitizeFileName(parsed.name || 'Candidato');
  }

  const baseFileName = candidateName ? `CV_${candidateName}_${sanitizedCompany}` : `CV_${sanitizedCompany}`;
  const cvMdPath = path.join(outputsDir, `${baseFileName}.md`);
  const pdfPath = path.join(outputsDir, `${baseFileName}.pdf`);
  const gapMdPath = path.join(outputsDir, `Gap_Analysis_${candidateName ? `${candidateName}_` : ''}${sanitizedCompany}.md`);

  if (gapContent) {
    fs.writeFileSync(gapMdPath, gapContent, 'utf8');
    console.log(`📊 Reporte de Gap Analysis guardado en: ${gapMdPath}`);
  }

  cvContent = cvContent.replace(/^```markdown\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
  fs.writeFileSync(cvMdPath, cvContent, 'utf8');
  console.log(`📝 CV Markdown generado y guardado en: ${cvMdPath}`);

  console.log(`🖨️ Compilando a PDF con tema "${theme}" (Límite: ${maxPages} página(s))...`);
  let pdfResult = await generatePdfFromMarkdown({
    markdownFilePath: cvMdPath,
    outputPath: pdfPath,
    theme,
    maxPages,
    baseDir: root
  });

  // Self-Healing AI Condensation Loop: If content overshoots maxPages, condense automatically
  if (pdfResult.pages > maxPages) {
    console.log(`\n⚠️ El CV generado ocupó ${pdfResult.pages} páginas (supera el límite de ${maxPages} pág).`);
    console.log(`🔄 Iniciando pase automático de auto-condensación y síntesis con Gemini...`);

    const condensationInstruction = `
You are a Senior Executive Resume Editor specializing in precision content synthesis.
The generated CV exceeded the target limit of ${maxPages} page(s) and must be rigorously condensed to fit into EXACTLY ${maxPages} page(s) while preserving technical impact, leadership verbs, and quantitative metrics.

CONDENSATION RULES:
1. Reduce experience bullets to EXACTLY 2–3 bullets per company, prioritizing top quantitative impact (Google XYZ formula).
2. Keep each bullet concise (20–25 words max).
3. Summary: Maximum 3 dense, impactful lines ending with core metrics.
4. Skills: Keep exactly 3 dense categories.
5. Education & Certifications: Keep highest degrees and 2-3 most critical certifications.
6. Preserve 100% factual accuracy and original language.
7. STRICT FORMAT: Return ONLY the raw Markdown code starting directly with "# [FULL NAME]", without any conversational preambles.
`;

    try {
      const condenseResponse = await (activeModel || genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })).generateContent([
        { text: condensationInstruction },
        { text: `CURRENT CV TO CONDENSE:\n\n${cvContent}` }
      ]);

      let condensedMarkdown = condenseResponse.response.text();
      const candidateHeaderRegex = /(#\s+[A-ZÁÉÍÓÚÑ\s]{4,}[\r\n]+[\s\S]*)$/i;
      const match = condensedMarkdown.match(candidateHeaderRegex);
      if (match && match[1]) {
        condensedMarkdown = match[1];
      }

      condensedMarkdown = condensedMarkdown
        .replace(/```markdown\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

      if (condensedMarkdown.length > 100) {
        cvContent = condensedMarkdown;
        fs.writeFileSync(cvMdPath, cvContent, 'utf8');
        console.log(`📝 CV condensado con éxito y guardado en: ${cvMdPath}`);

        console.log(`🖨️ Recompilando PDF ajustado...`);
        pdfResult = await generatePdfFromMarkdown({
          markdownFilePath: cvMdPath,
          outputPath: pdfPath,
          theme,
          maxPages,
          baseDir: root
        });
      }
    } catch (condenseErr: any) {
      console.warn(`⚠️ No se pudo completar la auto-condensación secundaria: ${condenseErr.message}`);
    }
  }

  console.log(`🎉 ¡PDF creado exitosamente en: ${pdfPath}! (Páginas: ${pdfResult.pages})`);

  let qualityReportPath: string | null = null;
  try {
    const auditRes = await generateQualityAuditReport({
      cvMarkdownPath: cvMdPath,
      theme,
      baseDir: root
    });
    qualityReportPath = auditRes.reportMdPath;
  } catch (auditErr: any) {
    console.warn(`⚠️ No se pudo generar el reporte de calidad: ${auditErr.message}`);
  }

  return {
    cvMdPath,
    gapMdPath: gapContent ? gapMdPath : null,
    qualityReportPath,
    pdfPath,
    theme
  };
}
