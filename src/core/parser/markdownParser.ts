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
    return { type: 'linkedin', label: clean, url };
  }

  // GitHub URL
  if (/github\.com\/[a-zA-Z0-9_-]+/i.test(clean)) {
    const match = clean.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
    const url = match ? (match[0].startsWith('http') ? match[0] : `https://${match[0]}`) : clean;
    return { type: 'github', label: clean, url };
  }

  // Phone
  if (/(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/.test(clean) && !/[a-zA-Z]{4,}/.test(clean)) {
    return { type: 'phone', label: clean };
  }

  // Location
  if (clean.includes(',') || /remoto|remote|colombia|mexico|spain|argentina|chile|peru|usa|canada|germany|france/i.test(clean)) {
    return { type: 'location', label: clean };
  }

  // Website / Portfolio
  if (/^https?:\/\//i.test(clean) || /\.[a-z]{2,3}(?:\/|$)/i.test(clean)) {
    const url = clean.startsWith('http') ? clean : `https://${clean}`;
    return { type: 'globe', label: clean, url };
  }

  return { type: 'text', label: clean };
}

/**
 * Extracts multiple discrete contacts from composite text blocks (e.g. headers with multiple dividers or bullet lists).
 */
export function extractContactsFromBlock(text: string): ContactItem[] {
  const results: ContactItem[] = [];
  const addedTypes = new Set<string>();

  // 1. Check for structured key-value pairs like '- **Email:** foo@bar.com'
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const kvMatch = trimmed.match(/^[-*•]?\s*\*{0,2}(Full Name|Nombre Completo|Primary Professional Title|Title|Cargo|Location|Ubicación|Email|Correo|Phone|Teléfono|WhatsApp|LinkedIn|GitHub|Portfolio|Portafolio|Website)(?:\s*\/[^*:]*)?:\*{0,2}\s*(.+)$/i);
    if (kvMatch) {
      const key = kvMatch[1].toLowerCase();
      const val = cleanMarkdownFormatting(kvMatch[2]);
      if (!val || val.startsWith('[')) continue;

      if (key.includes('email') || key.includes('correo')) {
        results.push({ type: 'email', label: val, url: `mailto:${val}` });
        addedTypes.add('email');
      } else if (key.includes('phone') || key.includes('tel') || key.includes('whatsapp')) {
        results.push({ type: 'phone', label: val });
        addedTypes.add('phone');
      } else if (key.includes('locat') || key.includes('ubicac')) {
        results.push({ type: 'location', label: val });
        addedTypes.add('location');
      } else if (key.includes('linkedin')) {
        const url = val.startsWith('http') ? val : `https://${val}`;
        results.push({ type: 'linkedin', label: val, url });
        addedTypes.add('linkedin');
      } else if (key.includes('github')) {
        const url = val.startsWith('http') ? val : `https://${val}`;
        results.push({ type: 'github', label: val, url });
        addedTypes.add('github');
      } else if (key.includes('portfol') || key.includes('web')) {
        const url = val.startsWith('http') ? val : `https://${val}`;
        results.push({ type: 'globe', label: val, url });
        addedTypes.add('globe');
      }
    }
  }

  // 2. Extract embedded entities from inline text (split by •, |, ·, \n)
  // Clean string and split on delimiters
  const rawParts = text
    .split(/[\r\n•|·\u00B7\u2022;]+/)
    .map(cleanMarkdownFormatting)
    .filter(Boolean);

  for (const part of rawParts) {
    // Check if the part has embedded email + phone + location lumped together
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
      results.push({ type: 'linkedin', label: linkedinMatch[0], url });
      addedTypes.add('linkedin');
    }
    if (githubMatch && !addedTypes.has('github')) {
      const url = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;
      results.push({ type: 'github', label: githubMatch[0], url });
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
      (locClean.includes(',') || /remoto|remote|colombia|mexico|spain|usa|chile|argentina|peru|germany|france/i.test(locClean))
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

    // Check if line contains one or more embedded category patterns, e.g.
    // '- **Frontend Stack:** Angular, React **Architecture:** Microfrontends'
    // or '- Frontend Stack: Angular, React.js, TypeScript'
    const categoryTokens = trimmed.split(/(?:^|(?<=[,\s]))(?:\*{0,2})([A-Z][A-Za-z0-9\s&/\\-]{2,30}?)(?:\*{0,2}):\s*/);

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

/**
 * Parses raw experience/projects text into typed ExperienceItem array
 */
function parseExperienceItems(rawContent: string): ExperienceItem[] {
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
      const parts = cleanLine.split('|').map(cleanMarkdownFormatting);

      const companyPart = parts[0] || '';
      let rolePart = parts[1] || undefined;
      let locationPart = parts[2] || undefined;

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
    } else if (isBullet) {
      const bulletText = cleanMarkdownFormatting(trimmed);
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
      const parts = trimmed.split('|').map(cleanMarkdownFormatting);

      for (const p of parts) {
        const cleanPart = p.trim();
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

    // Check if multiple items are joined on a single line with bullets (• or · or ;)
    // e.g. 'API Development Apigee · 2024 • API Documentation · 2024 • Leadership & Team Mgmt · 2023'
    if (trimmed.includes('•') || trimmed.includes('·') || trimmed.includes(';')) {
      const subParts = trimmed.split(/\s*[•;]\s*/).filter(Boolean);
      if (subParts.length > 1) {
        for (const part of subParts) {
          const cleanPart = cleanMarkdownFormatting(part);
          if (cleanPart) {
            items.push(cleanPart);
          }
        }
        continue;
      }
    }

    const cleanLine = cleanMarkdownFormatting(trimmed);
    if (cleanLine) {
      items.push(cleanLine);
    }
  }

  return items;
}

/**
 * Main parser: transforms Markdown string to structured CVData object
 */
export function parseCvMarkdownToData(rawMarkdown: string): CVData {
  if (!rawMarkdown) {
    return { name: '', title: '', contacts: [], sections: [] };
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
      break;
    }
    lineIdx++;
  }

  // 2. Extract Subtitle / Role & Header Contacts
  while (lineIdx < cvLines.length) {
    const line = cvLines[lineIdx].trim();
    if (line.startsWith('---') || line.startsWith('## ')) {
      break;
    }

    // Check if line is professional title: **Frontend Engineer | React Specialist**
    if (line.startsWith('**') && line.endsWith('**') && !title && !line.includes('@') && !line.includes('http')) {
      title = cleanMarkdownFormatting(line);
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
      } else if (
        upper.includes('EXPERIENCIA') ||
        upper.includes('EXPERIENCE') ||
        upper.includes('HISTORIAL') ||
        upper.includes('CAREER HISTORY') ||
        upper.includes('WORK HISTORY')
      ) {
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
      } else if (
        upper.includes('EDUCACI') ||
        upper.includes('EDUCATION') ||
        upper.includes('CERTIFICA') ||
        upper.includes('ACADEMIC')
      ) {
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

  // Extract contacts from header and entire markdown document (including personal info section)
  const fullTextToScan = [headerContactText.join('\n'), rawMarkdown].join('\n');
  const contacts = extractContactsFromBlock(fullTextToScan);

  // If candidate name wasn't found in H1, inspect personal info section
  if (!name) {
    const nameMatch = rawMarkdown.match(/(?:Nombre Completo|Full Name|Candidate Name):\*{0,2}\s*\[?([^\]\r\n*]+)\]?/i);
    if (nameMatch) {
      const clean = cleanMarkdownFormatting(nameMatch[1]);
      if (!clean.toLowerCase().includes('candidate') && !clean.toLowerCase().includes('tu nombre')) {
        name = clean;
      }
    }
  }

  // If title wasn't found in header, inspect personal info section
  if (!title) {
    const titleMatch = rawMarkdown.match(/(?:Primary Professional Title|Title|Cargo|Headline):\*{0,2}\s*\[?([^\]\r\n*]+)\]?/i);
    if (titleMatch) {
      const clean = cleanMarkdownFormatting(titleMatch[1]);
      if (!clean.toLowerCase().includes('specialization') && !clean.toLowerCase().includes('primary')) {
        title = clean;
      }
    }
  }

  // Populate structured helper properties
  const cvData: CVData = {
    name: name || 'Candidate',
    title: title || 'Professional Specialist',
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
