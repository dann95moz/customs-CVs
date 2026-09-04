import {
  CVData,
  ContactItem,
  ContactType,
  CVSection,
  SectionType,
  SkillCategory,
  ExperienceItem,
  LanguageItem,
  CEFRLevel,
  CustomSection,
  CustomSectionPresetType
} from '../../types/cv';
import { classifySectionType } from '../../constants/sectionKeywords';


/**
 * Markdown-to-Structured CV AST Parser.
 * Principle: Single Responsibility (S) - converts raw markdown into structured domain models.
 */

/**
 * Cleans markdown formatting markers (bold, italics, links, brackets) from plain text values.
 */
export function cleanMarkdownFormatting(text: string): string {
  if (!text) return '';
  return text
    .replace(/^#+\s*/, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[*•\-–—]+\s*/, '')
    .replace(/[*•\-–—]+$/, '')
    .trim();
}

/**
 * Detects contact type and extracts clean label & URL
 */
export function parseContactItem(rawText: string): ContactItem | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  // Markdown link: [Label](url)
  const linkMatch = trimmed.match(/\[(.*?)\]\((.*?)\)/);
  if (linkMatch) {
    let label = cleanMarkdownFormatting(linkMatch[1]);
    let url = linkMatch[2].trim();
    let type: ContactType = 'globe';

    if (url.includes('linkedin.com') || label.toLowerCase().includes('linkedin')) {
      type = 'linkedin';
    } else if (url.includes('github.com') || label.toLowerCase().includes('github')) {
      type = 'github';
    } else if (url.startsWith('mailto:') || label.includes('@')) {
      type = 'email';
      label = label.replace(/^mailto:/i, '').trim();
      url = `mailto:${label}`;
    }

    return { type, label, url };
  }

  const clean = cleanMarkdownFormatting(trimmed);

  // Email
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(clean)) {
    const emailMatch = clean.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : clean;
    return { type: 'email', label: email, url: `mailto:${email}` };
  }

  // LinkedIn URL
  if (/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i.test(clean)) {
    const match = clean.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    const url = match ? (match[0].startsWith('http') ? match[0] : `https://${match[0]}`) : clean;
    return { type: 'linkedin', label: 'LinkedIn', url };
  }

  // GitHub URL
  if (/github\.com\/[a-zA-Z0-9_-]+/i.test(clean)) {
    const match = clean.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
    const url = match ? (match[0].startsWith('http') ? match[0] : `https://${match[0]}`) : clean;
    return { type: 'github', label: 'GitHub', url };
  }

  // Phone
  if (/(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/.test(clean) && !/[a-zA-Z]{4,}/.test(clean)) {
    return { type: 'phone', label: clean };
  }

  // Location
  if (clean.includes(',') || /remot[eo]|hybrid|h[íi]brido|onsite|presencial/i.test(clean)) {
    return { type: 'location', label: clean };
  }

  // Website / Portfolio
  if (/^https?:\/\//i.test(clean) || /\.[a-z]{2,3}(?:\/|$)/i.test(clean)) {
    const url = clean.startsWith('http') ? clean : `https://${clean}`;
    return { type: 'globe', label: 'Portfolio', url };
  }

  return { type: 'text', label: clean };
}

/**
 * Extracts multiple discrete contacts from composite text blocks (e.g. headers with multiple dividers or bullet lists).
 */
