import { SectionType } from '../types/cv';

/**
 * Multilingual section classification dictionary across all 5 supported locales:
 * - English (en)
 * - Spanish (es)
 * - German (de)
 * - French (fr)
 * - Italian (it)
 */
export const SECTION_KEYWORDS: Record<Exclude<SectionType, 'generic'>, string[]> = {
  summary: [
    // English
    'summary', 'professional summary', 'executive summary', 'profile', 'about me', 'career objective', 'pitch',
    // Spanish
    'resumen', 'resumen profesional', 'perfil', 'perfil profesional', 'sobre mí', 'extracto', 'presentación',
    // German
    'zusammenfassung', 'kurzprofil', 'profil', 'über mich', 'beruflicher werdegang kurzfassung', 'karriereprofil',
    // French
    'résumé', 'resume', 'profil', 'profil professionnel', 'à propos de moi', 'a propos', 'synthèse',
    // Italian
    'sommario', 'profilo', 'profilo professionale', 'chi sono', 'presentazione', 'sintesi'
  ],
  skills: [
    // English
    'skills', 'technical skills', 'core competencies', 'competencies', 'tech stack', 'technologies', 'stack', 'expertise', 'areas of expertise',
    // Spanish
    'habilidades', 'competencias', 'habilidades técnicas', 'stack tecnológico', 'tecnologías', 'áreas de experiencia',
    // German
    'kenntnisse', 'fähigkeiten', 'faehigkeiten', 'kompetenzen', 'technologien', 'fachkenntnisse', 'it-kenntnisse', 'qualifikationen',
    // French
    'compétences', 'competences', 'compétences techniques', 'savoir-faire', 'technologies', 'expertises',
    // Italian
    'competenze', 'competenze tecniche', 'abilità', 'abilita', 'tecnologie', 'conoscenze tecniche'
  ],
  experience: [
    // English
    'experience', 'work experience', 'professional experience', 'career history', 'employment history', 'work history',
    // Spanish
    'experiencia', 'experiencia laboral', 'experiencia profesional', 'historial laboral', 'trayectoria profesional',
    // German
    'berufserfahrung', 'beruflicher werdegang', 'werdegang', 'praxiserfahrung', 'arbeitserfahrung',
    // French
    'expérience', 'experience', 'expérience professionnelle', 'parcours professionnel', 'historique professionnel',
    // Italian
    'esperienza', 'esperienza professionale', 'esperienze lavorative', 'percorso professionale', 'storia lavorativa'
  ],
  education: [
    // English
    'education', 'academic background', 'academics', 'certifications', 'degrees', 'training',
    // Spanish
    'educación', 'educacion', 'formación académica', 'formacion', 'certificaciones', 'titulaciones', 'estudios',
    // German
    'ausbildung', 'studium', 'bildungsweg', 'akademischer werdegang', 'zertifikate', 'weiterbildung',
    // French
    'formation', 'formations', 'études', 'etudes', 'diplômes', 'diplomes', 'certifications', 'cursus académique',
    // Italian
    'istruzione', 'formazione', 'titoli di studio', 'certificazioni', 'percorso accademico', 'studi'
  ],
  languages: [
    // English
    'languages', 'language skills', 'spoken languages',
    // Spanish
    'idiomas', 'lenguajes', 'competencia lingüística',
    // German
    'sprachen', 'sprachkenntnisse', 'fremdsprachen',
    // French
    'langues', 'langues parlées', 'compétences linguistiques',
    // Italian
    'lingue', 'lingue conosciute', 'competenze linguistiche'
  ],
  projects: [
    // English
    'projects', 'key projects', 'notable projects', 'initiatives', 'publications', 'volunteering', 'side ventures', 'case studies',
    // Spanish
    'proyectos', 'proyectos destacados', 'iniciativas', 'publicaciones', 'voluntariado', 'casos de estudio',
    // German
    'projekte', 'ausgewählte projekte', 'publikationen', 'ehrenamt', 'initiativen', 'fallstudien',
    // French
    'projets', 'projets récents', 'publications', 'bénévolat', 'initiatives', 'études de cas',
    // Italian
    'progetti', 'progetti principali', 'pubblicazioni', 'volontariato', 'iniziative', 'casi di studio'
  ]
};

/**
 * Classifies a raw section header into a standardized SectionType across all 5 locales.
 */
export function classifySectionType(rawTitle: string): SectionType {
  const normalized = rawTitle
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics for uniform matching
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();

  // Check categories in priority order
  const categories: Array<Exclude<SectionType, 'generic'>> = [
    'summary',
    'skills',
    'experience',
    'education',
    'languages',
    'projects'
  ];

  for (const cat of categories) {
    const keywords = SECTION_KEYWORDS[cat];
    for (const kw of keywords) {
      const normalizedKw = kw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

      if (normalized.includes(normalizedKw)) {
        return cat;
      }
    }
  }

  return 'generic';
}
