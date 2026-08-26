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
import { getWorkspaceRoot, getOutputsDir } from './workspace';
import { buildPrompts } from './ai/prompt-builder';
import { extractCvAndGap } from './ai/extractor';

dotenv.config();

export interface TailorCvOptions {
  companyName?: string;
  theme?: ThemeId;
  modelName?: string;
  maxPages?: number;
  baseDir?: string;
}

function loadReferenceFiles(root: string) {
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

  const root = getWorkspaceRoot(baseDir);
  const { masterData, targetJob, rules } = loadReferenceFiles(root);

  const prompts = buildPrompts({
    masterData,
    targetJob,
    rules,
    companyName: companyName !== 'Objetivo' ? companyName : undefined,
    pageBudget: maxPages === 2 ? 2 : 1,
    providerSettings: {
      provider: 'gemini',
      model: modelName,
      apiKey
    }
  });

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTry = [modelName, 'gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3.6-flash'].filter((v, i, a) => a.indexOf(v) === i);

  let result;
  let usedModel = modelName;
  let activeModel: any = null;

  for (const m of modelsToTry) {
    try {
      console.log(`📡 Enviando solicitud al modelo ${m}...`);
      const model = genAI.getGenerativeModel({
        model: m,
        systemInstruction: prompts.systemInstruction,
        generationConfig: {
          temperature: 0.15
        }
      });
      result = await model.generateContent(prompts.userPrompt);
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
  const outputsDir = getOutputsDir(root);

  // Extract CV and Gap Analysis using unified extractor
  const extracted = extractCvAndGap(responseText, masterData, prompts.company);
  let cvContent = extracted.cvMarkdown;
  const gapContent = extracted.gapMarkdown;

  const inferredCompany = companyName !== 'Objetivo' ? companyName : extractTargetCompany(targetJob, 'Objetivo');
  const sanitizedCompany = sanitizeFileName(inferredCompany || 'Objetivo');

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

      const condensedExtracted = extractCvAndGap(condenseResponse.response.text(), masterData, prompts.company);
      const condensedMarkdown = condensedExtracted.cvMarkdown;

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
    theme,
    modelUsed: usedModel
  };
}
