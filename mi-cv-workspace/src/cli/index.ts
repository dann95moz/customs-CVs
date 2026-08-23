#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { generatePdfFromMarkdown, generateAllPdfs } from '../core/pdf-generator';
import { tailorCvWithGemini } from '../core/gemini';
import { ThemeId } from '../types/cv';

function getWorkspaceDir(): string {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'master-data.md'))) {
    return cwd;
  }
  if (fs.existsSync(path.join(cwd, 'mi-cv-workspace', 'master-data.md'))) {
    return path.join(cwd, 'mi-cv-workspace');
  }
  return path.resolve(import.meta.dirname, '..', '..');
}

const rootDir = getWorkspaceDir();
const outputsDir = path.join(rootDir, 'outputs');

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
        let targetFile = positional[1];

        if (!targetFile) {
          if (!fs.existsSync(outputsDir)) {
            fs.mkdirSync(outputsDir, { recursive: true });
          }
          const files = fs.readdirSync(outputsDir)
            .filter(f => f.endsWith('.md'))
            .map(f => ({ name: f, time: fs.statSync(path.join(outputsDir, f)).mtimeMs }))
            .sort((a, b) => b.time - a.time);

          if (files.length === 0) {
            console.log('⚠️ No se encontraron archivos .md en outputs/. Usando plantilla base...');
            targetFile = path.join(rootDir, 'templates', 'cv-template.md');
          } else {
            targetFile = path.join(outputsDir, files[0].name);
          }
        } else {
          if (!path.isAbsolute(targetFile)) {
            const directPath = path.resolve(process.cwd(), targetFile);
            const rootPath = path.resolve(rootDir, targetFile);
            const outputSubPath = path.resolve(rootDir, 'outputs', targetFile);
            if (fs.existsSync(directPath)) {
              targetFile = directPath;
            } else if (fs.existsSync(rootPath)) {
              targetFile = rootPath;
            } else if (fs.existsSync(outputSubPath)) {
              targetFile = outputSubPath;
            } else {
              targetFile = rootPath;
            }
          }
        }

        console.log(`\n🚀 Compilando CV a PDF con TypeScript + React SSR...`);
        console.log(`📄 Origen: ${targetFile}`);
        console.log(`🎨 Tema:   ${theme}`);

        const result = await generatePdfFromMarkdown({
          markdownFilePath: targetFile,
          outputPath: flags.output as string | undefined,
          theme,
          baseDir: rootDir
        });

        console.log(`\n✅ ¡PDF generado con éxito!\n📂 Archivo: ${result.outputPath}\n`);
        break;
      }

      case 'pdf:all': {
        console.log(`\n🚀 Compilando todos los archivos de outputs/ a PDF (Tema: ${theme})...\n`);
        await generateAllPdfs({ theme, baseDir: rootDir });
        console.log(`\n✨ Proceso completado exitosamente.\n`);
        break;
      }

      case 'generate':
      case 'tailor': {
        const companyName = positional[1] || (flags.company as string) || 'Objetivo';
        console.log(`\n🎯 Iniciando CV Tailoring con Gemini API para: "${companyName}"...`);
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
