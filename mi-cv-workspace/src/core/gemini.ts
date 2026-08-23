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
import { ThemeId } from '../types/cv';

dotenv.config();

interface TailorCvOptions {
  companyName?: string;
  theme?: ThemeId;
  modelName?: string;
  baseDir?: string;
}

function resolveWorkspaceDir(baseDir?: string): string {
  if (baseDir && fs.existsSync(baseDir)) return baseDir;
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'master-data.md'))) return cwd;
  if (fs.existsSync(path.join(cwd, 'mi-cv-workspace', 'master-data.md'))) return path.join(cwd, 'mi-cv-workspace');
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
  modelName = 'gemini-2.5-flash',
  baseDir
}: TailorCvOptions = {}) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error(
      '⚠️  GEMINI_API_KEY no encontrada.\n' +
      '   Crea un archivo .env en la carpeta mi-cv-workspace con:\n' +
      '   GEMINI_API_KEY=tu_api_key_aqui'
    );
  }

  const root = baseDir || process.cwd();
  const { masterData, targetJob, rules } = loadReferenceFiles(root);

  console.log('🤖 Conectando con Gemini API...');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const systemInstruction = `
Eres un Headhunter Ejecutivo y Consultor Experto en Reclutamiento Tech & Optimización ATS.
Tu objetivo es analizar la base de datos profesional (master-data.md), que actúa como un Baúl de Conocimiento Profesional Amplio (Braindump), cruzarla con la oferta de trabajo objetivo (target-job.md) y aplicar las reglas de contenido (rules.md) para generar un CV de alto impacto 100% sintetizado y adaptado.

TAREAS CLAVE DE SÍNTESIS:
1. SÍNTESIS DEL RESUMEN PROFESIONAL: Redacta dinámicamente un Resumen Ejecutivo de 3-4 líneas conectando la trayectoria, especialidad y fortalezas de master-data.md con las necesidades clave de target-job.md (no busques textos pre-redactados; sintetízalo a medida).
2. HABILIDADES TÉCNICAS: Selecciona del Master Stack de master-data.md las tecnologías relevantes para la vacante y organízalas en categorías claras, priorizando las requeridas en la oferta.
3. LOGROS CON FÓRMULA GOOGLE XYZ: Transforma las notas, tareas y responsabilidades de master-data.md en viñetas de alto impacto con verbos de acción en pasado ("Logré [X] medido por [Y] haciendo [Z]").
4. VERACIDAD TOTAL (SSOT): master-data.md es la única fuente de verdad. NUNCA inventes tecnologías, empresas, años de experiencia ni certificaciones no mencionadas.
5. REGLAS ATS: Sin foto, sin edad ni datos sensibles; respeta límites de páginas y consistencia de idioma.

FORMATO DE RESPUESTA:
Entrega dos partes claramente delimitadas:

PARTE 1: GAP ANALYSIS
\`\`\`markdown
# REPORTE DE MATCHING Y ESTRATEGIA (Gap Analysis)
- **Puntaje de Match Estimado:** X/100
- **Palabras Clave Críticas Integradas:** [...]
- **Estrategia de Alineación:** [...]
- **Gaps Detectados y Mitigación:** [...]
\`\`\`

PARTE 2: CV OPTIMIZADO
\`\`\`markdown
# [NOMBRE Y APELLIDO]
**[Título del Rol Objetivo | Especialidad]**
[Ubicación] • [Email] • [Teléfono]
[LinkedIn](...) • [GitHub](...) • [Portfolio](...)

---

## RESUMEN PROFESIONAL
...

## HABILIDADES TÉCNICAS
...

## EXPERIENCIA LABORAL
...

## EDUCACIÓN Y CERTIFICACIONES
...

## IDIOMAS
...
\`\`\`
`;

  const userPrompt = `
Por favor procesa los siguientes 3 archivos para generar el CV adaptado a la empresa "${companyName}":

=== 1. RULES.MD ===
${rules}

=== 2. MASTER-DATA.MD (SSOT - Consulta) ===
${masterData}

=== 3. TARGET-JOB.MD (Oferta Objetivo) ===
${targetJob}
`;

  console.log(`📡 Enviando solicitud al modelo ${modelName}...`);
  const result = await model.generateContent([
    { text: systemInstruction },
    { text: userPrompt }
  ]);

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

  const gapMatch = responseText.match(/#\s*(?:REPORTE DE MATCHING|GAP ANALYSIS)[\s\S]*?(?=(?:#\s+[A-ZÁÉÍÓÚÑ\s]{4,}|\n---\s*\n#))/i);
  if (gapMatch) {
    gapContent = gapMatch[0].trim();
    cvContent = responseText.replace(gapMatch[0], '').trim();
    cvContent = cvContent.replace(/^```markdown\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
  }

  cvContent = cvContent.replace(/^```markdown\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();

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

  console.log(`🖨️ Compilando a PDF con tema "${theme}"...`);
  await generatePdfFromMarkdown({
    markdownFilePath: cvMdPath,
    outputPath: pdfPath,
    theme,
    baseDir: root
  });

  console.log(`🎉 ¡PDF creado exitosamente en: ${pdfPath}!`);
  return {
    cvMdPath,
    gapMdPath: gapContent ? gapMdPath : null,
    pdfPath,
    theme
  };
}
