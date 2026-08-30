import type { TFunction } from 'i18next';
import { KanbanColumn, DEFAULT_KANBAN_COLUMNS } from '../types/cv';

/**
 * Standard default stage IDs for the recruitment Kanban board.
 */
export const DEFAULT_STAGE_IDS = [
  'applied',
  'interview',
  'tech_test',
  'offer',
  'rejected',
] as const;

export type DefaultStageId = (typeof DEFAULT_STAGE_IDS)[number];

/**
 * Known default translations / aliases across supported languages.
 * Used to detect if a column is still using its default name or was custom-renamed by user.
 */
export const DEFAULT_STAGE_FALLBACKS: Record<DefaultStageId, string[]> = {
  applied: [
    'applied',
    'postulado',
    'candidato',
    'beworben',
    'postulé',
    'active applications',
    'candidatures actives',
    'postulaciones activas',
    'candidature attive',
    'aktive bewerbungen',
  ],
  interview: [
    'interview',
    'interviewing',
    'entrevista',
    'en entrevista',
    'vorstellungsgespräch',
    'im gespräch',
    'entretien',
    'en entretien',
    'colloquio',
    'in colloquio',
  ],
  tech_test: [
    'technical assessment',
    'tech test',
    'prueba técnica',
    'prueba tecnica',
    'test technique',
    'prova tecnica',
    'fachgespräch / test',
    'fachgespraech / test',
    'technischer test',
    'technisches assessment',
  ],
  offer: [
    'offer received',
    'offer',
    'oferta recibida',
    'angebot erhalten',
    'offre reçue',
    'offre recue',
    'offerta ricevuta',
  ],
  rejected: [
    'rejected',
    'descartado',
    'rechazado',
    'abgelehnt',
    'refusé',
    'refuse',
    'rifiutato',
  ],
};

/**
 * Checks whether a stage ID is one of the default Kanban columns.
 */
export const isDefaultColumnId = (id?: string): id is DefaultStageId => {
  if (!id) return false;
  return DEFAULT_STAGE_IDS.includes(id as DefaultStageId);
};

/**
 * Returns the localized title of a Kanban column based on the active language.
 * If the column has a custom user-defined title, it preserves the custom title.
 * If the column is one of the default stages (or matches default titles), it returns
 * the localized string from i18n ('history:stages.<id>').
 */
export const getLocalizedColumnTitle = (
  column?: KanbanColumn | { id: string; title?: string } | null,
  t?: TFunction<any, any>
): string => {
  if (!column) return '';

  const fallbackTitle = column.title || '';
  if (!t) return fallbackTitle;

  const colId = column.id as DefaultStageId;

  // Check if it's a known default column
  if (isDefaultColumnId(colId)) {
    const knownFallbacks = DEFAULT_STAGE_FALLBACKS[colId] || [];
    const normalizedTitle = fallbackTitle.trim().toLowerCase();

    const isDefaultOrEmpty =
      !normalizedTitle ||
      knownFallbacks.includes(normalizedTitle) ||
      DEFAULT_KANBAN_COLUMNS.some(
        (defCol) => defCol.id === colId && defCol.title.trim().toLowerCase() === normalizedTitle
      );

    if (isDefaultOrEmpty) {
      const defaultEnglish =
        DEFAULT_KANBAN_COLUMNS.find((defCol) => defCol.id === colId)?.title || fallbackTitle;
      return t(`history:stages.${colId}`, {
        defaultValue: t(`history:status.${colId}`, { defaultValue: defaultEnglish }),
      });
    }
  }

  // If a custom column has an exact i18n key translation, use it; otherwise preserve user title
  const localizedCandidate = t(`history:stages.${column.id}`, { defaultValue: '' });
  if (localizedCandidate && localizedCandidate !== `history:stages.${column.id}`) {
    return localizedCandidate;
  }

  return fallbackTitle;
};
