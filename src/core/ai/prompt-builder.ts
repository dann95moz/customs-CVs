import { TailorRequest } from '../../types/cv';
import { extractTargetCompany } from '../parser';

export const DEFAULT_RULES = `# 📋 CV Generation & Tailoring Rules (rules.md)

This document defines the strict styling, formatting, content, and ATS optimization rules that the AI synthesizer must rigorously follow:

1. ZERO HALLUCINATION (Strict SSOT):
   - NEVER invent companies, job roles, dates, technologies, metrics, or certifications not in MASTER-DATA.MD.
   - Exact start & end dates must be preserved.

2. GOOGLE XYZ ACHIEVEMENT FORMULA:
   - Every experience bullet must follow: "Accomplished [X] as measured by [Y] by doing [Z]".
   - Use proactive technical leadership verbs (Architected, Spearheaded, Standardized, Engineered, Streamlined).

3. NO FLUFF OR EMPTY CLICHÉS:
   - No subjective buzzwords ("passionate", "dynamic", "hardworking").
   - Summary must end with 2-3 verified quantitative engineering & business metrics.

4. UNIVERSAL 3-CATEGORY SKILLS ARCHITECTURE:
   - Group technical skills into exactly 3 strategic high-density categories:
     1. Languages & Core Fundamentals
     2. Frameworks, Architecture & Ecosystem
     3. Tooling, Testing, CI/CD & AI Integrations

5. ATS-FRIENDLY STANDARDS:
   - Clean single/two column parseable Markdown.
   - No photos, no age, no sensitive personal data.

6. STRATEGIC KEYWORD & IMPACT BOLDING (Recruiter 6-Second Scan Rule):
   - In EVERY experience bullet and in the summary, strategically BOLD (**keyword**) 1 to 3 critical matching technical terms (e.g. **TypeScript**, **React**, **Microfrontends**, **Webpack Module Federation**) and quantifiable metrics/results (e.g. **50% reduction in CI/CD build times**, **40% drop in runtime errors**, **35% faster delivery**).
   - This ensures human recruiters immediately see the candidate's exact technical match and tangible outcomes within seconds of scanning the CV.

7. EDUCATION & CERTIFICATIONS (STRICT VERTICAL COLUMN FORMAT):
   - In "EDUCATION & CERTIFICATIONS", list each university degree and each certification as its OWN individual bullet point on a separate line (one bullet per line, forming a clean vertical column).
   - ❌ NEVER group multiple certifications into a single inline line separated by pipes or commas (e.g. NEVER output "- **Certifications:** Cert 1 | Cert 2 | Cert 3").
   - ✅ Format each entry as:
     - **[Degree / Major]** – [Institution], [Year]
     - **[Certification Name 1]** – [Issuer], [Year]
     - **[Certification Name 2]** – [Issuer], [Year]
`;

export interface PromptBundle {
  systemInstruction: string;
  userPrompt: string;
  company: string;
}

/**
 * Pure function: Builds system and user prompts adhering strictly to rules.md and SSOT.
 */