export function extractContactsFromBlock(text: string): ContactItem[] {
  const results: ContactItem[] = [];
  const addedTypes = new Set<string>();

  // 1. First extract all explicit markdown links [Label](URL) to preserve URLs
  const mdLinkRegex = /\[(.*?)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g;
  let linkMatch: RegExpExecArray | null;
  while ((linkMatch = mdLinkRegex.exec(text)) !== null) {
    const rawLabel = linkMatch[1].trim();
    const rawUrl = linkMatch[2].trim();
    const cleanLabel = cleanMarkdownFormatting(rawLabel);

    if (rawUrl.includes('linkedin.com') || cleanLabel.toLowerCase().includes('linkedin')) {
      if (!addedTypes.has('linkedin')) {
        results.push({ type: 'linkedin', label: cleanLabel || 'LinkedIn', url: rawUrl });
        addedTypes.add('linkedin');
      }
    } else if (rawUrl.includes('github.com') || cleanLabel.toLowerCase().includes('github')) {
      if (!addedTypes.has('github')) {
        results.push({ type: 'github', label: cleanLabel || 'GitHub', url: rawUrl });
        addedTypes.add('github');
      }
    } else if (rawUrl.startsWith('mailto:') || rawUrl.includes('@')) {
      const email = rawUrl.replace(/^mailto:/i, '');
      if (!addedTypes.has('email')) {
        results.push({ type: 'email', label: email, url: `mailto:${email}` });
        addedTypes.add('email');
      }
    } else if (!addedTypes.has('globe')) {
      results.push({ type: 'globe', label: cleanLabel || 'Portfolio', url: rawUrl });
      addedTypes.add('globe');
    }
  }

  // 2. Check for structured key-value pairs like '- **Email:** foo@bar.com'
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const kvMatch = trimmed.match(/^[-*•]?\s*\*{0,2}(Full Name|Nombre Completo|Primary Professional Title|Title|Cargo|Location|Ubicación|Email|Correo|Phone|Teléfono|WhatsApp|LinkedIn|GitHub|Portfolio|Portafolio|Website)(?:\s*\/[^*:]*)?:\*{0,2}\s*(.+)$/i);
    if (kvMatch) {
      const key = kvMatch[1].toLowerCase();
      const rawVal = kvMatch[2].trim();

      // Check if value contains a markdown link [Label](url)
      const innerLink = rawVal.match(/\[(.*?)\]\((.*?)\)/);
      const val = innerLink ? innerLink[2].trim() : cleanMarkdownFormatting(rawVal);
      const label = innerLink ? cleanMarkdownFormatting(innerLink[1]) : val;
      if (!val) continue;

      if ((key.includes('email') || key.includes('correo')) && !addedTypes.has('email')) {
        const cleanEmail = val.replace(/^mailto:/i, '');
        results.push({ type: 'email', label: cleanEmail, url: `mailto:${cleanEmail}` });
        addedTypes.add('email');
      } else if ((key.includes('phone') || key.includes('tel') || key.includes('whatsapp')) && !addedTypes.has('phone')) {
        results.push({ type: 'phone', label: val });
        addedTypes.add('phone');
      } else if ((key.includes('locat') || key.includes('ubicac')) && !addedTypes.has('location')) {
        results.push({ type: 'location', label: val });
        addedTypes.add('location');
      } else if (key.includes('linkedin') && !addedTypes.has('linkedin')) {
        const url = val.startsWith('http') ? val : `https://${val}`;
        results.push({ type: 'linkedin', label: label || 'LinkedIn', url });
        addedTypes.add('linkedin');
      } else if (key.includes('github') && !addedTypes.has('github')) {
        const url = val.startsWith('http') ? val : `https://${val}`;
        results.push({ type: 'github', label: label || 'GitHub', url });
        addedTypes.add('github');
      } else if ((key.includes('portfol') || key.includes('web')) && !addedTypes.has('globe')) {
        const url = val.startsWith('http') ? val : `https://${val}`;
        results.push({ type: 'globe', label: label || 'Portfolio', url });
        addedTypes.add('globe');
      }
    }
  }

  // 3. Extract embedded entities from inline text (split by •, |, ·, \n)
  const rawParts = text
    .split(/[\r\n•|·\u00B7\u2022;]+/)
    .map(p => p.trim())
    .filter(Boolean);

  for (const part of rawParts) {
    const emailMatch = part.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const linkedinMatch = part.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    const githubMatch = part.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
    const phoneMatch = part.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/);

    if (emailMatch && !addedTypes.has('email')) {
      results.push({ type: 'email', label: emailMatch[0], url: `mailto:${emailMatch[0]}` });
      addedTypes.add('email');
    }
    if (linkedinMatch && !addedTypes.has('linkedin')) {
      const url = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
      results.push({ type: 'linkedin', label: 'LinkedIn', url });
      addedTypes.add('linkedin');
    }
    if (githubMatch && !addedTypes.has('github')) {
      const url = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;
      results.push({ type: 'github', label: 'GitHub', url });
      addedTypes.add('github');
    }
    if (phoneMatch && !emailMatch && !addedTypes.has('phone') && phoneMatch[0].replace(/\D/g, '').length >= 7) {
      results.push({ type: 'phone', label: phoneMatch[0].trim() });
      addedTypes.add('phone');
    }

    // Isolate Location (remove email, phone, links from part)
    let locClean = part;
    if (emailMatch) locClean = locClean.replace(emailMatch[0], '');
    if (linkedinMatch) locClean = locClean.replace(linkedinMatch[0], '');
    if (githubMatch) locClean = locClean.replace(githubMatch[0], '');
    if (phoneMatch) locClean = locClean.replace(phoneMatch[0], '');
    locClean = cleanMarkdownFormatting(locClean).replace(/^[,\s\-.:]+|[,\s\-.:]+$/g, '').trim();

    if (
      locClean &&
      !addedTypes.has('location') &&
      locClean.length >= 3 &&
      locClean.length <= 60 &&
      (locClean.includes(',') ||
        /remot[eo]|hybrid|h[íi]brido|onsite|presencial/i.test(locClean) ||
        (!locClean.includes('@') && !locClean.includes('/') && !/\d{5,}/.test(locClean) && !locClean.toLowerCase().includes('github') && !locClean.toLowerCase().includes('linkedin')))
    ) {
      results.push({ type: 'location', label: locClean });
      addedTypes.add('location');
    }
  }

  return results;
}

