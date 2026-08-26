#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { generatePdfFromMarkdown, generateAllPdfs } from '../core/pdf-generator';
import { tailorCvWithGemini } from '../core/gemini';
import { generateQualityAuditReport } from '../core/audit';
import { ThemeId } from '../types/cv';
import { getWorkspaceRoot, getOutputsDir, findLatestCvMarkdown, resolveCvPath } from '../core/workspace';

const rootDir = getWorkspaceRoot();
const outputsDir = getOutputsDir(rootDir);

function parseArgs(args: string[]) {
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      const next = args[i + 1];
      if (next && !next.startsWith('-')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }

  return { flags, positional };
}

function printHelp() {
  console.log(`
✨ CV Studio & Tailor Engine (TypeScript + React + Puppeteer)
=============================================================

Uso CLI:
  npm run pdf                         Genera PDF del archivo más reciente en outputs/
  npm run pdf <archivo.md>            Genera PDF del archivo indicado
  npm run pdf:all                     Genera PDFs de todos los archivos en outputs/
  npm run audit [archivo.md]          Genera Reporte de Calidad y Auditoría (Tabla 1-10 y mejoras)
  npm run dev                         Inicia el CV Studio Web en tiempo real (Vite + React)
  npm run generate [Empresa]          Genera CV con Gemini API a partir de target-job.md

Temas visuales disponibles:
  --theme modern-tech                 (Defecto: estilo Stripe/Linear con badges)
  --theme executive                   (Corporativo Navy con tipografía Serif)
  --theme minimal-ats                 (Monocromático estricto para ATS)
  --theme two-column                  (2 columnas con barra lateral)

Opciones:
  --output <ruta>                     Ruta destino del PDF generado
  --help, -h                          Muestra este mensaje de ayuda

Ejemplos:
  npm run pdf outputs/Ejemplo_CV_Tailored_Stripe.md -- --theme executive
  npm run audit outputs/CV_Daniel_Corredor_Acosta_Addi.md
  npm run generate "Google" -- --theme modern-tech
`);
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const { flags, positional } = parseArgs(rawArgs);

  const command = positional[0] || 'pdf';
  const theme = (flags.theme as ThemeId) || 'modern-tech';

  if (flags.help || flags.h || command === 'help') {
    printHelp();
    return;
  }

  try {
    switch (command) {
      case 'pdf': {
        const targetFile = positional[1]
          ? resolveCvPath(positional[1], rootDir)
          : findLatestCvMarkdown(rootDir);

        if (!targetFile) {
          console.error('❌ No se encontró ningún archivo .md en outputs/ o templates/.');
          process.exit(1);
        }

        console.log(`\n🚀 Compilando CV a PDF con TypeScript + React SSR...`);
        console.log(`📄 Origen: ${targetFile}`);
        console.log(`🎨 Tema:   ${theme}`);

        const maxPages = flags['max-pages'] ? Number(flags['max-pages']) : undefined;

        const result = await generatePdfFromMarkdown({
          markdownFilePath: targetFile,
          outputPath: flags.output as string | undefined,
          theme,
          maxPages,
          baseDir: rootDir
        });

        console.log(`\n✅ ¡PDF generado con éxito!\n📂 Archivo: ${result.outputPath}\n📄 Páginas: ${result.pages} ${result.scale && result.scale < 1 ? `(Auto-Fit: ${(result.scale * 100).toFixed(0)}%)` : ''}\n`);
        break;
      }

      case 'pdf:all': {
        console.log(`\n🚀 Compilando todos los archivos de outputs/ a PDF (Tema: ${theme})...\n`);
        await generateAllPdfs({ theme, baseDir: rootDir });
        console.log(`\n✨ Proceso completado exitosamente.\n`);
        break;
      }

      case 'audit':
      case 'quality': {
        const targetFile = positional[1]
          ? resolveCvPath(positional[1], rootDir)
          : findLatestCvMarkdown(rootDir);

        if (!targetFile) {
          console.error('❌ No se encontró ningún CV en outputs/ para auditar. Pasa la ruta del archivo explícitamente.');
          process.exit(1);
        }

        console.log(`\n🔍 Iniciando Auditoría de Calidad de CV...`);
        console.log(`📄 CV Evaluado: ${targetFile}`);

        const result = await generateQualityAuditReport({
          cvMarkdownPath: targetFile,
          theme,
          outputPath: flags.output as string | undefined,
          baseDir: rootDir
        });

        console.log(`\n🎉 ¡Reporte de Calidad y PDF generados con éxito!`);
        console.log(`📊 Reporte Markdown: ${result.reportMdPath}`);
        console.log(`🖨️ Reporte PDF:      ${result.reportPdfPath}`);
        console.log(`⭐ Puntaje Global:   ${result.report.overallScore} / 10.0\n`);
        break;
      }

      case 'generate':
      case 'tailor': {
        const companyName = positional[1] || (flags.company as string) || undefined;
        console.log(`\n🎯 Iniciando CV Tailoring con Gemini API...`);
        console.log(`🔒 SSOT: master-data.md es estrictamente de solo lectura.`);

        const result = await tailorCvWithGemini({
          companyName,
          theme,
          baseDir: rootDir
        });

        console.log(`\n🎉 ¡CV y PDF generados con éxito!`);
        console.log(`📄 Markdown: ${result.cvMdPath}`);
        if (result.gapMdPath) {
          console.log(`📊 Gap Report: ${result.gapMdPath}`);
        }
        console.log(`🖨️ PDF:      ${result.pdfPath}\n`);
        break;
      }

      default:
        console.error(`❌ Comando no reconocido: "${command}"`);
        printHelp();
        process.exit(1);
    }
  } catch (error: any) {
    console.error(`\n❌ Error:`, error.message);
    process.exit(1);
  }
}

main();
