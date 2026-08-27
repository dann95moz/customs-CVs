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

CLI Usage:
  npm run pdf                         Generate PDF from the most recent file in outputs/
  npm run pdf <file.md>               Generate PDF from the specified Markdown file
  npm run pdf:all                     Generate PDFs for all files in outputs/
  npm run audit [file.md]             Generate Quality and Audit Report (1-10 table and growth levers)
  npm run dev                         Start the CV Studio Web interface in real-time (Vite + React)
  npm run generate [Company]          Synthesize tailored CV using Gemini API from target-job.md

Available visual themes:
  --theme modern-tech                 (Default: Stripe/Linear inspired style with badges)
  --theme executive                   (Corporate Navy design with formal Serif typography)
  --theme minimal-ats                 (Strict linear monochrome for ATS compatibility)
  --theme two-column                  (Two-column layout with skills & languages sidebar)

Options:
  --output <path>                     Destination path for the generated PDF
  --help, -h                          Display this help message

Examples:
  npm run pdf outputs/Sample_CV_Stripe.md -- --theme executive
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
          console.error('❌ No .md file found in outputs/ or templates/.');
          process.exit(1);
        }

        console.log(`\n🚀 Compiling CV to PDF with TypeScript + React SSR...`);
        console.log(`📄 Source: ${targetFile}`);
        console.log(`🎨 Theme:  ${theme}`);

        const maxPages = flags['max-pages'] ? Number(flags['max-pages']) : undefined;

        const result = await generatePdfFromMarkdown({
          markdownFilePath: targetFile,
          outputPath: flags.output as string | undefined,
          theme,
          maxPages,
          baseDir: rootDir
        });

        console.log(`\n✅ PDF generated successfully!\n📂 File: ${result.outputPath}\n📄 Pages: ${result.pages} ${result.scale && result.scale < 1 ? `(Auto-Fit: ${(result.scale * 100).toFixed(0)}%)` : ''}\n`);
        break;
      }

      case 'pdf:all': {
        console.log(`\n🚀 Compiling all files in outputs/ to PDF (Theme: ${theme})...\n`);
        await generateAllPdfs({ theme, baseDir: rootDir });
        console.log(`\n✨ Process completed successfully.\n`);
        break;
      }

      case 'audit':
      case 'quality': {
        const targetFile = positional[1]
          ? resolveCvPath(positional[1], rootDir)
          : findLatestCvMarkdown(rootDir);

        if (!targetFile) {
          console.error('❌ No CV found in outputs/ to audit. Pass the file path explicitly.');
          process.exit(1);
        }

        console.log(`\n🔍 Starting CV Quality Audit...`);
        console.log(`📄 Evaluated CV: ${targetFile}`);

        const result = await generateQualityAuditReport({
          cvMarkdownPath: targetFile,
          theme,
          outputPath: flags.output as string | undefined,
          baseDir: rootDir
        });

        console.log(`\n🎉 Quality Report and PDF generated successfully!`);
        console.log(`📊 Markdown Report: ${result.reportMdPath}`);
        console.log(`🖨️ PDF Report:      ${result.reportPdfPath}`);
        console.log(`⭐ Overall Score:   ${result.report.overallScore} / 10.0\n`);
        break;
      }

      case 'generate':
      case 'tailor': {
        const companyName = positional[1] || (flags.company as string) || undefined;
        console.log(`\n🎯 Starting CV Tailoring with Gemini API...`);
        console.log(`🔒 SSOT: master-data.md is strictly read-only.`);

        const result = await tailorCvWithGemini({
          companyName,
          theme,
          baseDir: rootDir
        });

        console.log(`\n🎉 CV and PDF generated successfully!`);
        console.log(`📄 Markdown: ${result.cvMdPath}`);
        if (result.gapMdPath) {
          console.log(`📊 Gap Report: ${result.gapMdPath}`);
        }
        console.log(`🖨️ PDF:      ${result.pdfPath}\n`);
        break;
      }

      default:
        console.error(`❌ Unrecognized command: "${command}"`);
        printHelp();
        process.exit(1);
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Error:`, msg);
    process.exit(1);
  }
}

main();
