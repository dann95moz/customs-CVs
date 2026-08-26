/**
 * CV Studio Pro 3.0 - Static Templates & Initial Markdown Documents
 * Separated from presentation logic to adhere to Single Responsibility Principle (SRP).
 */

export const BLANK_MASTER_DATA = `# [CANDIDATE FULL NAME]
**[Primary Professional Role / Specialization]**  
[City, Country] • [candidate.email@example.com] • [+1 234 567 8900]  
[LinkedIn](https://linkedin.com/in/username) • [GitHub](https://github.com/username) • [Portfolio](https://portfolio.dev)

---

## 🎯 PROFESSIONAL SUMMARY & PITCH
[Write a concise 2-3 paragraph summary of your overall career trajectory, core technical domain, architectural capabilities, and high-level engineering achievements...]

---

## 🛠️ MASTER TECH STACK & COMPETENCIES
- **Languages & Core Fundamentals:** TypeScript, JavaScript, Python, SQL, HTML5, CSS3, Modern Tooling
- **Frameworks & State Architecture:** React, Next.js, Node.js, Express, Zustand, Redux, RESTful APIs
- **Tooling, Testing, CI/CD & Cloud:** Git, Docker, Jest, Vitest, CI/CD Automation, AWS, Google Cloud

---

## 💼 CAREER HISTORY & KEY ACHIEVEMENTS

### **[Current Company Name]** | [Location / Remote]
*[Job Title]* | **[Mon YYYY – Present]**
- **[Lead Verb & Core Action]** accomplished [X] as measured by [Y] (e.g. cutting build times by **50%**) by implementing [Z].
- **[Action & Metric]** engineered [solution] improving performance by **35%** across [scale / volume].
- **[Technical Leadership]** mentored [team count] engineers and standardized [architecture / testing].

---

### **[Previous Company Name]** | [Location / Remote]
*[Job Title]* | **[Mon YYYY – Mon YYYY]**
- **[Lead Verb]** developed [system / application] reducing runtime error rates by **40%**.
- **[Action & Metric]** automated [workflow / deployment] saving **120+ hours monthly**.

---

## 🎓 EDUCATION & CERTIFICATIONS
- **[Degree / Major in Engineering / Computer Science]** – [University / Institution], [Year]
- **[Official Industry Certification]** – [Issuer / Organization], [Year]

---

## 🌐 LANGUAGES
- **[Native Language]:** Native
- **[Second Language]:** C1 – Advanced / Full Professional Working Proficiency
`;

export const BLANK_TARGET_JOB = `# 🎯 Target Job Posting

## 📌 Vacancy Overview
- **Company:** [Target Company Name]
- **Target Role:** [e.g. Senior Software Engineer]
- **Location:** [Remote / City, Country]
- **Job Link:** [https://...]

---

## 📋 Full Job Description & Requirements
[Paste the raw job description, responsibilities, required qualifications, and tech stack here...]
`;

export const BLANK_TAILORED_CV = `# [CANDIDATE FULL NAME]
**[Target Role Title | Primary Specialization]**  
[City, Country] • [candidate.email@example.com] • [+1 234 567 8900]  
[LinkedIn](https://linkedin.com/in/username) • [GitHub](https://github.com/username)

---

## PROFESSIONAL SUMMARY
[Dynamic 3-4 line summary connecting your seniority, technical alignment with target vacancy, and concluding with 2-3 verified quantitative engineering/business metrics.]

---

## TECHNICAL SKILLS
- **Languages & Core Fundamentals:** TypeScript, JavaScript (ESNext), Python, SQL, HTML5, Modern CSS
- **Frameworks, Architecture & Ecosystem:** React, Next.js, Node.js, RESTful APIs, State Management
- **Tooling, Testing, CI/CD & AI Integrations:** Docker, Jest, Vitest, Git, CI/CD, AWS, Google Cloud

---

## PROFESSIONAL EXPERIENCE

### **[Target-Aligned Company / Experience 1]** | [Location / Remote]
*[Job Title]* | **[Mon YYYY – Present]**
- **[Action Verb]** achieved [X] as measured by [Y% metric] by designing and deploying [Z].
- **[Action Verb]** optimized core infrastructure reducing latency by **38%** for [volume].
- **[Leadership Verb]** standardized code quality and automated testing workflows.

---

### **[Experience 2]** | [Location / Remote]
*[Job Title]* | **[Mon YYYY – Mon YYYY]**
- **[Action Verb]** modernized frontend codebase with TypeScript, preventing **40%** of runtime bugs.
- **[Action Verb]** decoupled state architecture, accelerating initial load times by **32%**.

---

## EDUCATION & CERTIFICATIONS
- **[Degree / Program]** – [University / Institution], [Year]
- **[Verified Industry Certification 1]** – [Issuer], [Year]
- **[Verified Industry Certification 2]** – [Issuer], [Year]

---

## LANGUAGES
- **[Language 1]:** Native
- **[Language 2]:** C1 – Advanced / Full Professional Working
`;

