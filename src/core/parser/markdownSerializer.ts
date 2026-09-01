import { CVData } from '../../types/cv';

/**
 * Serializes a structured CVData object back into standardized Markdown.
 * Principle: Single Responsibility (S) - focuses exclusively on converting CV model to Markdown text.
 */
export function serializeCvDataToMarkdown(data: CVData): string {
  const hasContent = Boolean(
    (data.name && data.name.trim()) ||
    (data.title && data.title.trim()) ||
    (data.contacts && data.contacts.length > 0) ||
    (data.summary && data.summary.trim()) ||
    (data.skillGroups && data.skillGroups.length > 0) ||
    (data.experience && data.experience.length > 0) ||
    (data.education && data.education.length > 0) ||
    (data.languages && data.languages.length > 0) ||
    (data.projects && data.projects.length > 0) ||
    (data.sections && data.sections.length > 0)
  );

  if (!hasContent) {
    return '';
  }

  const parts: string[] = [];

  // Name
  parts.push(`# ${data.name || ''}`);

  // Title
  if (data.title) {
    parts.push(`**${data.title}**  `);
  }

  // Contacts
  if (data.contacts && data.contacts.length > 0) {
    const contactStrings = data.contacts.map(c => {
      if (c.url) {
        return `[${c.label}](${c.url})`;
      }
      return c.label;
    });
    parts.push(contactStrings.join(' • '));
  }

  // Helper to get formatted section title preserving user's edit or emoji prefix
  const getSectionTitle = (type: string, defaultTitle: string, defaultEmoji = '') => {
    const custom = data.sectionTitles?.[type] || data.sections?.find(s => s.type === type)?.title;
    if (custom && custom.trim()) {
      return custom.trim();
    }
    return defaultEmoji ? `${defaultEmoji} ${defaultTitle}` : defaultTitle;
  };

  // Summary
  if (data.summary && data.summary.trim()) {
    parts.push('\n---\n');
    parts.push(`## ${getSectionTitle('summary', 'PROFESSIONAL SUMMARY & PITCH', '🎯')}`);
    parts.push(data.summary.trim());
  }

  // Skills
  if (data.skillGroups && data.skillGroups.length > 0) {
    parts.push('\n---\n');
    parts.push(`## ${getSectionTitle('skills', 'CORE SKILLS & COMPETENCIES', '🛠️')}`);
    for (const group of data.skillGroups) {
      const cat = group.category ? group.category.trim() : '';
      const skl = group.skills && group.skills.length > 0 ? group.skills.join(', ') : '';
      parts.push(`- **${cat}:** ${skl}`);
    }
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    parts.push('\n---\n');
    parts.push(`## ${getSectionTitle('experience', 'CAREER HISTORY & KEY ACHIEVEMENTS', '💼')}\n`);
    const expItemsFormatted = data.experience.map(exp => {
      const company = exp.company || '';
      const role = exp.role || '';
      const headerLine = `### **${company}**${exp.location ? ` | ${exp.location}` : ''}`;
      const subHeaderLine = `*${role}*${exp.date ? ` | **${exp.date}**` : ''}`;
      const bullets = (exp.bullets || []).map(b => (b.startsWith('- ') ? b : `- ${b}`)).join('\n');
      return `${headerLine}\n${subHeaderLine}\n${bullets}`;
    });
    parts.push(expItemsFormatted.join('\n\n---\n\n'));
  }

  // Projects & Extras
  if (data.projects && data.projects.length > 0) {
    parts.push('\n---\n');
    parts.push(`## ${getSectionTitle('projects', 'PROJECTS & EXTRAS', '🚀')}\n`);
    const projItemsFormatted = data.projects.map(proj => {
      const company = proj.company || '';
      const role = proj.role || '';
      const headerLine = `### **${company}**${proj.location ? ` | ${proj.location}` : ''}`;
      const subHeaderLine = `*${role}*${proj.date ? ` | **${proj.date}**` : ''}`;
      const bullets = (proj.bullets || [])
        .filter(b => Boolean(b && b.trim()))
        .map(b => (b.startsWith('- ') ? b : `- ${b}`))
        .join('\n');
      return `${headerLine}\n${subHeaderLine}${bullets ? `\n${bullets}` : ''}`;
    });
    parts.push(projItemsFormatted.join('\n\n---\n\n'));
  }

  // Education
  if (data.education && data.education.length > 0) {
    parts.push('\n---\n');
    parts.push(`## ${getSectionTitle('education', 'EDUCATION & CERTIFICATIONS', '🎓')}`);
    for (const edu of data.education) {
      let cleanEdu = edu.replace(/^(?:[-•]\s*|\*\s+)/, '');
      if (/^\*?[^*]+\*\*/.test(cleanEdu)) {
        cleanEdu = cleanEdu.replace(/^\*?([^*]+)\*\*/, '**$1**');
      }
      parts.push(`- ${cleanEdu}`);
    }
  }

  // Languages
  if (data.languages && data.languages.length > 0) {
    parts.push('\n---\n');
    parts.push(`## ${getSectionTitle('languages', 'LANGUAGES', '🌐')}`);
    for (const lang of data.languages) {
      let cleanLang = lang.replace(/^(?:[-•]\s*|\*\s+)/, '');
      if (/^\*?[^*]+\*\*/.test(cleanLang)) {
        cleanLang = cleanLang.replace(/^\*?([^*]+)\*\*/, '**$1**');
      }
      parts.push(`- ${cleanLang}`);
    }
  }


  // Dynamic Custom Sections (Certifications, Awards, Publications, Volunteering, etc.)
  if (data.customSections && data.customSections.length > 0) {
    for (const custom of data.customSections) {
      if (custom.title && custom.items && custom.items.length > 0) {
        parts.push('\n---\n');
        let iconPrefix = '';
        if (custom.presetType === 'certifications') iconPrefix = '🏆 ';
        else if (custom.presetType === 'awards') iconPrefix = '🎖️ ';
        else if (custom.presetType === 'publications') iconPrefix = '📚 ';
        else if (custom.presetType === 'volunteering') iconPrefix = '🤝 ';
        else if (custom.presetType === 'conferences') iconPrefix = '🎤 ';
        else iconPrefix = '📌 ';

        const cleanTitle = custom.title.replace(/^[🏆🎖️📚🤝🎤📌\s]+/, '').trim();
        parts.push(`## ${iconPrefix}${cleanTitle.toUpperCase()}`);
        for (const item of custom.items) {
          let cleanItem = item.replace(/^(?:[-•]\s*|\*\s+)/, '');
          if (cleanItem.trim()) {
            parts.push(`- ${cleanItem}`);
          }
        }
      }
    }
  }

  return parts.join('\n') + '\n';
}

