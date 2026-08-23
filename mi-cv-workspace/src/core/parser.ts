import { 
  CVData, 
  ContactItem, 
  ContactType, 
  CVSection, 
  SectionType, 
  SkillCategory, 
  ExperienceItem 
} from '../types/cv';

/**
 * Detects contact type and extracts label & URL
 */
export function parseContactItem(rawText: string): ContactItem | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  // Markdown link: [Label](url)
  const linkMatch = trimmed.match(/\[(.*?)\]\((.*?)\)/);
  if (linkMatch) {
    const label = linkMatch[1];
    const url = linkMatch[2];
    let type: ContactType = 'globe';

    if (url.includes('linkedin.com') || label.toLowerCase().includes('linkedin')) {
      type = 'linkedin';
    } else if (url.includes('github.com') || label.toLowerCase().includes('github')) {
      type = 'github';
    } else if (url.startsWith('mailto:') || label.includes('@')) {
      type = 'email';
    }

    return { type, label, url };
  }

  // Plain email
  if (trimmed.includes('@') && !trimmed.includes(' ')) {
    return { type: 'email', label: trimmed, url: `mailto:${trimmed}` };
  }

  // Plain phone
  if (/^(\+?[0-9\s\-()]{7,})$/.test(trimmed)) {
    return { type: 'phone', label: trimmed };
  }

  // Location
  if (trimmed.includes(',') || trimmed.toLowerCase().includes('remoto') || trimmed.toLowerCase().includes('remote')) {
    return { type: 'location', label: trimmed };
  }

  return { type: 'text', label: trimmed };
}

/**
 * Cleans section titles from emojis and leading markdown symbols
 */
function cleanSectionTitle(rawTitle: string): string {
  return rawTitle
    .replace(/^#+\s*/, '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
    .trim();
}

/**
 * Parses raw skills text into typed SkillCategory array
 */
function parseSkillGroups(rawContent: string): SkillCategory[] {
  const lines = rawContent.split(/\r?\n/);
  const groups: SkillCategory[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^-\s*\*\*(.*?)\*\*:?\s*(.*)$/);
    if (match) {
      const category = match[1].replace(/:$/, '').trim();
      const skills = match[2].split(',').map(s => s.trim()).filter(Boolean);
      groups.push({ category, skills });
    }
  }

  return groups;
}

/**
 * Parses raw experience/projects text into typed ExperienceItem array
 */
function parseExperienceItems(rawContent: string): ExperienceItem[] {
  const lines = rawContent.split(/\r?\n/);
  const items: ExperienceItem[] = [];

  let currentItem: ExperienceItem | null = null;

  function flush() {
    if (currentItem) {
      items.push(currentItem);
      currentItem = null;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('### ')) {
      flush();
      const content = trimmed.replace(/^###\s*/, '').trim();
      const parts = content.split('|').map(s => s.trim());
      const company = (parts[0] || '').replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
      const location = parts[1] || undefined;

      currentItem = {
        company,
        location,
        role: undefined,
        date: undefined,
        bullets: []
      };
    } else if (trimmed.startsWith('*') && trimmed.includes('|') && currentItem && !currentItem.role) {
      const parts = trimmed.split('|').map(s => s.trim());
      const roleRaw = parts[0] || '';
      const dateRaw = parts[1] || '';

      currentItem.role = roleRaw.replace(/^\*/, '').replace(/\*$/, '').replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
      currentItem.date = dateRaw.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/^\*/, '').replace(/\*$/, '').trim();
    } else if (trimmed.startsWith('- ')) {
      const bullet = trimmed.replace(/^-\s*/, '').trim();
      if (currentItem) {
        currentItem.bullets.push(bullet);
      }
    } else if (currentItem) {
      currentItem.bullets.push(trimmed);
    }
  }

  flush();
  return items;
}

/**
 * Parses education/languages bullet items
 */
function parseListItems(rawContent: string): string[] {
  const lines = rawContent.split(/\r?\n/);
  const items: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('- ')) {
      items.push(trimmed.replace(/^-\s*/, '').trim());
    } else {
      items.push(trimmed);
    }
  }

  return items;
}

