import { CVData } from '../../types/cv';
import { stripMarkdownFormatting } from './plainTextExporter';

/**
 * Escapes HTML characters for safe XML/HTML embedding.
 */
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Converts inline markdown formatting (**bold**, *italic*, [link](url)) to clean HTML tags.
 */
function inlineMarkdownToHtml(text: string): string {
  if (!text) return '';
  let res = escapeHtml(text);
  // Replace links [label](url)
  res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #0284c7; text-decoration: underline;">$1</a>');
  // Replace bold **text**
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Replace italic *text*
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
  return res;
}

/**
 * Generates an ATS-compliant Word document (.doc/.docx compatible)
 * structured with native Microsoft Office XML namespaces and clean typography.
 */
export function generateWordDocumentBlob(data: CVData): Blob {
  const primaryColor = '#0f172a';
  const accentColor = '#0284c7';
  const dividerColor = '#cbd5e1';

  let bodyContent = '';

  // 1. Header: Name and Title
  if (data.name) {
    bodyContent += `<h1 style="margin: 0 0 4pt 0; font-size: 22pt; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 0.5pt; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">${escapeHtml(data.name)}</h1>`;
  }
  if (data.title) {
    bodyContent += `<p style="margin: 0 0 8pt 0; font-size: 13pt; font-weight: bold; color: ${accentColor}; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">${escapeHtml(stripMarkdownFormatting(data.title))}</p>`;
  }

  // 2. Contacts
  if (data.contacts && data.contacts.length > 0) {
    const contactSpans = data.contacts.map((c) => {
      const cleanLabel = escapeHtml(stripMarkdownFormatting(c.label));
      if (c.url) {
        return `<a href="${escapeHtml(c.url)}" style="color: #475569; text-decoration: none;">${cleanLabel}</a>`;
      }
      return cleanLabel;
    });
    bodyContent += `<p style="margin: 0 0 14pt 0; font-size: 9.5pt; color: #475569;">${contactSpans.join(' &nbsp;•&nbsp; ')}</p>`;
  }

  // Section Header Generator
  const renderSectionHeader = (title: string) => `
    <table style="width: 100%; border-collapse: collapse; margin-top: 14pt; margin-bottom: 6pt;">
      <tr>
        <td style="border-bottom: 1.5pt solid ${accentColor}; padding-bottom: 2pt;">
          <span style="font-size: 11pt; font-weight: bold; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 0.5pt; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
            ${escapeHtml(title)}
          </span>
        </td>
      </tr>
    </table>
  `;

  // 3. Professional Summary
  if (data.summary && data.summary.trim()) {
    bodyContent += renderSectionHeader('Professional Summary');
    bodyContent += `<p style="margin: 0 0 8pt 0; font-size: 10pt; line-height: 1.4; color: #1e293b; text-align: justify;">${inlineMarkdownToHtml(data.summary.trim())}</p>`;
  }

  // 4. Skills
  if (data.skillGroups && data.skillGroups.length > 0) {
    bodyContent += renderSectionHeader('Core Competencies & Technical Skills');
    bodyContent += `<ul style="margin: 4pt 0 8pt 16pt; padding: 0; font-size: 10pt; line-height: 1.4; color: #1e293b;">`;
    for (const group of data.skillGroups) {
      const cat = escapeHtml(stripMarkdownFormatting(group.category || 'Competencies').replace(/[:*_\s]+$/, ''));
      const skls = (group.skills || [])
        .map((s) => escapeHtml(stripMarkdownFormatting(s).replace(/^[:*_\s]+/, '').replace(/[:*_\s]+$/, '')))
        .filter(Boolean)
        .join(', ');
      bodyContent += `<li style="margin-bottom: 3pt;"><strong>${cat}:</strong> ${skls}</li>`;
    }
    bodyContent += `</ul>`;
  }

  // 5. Professional Experience
  if (data.experience && data.experience.length > 0) {
    bodyContent += renderSectionHeader('Professional Experience');

    for (const exp of data.experience) {
      const comp = escapeHtml(stripMarkdownFormatting(exp.company || 'Organization'));
      const loc = exp.location ? escapeHtml(stripMarkdownFormatting(exp.location)) : '';
      const role = escapeHtml(stripMarkdownFormatting(exp.role || 'Specialist'));
      const date = exp.date ? escapeHtml(stripMarkdownFormatting(exp.date)) : '';

      bodyContent += `
        <table style="width: 100%; border-collapse: collapse; margin-top: 8pt; margin-bottom: 2pt;">
          <tr>
            <td style="font-size: 10.5pt; font-weight: bold; color: ${primaryColor}; text-align: left;">
              ${comp}${loc ? ` <span style="font-weight: normal; color: #64748b;">• ${loc}</span>` : ''}
            </td>
            <td style="font-size: 9.5pt; font-weight: bold; color: #475569; text-align: right;">
              ${date}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="font-size: 10pt; font-style: italic; color: ${accentColor}; padding-bottom: 2pt;">
              ${role}
            </td>
          </tr>
        </table>
        <ul style="margin: 2pt 0 6pt 16pt; padding: 0; font-size: 9.5pt; line-height: 1.35; color: #1e293b;">
      `;

      for (const b of exp.bullets || []) {
        const cleanBullet = b.replace(/^[-*•]\s*/, '');
        if (cleanBullet) {
          bodyContent += `<li style="margin-bottom: 2.5pt;">${inlineMarkdownToHtml(cleanBullet)}</li>`;
        }
      }

      bodyContent += `</ul>`;
    }
  }

  // 6. Featured Projects
  if (data.projects && data.projects.length > 0) {
    bodyContent += renderSectionHeader('Featured Projects');

    for (const proj of data.projects) {
      const name = escapeHtml(stripMarkdownFormatting(proj.company || 'Project'));
      const role = proj.role ? ` <span style="font-style: italic; color: #64748b;">(${escapeHtml(stripMarkdownFormatting(proj.role))})</span>` : '';
      const links: string[] = [];
      if (proj.demoUrl) links.push(`<a href="${escapeHtml(proj.demoUrl)}" style="color: ${accentColor};">Demo</a>`);
      if (proj.repoUrl) links.push(`<a href="${escapeHtml(proj.repoUrl)}" style="color: ${accentColor};">GitHub</a>`);
      const linkHtml = links.length > 0 ? ` &nbsp;[${links.join(' | ')}]` : '';

      bodyContent += `<p style="margin: 6pt 0 2pt 0; font-size: 10pt; font-weight: bold; color: ${primaryColor};">${name}${role}${linkHtml}</p>`;
      bodyContent += `<ul style="margin: 2pt 0 6pt 16pt; padding: 0; font-size: 9.5pt; line-height: 1.35; color: #1e293b;">`;
      for (const b of proj.bullets || []) {
        const cleanBullet = b.replace(/^[-*•]\s*/, '');
        if (cleanBullet) {
          bodyContent += `<li style="margin-bottom: 2pt;">${inlineMarkdownToHtml(cleanBullet)}</li>`;
        }
      }
      bodyContent += `</ul>`;
    }
  }

  // 7. Education & Certifications
  if ((data.education && data.education.length > 0) || (data.certifications && data.certifications.length > 0)) {
    bodyContent += renderSectionHeader('Education & Credentials');
    bodyContent += `<ul style="margin: 4pt 0 6pt 16pt; padding: 0; font-size: 9.5pt; line-height: 1.35; color: #1e293b;">`;
    for (const edu of data.education || []) {
      const cleanEdu = edu.replace(/^[-*•]\s*/, '');
      if (cleanEdu) bodyContent += `<li style="margin-bottom: 2pt;">${inlineMarkdownToHtml(cleanEdu)}</li>`;
    }
    for (const cert of data.certifications || []) {
      const cleanCert = cert.replace(/^[-*•]\s*/, '');
      if (cleanCert) bodyContent += `<li style="margin-bottom: 2pt;">${inlineMarkdownToHtml(cleanCert)}</li>`;
    }
    bodyContent += `</ul>`;
  }

  // 8. Languages
  if (data.languages && data.languages.length > 0) {
    bodyContent += renderSectionHeader('Languages');
    bodyContent += `<ul style="margin: 4pt 0 6pt 16pt; padding: 0; font-size: 9.5pt; line-height: 1.35; color: #1e293b;">`;
    for (const lang of data.languages) {
      const cleanLang = lang.replace(/^[-*•]\s*/, '');
      if (cleanLang) bodyContent += `<li style="margin-bottom: 2pt;">${inlineMarkdownToHtml(cleanLang)}</li>`;
    }
    bodyContent += `</ul>`;
  }

  const documentHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 210mm 297mm;
          margin: 18mm 18mm 18mm 18mm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: Calibri, 'Segoe UI', Arial, sans-serif;
          font-size: 10pt;
          line-height: 1.35;
          color: #1e293b;
        }
        strong {
          color: #0f172a;
        }
      </style>
    </head>
    <body>
      ${bodyContent}
    </body>
    </html>
  `;

  return new Blob([documentHtml], {
    type: 'application/msword;charset=utf-8;'
  });
}