export const BLANK_GAP_REPORT = `# MATCHING & TAILORING STRATEGY REPORT (Gap Analysis)
- **Target Company:** [Target Company]
- **Target Role:** [Target Role]
- **Estimated Match Score:** --/100
- **Critical Integrated Keywords:** [Keywords will appear here once synthesized]
- **Strategic Alignment Narrative:** [Paste your target vacancy and candidate master data, then click 'Synthesize Tailored CV' in the AI Tailor tab to generate your custom matching strategy.]
- **Identified Gaps & Mitigation:** [Identified gaps and mitigation recommendations will appear here.]
`;

export const DEMO_MASTER_DATA = `# ALEX MORGAN
**Senior Frontend Engineer | UI Architecture & High-Scale Systems**  
San Francisco, CA • alex.morgan@example.com • +1 415 555 0192  
[LinkedIn](https://linkedin.com/in/alexmorgan-eng) • [GitHub](https://github.com/alexmorgan-eng) • [Portfolio](https://alexmorgan.dev)

---

## 🎯 PROFESSIONAL SUMMARY & PITCH
Senior Frontend Engineer with 6+ years of experience specialized in architecting high-throughput web applications, microfrontends, and design systems using TypeScript, React, and Next.js. Proven track record of cutting CI/CD build times by 50%, eliminating 40% of runtime errors through strict type systems, and scaling checkout experiences processing over $80M in annualized transactions.

---

## 🛠️ MASTER TECH STACK & COMPETENCIES
- **Languages & Core Fundamentals:** TypeScript, JavaScript (ESNext), Python, SQL, HTML5, CSS3, Core Web Vitals
- **Frameworks & State Architecture:** React, Next.js, Node.js, Zustand, Redux Toolkit, React Query, RESTful APIs, GraphQL
- **Tooling, Testing, CI/CD & Cloud:** Vite, Webpack Module Federation, Jest, React Testing Library, Playwright, Docker, CI/CD, AWS

---

## 💼 CAREER HISTORY & KEY ACHIEVEMENTS

### **FinScale Technologies** | San Francisco, CA (Remote)
*Staff Frontend Engineer* | **Oct 2022 – Present**
- **Spearheaded** the architectural migration from a legacy monolithic SPA to a modular **Microfrontend Architecture** using **Webpack Module Federation**, reducing core bundle sizes by **45%** and accelerating team deployment frequency by **3.5x**.
- **Engineered** a real-time merchant onboarding portal with **TypeScript** and **React**, cutting onboarding drop-off by **28%** and supporting over **$80M+ in annual transaction volume**.
- **Standardized** automated testing across 4 feature squads by introducing **Jest** and **Playwright** end-to-end suites, raising test coverage from **38% to 84%** and cutting production bug escapes by **40%**.

---

### **Nova Cloud Systems** | Austin, TX
*Senior Frontend Engineer* | **Jan 2020 – Sep 2022**
- **Architected** high-performance data analytics dashboards using **React**, **Zustand**, and **Virtual Tables**, rendering 50,000+ real-time time-series records at a steady **60 FPS**.
- **Streamlined** CI/CD release pipelines with GitHub Actions and Docker, reducing build and verification times by **52%**.
- **Mentored** 6 junior and mid-level software engineers on Clean Code, design patterns, and accessibility standards (WCAG 2.1 AA).

---

## 🎓 EDUCATION & CERTIFICATIONS
- **B.S. in Computer Science** – University of California, Berkeley, 2019
- **AWS Certified Developer – Associate** – Amazon Web Services, 2023
- **Meta Certified Front-End Developer** – Meta, 2022

---

## 🌐 LANGUAGES
- **English:** Native
- **Spanish:** C1 – Professional Working Proficiency
`;

