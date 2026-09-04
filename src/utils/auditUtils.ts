import { TFunction } from 'i18next';
import { AuditSectionResult } from '../types/audit';
import { RadarDimension } from '../components/atoms/HexagonRadarChart';

/**
 * Returns localized short dimension label for radar chart vertices.
 */
export function getLocalizedDimensionLabel(sectionName: string, t: TFunction): string {
  const name = (sectionName || '').toLowerCase();
  if (name.includes('header') || name.includes('contact')) return t('audit:dimensions.header', 'Contacto');
  if (name.includes('summary')) return t('audit:dimensions.summary', 'Extracto');
  if (name.includes('skills')) return t('audit:dimensions.skills', 'Habilidades');
  if (name.includes('experience')) return t('audit:dimensions.experience', 'Impacto');
  if (name.includes('education')) return t('audit:dimensions.education', 'Educación');
  if (name.includes('language')) return t('audit:dimensions.languages', 'Idiomas');
  if (name.includes('structure') || name.includes('legibility')) return t('audit:dimensions.structure', 'Estructura');
  return sectionName.split(' ')[0];
}

/**
 * Returns localized full section name for audit report cards and headings.
 */
export function getLocalizedSectionName(sectionName: string, t: TFunction): string {
  const name = (sectionName || '').toLowerCase();
  if (name.includes('header') || name.includes('contact')) return t('audit:sections.header', 'Contacto e Información Personal');
  if (name.includes('summary')) return t('audit:sections.summary', 'Extracto Profesional');
  if (name.includes('skills')) return t('audit:sections.skills', 'Habilidades y Competencias');
  if (name.includes('experience')) return t('audit:sections.experience', 'Experiencia Profesional');
  if (name.includes('education')) return t('audit:sections.education', 'Educación y Certificaciones');
  if (name.includes('language')) return t('audit:sections.languages', 'Idiomas');
  if (name.includes('structure') || name.includes('legibility')) return t('audit:sections.structure', 'Estructura General y Legibilidad ATS');
  return sectionName;
}

/**
 * Returns localized status badge text (Optimal, Solid with Headroom, Needs Attention).
 */
export function getLocalizedStatus(status: string, t: TFunction): string {
  if (!status) return '';
  if (status.includes('Optimal')) return `🟢 ${t('audit:status.optimal', 'Óptimo')}`;
  if (status.includes('Solid')) return `🟡 ${t('audit:status.solid', 'Sólido con margen de mejora')}`;
  if (status.includes('Attention')) return `🔴 ${t('audit:status.needsAttention', 'Requiere Atención')}`;
  return status;
}

/**
 * Maps section results and scores to localized actionable recommendations.
 * Ensures the hover details in radar charts and action lever cards strictly match
 * the user's selected language instead of raw burned English text.
 */
