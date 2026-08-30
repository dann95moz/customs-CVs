import { CVData } from '../../types/cv';

/**
 * Serializes a structured CVData object back into standardized Markdown.
 * Principle: Single Responsibility (S) - focuses exclusively on converting CV model to Markdown text.
 */
export function serializeCvDataToMarkdown(data: CVData): string {
  const parts: string[] = [];

  // Name
  parts.push(`# ${data.name || 'CANDIDATE FULL NAME'}`);

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

  // Summary
  if (data.summary && data.summary.trim()) {
    parts.push('\n---\n');
    parts.push('## 🎯 PROFESSIONAL SUMMARY & PITCH');
    parts.push(data.summary.trim());
  }

  // Skills
  if (data.skillGroups && data.skillGroups.length > 0) {
    parts.push('\n---\n');
    parts.push('## 🛠️ MASTER TECH STACK & COMPETENCIES');
    for (const group of data.skillGroups) {
      const cat = group.category ? group.category.trim() : 'Specialized Domain';
      const skl = group.skills && group.skills.length > 0 ? group.skills.join(', ') : '';
      parts.push(`- **${cat}:** ${skl}`);
    }
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    parts.push('\n---\n');
    parts.push('## 💼 CAREER HISTORY & KEY ACHIEVEMENTS\n');
    const expItemsFormatted = data.experience.map(exp => {
      const headerLine = `### **${exp.company || 'Company'}**${exp.location ? ` | ${exp.location}` : ''}`;
      const subHeaderLine = `*${exp.role || 'Role'}*${exp.date ? ` | **${exp.date}**` : ''}`;
      const bullets = (exp.bullets || []).map(b => (b.startsWith('- ') ? b : `- ${b}`)).join('\n');
      return `${headerLine}\n${subHeaderLine}\n${bullets}`;
    });
    parts.push(expItemsFormatted.join('\n\n---\n\n'));
  }

  // Projects & Extras
  if (data.projects && data.projects.length > 0) {
    parts.push('\n---\n');
    parts.push('## 🚀 PROJECTS & EXTRAS\n');
    const projItemsFormatted = data.projects.map(proj => {
      const headerLine = `### **${proj.company || 'Project'}**${proj.location ? ` | ${proj.location}` : ''}`;
      const subHeaderLine = `*${proj.role || 'Project'}*${proj.date ? ` | **${proj.date}**` : ''}`;
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
    parts.push('## 🎓 EDUCATION & CERTIFICATIONS');
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
    parts.push('## 🌐 LANGUAGES');
    for (const lang of data.languages) {
      let cleanLang = lang.replace(/^(?:[-•]\s*|\*\s+)/, '');
      if (/^\*?[^*]+\*\*/.test(cleanLang)) {
        cleanLang = cleanLang.replace(/^\*?([^*]+)\*\*/, '**$1**');
      }
      parts.push(`- ${cleanLang}`);
    }
  }

  return parts.join('\n') + '\n';
}
