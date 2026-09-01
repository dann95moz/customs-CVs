# 📋 CV Generation & Tailoring Rules (rules.md)

This document defines the strict styling, formatting, content, and ATS optimization rules that the AI synthesizer **must rigorously follow** when generating any tailored CV.

---

## 1. 🚫 What NOT To Do (Strict Constraints)

- **No Sensitive Personal Information:**
  - ❌ Do NOT include headshots or photos (unless legally and explicitly mandated in specific regional jurisdictions).
  - ❌ Do NOT include birth date, age, marital status, gender, nationality, or religion.
  - ❌ Do NOT include national ID or passport numbers (National ID, SSN, Passport Number).
  - ❌ Do NOT include full residential street addresses. Use only `City, Country`.
- **No Empty Clichés or Buzzword Fluff:**
  - ❌ Avoid unsupported adjectives: *"passionate worker"*, *"results-driven team player"*, *"dynamic out-of-the-box thinker"*, *"adaptive developer"*.
  - ❌ Replace all subjective claims with concrete engineering achievements, percentages, and metrics.
- **No Passive Duty Descriptions:**
  - ❌ Do NOT write passive job duty lists (*"Responsible for developing APIs"*). Use strong active impact verbs (*"Architected RESTful microservices..."*).
- **No Graphic Elements That Break ATS:**
  - ❌ Do NOT use complex nested tables, multi-column floating boxes, skill percentage progress bars (*"Python 80%"* is meaningless to recruiters and ATS), or icons in place of text.
- **No Redundant Sections:**
  - ❌ Do NOT include *"References available upon request"*.
  - ❌ Do NOT list high schools or secondary education if higher university education exists.
- **Zero Hallucination (Strict SSOT):**
  - ❌ NEVER invent companies, job roles, dates, technologies, metrics, or certifications that are not present in `master-data.md`.
  If master-data.md contains fewer than 2 verifiable quantitative metrics for a given role, use the metrics available and rely on scope/scale qualifiers (team size, technologies owned, system criticality) instead of fabricating numbers. Never pad a bullet with an invented percentage to satisfy the format.

---

## 2. ✅ Mandatory Standards & Structure

### A. Content Budget & Visual Page Fit (A4 Full-Page Fill)
- **1-Page Target (Junior / Mid / Senior <6 years experience):**
  - Generate max 4 bullets per role, prioritizing bullets with quantifiable metrics. Do not alter seniority level or job title from the source data under any circumstance.
  - Word budget: **420 to 480 total words** (filling 80% to 90% of an A4 sheet harmoniously).
  - Professional Summary: 3–4 impactful lines ending with concrete metrics.
  - Technical Skills: Exactly 3 strategic high-density categories.
  - Professional Experience: 2–3 roles with **3 to 4 high-impact bullets per role** (Google XYZ format).
  - Education & Certifications: University degrees and relevant verified certifications with issuer and year, formatted in a strict vertical column (one bullet per degree/certification). NEVER combine multiple certifications into a single inline line with pipes or commas. Select max 4–5 certifications most relevant to `target-job.md`, prioritizing recency and direct topical match. Omit outdated, unrelated, or lower-signal certifications rather than listing the full training history.
  - Languages: Standardized proficiency levels (CEFR: Native, B2, C1, C2).
- **2-Page Target (Lead / Staff / Director +7 years experience):**
  - Word budget: **750 to 850 total words** completing 2 full pages.

### B. High-Impact Executive Summary (Zero-Fluff Rule)
- **Structure (3 to 4 lines maximum):**
  1. **Identity & Seniority:** `[Target Role Title] with [X]+ years of experience specialized in [Core Domain / Key Technologies].`
  2. **Technical Alignment:** Direct architectural connection addressing the core requirements in `target-job.md`.
  3. **Mandatory Closing Impact Metrics:** Must conclude with 2–3 verified quantitative metrics from `master-data.md` (e.g., *"Proven track record of cutting Jenkins CI/CD pipeline build times by 50%, reducing production runtime errors by 40% through TypeScript migrations, and accelerating feature delivery cycles by 35%."*).
  - **Summary Bolding Restriction:** Apply bold formatting only to the closing quantitative metrics in the summary — do not bold technology names or domain terms here, since they're already emphasized in the Technical Skills section below.

