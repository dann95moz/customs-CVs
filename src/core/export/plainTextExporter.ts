import { CVData } from '../../types/cv';

/**
 * Strips inline markdown formatting (**bold**, *italic*, [link](url), `code`) from a string.
 */
export function stripMarkdownFormatting(text: string): string {
  if (!text) return '';
  return text
    // Replace markdown links [label](url) with "label (url)" or just label if same
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
      if (label.trim().toLowerCase() === url.trim().toLowerCase()) return label.trim();
      return `${label.trim()} (${url.trim()})`;
    })
    // Remove bold and italics
    .replace(/(\*\*|\*|__|_)(.*?)\1/g, '$2')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Clean up excessive whitespace
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Generates an ATS-compliant Plain Text (.txt) resume representation.
 * Designed for direct copy-pasting into legacy and modern ATS input boxes
 * (Workday, Taleo, Greenhouse, Lever, SAP SuccessFactors).
 */
export function generatePlainTextCv(data: CVData): string {
  const lines: string[] = [];
  const divider = '============================================================';
  const subDivider = '------------------------------------------------------------';

  // 1. Header (Candidate Name & Headline)
  if (data.name) {
    lines.push(data.name.toUpperCase());
  }
  if (data.title) {
    lines.push(stripMarkdownFormatting(data.title));
  }

  // 2. Contacts
  if (data.contacts && data.contacts.length > 0) {
    const contactParts = data.contacts
      .map((c) => {
        const cleanLabel = stripMarkdownFormatting(c.label);
        if (c.url && !cleanLabel.includes(c.url)) {
          return `${cleanLabel}: ${c.url}`;
        }
        return cleanLabel;
      })
      .filter(Boolean);
    if (contactParts.length > 0) {
      lines.push(contactParts.join(' | '));
    }
  }

  // 3. Professional Summary
  if (data.summary && data.summary.trim()) {
    lines.push('');
    lines.push(divider);
    lines.push('PROFESSIONAL SUMMARY');
    lines.push(divider);
    lines.push(stripMarkdownFormatting(data.summary.trim()));
  }

  // 4. Skills
  if (data.skillGroups && data.skillGroups.length > 0) {
    lines.push('');
    lines.push(divider);
    lines.push('CORE SKILLS & TECHNICAL COMPETENCIES');
    lines.push(divider);
    for (const group of data.skillGroups) {
      const cat = stripMarkdownFormatting(group.category || 'Competencies').replace(/[:*_\s]+$/, '');
      const skls = (group.skills || [])
        .map((s) => stripMarkdownFormatting(s).replace(/^[:*_\s]+/, '').replace(/[:*_\s]+$/, ''))
        .filter(Boolean)
        .join(', ');
      lines.push(`• ${cat}: ${skls}`);
    }
  }

  // 5. Professional Experience
  if (data.experience && data.experience.length > 0) {
    lines.push('');
    lines.push(divider);
    lines.push('PROFESSIONAL EXPERIENCE');
    lines.push(divider);

    data.experience.forEach((exp, idx) => {
      if (idx > 0) lines.push('');
      const comp = stripMarkdownFormatting(exp.company || 'Organization');
      const loc = exp.location ? ` | ${stripMarkdownFormatting(exp.location)}` : '';
      const role = stripMarkdownFormatting(exp.role || 'Specialist');
      const date = exp.date ? ` | ${stripMarkdownFormatting(exp.date)}` : '';

      lines.push(`${comp}${loc}`);
      lines.push(`${role}${date}`);
      lines.push(subDivider);

      for (const b of exp.bullets || []) {
        const cleanBullet = stripMarkdownFormatting(b.replace(/^[-*•]\s*/, ''));
        if (cleanBullet) {
          lines.push(`  • ${cleanBullet}`);
        }
      }
    });
  }

  // 6. Featured Projects
  if (data.projects && data.projects.length > 0) {
    lines.push('');
    lines.push(divider);
    lines.push('FEATURED PROJECTS');
    lines.push(divider);

    data.projects.forEach((proj, idx) => {
      if (idx > 0) lines.push('');
      const name = stripMarkdownFormatting(proj.company || 'Project');
      const role = proj.role ? ` (${stripMarkdownFormatting(proj.role)})` : '';
      const links: string[] = [];
      if (proj.demoUrl) links.push(`Demo: ${proj.demoUrl}`);
      if (proj.repoUrl) links.push(`Repo: ${proj.repoUrl}`);
      const linkText = links.length > 0 ? ` [${links.join(' | ')}]` : '';

      lines.push(`${name}${role}${linkText}`);
      for (const b of proj.bullets || []) {
        const cleanBullet = stripMarkdownFormatting(b.replace(/^[-*•]\s*/, ''));
        if (cleanBullet) {
          lines.push(`  • ${cleanBullet}`);
        }
      }
    });
  }

  // 7. Education & Certifications
  if ((data.education && data.education.length > 0) || (data.certifications && data.certifications.length > 0)) {
    lines.push('');
    lines.push(divider);
    lines.push('EDUCATION & CERTIFICATIONS');
    lines.push(divider);

    for (const edu of data.education || []) {
      const cleanEdu = stripMarkdownFormatting(edu.replace(/^[-*•]\s*/, ''));
      if (cleanEdu) lines.push(`• ${cleanEdu}`);
    }

    for (const cert of data.certifications || []) {
      const cleanCert = stripMarkdownFormatting(cert.replace(/^[-*•]\s*/, ''));
      if (cleanCert) lines.push(`• ${cleanCert}`);
    }
  }

  // 8. Languages
  if (data.languages && data.languages.length > 0) {
    lines.push('');
    lines.push(divider);
    lines.push('LANGUAGES');
    lines.push(divider);
    for (const lang of data.languages) {
      const cleanLang = stripMarkdownFormatting(lang.replace(/^[-*•]\s*/, ''));
      if (cleanLang) lines.push(`• ${cleanLang}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}