/**
 * Cleans section titles from emojis and leading markdown symbols
 */
function cleanSectionTitle(rawTitle: string): string {
  return rawTitle
    .replace(/^#+\s*/, '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/^[\d.\s]+/, '')
    .trim();
}

/**
 * Parses raw skills text into typed SkillCategory array, cleanly breaking embedded sub-categories and stripping markdown artifacts.
 */
function parseSkillGroups(rawContent: string): SkillCategory[] {
  const lines = rawContent.split(/\r?\n/);
  const groups: SkillCategory[] = [];
  let currentGroup: SkillCategory | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Heading style: ### Category Name
    if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
      const categoryName = cleanMarkdownFormatting(trimmed.replace(/^#+\s*/, ''));
      currentGroup = { category: categoryName, skills: [] };
      groups.push(currentGroup);
      continue;
    }

    // Check if line contains one or more embedded category patterns, supporting Unicode characters (e.g. Á, É, Í, Ó, Ú, Ü, Ä, Ö, etc.)
    const categoryTokens = trimmed.split(/(?:^|(?<=[,\s]))(?:\*{0,2})([\p{Lu}\p{L}][\p{L}0-9\s&/\\-]{2,35}?)(?:\*{0,2}):\s*/u);

    if (categoryTokens.length > 1) {
      // We found structured category:skills segments
      for (let i = 1; i < categoryTokens.length; i += 2) {
        const catName = cleanMarkdownFormatting(categoryTokens[i]).replace(/:$/, '').trim();
        const skillsRaw = categoryTokens[i + 1] || '';
        const skills = skillsRaw
          .split(/[,•|·;]/)
          .map(cleanMarkdownFormatting)
          .filter((s) => s.length > 0 && !s.toLowerCase().startsWith('category') && s !== '-');

        if (catName && (skills.length > 0 || !groups.some((g) => g.category === catName))) {
          groups.push({
            category: catName,
            skills
          });
        }
      }
      continue;
    }

    // Bullet style: - **Languages:** JavaScript, TypeScript
    const bulletMatch = trimmed.match(/^[-*•]\s*(?:\*\*(.*?)\*\*|(.*?)):?\s*(.*)$/);
    if (bulletMatch) {
      const category = cleanMarkdownFormatting(bulletMatch[1] || bulletMatch[2] || '');
      const rawSkills = bulletMatch[3] !== undefined ? bulletMatch[3] : '';
      const skills = rawSkills
        .split(/[,•|·;]/)
        .map(cleanMarkdownFormatting)
        .filter((s) => s.length > 0 && s !== '-');

      if (category || skills.length > 0) {
        groups.push({ category: category || 'Technical Skills', skills });
      }
      continue;
    }

    // Comma-separated list without explicit category
    const looseSkills = trimmed
      .split(/[,•|·;]/)
      .map(cleanMarkdownFormatting)
      .filter((s) => s.length > 0 && s !== '-');

    if (looseSkills.length > 0) {
      if (currentGroup) {
        currentGroup.skills.push(...looseSkills);
      } else {
        currentGroup = { category: 'Core Skills & Competencies', skills: looseSkills };
        groups.push(currentGroup);
      }
    }
  }

  // Deduplicate and clean
  return groups.map((g) => ({
    category: g.category.trim() || 'Core Competencies',
    skills: Array.from(new Set(g.skills.map(cleanMarkdownFormatting).filter(Boolean)))
  }));
}

function cleanEmptyMarkdownLinks(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(\s*\)/g, '')
    .replace(/\|\s*(?:\d{4}|present|presente|actual|current).*$/i, '')
    .replace(/^\*+|\*+$/g, '')
    .replace(/\s*•\s*•\s*/g, ' • ')
    .replace(/^\s*•\s*|\s*•\s*$/g, '')
    .trim();
}