- **No Trivial Counters, But Scale Counters Are Encouraged:**
  - ❌ Do NOT count administrative or low-signal items: *"100 meetings"*,
    *"50 tickets closed"*, *"7 microfrontends"*, *"12 endpoints"*. These read
    as busywork, not impact.
  - ✅ DO include legitimate scale/context counters that convey seniority and
    magnitude: team size led (*"led a team of 6 engineers"*), user/traffic
    volume (*"serving 2M+ monthly active users"*, *"handling 10K+
    requests/second"*), or organizational reach (*"across 4 product squads"*).
  - **Distinction rule:** if the number communicates the *scope or blast
    radius* of the work, include it. If it only communicates *activity
    volume* with no bearing on impact, omit it.

### C. Header & Contact Information
- **Strategic GitHub / Portfolio Curation:** Include GitHub/portfolio links only when relevant public projects exist for the target role; omit if the profile has no verifiable public work to showcase, rather than including an empty or generic profile link.

### D. Technical Leadership & Active Ownership Verbs
- **Replace passive phrasing:** Instead of *"mentored junior developers"*, use proactive leadership verbs:
  - *Leadership & Ownership:* **Spearheaded, Led, Standardized, Orchestrated, Established, Mentored.**
  - *Example:* *"Led technical upskilling and codebase onboarding for junior frontend engineers on TypeScript and Clean Code standards, accelerating feature delivery cycles by 35%."*
  - *Architecture & Engineering:* **Architected, Engineered, Refactored, Modernized, Deployed.**
  - *Optimization:* **Streamlined, Reduced, Accelerated, Scaled, Eliminated.**

### E. Universal 3-Category Skills Architecture
- Regardless of role or discipline (Frontend, Backend, Fullstack, Data, DevOps,
  Mobile, QA, Product, Design, Marketing, etc.), group core competencies into
  **exactly 3 strategic categories relevant to the candidate's domain**, derived
  from `master-data.md` and `target-job.md` — not from a fixed engineering-only
  taxonomy. Choose the 3 categories that best represent the candidate's actual
  expertise clusters.
  - *Example (Software Engineering):* Languages & Core Fundamentals /
    Frameworks, Architecture & Ecosystem / Tooling, Testing, CI/CD & AI
    Integrations.
  - *Example (Product Management):* Product Strategy & Discovery /
    Analytics & Experimentation / Stakeholder & Cross-Functional Leadership.
  - *Example (Design):* Design Systems & Tooling / UX Research & Testing /
    Cross-Functional Collaboration.
- Render each category as a single dense line with comma-separated items.

### F. Google XYZ Achievement Formula
Each experience bullet point must follow the **Google XYZ Formula** ($\text{"Accomplished [X] as measured by [Y] by doing [Z]"}$):
- **Action Verb:** Strong past-tense action verb (*Architected, Spearheaded, Refactored, Streamlined*).
- **Challenge / Technical Context:** The engineering problem or architectural initiative.
- **Action / Implementation:** The modern stack, design pattern, or migration applied.
- **Quantitative Result:** Clear percentage or business/engineering metric achieved.
- **Cross-Role Redundancy Check:** Before finalizing, cross-check bullets across all included roles: if two bullets from different roles emphasize the same technical theme (e.g., both about CI/CD optimization), keep only the strongest/most quantified instance and select a different achievement angle for the other role.

### G. Strategic Keyword & Impact Bolding (The 6-Second Recruiter Hook)
- **Recruiter Visual Anchors:** Recruiters and hiring managers spend an average of 6–8 seconds scanning a CV. To immediately seize attention and maximize reading speed:
  - **Bold Core Matching Tech:** Strategically apply Markdown bolding (`**Keyword**`) to 1–2 primary matching technical terms per bullet (e.g., `**TypeScript**`, `**React**`, `**Webpack Module Federation**`, `**Microfrontends**`, `**Zustand**`, `**AWS**`, `**Docker**`).
  - **Bold Quantitative Metrics & Results:** Apply Markdown bolding to all key percentages and numerical gains (e.g., `**50% reduction in CI/CD pipeline build times**`, `**40% decrease in runtime errors**`, `**35% faster cross-team feature delivery**`).
  - **Rule of Balance:** Limit bold highlights to **1 to 3 impactful items per bullet** so the document remains clean, sophisticated, and easy to read without feeling cluttered.

---

## 3. 🎯 ATS Optimization & Formatting Consistency

- **Keyword Integration:** Seamlessly incorporate high-priority skills, methodologies (CI/CD, Microfrontends, Agile), and tooling explicitly mentioned in `target-job.md`.
- **Natural Keyword Integration (No Verbatim Copying):**
  - Integrate `target-job.md` keywords and terminology naturally into the
    candidate's own achievements and phrasing.
  - ❌ Never copy phrases verbatim from the job posting into the CV — this
    reads as keyword-stuffing to both recruiters and modern ATS semantic
    matching, and can flag as low-effort or automated.
  - ✅ Rephrase the underlying skill or requirement in the candidate's own
    voice, backed by their actual experience from `master-data.md`.
- **Target Role Title Alignment:** Align the sub-header title to the target role while maintaining factual career accuracy.
- **Strict Date Fidelity (SSOT):**
  - Copy exact start and end dates from `master-data.md` (e.g., `Oct 2024 – Apr 2026`).
  - **Never assume "Present"** automatically if an explicit end month/year is provided. Only use "Present" if `master-data.md` explicitly specifies "Present".
  - Standard date format: `Mon YYYY – Mon YYYY` (e.g., `Oct 2024 – Apr 2026` or `Jul 2022 – Oct 2024`).
- **Certifications & Education Format (Strict Column Rule):**
  - Always list each university degree and each certification as its own individual bullet point on a separate line (forming a clean vertical column).
  - ❌ Do NOT combine multiple certifications into a single inline line separated by pipes `|` or commas (e.g. NEVER output `- **Certifications:** Cert 1 | Cert 2`).
  - ✅ Format: `- **[Certification Name]** – [Issuer], [Year]`.
- **Language Uniformity (100% English Standard):**
  - Generate the CV in the same language as target-job.md. If the job posting's language cannot be reliably detected, default to English. Section headers (PROFESSIONAL SUMMARY, etc.) must also be translated accordingly — never mixed languages within the same document.
- **Optional Projects & Extras Selection:**
  - Items in the candidate's optional "Projects & Extras" pool (personal
    projects, publications, volunteer work, talks, awards, etc.) are **not
    included automatically or in full**.
  - Select only the items most relevant to `target-job.md`, using the same
    relevance criteria applied to Professional Experience bullets.
  - If none of the pool items are relevant to the target role, omit the
    section entirely rather than padding the CV with unrelated content.
  - Never fabricate or expand details beyond what the candidate provided for
    each item — the same Zero Hallucination / Strict SSOT rule applies here.
