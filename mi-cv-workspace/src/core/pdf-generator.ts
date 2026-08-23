import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseCvMarkdownToData } from './parser';
import { CVRenderer } from '../components/CVRenderer';
import { ThemeId } from '../types/cv';

interface GeneratePdfOptions {
  markdownContent?: string;
  markdownFilePath?: string;
  outputPath?: string;
  theme?: ThemeId;
  format?: 'A4' | 'Letter';
  baseDir?: string;
}

function resolveWorkspaceDir(baseDir?: string): string {
  if (baseDir && fs.existsSync(baseDir)) return baseDir;
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'master-data.md'))) return cwd;
  if (fs.existsSync(path.join(cwd, 'mi-cv-workspace', 'master-data.md'))) return path.join(cwd, 'mi-cv-workspace');
  return path.resolve(import.meta.dirname, '..', '..');
}

export function renderCvToHtml(markdownContent: string, theme: ThemeId = 'modern-tech', baseDir?: string): string {
  const rootDir = resolveWorkspaceDir(baseDir);
  const cvData = parseCvMarkdownToData(markdownContent);

  // Render React component tree to static HTML markup
  const componentHtml = renderToStaticMarkup(
    React.createElement(CVRenderer, { data: cvData, theme })
  );

  // Load theme CSS
  const themePath = path.join(rootDir, 'src', 'themes', `${theme}.css`);
  const themeCss = fs.existsSync(themePath) ? fs.readFileSync(themePath, 'utf8') : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cvData.name || 'CV'} - ${cvData.title || 'Curriculum Vitae'}</title>
  <!-- Google Fonts: Inter, Merriweather, Outfit, Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <style>
    /* CSS Base & Reset */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      font-size: 10pt;
      line-height: 1.45;
      color: #1e293b;
      background-color: #ffffff;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Print Setup */
    @page {
      size: A4;
      margin: 10mm 12mm 10mm 12mm;
    }

    @media print {
      html, body {
        background: transparent !important;
        font-size: 9.5pt;
      }
      .cv-container {
        box-shadow: none !important;
        margin: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      a {
        text-decoration: none !important;
        color: inherit !important;
      }
    }

    .section-block {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .experience-item, .project-item, .education-item {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .icon {
      display: inline-flex;
      align-self: center;
      width: 13px;
      height: 13px;
      margin-right: 5px;
      vertical-align: -1.5px;
      fill: currentColor;
      flex-shrink: 0;
    }

    /* Injected Theme Styles */
    ${themeCss}
  </style>
</head>
<body class="theme-${theme}">
  ${componentHtml}
</body>
</html>`;
}

export async function generatePdfFromMarkdown({
  markdownContent,
  markdownFilePath,
  outputPath,
  theme = 'modern-tech',
  format = 'A4',
  baseDir
}: GeneratePdfOptions) {
  const rootDir = resolveWorkspaceDir(baseDir);

  let content = markdownContent;
  if (!content && markdownFilePath) {
    if (!fs.existsSync(markdownFilePath)) {
      throw new Error(`No se encontró el archivo: ${markdownFilePath}`);
    }
    content = fs.readFileSync(markdownFilePath, 'utf8');
  }

  if (!content) {
    throw new Error('No se proporcionó contenido Markdown ni archivo.');
  }

  let finalOutputPath = outputPath;
  if (!finalOutputPath && markdownFilePath) {
    const dir = path.dirname(markdownFilePath);
    const ext = path.extname(markdownFilePath);
    const basename = path.basename(markdownFilePath, ext);
    finalOutputPath = path.join(dir, `${basename}.pdf`);
  }

  if (!finalOutputPath) {
    finalOutputPath = path.join(rootDir, 'outputs', 'CV_Generado.pdf');
  }

  const html = renderCvToHtml(content, theme, rootDir);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=medium'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
    await page.evaluateHandle('document.fonts.ready');

    const outputDir = path.dirname(finalOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await page.pdf({
      path: finalOutputPath,
      format,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '10mm',
        right: '12mm',
        bottom: '10mm',
        left: '12mm'
      }
    });

    return {
      success: true,
      outputPath: finalOutputPath,
      theme
    };
  } finally {
    await browser.close();
  }
}

export async function generateAllPdfs({ theme = 'modern-tech', baseDir }: { theme?: ThemeId; baseDir?: string } = {}) {
  const rootDir = resolveWorkspaceDir(baseDir);
  const outputsDir = path.join(rootDir, 'outputs');

  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }

  const files = fs.readdirSync(outputsDir).filter(f => f.endsWith('.md'));
  const results = [];

  for (const file of files) {
    const mdPath = path.join(outputsDir, file);
    const pdfName = file.replace(/\.md$/, '.pdf');
    const pdfPath = path.join(outputsDir, pdfName);

    console.log(`📄 Procesando: ${file} (Tema: ${theme})...`);
    try {
      const res = await generatePdfFromMarkdown({
        markdownFilePath: mdPath,
        outputPath: pdfPath,
        theme,
        baseDir: rootDir
      });
      console.log(`✅ Creado: ${pdfPath}`);
      results.push(res);
    } catch (err: any) {
      console.error(`❌ Error en ${file}:`, err.message);
      results.push({ success: false, file, error: err.message });
    }
  }

  return results;
}
