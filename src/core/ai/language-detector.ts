export type SupportedLanguage = 'es' | 'de' | 'fr' | 'it' | 'en';

export interface DetectedLanguage {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  sections: {
    summary: string;
    skills: string;
    experience: string;
    projects: string;
    education: string;
    languages: string;
  };
  skillsCategories: {
    languages: string;
    frameworks: string;
    tooling: string;
  };
  gapReportTitle: string;
  gapLabels: {
    targetCompany: string;
    targetRole: string;
    matchScore: string;
    keywords: string;
    narrative: string;
    gaps: string;
  };
}

export const LANGUAGE_DEFINITIONS: Record<SupportedLanguage, DetectedLanguage> = {
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    sections: {
      summary: 'RESUMEN PROFESIONAL',
      skills: 'HABILIDADES TÉCNICAS',
      experience: 'EXPERIENCIA LABORAL',
      projects: 'PROYECTOS DESTACADOS',
      education: 'EDUCACIÓN Y CERTIFICACIONES',
      languages: 'IDIOMAS'
    },
    skillsCategories: {
      languages: 'Lenguajes y Fundamentos:',
      frameworks: 'Frameworks, Arquitectura y Ecosistema:',
      tooling: 'Herramientas, Testing, CI/CD e Integración IA:'
    },
    gapReportTitle: 'REPORTE DE ESTRATEGIA Y MATCHING (Análisis de Brechas)',
    gapLabels: {
      targetCompany: 'Empresa Objetivo:',
      targetRole: 'Rol Objetivo:',
      matchScore: 'Puntuación Estimada de Compatibilidad:',
      keywords: 'Palabras Clave Críticas Integradas:',
      narrative: 'Narrativa de Alineación Estratégica:',
      gaps: 'Brechas Identificadas y Mitigación:'
    }
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    sections: {
      summary: 'KURZPROFIL',
      skills: 'IT-KENNTNISSE & FÄHIGKEITEN',
      experience: 'BERUFLICHER WERDEGANG',
      projects: 'AUSGEWÄHLTE PROJEKTE',
      education: 'AUSBILDUNG & ZERTIFIZIERUNGEN',
      languages: 'SPRACHKENNTNISSE'
    },
    skillsCategories: {
      languages: 'Programmiersprachen & Grundlagen:',
      frameworks: 'Frameworks, Architektur & Ökosystem:',
      tooling: 'Werkzeuge, Testing, CI/CD & KI-Integrationen:'
    },
    gapReportTitle: 'MATCHING- & ANPASSUNGSSTRATEGIEBERICHT (Gap-Analyse)',
    gapLabels: {
      targetCompany: 'Zielunternehmen:',
      targetRole: 'Zielrolle:',
      matchScore: 'Geschätzter Match-Score:',
      keywords: 'Integrierte kritische Schlüsselwörter:',
      narrative: 'Strategische Ausrichtung:',
      gaps: 'Identifizierte Lücken & Abmilderung:'
    }
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    sections: {
      summary: 'PROFIL PROFESSIONNEL',
      skills: 'COMPÉTENCES TECHNIQUES',
      experience: 'EXPÉRIENCE PROFESSIONNELLE',
      projects: 'PROJETS NOTABLES',
      education: 'FORMATION & CERTIFICATIONS',
      languages: 'LANGUES'
    },
    skillsCategories: {
      languages: 'Langages et Fondamentaux:',
      frameworks: 'Frameworks, Architecture et Écosystème:',
      tooling: 'Outils, Tests, CI/CD et Intégrations IA:'
    },
    gapReportTitle: 'RAPPORT DE STRATÉGIE ET D’ADÉQUATION (Analyse des Écarts)',
    gapLabels: {
      targetCompany: 'Entreprise Cible:',
      targetRole: 'Poste Cible:',
      matchScore: 'Score de Correspondance Estimé:',
      keywords: 'Mots-clés Critiques Intégrés:',
      narrative: 'Narrative d’Alignement Stratégique:',
      gaps: 'Écarts Identifiés et Mesures d’Atténuation:'
    }
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    sections: {
      summary: 'PROFILO PROFESSIONALE',
      skills: 'COMPETENZE TECNICHE',
      experience: 'ESPERIENZA PROFESSIONALE',
      projects: 'PROGETTI PRINCIPALI',
      education: 'ISTRUZIONE E CERTIFICAZIONI',
      languages: 'LINGUE'
    },
    skillsCategories: {
      languages: 'Linguaggi e Fondamenti:',
      frameworks: 'Framework, Architettura ed Ecosistema:',
      tooling: 'Strumenti, Testing, CI/CD e Integrazioni IA:'
    },
    gapReportTitle: 'RAPPORTO DI STRATEGIA E ALLINEAMENTO (Analisi dei Gap)',
    gapLabels: {
      targetCompany: 'Azienda Obiettivo:',
      targetRole: 'Ruolo Obiettivo:',
      matchScore: 'Punteggio di Corrispondenza Stimato:',
      keywords: 'Parole Chiave Critiche Integrate:',
      narrative: 'Narrativa di Allineamento Strategico:',
      gaps: 'Gap Identificati e Mitigazione:'
    }
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    sections: {
      summary: 'PROFESSIONAL SUMMARY',
      skills: 'TECHNICAL SKILLS',
      experience: 'PROFESSIONAL EXPERIENCE',
      projects: 'FEATURED PROJECTS',
      education: 'EDUCATION & CERTIFICATIONS',
      languages: 'LANGUAGES'
    },
    skillsCategories: {
      languages: 'Languages & Core Fundamentals:',
      frameworks: 'Frameworks, Architecture & Ecosystem:',
      tooling: 'Tooling, Testing, CI/CD & AI Integrations:'
    },
    gapReportTitle: 'MATCHING & TAILORING STRATEGY REPORT (Gap Analysis)',
    gapLabels: {
      targetCompany: 'Target Company:',
      targetRole: 'Target Role:',
      matchScore: 'Estimated Match Score:',
      keywords: 'Critical Integrated Keywords:',
      narrative: 'Strategic Alignment Narrative:',
      gaps: 'Identified Gaps & Mitigation:'
    }
  }
};

