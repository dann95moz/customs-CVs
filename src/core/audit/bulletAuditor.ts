/**
 * Granular bullet point auditor evaluating compliance with the Google XYZ impact formula:
 * Accomplished [X], as measured by [Y], by doing [Z].
 * Zero external dependencies.
 */

import { BulletAuditIssue } from '../../types/audit';

export type { BulletAuditIssue };

const METRIC_PATTERN = /\d+[\s%kmb€$£xX]|percent|uplift|growth|revenue|efficiency|reduction|roi|savings|ahorro|reducción|crecimiento|aumento|millones|miles/i;

/**
 * Evaluates an individual bullet string.
 * Returns null if the bullet satisfies the Google XYZ formula criteria.
 */
export const auditSingleBullet = (text: string): BulletAuditIssue | null => {
  if (!text) return null;
  const clean = text.replace(/<[^>]*>/g, '').trim();

  // 1. Check if bullet is too brief to convey meaningful accomplishment
  if (clean.length > 0 && clean.length < 20) {
    return {
      type: 'too_short',
      titleKey: 'preview:bulletAudit.tooShortTitle',
      defaultTitle: 'Bullet point is very brief',
      descKey: 'preview:bulletAudit.tooShortDesc',
      defaultDesc: 'Very short bullet points lack the business scope and context recruiters scan for.',
      suggestionKey: 'preview:bulletAudit.tooShortSuggestion',
      defaultSuggestion: 'Expand on the task scope and what tools or technologies you used.',
    };
  }

  // 2. Check for Google XYZ quantifiable metric
  if (!METRIC_PATTERN.test(clean)) {
    return {
      type: 'missing_metric',
      titleKey: 'preview:bulletAudit.missingMetricTitle',
      defaultTitle: 'Missing quantifiable outcome (XYZ formula)',
      descKey: 'preview:bulletAudit.missingMetricDesc',
      defaultDesc: 'This bullet describes responsibilities but lacks a measurable result (numbers, %, time, or money).',
      suggestionKey: 'preview:bulletAudit.missingMetricSuggestion',
      defaultSuggestion: 'Quantify impact: how much did performance improve, what % savings was achieved, or how many users were impacted?',
    };
  }

  return null; // Passes XYZ impact check!
};