---

## 4. 📊 Quality Audit & Scoring Standard (Quality Report)

Every CV generation or evaluation can produce a comprehensive Quality Audit Report formatted according to the following executive headhunter standards:

### A. Mandatory 7-Pillar Scoring Table
A Markdown table evaluating each key dimension on a strict **1.0 to 10.0 scale**:

| Section | Score (1-10) | Diagnostic & Assessment Criteria |
| :--- | :---: | :--- |
| **Header & Contact Information** | [Score] | Clarity, direct links (LinkedIn, Email, Phone), omission of sensitive personal data (DNI/SSN/Address), and strategic GitHub curation. |
| **Professional Summary** | [Score] | Length (3–4 dense lines), zero fluff/clichés, technical alignment with target role, and mandatory closing quantitative metrics. |
| **Technical Skills** | [Score] | Universal 3-category high-density architecture, direct relevance to target job, and zero unverified technologies (strict SSOT). |
| **Professional Experience** | [Score] | Google XYZ achievement formula, active technical leadership verbs, verifiable impact metrics, and zero thematic redundancy across roles. |
| **Education & Certifications** | [Score] | University degrees, analytical/transferable context lines for non-traditional degrees, and curated technical certifications. |
| **Languages** | [Score] | Standardized CEFR proficiency (Native, B2, C1, C2) with professional working capability. |
| **Overall Structure & Legibility** | [Score] | Strict 1-page A4 fit (80%–90% harmonious fill / 420–480 words), clean Markdown hierarchy, and 100% ATS parseability. |

### B. Action Plan for Scores Below 9.0 (`< 9.0/10`)
For **any section scoring strictly below 9.0/10**, the audit report must explicitly outline:
1. **Identified Gap / Missing Information:** The exact data points, metrics, or credentials missing from `master-data.md` or the CV.
2. **Recommended Action:** Concrete bullet points, rephrasing, or structural adjustments required to reach a **10/10**.

### C. Strategic Levers for Top-Tier Excellence (The 10/10 Ceiling)
To bridge the gap from a solid 8.5–9.0 narrative to a top 5% candidate profile:
1. **Verifiable Public Artifacts (Featured Projects):** Include 1–2 public projects with live demo and GitHub repository links to convert private enterprise narrative into verifiable proof.
2. **Business & User-Facing Impact:** Complement internal engineering metrics (build times, error rates) with direct product metrics (conversion rates, transaction volume, churn reduction, customer onboarding speed).
3. **Scale & Context Magnitude:** Anchor engineering achievements with volume context (MAU, transactions processed per month, cross-functional team size).