export const DEMO_TARGET_JOB = `# 🎯 Target Job Posting

## 📌 Vacancy Overview
- **Company:** Stripe
- **Target Role:** Senior Frontend Engineer – Core Payments Platform
- **Location:** Remote (Global / Americas)
- **Job Portal:** https://stripe.com/jobs/senior-frontend-engineer

---

## 📋 Full Job Description & Requirements
We are looking for a Senior Frontend Engineer to build resilient, ultra-fast web user experiences for global payments. You will design modular UI components, optimize bundle sizes, and collaborate on mission-critical transactional workflows.

### Key Responsibilities:
- Build performant, accessible web applications using TypeScript, React, and modern state architectures.
- Architect modular frontend components and microfrontends with zero runtime errors.
- Optimize CI/CD pipelines, automated testing (Jest/Vitest), and Core Web Vitals.
- Partner with product managers and backend engineers to integrate high-throughput APIs.

### Ideal Qualifications:
- 5+ years of experience with React, TypeScript, and modern frontend ecosystems.
- Deep understanding of Webpack/Vite module federation, performance profiling, and state management (Zustand/Redux).
- Proven track record using metrics and quantifiable results (Google XYZ achievement formula).
`;

export const DEMO_TAILORED_CV = `# ALEX MORGAN
**Senior Frontend Engineer – Core Payments Platform**  
San Francisco, CA • alex.morgan@example.com • +1 415 555 0192  
[LinkedIn](https://linkedin.com/in/alexmorgan-eng) • [GitHub](https://github.com/alexmorgan-eng) • [Portfolio](https://alexmorgan.dev)

---

## PROFESSIONAL SUMMARY
Senior Frontend Engineer with 6+ years of experience specialized in **TypeScript**, **React**, and **Microfrontends**, building resilient user experiences for high-volume transactions. Proven track record of cutting CI/CD build times by **50%**, reducing production runtime errors by **40%**, and architecting payment onboarding workflows handling over **$80M+ in transaction volume**.

---

## TECHNICAL SKILLS
- **Languages & Core Fundamentals:** TypeScript, JavaScript (ESNext), Python, SQL, HTML5, CSS3, Core Web Vitals
- **Frameworks, Architecture & Ecosystem:** React, Next.js, Webpack Module Federation, Node.js, Zustand, Redux, RESTful APIs
- **Tooling, Testing, CI/CD & AI Integrations:** Jest, React Testing Library, Playwright, Vite, Docker, GitHub Actions CI/CD, AWS

---

## PROFESSIONAL EXPERIENCE

### **FinScale Technologies** | San Francisco, CA (Remote)
*Staff Frontend Engineer* | Oct 2022 – Present
- **Spearheaded** modular **Microfrontend Architecture** using **Webpack Module Federation**, reducing core bundle sizes by **45%** and accelerating cross-team deployments by **3.5x**.
- **Engineered** high-resilience payment onboarding flows with **TypeScript** and **React**, driving a **28% reduction in checkout drop-offs** across **$80M+ in annual payments**.
- **Standardized** automated testing with **Jest** and **Playwright**, boosting test coverage to **84%** and cutting production bug escapes by **40%**.

---

### **Nova Cloud Systems** | Austin, TX
*Senior Frontend Engineer* | Jan 2020 – Sep 2022
- **Architected** high-performance transactional dashboards with **React** and **Zustand**, maintaining **60 FPS** across 50,000+ live data streams.
- **Streamlined** automated CI/CD deployment pipelines, cutting build and test execution cycles by **52%**.
- **Standardized** accessibility standards across customer interfaces, achieving **100% WCAG 2.1 AA compliance**.

---

## EDUCATION & CERTIFICATIONS
- **B.S. in Computer Science** – University of California, Berkeley, 2019
- **AWS Certified Developer – Associate** – Amazon Web Services, 2023
- **Meta Certified Front-End Developer** – Meta, 2022

---

## LANGUAGES
- **English:** Native
- **Spanish:** C1 – Professional Working Proficiency
`;

export const DEMO_GAP_REPORT = `# MATCHING & TAILORING STRATEGY REPORT (Gap Analysis)
- **Target Company:** Stripe
- **Target Role:** Senior Frontend Engineer – Core Payments Platform
- **Estimated Match Score:** 94/100
- **Critical Integrated Keywords:** [TypeScript, React, Microfrontends, Webpack Module Federation, Core Web Vitals, Jest, CI/CD, Zustand]
- **Strategic Alignment Narrative:** The candidate demonstrates strong senior-level alignment with Stripe's payments platform requirements. Prior experience architecting microfrontends with Webpack Module Federation and building transaction workflows processing $80M+ directly addresses the job posting. Quantitative engineering achievements and strong CI/CD optimization history provide compelling evidence of technical ownership.
- **Identified Gaps & Mitigation:** The target job description highlights deep payment processing integrations and international localized flows. While the candidate has solid experience in merchant onboarding and scale, specific card network protocol details can be highlighted during technical interview rounds by drawing parallels to high-throughput financial dashboards.
`;

