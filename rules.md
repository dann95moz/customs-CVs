# 📋 CV Generation & Tailoring Rules (rules.md)

This document defines the strict styling, formatting, content, and ATS optimization rules that the AI synthesizer **must rigorously follow** when generating any tailored CV.

---

## 1. 🚫 What NOT To Do (Strict Constraints)

- **No Sensitive Personal Information:**
  - ❌ Do NOT include headshots or photos (unless legally and explicitly mandated in specific regional jurisdictions).
  - ❌ Do NOT include birth date, age, marital status, gender, nationality, or religion.
  - ❌ Do NOT include national ID or passport numbers (DNI, Cédula, SSN).
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

---

## 2. ✅ Mandatory Standards & Structure

### A. Content Budget & Visual Page Fit (A4 Full-Page Fill)
- **1-Page Target (Junior / Mid / Senior <6 years experience):**
  - Word budget: **420 to 480 total words** (filling 80% to 90% of an A4 sheet harmoniously).
  - Professional Summary: 3–4 impactful lines ending with concrete metrics.
  - Technical Skills: Exactly 3 strategic high-density categories.
  - Professional Experience: 2–3 roles with **3 to 4 high-impact bullets per role** (Google XYZ format).
  - Education & Certifications: University degrees and relevant verified certifications with issuer and year.
  - Languages: Standardized proficiency levels (CEFR: Native, B2, C1, C2).
- **2-Page Target (Lead / Staff / Director +7 years experience):**
  - Word budget: **750 to 850 total words** completing 2 full pages.

### B. High-Impact Executive Summary (Zero-Fluff Rule)
- **Structure (3 to 4 lines maximum):**
  1. **Identity & Seniority:** `[Target Role Title] with [X]+ years of experience specialized in [Core Domain / Key Technologies].`
  2. **Technical Alignment:** Direct architectural connection addressing the core requirements in `target-job.md`.
  3. **Mandatory Closing Impact Metrics:** Must conclude with 2–3 verified quantitative metrics from `master-data.md` (e.g., *"Proven track record of cutting Jenkins CI/CD pipeline build times by 50%, reducing production runtime errors by 40% through TypeScript migrations, and accelerating feature delivery cycles by 35%."*).

### C. Clean Metrics & Zero Parenthetical Noise
- **No Parenthetical Breakdowns:** Do NOT add redundant parenthetical notes like `(from 40m down to 20m)` or `(from 40s to 15s)`. The percentage reduction (`by 50%`) delivers the message with conciseness and punch.
- **No Trivial Counters:** Do NOT count trivial items like *"7 microfrontends"*, *"12 endpoints"*, or *"100 meetings"*. Highlight the architectural scale and technical scope instead (*"architecting modular microfrontends across multi-bank financial design systems"*).
- **Clean Impact Percentages:** State the performance gain directly (*"cutting CI/CD pipeline build times by 50%"*, *"reducing runtime errors by 40%"*, *"accelerating sprint delivery cycles by 35%"*).

### D. Technical Leadership & Active Ownership Verbs
- **Replace passive phrasing:** Instead of *"mentored junior developers"*, use proactive leadership verbs:
  - *Leadership & Ownership:* **Spearheaded, Led, Standardized, Orchestrated, Established, Mentored.**
  - *Example:* *"Led technical upskilling and codebase onboarding for junior frontend engineers on TypeScript and Clean Code standards, accelerating feature delivery cycles by 35%."*
  - *Architecture & Engineering:* **Architected, Engineered, Refactored, Modernized, Deployed.**
  - *Optimization:* **Streamlined, Reduced, Accelerated, Scaled, Eliminated.**

### E. Universal 3-Category Skills Architecture
- Regardless of role (Frontend, Backend, Fullstack, Data, DevOps, Mobile, QA, Product), group technical competencies into **exactly 3 strategic categories**:
  1. **Category 1 (Languages & Core Fundamentals):** Core programming languages, base protocols, and fundamentals.
  2. **Category 2 (Frameworks, Architecture & Ecosystem):** Primary frameworks, state management, APIs, databases, or platform architecture.
  3. **Category 3 (Tooling, Testing, CI/CD & AI Integrations):** Testing frameworks, CI/CD pipelines, cloud, build tools, and modern developer tooling.
- Render each category as a single dense line with comma-separated items.

### F. Google XYZ Achievement Formula
Each experience bullet point must follow the **Google XYZ Formula** ($\text{"Accomplished [X] as measured by [Y] by doing [Z]"}$):
- **Action Verb:** Strong past-tense action verb (*Architected, Spearheaded, Refactored, Streamlined*).
- **Challenge / Technical Context:** The engineering problem or architectural initiative.
- **Action / Implementation:** The modern stack, design pattern, or migration applied.
- **Quantitative Result:** Clear percentage or business/engineering metric achieved.

---

## 3. 🎯 ATS Optimization & Formatting Consistency

- **Keyword Integration:** Seamlessly incorporate high-priority skills, methodologies (CI/CD, Microfrontends, Agile), and tooling explicitly mentioned in `target-job.md`.
- **Target Role Title Alignment:** Align the sub-header title to the target role while maintaining factual career accuracy.
- **Strict Date Fidelity (SSOT):**
  - Copy exact start and end dates from `master-data.md` (e.g., `Oct 2024 – Apr 2026`).
  - **Never assume "Present"** automatically if an explicit end month/year is provided. Only use "Present" if `master-data.md` explicitly specifies "Present" / "Actual".
  - Standard date format: `Mon YYYY – Mon YYYY` (e.g., `Oct 2024 – Apr 2026` or `Jul 2022 – Oct 2024`).
- **Language Uniformity:**
  - If `target-job.md` is in English, generate 100% of the CV in professional English with exact section titles (`PROFESSIONAL SUMMARY`, `TECHNICAL SKILLS`, `PROFESSIONAL EXPERIENCE`, `EDUCATION & CERTIFICATIONS`, `LANGUAGES`).
  - If `target-job.md` is in Spanish, use industry-standard tech terminology.
