/**
 * High-performance, client-side keyword overlap matcher for pre-generation affinity estimation.
 * Zero external dependencies, pure deterministic NLP and tokenization.
 */

export interface QuickMatchResult {
  score: number; // 0 to 100
  matchedKeywords: string[];
  missingKeywords: string[];
  totalKeywords: number;
  verdict: 'high' | 'moderate' | 'low';
}

const COMMON_STOPWORDS = new Set([
  // English
  'the', 'and', 'with', 'for', 'you', 'will', 'that', 'this', 'from', 'are', 'our', 'have', 'work',
  'team', 'experience', 'years', 'skills', 'role', 'job', 'requirements', 'responsibilities', 'qualifications',
  'preferred', 'plus', 'ability', 'must', 'strong', 'good', 'great', 'opportunity', 'company', 'position',
  'using', 'working', 'knowledge', 'understanding', 'hands-on', 'candidates', 'seeking', 'looking',
  // Spanish
  'que', 'con', 'para', 'por', 'los', 'las', 'del', 'una', 'uno', 'experiencia', 'anos', 'años', 'habilidades',
  'requisitos', 'responsabilidades', 'trabajo', 'equipo', 'empresa', 'puesto', 'rol', 'buscamos', 'conocimiento',
  'capacidad', 'manejo', 'nivel', 'funciones', 'deseable', 'valorable', 'perfil', 'candidato',
  // German
  'und', 'mit', 'fuer', 'für', 'eine', 'einen', 'wir', 'sie', 'erfahrung', 'kenntnisse', 'team',
  // French
  'avec', 'pour', 'dans', 'nous', 'vous', 'experience', 'expérience', 'competences', 'compétences', 'equipe',
  // Italian
  'con', 'per', 'nella', 'della', 'esperienza', 'competenze', 'squadra', 'lavoro',
]);

/**
 * Known tech, domain and methodology tokens to prioritize in keyword extraction.
 */
const KNOWN_SKILL_PATTERNS = [
  'react', 'next.js', 'vue', 'angular', 'typescript', 'javascript', 'html5', 'css3', 'sass', 'tailwind',
  'node.js', 'express', 'nestjs', 'python', 'django', 'fastapi', 'java', 'spring', 'go', 'golang', 'rust',
  'c#', '.net', 'c++', 'php', 'laravel', 'ruby', 'rails', 'swift', 'kotlin', 'flutter', 'react native',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'graphql', 'rest', 'api', 'grpc',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'github actions', 'jenkins',
  'microservices', 'serverless', 'agile', 'scrum', 'kanban', 'jira', 'figma', 'ui/ux', 'design system',
  'jest', 'cypress', 'playwright', 'vitest', 'unit testing', 'tdd', 'clean architecture', 'solid',
  'performance', 'seo', 'accessibility', 'a11y', 'git', 'webpack', 'vite', 'redux', 'zustand',
  'machine learning', 'ai', 'llm', 'nlp', 'data analysis', 'bi', 'power bi', 'tableau', 'excel'
];

/**
 * Extracts key domain phrases and tokens from job posting text.
 */
export const extractJobKeywords = (jobText: string): string[] => {
  if (!jobText || jobText.trim().length < 20) return [];

  const lowerJob = jobText.toLowerCase();
  const detected = new Set<string>();

  // 1. Scan for known high-value skills & methodologies
  for (const skill of KNOWN_SKILL_PATTERNS) {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i');
    if (regex.test(lowerJob)) {
      // Normalize casing for display
      detected.add(skill.toUpperCase() === skill ? skill : skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  }

  // 2. Scan for capitalized technical terms or bullet phrases in requirements
  const lines = jobText.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // Check if line looks like a bullet requirement
    if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
      const words = trimmed
        .replace(/^[-*•\d.)\s]+/, '')
        .split(/[,;/()]/)
        .map((part) => part.trim())
        .filter((part) => part.length >= 3 && part.length <= 25);

      for (const phrase of words) {
        const pLower = phrase.toLowerCase();
        if (!COMMON_STOPWORDS.has(pLower) && /^[a-zA-Z0-9#+.\s-]+$/.test(phrase) && phrase.split(' ').length <= 3) {
          if (KNOWN_SKILL_PATTERNS.some((k) => pLower.includes(k))) {
            detected.add(phrase);
          }
        }
      }
    }
  }

  return Array.from(detected).slice(0, 30);
};

/**
 * Calculates keyword overlap score and lists between Target Job and Master CV.
 */
export const calculateQuickScore = (targetJobText: string, masterDataText: string): QuickMatchResult => {
  if (!targetJobText || targetJobText.trim().length < 30 || !masterDataText || masterDataText.trim().length < 30) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      totalKeywords: 0,
      verdict: 'low',
    };
  }

  const keywords = extractJobKeywords(targetJobText);
  if (keywords.length === 0) {
    return {
      score: 50,
      matchedKeywords: [],
      missingKeywords: [],
      totalKeywords: 0,
      verdict: 'moderate',
    };
  }

  const lowerMaster = masterDataText.toLowerCase();
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of keywords) {
    const cleanKw = kw.toLowerCase().trim();
    const escaped = cleanKw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i');

    if (regex.test(lowerMaster)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const rawScore = Math.round((matchedKeywords.length / keywords.length) * 100);
  const score = Math.max(0, Math.min(100, rawScore));

  let verdict: 'high' | 'moderate' | 'low' = 'low';
  if (score >= 70) {
    verdict = 'high';
  } else if (score >= 45) {
    verdict = 'moderate';
  }

  return {
    score,
    matchedKeywords,
    missingKeywords,
    totalKeywords: keywords.length,
    verdict,
  };
};
