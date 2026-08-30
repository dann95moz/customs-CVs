import {
  CVData,
  ContactItem,
  ContactType,
  CVSection,
  SectionType,
  SkillCategory,
  ExperienceItem
} from '../../types/cv';

/**
 * Markdown-to-Structured CV AST Parser.
 * Principle: Single Responsibility (S) - converts raw markdown into structured domain models.
 */

/**
 * Detects contact type and extracts label & URL
 */
export function parseContactItem(rawText: string): ContactItem | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  // Markdown link: [Label](url)
  const linkMatch = trimmed.match(/\[(.*?)\]\((.*?)\)/);
  if (linkMatch) {
    let label = linkMatch[1];
    let url = linkMatch[2];
    let type: ContactType = 'globe';

    if (url.includes('linkedin.com') || label.toLowerCase().includes('linkedin')) {
      type = 'linkedin';
    } else if (url.includes('github.com') || label.toLowerCase().includes('github')) {
      type = 'github';
    } else if (url.startsWith('mailto:') || label.includes('@')) {
      type = 'email';
      label = label.replace(/^mailto:/i, '').trim();
      if (!url.startsWith('mailto:') && label) {
        url = `mailto:${label}`;
      }
    }

    return { type, label, url };
  }

  // Plain email
  if (trimmed.includes('@') && !trimmed.includes(' ')) {
    const cleanEmail = trimmed.replace(/^mailto:/i, '').trim();
    return { type: 'email', label: cleanEmail, url: `mailto:${cleanEmail}` };
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

    const match = trimmed.match(/^[-*•]\s*(?:\*\*(.*?)\*\*|(.*?)):?\s*(.*)$/);
    if (match) {
      const category = (match[1] || match[2] || '').replace(/:$/, '').trim();
      const rawSkills = match[3] !== undefined ? match[3] : '';
      const skills = rawSkills.split(',').map(s => s.trim()).filter(Boolean);
      if (category || skills.length > 0) {
        groups.push({ category: category || 'Specialized Domain', skills });
      }
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
    if (currentItem && (currentItem.company || currentItem.role || currentItem.bullets.length > 0)) {
      items.push(currentItem);
      currentItem = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ');
    const isHeading = trimmed.startsWith('### ') || trimmed.startsWith('#### ');
    const isBoldHeader = trimmed.startsWith('**') && (trimmed.includes('|') || currentItem === null || (currentItem && currentItem.bullets.length > 0));

    if (isHeading || isBoldHeader) {
      flush();
      
      const cleanLine = trimmed.replace(/^#+\s*/, '').trim();
      const parts = cleanLine.split('|').map(s => s.trim());
      
      const companyPart = (parts[0] || '').replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
      let rolePart = parts[1] ? parts[1].replace(/^\*/, '').replace(/\*$/, '').replace(/^\*\*/, '').replace(/\*\*$/, '').trim() : undefined;
      let locationPart = parts[2] ? parts[2].trim() : undefined;

      if (rolePart && (rolePart.toLowerCase().includes('remoto') || rolePart.toLowerCase().includes('remote') || rolePart.includes(','))) {
        locationPart = rolePart;
        rolePart = undefined;
      }

      currentItem = {
        company: companyPart,
        location: locationPart,
        role: rolePart,
        date: undefined,
        bullets: []
      };
    } else if (isBullet) {
      const bulletText = trimmed.replace(/^[-*•]\s*/, '').trim();
      if (!currentItem) {
        currentItem = {
          company: 'Experience',
          bullets: []
        };
      }
      currentItem.bullets.push(bulletText);
    } else if (currentItem) {
      const cleanSub = trimmed.replace(/^\*/, '').replace(/\*$/, '').trim();
      const parts = cleanSub.split('|').map(s => s.trim());

      for (const p of parts) {
        const cleanPart = p.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/^\*/, '').replace(/\*$/, '').trim();
        if (/\d{4}|present|presente|actual/i.test(cleanPart)) {
          currentItem.date = cleanPart;
        } else if (/remoto|remote|,|colombia|mexico|usa|chile|spain/i.test(cleanPart)) {
          currentItem.location = cleanPart;
        } else if (!currentItem.role) {
          currentItem.role = cleanPart;
        }
      }
    }
  }

  flush();
  return items;
}

/**
 * Parses education/languages bullet items (supports discrete bullets and auto-splits inline certifications)
 */
function parseListItems(rawContent: string): string[] {
  const lines = rawContent.split(/\r?\n/);
  const items: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const certPrefixMatch = trimmed.match(/^(?:[-•]\s*|\*\s+)?\*{0,2}(?:certifications?|certificaciones?):\*{0,2}\s*(.+)$/i);
    if (certPrefixMatch) {
      const certContent = certPrefixMatch[1].trim();
      let certList: string[] = [];

      if (certContent.includes('|')) {
        certList = certContent.split('|').map(s => s.trim()).filter(Boolean);
      } else if (certContent.includes('•')) {
        certList = certContent.split('•').map(s => s.trim()).filter(Boolean);
      } else if (certContent.includes(';')) {
        certList = certContent.split(';').map(s => s.trim()).filter(Boolean);
      } else if (/\),\s*[A-Z\*\d]/.test(certContent)) {
        certList = certContent
          .split(/\),\s*/)
          .map((s, idx, arr) => (idx < arr.length - 1 ? `${s})` : s))
          .map(s => s.trim())
          .filter(Boolean);
      } else {
        certList = [certContent];
      }

      for (const cert of certList) {
        let formatted = cert.trim();
        if (!formatted.startsWith('**')) {
          const matchParen = formatted.match(/^([^(]+)\s*\(([^)]+)\)$/);
          if (matchParen) {
            formatted = `**${matchParen[1].trim()}** – ${matchParen[2].trim()}`;
          } else {
            formatted = `**${formatted}**`;
          }
        }
        items.push(formatted);
      }
      continue;
    }

    if (trimmed.includes('|') && !trimmed.startsWith('#')) {
      const cleanLine = trimmed.replace(/^(?:[-•]\s*|\*\s+)/, '');
      const parts = cleanLine.split('|').map(s => s.trim()).filter(Boolean);
      for (const part of parts) {
        let itemText = part;
        if (/^[^*]+:\*\*/.test(itemText)) {
          itemText = `**${itemText}`;
        }
        items.push(itemText);
      }
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      let itemText = trimmed.replace(/^(?:[-•]\s*|\*\s+)/, '').trim();
      if (/^[^*]+:\*\*/.test(itemText)) {
        itemText = `**${itemText}`;
      }
      items.push(itemText);
    } else {
      let itemText = trimmed;
      if (/^[^*]+:\*\*/.test(itemText)) {
        itemText = `**${itemText}`;
      }
      items.push(itemText);
    }
  }

  return items;
}

