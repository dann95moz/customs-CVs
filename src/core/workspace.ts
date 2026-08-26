import fs from 'fs';
import path from 'path';

/**
 * Resolves the root workspace directory reliably in Node.js / CLI environments.
 */
export function getWorkspaceRoot(baseDir?: string): string {
  if (baseDir && fs.existsSync(baseDir)) return baseDir;
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'master-data.md')) || fs.existsSync(path.join(cwd, 'package.json'))) {
    return cwd;
  }
  return path.resolve(import.meta.dirname, '..', '..');
}

/**
 * Returns the outputs directory path, creating it if it doesn't exist.
 */
export function getOutputsDir(baseDir?: string): string {
  const root = getWorkspaceRoot(baseDir);
  const outputsDir = path.join(root, 'outputs');
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }
  return outputsDir;
}

/**
 * Resolves a target file path which could be absolute, relative to CWD, relative to root, or in outputs/.
 */
export function resolveCvPath(targetFile: string, baseDir?: string): string {
  if (path.isAbsolute(targetFile) && fs.existsSync(targetFile)) {
    return targetFile;
  }

  const root = getWorkspaceRoot(baseDir);
  const directPath = path.resolve(process.cwd(), targetFile);
  const rootPath = path.resolve(root, targetFile);
  const outputSubPath = path.resolve(root, 'outputs', targetFile);

  if (fs.existsSync(directPath)) return directPath;
  if (fs.existsSync(rootPath)) return rootPath;
  if (fs.existsSync(outputSubPath)) return outputSubPath;

  return rootPath;
}

/**
 * Finds the most recent CV Markdown file in outputs/, ignoring gap analyses and quality reports.
 */
export function findLatestCvMarkdown(baseDir?: string): string | null {
  const outputsDir = getOutputsDir(baseDir);
  const root = getWorkspaceRoot(baseDir);

  // First look for tailored CVs
  let files = fs.readdirSync(outputsDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('Gap_Analysis_') && !f.startsWith('Quality_Report_'))
    .map(f => ({ name: f, time: fs.statSync(path.join(outputsDir, f)).mtimeMs }))
    .sort((a, b) => b.time - a.time);

  // Fallback to any markdown file in outputs/
  if (files.length === 0) {
    files = fs.readdirSync(outputsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({ name: f, time: fs.statSync(path.join(outputsDir, f)).mtimeMs }))
      .sort((a, b) => b.time - a.time);
  }

  if (files.length > 0) {
    return path.join(outputsDir, files[0].name);
  }

  // Fallback to default cv-template.md if available
  const defaultTemplate = path.join(root, 'templates', 'cv-template.md');
  if (fs.existsSync(defaultTemplate)) {
    return defaultTemplate;
  }

  return null;
}