/**
 * Parses raw experience/projects text into typed ExperienceItem array.
 * If isProjects is true, date and location are strictly omitted (not work experiences),
 * and markdown links [Title](url) in headings and subtitles are fully preserved.
 */
function parseExperienceItems(rawContent: string, isProjects: boolean = false): ExperienceItem[] {
  const lines = rawContent.split(/\r?\n/);
  const items: ExperienceItem[] = [];
  let currentItem: ExperienceItem | null = null;

  function flush() {
    if (
      currentItem &&
      (currentItem.company ||
        currentItem.role ||
        currentItem.bullets.length > 0 ||
        currentItem.location ||
        currentItem.date)
    ) {
      items.push(currentItem);
      currentItem = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ');
    const isHeading = trimmed.startsWith('### ') || trimmed.startsWith('#### ');
    const isBoldHeader =
      trimmed.startsWith('**') &&
      (trimmed.includes('|') || currentItem === null || (currentItem && currentItem.bullets.length > 0));

    if (isHeading || isBoldHeader) {
      flush();

      const cleanLine = trimmed.replace(/^#+\s*/, '').trim();
      const rawParts = cleanLine.split('|');

      const companyPart = cleanMarkdownFormatting(rawParts[0]);
      let rolePart = rawParts.slice(1).join(' | ').trim() || undefined;
      let locationPart: string | undefined = undefined;

      if (isProjects) {
        // Personal projects do not have physical locations or employment tenure dates
        const cleanedRole = rolePart ? cleanEmptyMarkdownLinks(rolePart) : undefined;
        currentItem = {
          company: companyPart,
          location: undefined,
          role: cleanedRole,
          date: undefined,
          bullets: []
        };
      } else {
        const parts = cleanLine.split('|').map(cleanMarkdownFormatting);
        rolePart = parts[1] || undefined;
        locationPart = parts[2] || undefined;

        if (
          rolePart &&
          (rolePart.toLowerCase().includes('remoto') ||
            rolePart.toLowerCase().includes('remote') ||
            rolePart.includes(','))
        ) {
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
      }
    } else if (isBullet) {
      // Strip leading bullet marker without removing markdown bold (**) or links ([...](...))
      const bulletText = trimmed.replace(/^(?:[-*•·]|\*(?!\*))\s*/, '').trim();
      if (!currentItem) {
        currentItem = {
          company: '',
          bullets: []
        };
      }
      if (bulletText) {
        currentItem.bullets.push(bulletText);
      }
    } else if (currentItem) {
      if (isProjects) {
        // Project subtitle / links / stack line without accidental dates
        const cleanSub = cleanEmptyMarkdownLinks(trimmed);
        if (cleanSub) {
          currentItem.role = currentItem.role ? `${currentItem.role} • ${cleanSub}` : cleanSub;
        }
      } else {
        const parts = trimmed.split('|').map(cleanMarkdownFormatting);

        for (const p of parts) {
          const cleanPart = p.trim();
          if (/\d{4}|present|presente|actual/i.test(cleanPart)) {
            currentItem.date = cleanPart;
          } else if (/remot[eo]|hybrid|h[íi]brido|onsite|presencial|,/i.test(cleanPart)) {
            currentItem.location = cleanPart;
          } else if (!currentItem.role) {
            currentItem.role = cleanPart;
          }
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
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('---')) continue;

    // Check if multiple items are joined on a single line with bullets (• or · or ;)
    // e.g. 'API Development Apigee · 2024 • API Documentation · 2024 • Leadership & Team Mgmt · 2023'
    if (trimmed.includes('•') || trimmed.includes('·') || (trimmed.includes(';') && !trimmed.includes('&'))) {
      const subParts = trimmed.split(/\s*[•;]\s*/).filter(Boolean);
      if (subParts.length > 1) {
        for (const part of subParts) {
          const cleanPart = part.replace(/^(?:[-•·]|\*(?!\*))\s*/, '').trim();
          if (cleanPart) {
            items.push(cleanPart);
          }
        }
        continue;
      }
    }

    const cleanLine = trimmed.replace(/^(?:[-•·]|\*(?!\*))\s*/, '').trim();
    if (cleanLine) {
      items.push(cleanLine);
    }
  }

  return items;
}

/**
 * Calibrates natural language descriptions into standard CEFR levels (A1 -> C2, Native).
 */
export function calibrateCEFRLevel(text: string): { level: CEFRLevel; displayLevel: string } {
  const lower = text.toLowerCase().trim();

  // 1. Native Checks
  if (
    lower.includes('native') ||
    lower.includes('nativo') ||
    lower.includes('nativa') ||
    lower.includes('muttersprache') ||
    lower.includes('maternelle') ||
    lower.includes('madrelingua') ||
    lower.includes('mother tongue')
  ) {
    return { level: 'Native', displayLevel: 'Native' };
  }

  // 2. Explicit CEFR Tags (C2, C1, B2, B1, A2, A1)
  if (/\bc2\b/i.test(lower)) {
    return { level: 'C2', displayLevel: 'C2 • Mastery' };
  }
  if (/\bc1\b/i.test(lower)) {
    return { level: 'C1', displayLevel: 'C1 • Advanced' };
  }
  if (/\bb2\b/i.test(lower)) {
    return { level: 'B2', displayLevel: 'B2 • Upper Intermediate' };
  }
  if (/\bb1\b/i.test(lower)) {
    return { level: 'B1', displayLevel: 'B1 • Intermediate' };
  }
  if (/\ba2\b/i.test(lower)) {
    return { level: 'A2', displayLevel: 'A2 • Elementary' };
  }
  if (/\ba1\b/i.test(lower)) {
    return { level: 'A1', displayLevel: 'A1 • Beginner' };
  }

  // 3. Descriptive / Qualitative Level Mappings
  if (lower.includes('bilingual') || lower.includes('bilingüe') || lower.includes('proficient') || lower.includes('mastery') || lower.includes('verhandlungssicher')) {
    return { level: 'C2', displayLevel: 'C2 • Mastery / Bilingual' };
  }
  if (lower.includes('advanced') || lower.includes('avanzado') || lower.includes('fluent') || lower.includes('fluido') || lower.includes('fließend') || lower.includes('courant') || lower.includes('full professional')) {
    return { level: 'C1', displayLevel: 'C1 • Advanced' };
  }
  if (lower.includes('upper intermediate') || lower.includes('intermedio alto') || lower.includes('intermedio-alto') || lower.includes('professional working') || lower.includes('competente')) {
    return { level: 'B2', displayLevel: 'B2 • Upper Intermediate' };
  }
  if (lower.includes('intermediate') || lower.includes('intermedio') || lower.includes('intermédiaire') || lower.includes('mittelstufe') || lower.includes('working proficiency') || lower.includes('conversacional') || lower.includes('conversational')) {
    return { level: 'B1', displayLevel: 'B1 • Intermediate' };
  }
  if (lower.includes('elementary') || lower.includes('básico') || lower.includes('basico') || lower.includes('grundkenntnisse') || lower.includes('élémentaire') || lower.includes('limited')) {
    return { level: 'A2', displayLevel: 'A2 • Elementary' };
  }
  if (lower.includes('beginner') || lower.includes('principiante') || lower.includes('anfänger') || lower.includes('débutant') || lower.includes('basic')) {
    return { level: 'A1', displayLevel: 'A1 • Beginner' };
  }

  // Default fallback
  return { level: 'B2', displayLevel: 'B2 • Professional Working' };
}

/**
 * Parses raw language section markdown into structured LanguageItem array with calibrated CEFR levels.
 */
export function parseLanguageItems(rawContent: string): LanguageItem[] {
  const lines = rawContent.split(/\r?\n/);
  const items: LanguageItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Remove leading bullet marker (- , * , •) without stripping first asterisk of **bold**
    const cleanLine = trimmed.replace(/^(?:[-•·]|\*(?!\*))\s*/, '').trim();

    let langName = '';
    let rawLevel = '';

    const colonMatch = cleanLine.match(/^\*{0,2}([^:*–—(]+)\*{0,2}\s*[:*–—]\s*(.+)$/);
    const parenMatch = cleanLine.match(/^\*{0,2}([^:(]+)\*{0,2}\s*\(([^)]+)\)$/);

    if (colonMatch) {
      langName = cleanMarkdownFormatting(colonMatch[1]);
      rawLevel = cleanMarkdownFormatting(colonMatch[2]);
    } else if (parenMatch) {
      langName = cleanMarkdownFormatting(parenMatch[1]);
      rawLevel = cleanMarkdownFormatting(parenMatch[2]);
    } else {
      const parts = cleanLine.split(/\s*[-–—|]\s*/);
      if (parts.length >= 2) {
        langName = cleanMarkdownFormatting(parts[0]);
        rawLevel = cleanMarkdownFormatting(parts.slice(1).join(' '));
      } else {
        langName = cleanMarkdownFormatting(cleanLine);
        rawLevel = 'Professional Working';
      }
    }

    if (langName) {
      const { level, displayLevel } = calibrateCEFRLevel(rawLevel || langName);
      items.push({
        name: langName,
        level,
        displayLevel: level === 'Native' ? 'Native' : displayLevel,
        raw: cleanLine
      });
    }
  }

  return items;
}

/**
 * Main parser: transforms Markdown string to structured CVData object
 */
export function parseCvMarkdownToData(rawMarkdown: string): CVData {
  if (!rawMarkdown || !rawMarkdown.trim() || rawMarkdown.trim() === '#') {
    return {
      name: '',
      title: '',
      contacts: [],
      summary: '',
      experience: [],
      education: [],
      skillGroups: [],
      languages: [],
      languageItems: [],
      projects: [],
      sections: []
    };
  }

  const lines = rawMarkdown.split(/\r?\n/);

  // Skip preamble / instructions
  let startIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      (line.startsWith('# ') || line === '#') &&
      !line.toLowerCase().includes('instrucciones') &&
      !line.toLowerCase().includes('instructions') &&
      !line.toLowerCase().includes('dossier') &&
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
  const headerContactText: string[] = [];
  const sections: CVSection[] = [];

  let lineIdx = 0;
  let foundH1 = false;

  // 1. Extract Name from Top Header or Search
  while (lineIdx < cvLines.length) {
    const line = cvLines[lineIdx].trim();
    if (line.startsWith('# ') || line === '#') {
      const raw = line.replace(/^#\s*/, '').trim();
      const clean = cleanMarkdownFormatting(raw);
      if (
        clean &&
        !clean.toLowerCase().includes('dossier') &&
        !clean.toLowerCase().includes('candidate full name') &&
        !clean.toLowerCase().includes('master career')
      ) {
        name = clean;
      }
      lineIdx++;
      foundH1 = true;
      break;
    }
    // If we encounter a section header before any H1, stop scanning so sections aren't consumed
    if (line.startsWith('## ')) {
      break;
    }
    lineIdx++;
  }

  // If no H1 line was found, rewind lineIdx to 0 so all lines and sections are parsed
  if (!foundH1) {
    lineIdx = 0;
    const nameMatch = rawMarkdown.match(/(?:Nombre Completo|Full Name|Candidate Name):\*{0,2}\s*\[?([^\]\r\n*]+)\]?/i);
    if (nameMatch) {
      const clean = cleanMarkdownFormatting(nameMatch[1]);
      if (!clean.toLowerCase().includes('candidate') && !clean.toLowerCase().includes('tu nombre')) {
        name = clean;
      }
    }
    if (!name && cvLines.length > 0) {
      for (let i = 0; i < Math.min(cvLines.length, 5); i++) {
        const l = cvLines[i].trim();
        if (!l || l.startsWith('#') || l.startsWith('---') || l.startsWith('*') || l.startsWith('-')) continue;
        if (!l.includes('@') && !l.includes('http') && !l.includes('|') && l.length >= 2 && l.length <= 50) {
          name = cleanMarkdownFormatting(l);
          if (i === 0) {
            lineIdx = 1;
          }
          break;
        }
      }
    }
  }

  // 2. Extract Subtitle / Role & Header Contacts
  while (lineIdx < cvLines.length) {
    const line = cvLines[lineIdx].trim();
    if (line.startsWith('## ')) {
      break;
    }
    if (line.startsWith('---')) {
      lineIdx++;
      continue;
    }

    // Check if line is professional title: **Frontend Engineer | React Specialist**
    if (!title && !line.includes('@') && !line.includes('http') && !line.includes('linkedin.com') && !line.includes('github.com')) {
      const cleanCandidate = cleanMarkdownFormatting(line);
      const isContactPattern = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}/.test(line);
      if (
        cleanCandidate &&
        cleanCandidate !== name &&
        !isContactPattern &&
        cleanCandidate.length <= 100 &&
        !cleanCandidate.toLowerCase().includes('dossier') &&
        !cleanCandidate.toLowerCase().includes('curriculum') &&
        !cleanCandidate.toLowerCase().includes('europass') &&
        !cleanCandidate.toLowerCase().includes('instructions') &&
        (line.startsWith('*') || line.startsWith('**') || line.endsWith('**') || line.endsWith('*') || cleanCandidate.includes('|') || !cleanCandidate.includes(','))
      ) {
        title = cleanCandidate;
        lineIdx++;
        continue;
      }
    } else if (line.length > 0) {
      headerContactText.push(line);
    }
    lineIdx++;
  }

  // 3. Sections Parser
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

      const type: SectionType = classifySectionType(cleanTitle);

      currentSec = {
        id: `sec-${sections.length}-${type}`,
        type,
        title: cleanTitle,
        rawContent: ''
      };
    } else if (trimmed.startsWith('---')) {
      // separator between blocks within section
    } else if (currentSec) {
      secContent.push(line);
    }
    lineIdx++;
  }
  flushSection();

  // Extract contacts from header and entire markdown document (including personal info section)
  const fullTextToScan = [headerContactText.join('\n'), rawMarkdown].join('\n');
  const contacts = extractContactsFromBlock(fullTextToScan);



  // If title wasn't found in header, inspect personal info section
  if (!title) {
    const titleMatch = rawMarkdown.match(/(?:Primary Professional Title|Target Role|Target Position|Title|Cargo|Headline|Puesto):\*{0,2}\s*\[?([^\]\r\n*]+)\]?/i);
    if (titleMatch) {
      const clean = cleanMarkdownFormatting(titleMatch[1]);
      if (!clean.toLowerCase().includes('specialization') && !clean.toLowerCase().includes('primary') && !clean.toLowerCase().includes('target role')) {
        title = clean;
      }
    }
  }

  // Extract optional European personal metadata
  let nationality: string | undefined;
  const natMatch = rawMarkdown.match(/(?:Nationality|Nacionalidad|Nationalität|Nationalité|Nazionalità):\*{0,2}\s*\[?([^\]\r\n*]+)\]?/i);
  if (natMatch) nationality = cleanMarkdownFormatting(natMatch[1]);

  let dateOfBirth: string | undefined;
  const dobMatch = rawMarkdown.match(/(?:Date of Birth|Fecha de Nacimiento|Geburtsdatum|Date de naissance|Data di nascita|DOB):\*{0,2}\s*\[?([^\]\r\n*]+)\]?/i);
  if (dobMatch) dateOfBirth = cleanMarkdownFormatting(dobMatch[1]);

  let drivingLicense: string | undefined;
  const dlMatch = rawMarkdown.match(/(?:Driving License|Driving Licence|Permiso de Conducir|Führerschein|Permis de conduire|Patente de guida):\*{0,2}\s*\[?([^\]\r\n*]+)\]?/i);
  if (dlMatch) drivingLicense = cleanMarkdownFormatting(dlMatch[1]);

  // Populate structured helper properties
  const cvData: CVData = {
    name: name || 'Candidate',
    title: title || 'Professional Specialist',
    contacts,
    sections,
    nationality,
    dateOfBirth,
    drivingLicense,
    languageItems: []
  };

  for (const s of sections) {
    if (s.type === 'summary') {
      cvData.summary = cvData.summary ? `${cvData.summary}\n\n${s.rawContent.trim()}` : s.rawContent.trim();
    }
    if (s.type === 'skills') {
      const parsedGroups = parseSkillGroups(s.rawContent);
      if (!cvData.skillGroups || cvData.skillGroups.length === 0) {
        cvData.skillGroups = parsedGroups;
      } else {
        const existingCategoryMap = new Map<string, SkillCategory>();
        cvData.skillGroups.forEach(g => existingCategoryMap.set(g.category.toLowerCase().trim(), g));
        for (const pg of parsedGroups) {
          const key = pg.category.toLowerCase().trim();
          if (existingCategoryMap.has(key)) {
            const existing = existingCategoryMap.get(key)!;
            const skillSet = new Set(existing.skills.map(sk => sk.toLowerCase().trim()));
            for (const sk of pg.skills) {
              if (!skillSet.has(sk.toLowerCase().trim())) {
                existing.skills.push(sk);
                skillSet.add(sk.toLowerCase().trim());
              }
            }
          } else {
            cvData.skillGroups.push(pg);
            existingCategoryMap.set(key, pg);
          }
        }
      }
    }
    if (s.type === 'experience') {
      const parsedExp = parseExperienceItems(s.rawContent, false);
      cvData.experience = cvData.experience && cvData.experience.length > 0 ? [...cvData.experience, ...parsedExp] : parsedExp;
    }
    if (s.type === 'projects') {
      const parsedProj = parseExperienceItems(s.rawContent, true);
      cvData.projects = cvData.projects && cvData.projects.length > 0 ? [...cvData.projects, ...parsedProj] : parsedProj;
    }
    if (s.type === 'education') {
      const items = parseListItems(s.rawContent);
      cvData.education = cvData.education && cvData.education.length > 0 ? [...cvData.education, ...items] : items;
    }
    if (s.type === 'languages') {
      const items = parseListItems(s.rawContent);
      cvData.languages = cvData.languages && cvData.languages.length > 0 ? [...cvData.languages, ...items] : items;
      const langItems = parseLanguageItems(s.rawContent);
      cvData.languageItems = cvData.languageItems && cvData.languageItems.length > 0 ? [...cvData.languageItems, ...langItems] : langItems;
    }
    if (s.type === 'generic' && s.rawContent && s.rawContent.trim()) {
      if (!cvData.customSections) cvData.customSections = [];
      const lower = s.title.toLowerCase();
      let presetType: CustomSectionPresetType = 'custom';
      if (/certif|licen/i.test(lower)) presetType = 'certifications';
      else if (/award|premio|honor|logro|reconocim/i.test(lower)) presetType = 'awards';
      else if (/publi|paper|art[ií]cul|patent/i.test(lower)) presetType = 'publications';
      else if (/volunt|comunit|social/i.test(lower)) presetType = 'volunteering';
      else if (/conferen|talk|charla|ponencia|workshop/i.test(lower)) presetType = 'conferences';

      const items = parseListItems(s.rawContent);
      cvData.customSections.push({
        id: s.id || `custom_${Date.now()}_${cvData.customSections.length}`,
        title: cleanMarkdownFormatting(s.title),
        presetType,
        items: items.length > 0 ? items : [s.rawContent.trim()]
      });
    }
  }

  return cvData;
}

