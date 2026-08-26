import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseCvMarkdownToData, sanitizeFileName } from './parser';
import { CVRenderer } from '../components/CVRenderer';
import { ThemeId } from '../types/cv';
import { getWorkspaceRoot, getOutputsDir } from './workspace';

interface GeneratePdfOptions {
  markdownContent?: string;
  markdownFilePath?: string;
  outputPath?: string;
  theme?: ThemeId;
  format?: 'A4' | 'Letter';
  maxPages?: number;
  autoFit?: boolean;
  baseDir?: string;
}

export function renderCvToHtml(markdownContent: string, theme: ThemeId = 'modern-tech', baseDir?: string): string {
  const rootDir = getWorkspaceRoot(baseDir);
  const cvData = parseCvMarkdownToData(markdownContent);

  // Render React component tree to static HTML markup
  const componentHtml = renderToStaticMarkup(
    React.createElement(CVRenderer, { data: cvData, theme })
  );

  // Load theme CSS
  const themePath = path.join(rootDir, 'src', 'themes', `${theme}.css`);
  const themeCss = fs.existsSync(themePath) ? fs.readFileSync(themePath, 'utf8') : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cvData.name || 'CV'} - ${cvData.title || 'Curriculum Vitae'}</title>
  <!-- Google Fonts: Inter, Merriweather, Outfit, Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <style>
    /* CSS Variables for Dynamic Scaling & Page Fitting */
    :root {
      --cv-font-size: 9.5pt;
      --cv-line-height: 1.42;
      --cv-section-gap: 14px;
      --cv-item-gap: 10px;
      --cv-bullet-gap: 4px;
      --cv-skills-gap: 6px;
      --cv-header-gap: 16px;
    }

    /* CSS Base & Reset */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      font-size: var(--cv-font-size, 9.5pt);
      line-height: var(--cv-line-height, 1.42);
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
        font-size: var(--cv-font-size, 9.5pt) !important;
        line-height: var(--cv-line-height, 1.42) !important;
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

    /* Auto-Fit Cascade Hooks */
    .cv-section {
      margin-bottom: var(--cv-section-gap, 14px) !important;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .experience-item, .project-item, .education-item {
      margin-bottom: var(--cv-item-gap, 10px) !important;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .skills-group {
      margin-bottom: var(--cv-skills-gap, 6px) !important;
    }

    .cv-bullet-item {
      margin-bottom: var(--cv-bullet-gap, 4px) !important;
    }

    .cv-summary {
      font-size: var(--cv-font-size, 9.5pt) !important;
      line-height: var(--cv-line-height, 1.42) !important;
    }

    .cv-header {
      margin-bottom: var(--cv-header-gap, 16px) !important;
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
  maxPages,
  autoFit = true,
  baseDir
}: GeneratePdfOptions) {
  const rootDir = getWorkspaceRoot(baseDir);

  let content = markdownContent;
  if (!content && markdownFilePath) {
    if (!fs.existsSync(markdownFilePath)) {
      throw new Error(`File not found: ${markdownFilePath}`);
    }
    content = fs.readFileSync(markdownFilePath, 'utf8');
  }

  if (!content) {
    throw new Error('No Markdown content or file path provided.');
  }

  let finalOutputPath = outputPath;
  if (!finalOutputPath && markdownFilePath) {
    const dir = path.dirname(markdownFilePath);
    const ext = path.extname(markdownFilePath);
    const basename = path.basename(markdownFilePath, ext);
    finalOutputPath = path.join(dir, `${basename}.pdf`);
  }

  if (!finalOutputPath) {
    const parsed = parseCvMarkdownToData(content);
    const candidateName = sanitizeFileName(parsed.name || 'Candidato');
    finalOutputPath = path.join(rootDir, 'outputs', `CV_${candidateName}.pdf`);
  }

  // Determine target pages (1 page default for standard lengths, 2 for longer)
  const wordCount = content.trim().split(/\s+/).length;
  const targetPages = maxPages || (wordCount > 520 ? 2 : 1);

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
    await page.emulateMediaType('print');

    // Execute Smart Auto-Fitting inside page context
    const fitResult = await page.evaluate((target: number, allowFit: boolean) => {
      const container = (document.querySelector('.cv-container') as HTMLElement) || document.body;
      
      // A4 printable height in px at standard 96dpi (277mm printable = ~1046.9px)
      const PAGE_HEIGHT_PX = 1046.9;
      const targetHeightPx = target * PAGE_HEIGHT_PX;
      
      let measuredHeight = container.offsetHeight || container.scrollHeight;
      let appliedScale = 1.0;

      if (allowFit && measuredHeight > targetHeightPx) {
        const overflowFactor = measuredHeight / targetHeightPx;
        
        // If content is within condensable overflow range (up to 40% excess height)
        if (overflowFactor <= 1.40) {
          for (let s = 0.98; s >= 0.80; s -= 0.02) {
            const fontPt = (9.5 * s).toFixed(2);
            const lineHt = (1.42 * Math.max(0.90, s)).toFixed(2);
            const secGap = Math.max(6, Math.round(14 * s));
            const itemGap = Math.max(3, Math.round(10 * s));
            const bulletGap = Math.max(2, Math.round(4 * s));
            const skillsGap = Math.max(3, Math.round(6 * s));
            const headerGap = Math.max(8, Math.round(16 * s));

            document.documentElement.style.setProperty('--cv-font-size', `${fontPt}pt`);
            document.documentElement.style.setProperty('--cv-line-height', `${lineHt}`);
            document.documentElement.style.setProperty('--cv-section-gap', `${secGap}px`);
            document.documentElement.style.setProperty('--cv-item-gap', `${itemGap}px`);
            document.documentElement.style.setProperty('--cv-bullet-gap', `${bulletGap}px`);
            document.documentElement.style.setProperty('--cv-skills-gap', `${skillsGap}px`);
            document.documentElement.style.setProperty('--cv-header-gap', `${headerGap}px`);

            // Direct inline overrides
            container.style.fontSize = `${fontPt}pt`;
            container.style.lineHeight = `${lineHt}`;

            document.querySelectorAll('.cv-section').forEach(sec => {
              (sec as HTMLElement).style.marginBottom = `${secGap}px`;
            });

            document.querySelectorAll('.experience-item, .project-item, .education-item').forEach(it => {
              (it as HTMLElement).style.marginBottom = `${itemGap}px`;
            });

            document.querySelectorAll('.cv-bullet-item').forEach(b => {
              (b as HTMLElement).style.marginBottom = `${bulletGap}px`;
            });

            document.querySelectorAll('.skills-group').forEach(sg => {
              (sg as HTMLElement).style.marginBottom = `${skillsGap}px`;
            });

            const header = document.querySelector('.cv-header') as HTMLElement;
            if (header) {
              header.style.marginBottom = `${headerGap}px`;
              header.style.paddingBottom = `${Math.max(6, Math.round(12 * s))}px`;
            }

            measuredHeight = container.offsetHeight || container.scrollHeight;
            if (measuredHeight <= targetHeightPx) {
              appliedScale = s;
              break;
            }
          }
        }
      }

      const calculatedPages = Math.max(1, Math.ceil((measuredHeight - 4) / PAGE_HEIGHT_PX));
      return {
        measuredHeight: Math.round(measuredHeight),
        targetHeight: Math.round(targetHeightPx),
        appliedScale: Number(appliedScale.toFixed(2)),
        pages: calculatedPages,
        fitsStrictly: calculatedPages <= target
      };
    }, targetPages, autoFit);

    if (fitResult.appliedScale < 1) {
      console.log(`📏 Auto-Fit: Content micro-adjusted to ${(fitResult.appliedScale * 100).toFixed(0)}% (${fitResult.measuredHeight}px / ${fitResult.targetHeight}px) -> ${fitResult.pages} page(s).`);
    } else {
      console.log(`📏 Auto-Fit: Height: ${fitResult.measuredHeight}px / ${fitResult.targetHeight}px (${fitResult.pages} page(s)).`);
    }

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
      theme,
      pages: fitResult.pages,
      scale: fitResult.appliedScale
    };
  } finally {
    await browser.close();
  }
}

export async function generateAllPdfs({ theme = 'modern-tech', baseDir }: { theme?: ThemeId; baseDir?: string } = {}) {
  const rootDir = getWorkspaceRoot(baseDir);
  const outputsDir = getOutputsDir(baseDir);

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
