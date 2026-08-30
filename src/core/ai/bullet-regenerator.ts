import { AIProviderSettings } from '../../types/cv';
import { getAIStrategy } from './strategies';
import { PromptBundle } from './prompt-builder';

export interface RegenerateBulletParams {
  currentBullet: string;
  company: string;
  role?: string;
  masterData: string;
  targetJob: string;
  userGuidance?: string;
  providerSettings: AIProviderSettings;
}

export interface RegenerateSummaryParams {
  currentSummary: string;
  masterData: string;
  targetJob: string;
  userGuidance?: string;
  providerSettings: AIProviderSettings;
}

/**
 * Extracts ONLY the specific role/company block from master-data.md to keep the AI payload minimal,
 * token latency ultra-low, and the hallucination surface strictly contained.
 */
export function extractRoleExcerptFromMasterData(
  masterData: string,
  company: string,
  role?: string
): string {
  if (!masterData || typeof masterData !== 'string') return '';

  const cleanComp = (company || '').trim().toLowerCase();
  const cleanRole = (role || '').trim().toLowerCase();

  // Split master-data by markdown headings (## or ###)
  const sections = masterData.split(/\n(?=#{2,3}\s+)/g);

  // 1. Try to find an exact or strong match in section headings
  let matchedSection = sections.find((sec) => {
    const firstLine = (sec.split('\n')[0] || '').toLowerCase();
    const matchesCompany = cleanComp && firstLine.includes(cleanComp);
    const matchesRole = cleanRole && firstLine.includes(cleanRole);
    return matchesCompany || matchesRole;
  });

  // 2. If not in heading, search in the entire section text
  if (!matchedSection && cleanComp) {
    matchedSection = sections.find((sec) => {
      const lower = sec.toLowerCase();
      return lower.includes(cleanComp);
    });
  }

  // 3. If found, return clean trimmed excerpt
  if (matchedSection) {
    return matchedSection.trim();
  }

  // 4. Fallback: extract Career Overview / Experience sections (max 2500 chars)
  const expMatch = masterData.match(/##\s*[^#\n]*(?:EXPERIENCE|EXPERIENCIA|OVERVIEW|PROJECTS)[^\n]*\n+([\s\S]*?)(?=\n+##\s+[^#\n]*(?:EDUCATION|SKILLS|HABILIDADES|IDIOMAS)|$)/i);
  if (expMatch && expMatch[1]) {
    return expMatch[1].slice(0, 2500).trim();
  }

  return masterData.slice(0, 2000).trim();
}

/**
 * Extracts the candidate's core profile, professional pitch, and summary background from master-data.md.
 */
export function extractSummaryExcerptFromMasterData(masterData: string): string {
  if (!masterData || typeof masterData !== 'string') return '';

  // 1. Match Personal Info / Career Overview / Storytelling / Pitch sections
  const overviewMatch = masterData.match(/##\s*[^#\n]*(?:OVERVIEW|PITCH|RESUMEN|PROFILE|PERFIL|SUMMARY|1\.|2\.)[^\n]*\n+([\s\S]*?)(?=\n+##\s+[^#\n]*(?:3\.|EXPERIENCE|EXPERIENCIA|EDUCATION)|$)/i);
  if (overviewMatch && overviewMatch[1]) {
    return overviewMatch[1].slice(0, 2000).trim();
  }

  // 2. Fallback: first 1500 chars of master-data
  return masterData.slice(0, 1500).trim();
}

/**
 * Builds prompt bundle for single bullet point regeneration adhering strictly to Zero-Hallucination & SSOT.
 */
export function buildBulletRegenerationPrompts(
  currentBullet: string,
  roleExcerpt: string,
  targetJob: string,
  userGuidance?: string
): PromptBundle {
  const guidanceText = (userGuidance || '').trim() || 'make it stronger and maximize quantifiable impact';

  const systemInstruction = `You are regenerating a single bullet point from a candidate's CV. You must follow the same Zero Hallucination / Strict SSOT rules as full CV generation.

Context provided:
- master-data.md excerpt: [ONLY the specific role/company block this bullet belongs to — not the full profile]
- target-job.md: [the vacancy, unchanged]
- Current bullet text: [the exact bullet being regenerated]
- User guidance (optional): [free-text or selected chip, e.g. "more concise"]

Rules:
1. The user's guidance may ONLY affect tone, emphasis, phrasing, or which existing fact to foreground. It may NEVER introduce a new fact, metric, technology, team size, or scope that is not explicitly present in the master-data.md excerpt above.
2. If the user's guidance implies information not present in the source (e.g. "mention I led 20 people" when no team size is in master-data.md), ignore that specific instruction and regenerate using only verified facts — do not fabricate to satisfy the request.
3. Still follow the Google XYZ formula (Action Verb + Challenge + Action + Quantitative Result) and the bolding rule (1-3 bolded items max using Markdown **...**).
4. Output ONLY the single rewritten bullet — no preamble, no explanation, no markdown list marker (do NOT include leading "- " or "* " or "• ").`;

  const userPrompt = `### MASTER-DATA.MD EXCERPT (SINGLE SOURCE OF TRUTH):
${roleExcerpt || 'No specific role excerpt available. Use only facts from current bullet.'}

### TARGET-JOB.MD (VACANCY CONTEXT):
${targetJob ? targetJob.slice(0, 1500) : 'General Tech Role'}

### CURRENT BULLET:
${currentBullet}

### USER GUIDANCE:
${guidanceText}

Regenerate this single bullet point now adhering strictly to the rules above.`;

  return {
    systemInstruction,
    userPrompt,
    company: '',
  };
}

/**
 * Builds prompt bundle for professional summary regeneration.
 */
export function buildSummaryRegenerationPrompts(
  currentSummary: string,
  summaryExcerpt: string,
  targetJob: string,
  userGuidance?: string
): PromptBundle {
  const guidanceText = (userGuidance || '').trim() || 'make it punchy, executive, and aligned with target role';

  const systemInstruction = `You are regenerating the Professional Summary section from a candidate's CV. You must follow the same Zero Hallucination / Strict SSOT rules as full CV generation.

Context provided:
- master-data.md excerpt: [The candidate's core profile, pitch, and experience background]
- target-job.md: [the vacancy, unchanged]
- Current summary text: [the exact summary being regenerated]
- User guidance (optional): [free-text or selected chip, e.g. "more concise"]

Rules:
1. The user's guidance may ONLY affect tone, emphasis, phrasing, or which existing fact to foreground. It may NEVER introduce a new fact, metric, technology, team size, or scope that is not explicitly present in the master-data.md excerpt above.
2. If the user's guidance implies information not present in the source, ignore that specific instruction and regenerate using only verified facts — do not fabricate to satisfy the request.
3. Keep it punchy (3-4 sentences / 40-70 words), highlighting key competencies aligned with target-job.md, ending with verified quantitative metrics, with 1-3 bolded items using Markdown **...**.
4. Output ONLY the rewritten summary paragraph — no preamble, no explanation, no markdown heading.`;

  const userPrompt = `### MASTER-DATA.MD EXCERPT (SINGLE SOURCE OF TRUTH):
${summaryExcerpt || 'Use verified facts from candidate dossier.'}

### TARGET-JOB.MD (VACANCY CONTEXT):
${targetJob ? targetJob.slice(0, 1500) : 'General Tech Role'}

### CURRENT SUMMARY:
${currentSummary}

### USER GUIDANCE:
${guidanceText}

Regenerate this professional summary block now adhering strictly to the rules above.`;

  return {
    systemInstruction,
    userPrompt,
    company: '',
  };
}

/**
 * Cleans the raw LLM output, removing any accidental bullet markers, quotes, or markdown code fences.
 */
export function cleanRegeneratedBulletText(rawText: string): string {
  if (!rawText) return '';

  let cleaned = rawText.trim();

  // Strip markdown code fences if wrapped
  cleaned = cleaned.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();

  // Strip leading bullet markers
  cleaned = cleaned.replace(/^[-*•]\s+/g, '');

  // Strip surrounding quotes
  cleaned = cleaned.replace(/^["'«»](.*)["'«»]$/s, '$1').trim();

  // Strip any accidental markdown header
  cleaned = cleaned.replace(/^#+\s+/g, '');

  return cleaned.trim();
}

/**
 * Cleans the raw LLM output for summary blocks.
 */
export function cleanRegeneratedSummaryText(rawText: string): string {
  if (!rawText) return '';

  let cleaned = rawText.trim();

  // Strip markdown code fences
  cleaned = cleaned.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();

  // Strip leading bullet markers or headers
  cleaned = cleaned.replace(/^[-*•]\s+/gm, '');
  cleaned = cleaned.replace(/^#+\s+/gm, '');

  // Strip surrounding quotes
  cleaned = cleaned.replace(/^["'«»](.*)["'«»]$/s, '$1').trim();

  return cleaned.trim();
}

/**
 * Regenerates an individual CV experience bullet with zero hallucinations.
 */
export async function regenerateCvBullet(params: RegenerateBulletParams): Promise<string> {
  const roleExcerpt = extractRoleExcerptFromMasterData(
    params.masterData,
    params.company,
    params.role
  );

  const prompts = buildBulletRegenerationPrompts(
    params.currentBullet,
    roleExcerpt,
    params.targetJob,
    params.userGuidance
  );

  const strategy = getAIStrategy(params.providerSettings.provider);
  const result = await strategy.execute(prompts, params.providerSettings);

  return cleanRegeneratedBulletText(result.text);
}

/**
 * Regenerates the professional summary block with zero hallucinations.
 */
export async function regenerateCvSummary(params: RegenerateSummaryParams): Promise<string> {
  const summaryExcerpt = extractSummaryExcerptFromMasterData(params.masterData);

  const prompts = buildSummaryRegenerationPrompts(
    params.currentSummary,
    summaryExcerpt,
    params.targetJob,
    params.userGuidance
  );

  const strategy = getAIStrategy(params.providerSettings.provider);
  const result = await strategy.execute(prompts, params.providerSettings);

  return cleanRegeneratedSummaryText(result.text);
}
