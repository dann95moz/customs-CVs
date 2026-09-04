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
      defaultTitle: 'Bullet demasiado breve',
      descKey: 'preview:bulletAudit.tooShortDesc',
      defaultDesc: 'Las viñetas muy cortas carecen del contexto de negocio necesario para los reclutadores.',
      suggestionKey: 'preview:bulletAudit.tooShortSuggestion',
      defaultSuggestion: 'Desarrolla el alcance de la tarea y qué herramientas utilizaste.',
    };
  }

  // 2. Check for Google XYZ quantifiable metric
  if (!METRIC_PATTERN.test(clean)) {
    return {
      type: 'missing_metric',
      titleKey: 'preview:bulletAudit.missingMetricTitle',
      defaultTitle: 'Falta métrica de resultado (Fórmula XYZ)',
      descKey: 'preview:bulletAudit.missingMetricDesc',
      defaultDesc: 'Este bullet describe responsabilidades pero no incluye un resultado medible (números, %, tiempo o dinero).',
      suggestionKey: 'preview:bulletAudit.missingMetricSuggestion',
      defaultSuggestion: 'Cuantifica el impacto: ¿cuánto mejoró el rendimiento, qué % de ahorro se logró o cuántos usuarios impactó?',
    };
  }

  return null; // Passes XYZ impact check!
};