/**
 * Main parser: transforms Markdown string to structured CVData object
 */
export function parseCvMarkdownToData(rawMarkdown: string): CVData {
  const lines = rawMarkdown.split(/\r?\n/);

  // Skip preamble (e.g. # 📄 Ejemplo...)
  let startIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.startsWith('# ') && 
      !line.toLowerCase().includes('ejemplo') && 
      !line.toLowerCase().includes('reporte') && 
      !line.toLowerCase().includes('gap')
    ) {
      startIndex = i;
      break;
    }
  }

  const cvLines = lines.slice(startIndex);

  let name = '';
  let title = '';
  const rawContactParts: string[] = [];
  const sections: CVSection[] = [];

  let lineIdx = 0;

  // 1. Name
  while (lineIdx < cvLines.length) {
    const line = cvLines[lineIdx].trim();
    if (line.startsWith('# ')) {
      name = line.replace(/^#\s*/, '').trim();
      lineIdx++;
      break;
    }
    lineIdx++;
  }

  // 2. Subtitle & Contacts
  while (lineIdx < cvLines.length) {
    const line = cvLines[lineIdx].trim();
    if (line.startsWith('---') || line.startsWith('## ')) {
      break;
    }
    if (line.startsWith('**') && line.endsWith('**') && !title) {
      title = line.replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
    } else if (line.length > 0) {
      const parts = line.split(/[•|]/);
      for (const p of parts) {
        if (p.trim()) rawContactParts.push(p.trim());
      }
    }
    lineIdx++;
  }

  const contacts: ContactItem[] = rawContactParts
    .map(parseContactItem)
    .filter((c): c is ContactItem => c !== null);

  // 3. Sections
  let currentSec: CVSection | null = null;
  let secContent: string[] = [];

  function flushSection() {
    if (currentSec) {
      currentSec.rawContent = secContent.join('\n');
      sections.push(currentSec);
      secContent = [];
      currentSec = null;
    }
  }

  while (lineIdx < cvLines.length) {
    const line = cvLines[lineIdx];
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      flushSection();
      const rawTitle = trimmed;
      const cleanTitle = cleanSectionTitle(rawTitle);
      const upper = cleanTitle.toUpperCase();

      let type: SectionType = 'generic';
      if (upper.includes('RESUMEN') || upper.includes('SUMMARY') || upper.includes('PERFIL')) {
        type = 'summary';
      } else if (upper.includes('HABILIDADES') || upper.includes('SKILLS') || upper.includes('COMPETENCIAS')) {
        type = 'skills';
      } else if (upper.includes('EXPERIENCIA') || upper.includes('EXPERIENCE') || upper.includes('HISTORIAL')) {
        type = 'experience';
      } else if (upper.includes('PROYECTOS') || upper.includes('PROJECTS')) {
        type = 'projects';
      } else if (upper.includes('EDUCACI') || upper.includes('EDUCATION') || upper.includes('CERTIFICA')) {
        type = 'education';
      } else if (upper.includes('IDIOMA') || upper.includes('LANGUAGE')) {
        type = 'languages';
      }

      currentSec = {
        id: `sec-${sections.length}-${type}`,
        type,
        title: cleanTitle,
        rawContent: ''
      };
    } else if (trimmed.startsWith('---')) {
      // separator
    } else if (currentSec) {
      secContent.push(line);
    }
    lineIdx++;
  }
  flushSection();

  // Populate structured helper properties
  const cvData: CVData = {
    name,
    title,
    contacts,
    sections
  };

  for (const s of sections) {
    if (s.type === 'summary') cvData.summary = s.rawContent;
    if (s.type === 'skills') cvData.skillGroups = parseSkillGroups(s.rawContent);
    if (s.type === 'experience') cvData.experience = parseExperienceItems(s.rawContent);
    if (s.type === 'projects') cvData.projects = parseExperienceItems(s.rawContent);
    if (s.type === 'education') cvData.education = parseListItems(s.rawContent);
    if (s.type === 'languages') cvData.languages = parseListItems(s.rawContent);
  }

  return cvData;
}
