import { useMemo } from 'react';
import { extractCandidateName } from '../core/parser';

export interface MissingSectionItem {
  id: string;
  labelKey: string;
  defaultLabel: string;
}

export interface ProfileCompletenessResult {
  score: number; // 0 to 100
  level: 'initial' | 'good' | 'complete';
  missingSections: MissingSectionItem[];
  completedCount: number;
  totalCount: number;
}

export const useMasterProfileCompleteness = (masterData: string): ProfileCompletenessResult => {
  return useMemo(() => {
    if (!masterData || masterData.trim().length < 20) {
      return {
        score: 0,
        level: 'initial',
        missingSections: [
          { id: 'personal', labelKey: 'profile:nav.personal', defaultLabel: 'Datos Personales' },
          { id: 'summary', labelKey: 'profile:nav.summary', defaultLabel: 'Extracto / Resumen' },
          { id: 'experience', labelKey: 'profile:nav.experience', defaultLabel: 'Experiencia' },
          { id: 'skills', labelKey: 'profile:nav.skills', defaultLabel: 'Habilidades' },
          { id: 'education', labelKey: 'profile:nav.education', defaultLabel: 'Educación' },
          { id: 'languages', labelKey: 'profile:nav.languages', defaultLabel: 'Idiomas' },
        ],
        completedCount: 0,
        totalCount: 6,
      };
    }

    const lower = masterData.toLowerCase();
    const candidateName = extractCandidateName(masterData, '');

    // 1. Personal & Contact (20 pts)
    const hasName = Boolean(candidateName && candidateName.length >= 3);
    const hasEmailOrContact =
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(masterData) ||
      lower.includes('email') ||
      lower.includes('correo') ||
      lower.includes('linkedin');
    const personalPassed = hasName && hasEmailOrContact;

    // 2. Summary (15 pts)
    const hasSummary =
      (lower.includes('summary') ||
        lower.includes('resumen') ||
        lower.includes('extracto') ||
        lower.includes('perfil profesional') ||
        lower.includes('about me')) &&
      masterData.length > 80;

    // 3. Work Experience (30 pts)
    const hasExperience =
      (lower.includes('experience') ||
        lower.includes('experiencia') ||
        lower.includes('work history') ||
        lower.includes('trayectoria') ||
        lower.includes('empleo') ||
        lower.includes('puesto')) &&
      ((/•|-|\*/.test(masterData) || /\b(19\d\d|20\d\d)\b/.test(masterData)) && masterData.length > 100);

    // 4. Skills (15 pts)
    const hasSkills =
      (lower.includes('skills') ||
        lower.includes('habilidades') ||
        lower.includes('competencias') ||
        lower.includes('tech stack') ||
        lower.includes('kenntnisse') ||
        lower.includes('compétences')) &&
      masterData.length > 80;

    // 5. Education (10 pts)
    const hasEducation =
      lower.includes('education') ||
      lower.includes('educación') ||
      lower.includes('educacion') ||
      lower.includes('formación') ||
      lower.includes('universidad') ||
      lower.includes('university') ||
      lower.includes('degree') ||
      lower.includes('ausbildung');

    // 6. Languages / Certifications (10 pts)
    const hasLanguages =
      lower.includes('languages') ||
      lower.includes('idiomas') ||
      lower.includes('sprachen') ||
      lower.includes('langues') ||
      lower.includes('lingue') ||
      lower.includes('english') ||
      lower.includes('inglés') ||
      lower.includes('ingles') ||
      lower.includes('certificat') ||
      lower.includes('certificaciones');

    const checks: Array<{ passed: boolean; item: MissingSectionItem; weight: number }> = [
      {
        passed: personalPassed,
        item: { id: 'personal', labelKey: 'profile:nav.personal', defaultLabel: 'Datos Personales' },
        weight: 20,
      },
      {
        passed: hasSummary,
        item: { id: 'summary', labelKey: 'profile:nav.summary', defaultLabel: 'Extracto / Resumen' },
        weight: 15,
      },
      {
        passed: hasExperience,
        item: { id: 'experience', labelKey: 'profile:nav.experience', defaultLabel: 'Experiencia Laboral' },
        weight: 30,
      },
      {
        passed: hasSkills,
        item: { id: 'skills', labelKey: 'profile:nav.skills', defaultLabel: 'Habilidades Técnicas' },
        weight: 15,
      },
      {
        passed: hasEducation,
        item: { id: 'education', labelKey: 'profile:nav.education', defaultLabel: 'Educación' },
        weight: 10,
      },
      {
        passed: hasLanguages,
        item: { id: 'languages', labelKey: 'profile:nav.languages', defaultLabel: 'Idiomas' },
        weight: 10,
      },
    ];

    let score = 0;
    const missingSections: MissingSectionItem[] = [];
    let completedCount = 0;

    for (const check of checks) {
      if (check.passed) {
        score += check.weight;
        completedCount++;
      } else {
        missingSections.push(check.item);
      }
    }

    let level: 'initial' | 'good' | 'complete' = 'initial';
    if (score >= 85) {
      level = 'complete';
    } else if (score >= 50) {
      level = 'good';
    }

    return {
      score,
      level,
      missingSections,
      completedCount,
      totalCount: checks.length,
    };
  }, [masterData]);
};
