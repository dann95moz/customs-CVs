/**
 * Metadata & text sanitization extraction utilities.
 * Principle: Single Responsibility (S) - focuses exclusively on parsing candidate & vacancy metadata.
 */

/**
 * Sanitizes a string into a clean Pascal_Snake_Case filename without accents or special chars
 */
export function sanitizeFileName(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\[|\]/g, '')
    .replace(/[^a-zA-Z0-9_\s-]/g, '')
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('_');
}

/**
 * Extracts candidate initials (e.g. 'Daniel Corredor' -> 'DC') for monograms
 */
export function extractCandidateInitials(name?: string): string {
  if (!name) return 'CV';
  const clean = name.replace(/\[|\]/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CV';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Extracts candidate name from master-data.md or fallback
 */
export function extractCandidateName(masterDataText: string, fallback: string = ''): string {
  const match = masterDataText.match(/(?:Nombre Completo|Full Name|Candidate Name):\*{0,2}\s*\[?([^\]\r\n*]+)\]?/i);
  if (match) {
    const raw = match[1].trim();
    if (
      !raw.toLowerCase().includes('tu nombre') && 
      !raw.toLowerCase().includes('nombre y apellido') &&
      !raw.toLowerCase().includes('candidate full name') &&
      !raw.toLowerCase().includes('candidate name')
    ) {
      return sanitizeFileName(raw);
    }
  }
  return sanitizeFileName(fallback);
}

/**
 * Extracts target company from target-job.md or fallback
 */
export function extractTargetCompany(targetJobText: string, fallback: string = ''): string {
  const match = targetJobText.match(/(?:Empresa|Company):\*{0,2}\s*\[?(?:Ej:\s*|e\.g\.\s*)?([^\]\r\n*]+)\]?/i);
  if (match) {
    const raw = match[1].trim();
    if (
      !raw.toLowerCase().includes('startup x') && 
      !raw.toLowerCase().includes('company name') && 
      !raw.toLowerCase().includes('target company') &&
      !raw.includes('/')
    ) {
      return sanitizeFileName(raw);
    }
  }
  return sanitizeFileName(fallback);
}

/**
 * Extracts target role from target-job.md or master-data.md or fallback
 */
export function extractTargetRole(targetJobText: string, masterDataText: string = '', fallback: string = ''): string {
  if (targetJobText) {
    const match = targetJobText.match(/(?:Target Role|Target Position|Role|Cargo|Puesto|Position|Title|Job Title):\*{0,2}\s*\[?(?:e\.g\.\s*|Ej:\s*)?([^\]\r\n*]+)\]?/i);
    if (match) {
      const raw = match[1].replace(/^[–\-•|:\s]+/, '').replace(/[–\-•|:\s]+$/, '').trim();
      if (
        !raw.toLowerCase().includes('target role') &&
        !raw.toLowerCase().includes('role title') &&
        !raw.toLowerCase().includes('e.g.') &&
        raw.length < 70
      ) {
        return raw;
      }
    }
  }

  if (masterDataText) {
    const matchTitle = masterDataText.match(/^\*\*([^*]+)\*\*\s*$/m);
    if (matchTitle) {
      const mainRole = matchTitle[1].split(/[|•]/)[0].trim();
      if (mainRole && !mainRole.includes('[') && mainRole.length < 70) {
        return mainRole;
      }
    }
  }

  return fallback;
}