/**
 * Main parser: transforms Markdown string to structured CVData object
 */
export function parseCvMarkdownToData(rawMarkdown: string): CVData {
  const lines = rawMarkdown.split(/\r?\n/);

  // Skip preamble
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
      if (upper.includes('RESUMEN') || upper.includes('SUMMARY') || upper.includes('PERFIL') || upper.includes('PITCH')) {
        type = 'summary';
      } else if (
        upper.includes('HABILIDADES') ||
        upper.includes('SKILLS') ||
        upper.includes('COMPETENCIAS') ||
        upper.includes('COMPETENCIES') ||
        upper.includes('TECH STACK') ||
        upper.includes('STACK')
      ) {
        type = 'skills';
      } else if (upper.includes('EXPERIENCIA') || upper.includes('EXPERIENCE') || upper.includes('HISTORIAL') || upper.includes('CAREER HISTORY') || upper.includes('WORK HISTORY')) {
        type = 'experience';
      } else if (
        upper.includes('PROYECTOS') ||
        upper.includes('PROJECTS') ||
        upper.includes('EXTRAS') ||
        upper.includes('PUBLICACIONES') ||
        upper.includes('PUBLICATIONS') ||
        upper.includes('VOLUNTEERING') ||
        upper.includes('VOLUNTARIADO') ||
        upper.includes('INITIATIVES') ||
        upper.includes('SIDE VENTURES')
      ) {
        type = 'projects';
      } else if (upper.includes('EDUCACI') || upper.includes('EDUCATION') || upper.includes('CERTIFICA') || upper.includes('ACADEMIC')) {
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
