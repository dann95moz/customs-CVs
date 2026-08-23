import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { generatePdfFromMarkdown } from './pdf-generator';
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
Tu objetivo es analizar la base de datos profesional (master-data.md), la oferta de trabajo (target-job.md) y las reglas de diseño y contenido (rules.md) para generar un CV 100% adaptado a la vacante.

REGLAS CRÍTICAS INQUEBRANTABLES:
1. master-data.md es la FUENTE ÚNICA DE VERDAD (SSOT).
2. NUNCA inventes información, años de experiencia, certificaciones, tecnologías o métricas que no existan en master-data.md.
3. Respeta estrictamente rules.md (Fórmula Google XYZ, límites de páginas, sin datos sensibles ni fotos).
4. El idioma debe alinearse al idioma de la oferta de trabajo o master-data.md.

FORMATO DE RESPUESTA:
Entrega dos partes claramente delimitadas:

PARTE 1: GAP ANALYSIS
\`\`\`markdown
# REPORTE DE MATCHING Y ESTRATEGIA (Gap Analysis)
[Puntaje de Match estimado: X/100]
[Palabras Clave Críticas Integradas]
[Estrategia de Mitigación de Gaps]
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

  const sanitizedCompany = companyName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cvMdPath = path.join(outputsDir, `CV_${sanitizedCompany}.md`);
  const pdfPath = path.join(outputsDir, `CV_${sanitizedCompany}.pdf`);
  const gapMdPath = path.join(outputsDir, `Gap_Analysis_${sanitizedCompany}.md`);

  let cvContent = responseText;
  let gapContent = '';

  const gapMatch = responseText.match(/#\s*(?:REPORTE DE MATCHING|GAP ANALYSIS)[\s\S]*?(?=(?:#\s+[A-ZÁÉÍÓÚÑ\s]{4,}|\n---\s*\n#))/i);
  if (gapMatch) {
    gapContent = gapMatch[0].trim();
    cvContent = responseText.replace(gapMatch[0], '').trim();
    cvContent = cvContent.replace(/^```markdown\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
    
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