export function getLocalizedAuditRecommendation(
  sec: { sectionName: string; score: number; actionToTen?: string[]; comment?: string },
  t: TFunction
): string {
  const name = (sec.sectionName || '').toLowerCase();
  const isHigh = sec.score >= 9.0;

  if (name.includes('header') || name.includes('contact')) {
    return isHigh
      ? t('audit:recommendations.header.reachTen', 'Para alcanzar 10/10, añade un perfil de LinkedIn curado o enlace al portafolio para validación profesional.')
      : t('audit:recommendations.header.gap', 'Asegúrate de incluir nombre completo, titular profesional alineado y correo electrónico directo.');
  }
  if (name.includes('summary')) {
    return isHigh
      ? t('audit:recommendations.summary.reachTen', 'Para alcanzar 10/10, incluye al menos 1 métrica cuantificable que refleje impacto de negocio (eficiencia, ingresos o crecimiento).')
      : t('audit:recommendations.summary.gap', 'Redacta un extracto conciso de 3-4 frases sintetizando experiencia clave, alcance y logros destacados.');
  }
  if (name.includes('skills')) {
    return isHigh
      ? t('audit:recommendations.skills.reachTen', 'Para alcanzar 10/10, alinea las habilidades clave directamente con las palabras clave de la vacante y terminología del sector.')
      : t('audit:recommendations.skills.gap', 'Organiza las competencias en grupos temáticos estructurados para un escaneo inmediato por reclutadores.');
  }
  if (name.includes('experience')) {
    return isHigh
      ? t('audit:recommendations.experience.reachTen', 'Para alcanzar 10/10, contextualiza logros con magnitud organizacional (presupuestos, volumen de clientes o tamaño de equipo).')
      : t('audit:recommendations.experience.gap', 'Cuantifica los logros con métricas medibles (porcentajes, ahorros o escala) en cada viñeta principal usando la fórmula Google XYZ.');
  }
  if (name.includes('education')) {
    return isHigh
      ? t('audit:recommendations.education.reachTen', 'Para alcanzar 10/10, mantén las certificaciones actualizadas con la entidad emisora y fechas de acreditación.')
      : t('audit:recommendations.education.gap', 'Añade los títulos académicos más altos obtenidos, instituciones y certificaciones reconocidas de la industria.');
  }
  if (name.includes('language')) {
    return isHigh
      ? t('audit:recommendations.languages.reachTen', 'Para alcanzar 10/10, respalda los niveles de idioma con estándares oficiales (MCER) o experiencia profesional internacional.')
      : t('audit:recommendations.languages.gap', 'Estandariza los niveles de idioma según el marco MCER (Nativo, Avanzado C1/C2, Profesional B2).');
  }
  if (name.includes('structure') || name.includes('legibility')) {
    return isHigh
      ? t('audit:recommendations.structure.reachTen', 'Mantén disciplina de 1 o 2 páginas con márgenes consistentes y longitud de viñetas uniforme para máxima legibilidad ATS.')
      : t('audit:recommendations.structure.gap', 'Optimiza la jerarquía tipográfica y densidad visual para garantizar 100% de compatibilidad con filtros ATS.');
  }

  return sec.actionToTen?.[0] || sec.comment || '';
}

/**
 * Returns localized descriptive summary comments for audit sections.
 */
export function getLocalizedComment(
  sec: { sectionName: string; comment?: string },
  t: TFunction
): string {
  const name = (sec.sectionName || '').toLowerCase();
  if (name.includes('header') || name.includes('contact')) return t('audit:comments.header', 'Encabezado completo con canales directos verificados y presencia profesional digital.');
  if (name.includes('summary')) return t('audit:comments.summary', 'Propuesta de valor sólida y concisa, destacando fortalezas clave y resultados cuantitativos.');
  if (name.includes('skills')) return t('audit:comments.skills', 'Competencias estructuradas y de alta densidad organizadas en categorías temáticas escaneables.');
  if (name.includes('experience')) return t('audit:comments.experience', 'Logros claros que demuestran liderazgo y resultados medibles usando la fórmula Google XYZ.');
  if (name.includes('education')) return t('audit:comments.education', 'Educación formal contextualizada con credenciales relevantes y certificaciones profesionales.');
  if (name.includes('language')) return t('audit:comments.languages', 'Niveles estandarizados según el marco MCER (Nativo, Avanzado / Fluido, Profesional).');
  if (name.includes('structure') || name.includes('legibility')) return t('audit:comments.structure', 'Jerarquía visual limpia, densidad tipográfica óptima para límites de página y 100% legibilidad ATS.');
  return sec.comment || '';
}

/**
 * High-order factory creating fully localized RadarDimension array for HexagonRadarChart.
 */
export function buildRadarDimensions(
  sections: AuditSectionResult[],
  t: TFunction
): RadarDimension[] {
  return sections.map((sec) => ({
    key: sec.sectionName,
    label: getLocalizedDimensionLabel(sec.sectionName, t),
    score: sec.score,
    targetScore: sec.targetScore ?? 9.0,
    maxScore: 10,
    recommendation: getLocalizedAuditRecommendation(sec, t),
  }));
}