interface LanguagePattern {
  commonWords: Set<string>;
  distinctiveWords: Set<string>;
}

const PATTERNS: Record<SupportedLanguage, LanguagePattern> = {
  es: {
    commonWords: new Set(['de', 'la', 'en', 'el', 'los', 'las', 'del', 'por', 'para', 'con', 'una', 'como', 'más', 'pero', 'sus', 'al', 'lo']),
    distinctiveWords: new Set([
      'requisitos', 'experiencia', 'empresa', 'trabajo', 'puesto', 'funciones', 'conocimientos',
      'ofrecemos', 'deseable', 'responsabilidades', 'candidato', 'habilidades', 'años', 'titulación',
      'salario', 'jornada', 'ubicación', 'perfil', 'incorporación', 'laboral', 'profesional', 'buscamos'
    ])
  },
  de: {
    commonWords: new Set(['und', 'der', 'die', 'das', 'mit', 'von', 'im', 'für', 'fuer', 'eine', 'wir', 'sie', 'auf', 'aus', 'den', 'zu']),
    distinctiveWords: new Set([
      'suchen', 'anforderungen', 'erfahrung', 'kenntnisse', 'aufgaben', 'profil', 'ihre', 'unser',
      'bereich', 'abgeschlossenes', 'studium', 'arbeitsplatz', 'bewerbung', 'qualifikationen', 'werdegang', 'unternehmen'
    ])
  },
  fr: {
    commonWords: new Set(['de', 'la', 'le', 'les', 'des', 'en', 'du', 'dans', 'pour', 'une', 'avec', 'sur', 'nous', 'vous', 'au', 'par']),
    distinctiveWords: new Set([
      'recherche', 'poste', 'missions', 'profil', 'compétences', 'competences', 'exigences', 'expérience',
      'experience', 'entreprise', 'candidat', 'formation', 'atout', 'rémunération', 'remuneration', 'recherchons'
    ])
  },
  it: {
    commonWords: new Set(['di', 'il', 'la', 'le', 'gli', 'in', 'per', 'con', 'del', 'della', 'dei', 'delle', 'sono', 'ed', 'al']),
    distinctiveWords: new Set([
      'requisiti', 'esperienza', 'azienda', 'lavoro', 'candidato', 'competenze', 'ricerchiamo',
      'mansioni', 'offerta', 'sede', 'inquadramento', 'titolo', 'inserimento', 'professionali'
    ])
  },
  en: {
    commonWords: new Set(['the', 'and', 'to', 'of', 'in', 'is', 'that', 'for', 'you', 'with', 'on', 'as', 'are', 'be', 'this', 'we', 'our']),
    distinctiveWords: new Set([
      'requirements', 'experience', 'looking', 'skills', 'responsibilities', 'qualifications',
      'team', 'working', 'opportunity', 'preferred', 'must-have', 'role', 'company', 'candidate'
    ])
  }
};

/**
 * Pure function: Detects the primary language of the target job posting text.
 * Falls back to English if no clear match is found or text is negligible.
 */
export function detectVacancyLanguage(targetJobText: string): DetectedLanguage {
  if (!targetJobText || targetJobText.trim().length < 15) {
    return LANGUAGE_DEFINITIONS.en;
  }

  // Tokenize words into lower-case unicode words
  const words = targetJobText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics for uniform matching
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1);

  if (words.length === 0) {
    return LANGUAGE_DEFINITIONS.en;
  }

  const scores: Record<SupportedLanguage, number> = {
    es: 0,
    de: 0,
    fr: 0,
    it: 0,
    en: 0,
  };

  for (const word of words) {
    for (const [lang, pattern] of Object.entries(PATTERNS) as [SupportedLanguage, LanguagePattern][]) {
      if (pattern.distinctiveWords.has(word)) {
        scores[lang] += 3;
      } else if (pattern.commonWords.has(word)) {
        scores[lang] += 1;
      }
    }
  }

  let bestLang: SupportedLanguage = 'en';
  let maxScore = 0;

  for (const [lang, score] of Object.entries(scores) as [SupportedLanguage, number][]) {
    if (score > maxScore) {
      maxScore = score;
      bestLang = lang;
    }
  }

  // If score is negligible, default to English
  if (maxScore < 3) {
    return LANGUAGE_DEFINITIONS.en;
  }

  return LANGUAGE_DEFINITIONS[bestLang];
}