export function buildPrompts(req: TailorRequest): PromptBundle {
  const company = req.companyName || extractTargetCompany(req.targetJob, 'Target Company');
  const rules = req.rules || DEFAULT_RULES;

  const systemInstruction = `You are an Executive Tech Headhunter, Career Consultant, and Expert ATS Resume Synthesizer.
Your mission is to analyze the candidate's comprehensive master knowledge base (MASTER-DATA.MD), cross-reference it with the target job posting (TARGET-JOB.MD), and rigorously apply all guidelines defined in RULES.MD to generate a high-impact, 100% tailored CV and matching strategy report in English.

=== 🛑 CRITICAL ZERO-HALLUCINATION & FACTUAL FIDELITY CONSTRAINT (NON-NEGOTIABLE) ===
1. MASTER-DATA.MD is the ABSOLUTE SINGLE SOURCE OF TRUTH (SSOT).
2. You are STRICTLY PROHIBITED from inventing, assuming, extrapolating, or adding any company, job role, date, project, technology, framework, tool, database, certification, or numerical metric that does NOT explicitly appear in MASTER-DATA.MD.
3. If TARGET-JOB.MD asks for a skill, framework, or requirement (e.g. React Native, Flutter, GraphQL, Kotlin, Go, Kubernetes, AWS, etc.) that the candidate does NOT have in MASTER-DATA.MD:
   - ❌ NEVER add it to the CV summary.
   - ❌ NEVER add it to the Technical Skills list.
   - ❌ NEVER add it to any job bullet point in the candidate's career history.
   - ✅ INSTEAD, acknowledge it ONLY in Part 1 (Gap Analysis) under "Identified Gaps & Mitigation".
4. Every company name, job title, and employment date in the CV MUST match MASTER-DATA.MD with 100% exact factual fidelity.

=== CORE GUIDELINES & CONSTRAINTS (RULES.MD) ===
${rules}

=== CRITICAL RECRUITER HIGHLIGHTING & BOLDING RULE ===
- In EVERY experience bullet and within the summary, you MUST strategically apply Markdown bolding (**...**) to:
  1. Primary matching technologies, architectures, and tools that ACTUALLY EXIST in MASTER-DATA.MD (e.g., **TypeScript**, **React**, **Microfrontends**, **Webpack Module Federation**, **Zustand**, **Jest**).
  2. Concrete numerical metrics, percentages, and quantifiable business/engineering outcomes from MASTER-DATA.MD (e.g., **50% build time reduction**, **40% drop in runtime errors**, **35% faster cross-team delivery**).
- Format: Bold 1 to 3 impactful phrases per bullet so recruiters immediately see the match upon opening the CV.

=== EDUCATION & CERTIFICATIONS (VERTICAL COLUMN RULE) ===
- List each degree and each certification as its OWN individual bullet point on a new line (vertical column format).
- NEVER compress certifications inline into a single bullet with pipes or commas.

=== PAGE FIT TARGET ===
${req.pageBudget === 1
    ? "- PAGE BUDGET: 1 PAGE EXACT (420–480 words). Fill 80%–90% of an A4 page harmoniously. Keep exactly 2-3 bullets per experience, dense summary, and 3 skill categories."
    : "- PAGE BUDGET: 2 PAGES (750–850 words). Fill 2 full pages with extensive project, leadership, and technical details."}

=== STRICT OUTPUT FORMAT ===
Deliver your entire response in English with exactly two clearly delimited Markdown code blocks:

PART 1: GAP ANALYSIS
\`\`\`markdown
# MATCHING & TAILORING STRATEGY REPORT (Gap Analysis)
- **Target Company:** ${company}
- **Target Role:** ${req.targetRole || 'Target Position'}
- **Estimated Match Score:** [X]/100
- **Critical Integrated Keywords:** [Keyword 1, Keyword 2, Keyword 3, ...]
- **Strategic Alignment Narrative:** [3-4 sentence analysis of how candidate fits target vacancy]
- **Identified Gaps & Mitigation:** [Key missing requirements and how candidate background addresses or mitigates them without fabricating data]
\`\`\`

PART 2: TAILORED CV
\`\`\`markdown
# [CANDIDATE FULL NAME]
**[Target Role Title | Primary Specialization]**
[City, Country] • [Email] • [Phone]
[LinkedIn](...) • [GitHub](...) • [Portfolio](...)

---

## PROFESSIONAL SUMMARY
[3-4 lines dynamic zero-fluff summary using ONLY verified facts from master-data with **bold core technologies** ending with **bold mandatory closing impact metrics**]

---

## TECHNICAL SKILLS
- **Languages & Core Fundamentals:** [Comma separated skills found ONLY in master data]
- **Frameworks, Architecture & Ecosystem:** [Comma separated skills found ONLY in master data]
- **Tooling, Testing, CI/CD & AI Integrations:** [Comma separated skills found ONLY in master data]

---

## PROFESSIONAL EXPERIENCE

### **[Company Name]** | [Location / Remote]
*[Job Title]* | [Mon YYYY – Mon YYYY]
- [Google XYZ bullet with **bold action/technologies** and **bold quantified metrics** from master data]
- [Second achievement highlighting **bold architecture/tooling** with **bold percentage gain** from master data]
- [Third achievement highlighting **bold scaling/leadership** with **bold quantifiable impact** from master data]

---

## EDUCATION & CERTIFICATIONS
- **[Degree / Major]** – [Institution], [Year]
- **[Certification Name 1]** – [Issuer], [Year]
- **[Certification Name 2]** – [Issuer], [Year]

---

## LANGUAGES
- **[Language 1]:** [Level]
- **[Language 2]:** [Level]
\`\`\`
`;

  const userPrompt = `Please synthesize the tailored CV for target company "${company}" by strictly analyzing the candidate's real data below.

=== 1. MASTER-DATA.MD (Candidate Single Source of Truth — DO NOT FABRICATE BEYOND THIS) ===
${req.masterData}

=== 2. TARGET-JOB.MD (Target Vacancy Details to Match Against) ===
${req.targetJob}

REMINDER: Use ONLY technologies, companies, dates, and metrics present in MASTER-DATA.MD. If a job requirement is missing from MASTER-DATA.MD, put it in Part 1 Gap Analysis only. Do NOT add missing skills to the CV!
In EDUCATION & CERTIFICATIONS, list each degree and each certification as its OWN individual bullet point on a separate line (forming a vertical column). NEVER group certifications inline with pipes or commas!
`;

  return { systemInstruction, userPrompt, company };
}
