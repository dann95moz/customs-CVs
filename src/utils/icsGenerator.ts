/**
 * RFC 5545 iCalendar (.ics) event generator for job interview scheduling.
 * Zero-dependency, pure client-side utility.
 */

export interface InterviewEventOptions {
  companyName: string;
  targetRole: string;
  startDate: Date;
  durationMinutes?: number;
  meetingLink?: string;
  notes?: string;
  interviewerName?: string;
}

/**
 * Formats a JS Date into iCalendar UTC format (YYYYMMDDTHHmmssZ).
 */
const formatIcsDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

/**
 * Escapes characters that have special meaning in iCalendar text lines.
 */
const escapeIcsText = (text: string): string => {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
};

/**
 * Builds the RFC 5545 .ics text string.
 */
export const buildInterviewIcsContent = ({
  companyName,
  targetRole,
  startDate,
  durationMinutes = 45,
  meetingLink,
  notes,
  interviewerName,
}: InterviewEventOptions): string => {
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
  const now = new Date();
  const uid = `interview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@cv-studio-pro`;

  const summary = `Interview: ${targetRole} @ ${companyName}`;

  const descriptionParts: string[] = [
    `Job Interview for ${targetRole} at ${companyName}.`,
  ];
  if (interviewerName?.trim()) {
    descriptionParts.push(`Interviewer / Contact: ${interviewerName.trim()}`);
  }
  if (meetingLink?.trim()) {
    descriptionParts.push(`Meeting Link: ${meetingLink.trim()}`);
  }
  if (notes?.trim()) {
    descriptionParts.push(`\nNotes:\n${notes.trim()}`);
  }
  descriptionParts.push('\nScheduled with CV Studio Pro');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CV Studio Pro//Interview Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(now)}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(descriptionParts.join('\n'))}`,
  ];

  if (meetingLink?.trim()) {
    lines.push(`LOCATION:${escapeIcsText(meetingLink.trim())}`);
  }

  lines.push('STATUS:CONFIRMED');
  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
};

/**
 * Generates and triggers the browser download of an .ics calendar file.
 */
export const downloadInterviewIcs = (options: InterviewEventOptions): void => {
  const icsContent = buildInterviewIcsContent(options);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const cleanCompany = options.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const fileName = `interview-${cleanCompany || 'job'}.ics`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
