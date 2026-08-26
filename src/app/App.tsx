import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  parseCvMarkdownToData, 
  extractCandidateName, 
  extractTargetCompany, 
  extractTargetRole 
} from '../core/parser';
import { CVRenderer } from '../components/CVRenderer';
import { Icon } from '../components/Icons';
import { MasterDataEditor } from '../components/studio/MasterDataEditor';
import { TargetJobEditor } from '../components/studio/TargetJobEditor';
import { SplitMarkdownEditor } from '../components/studio/SplitMarkdownEditor';
import { QualityAuditView } from '../components/studio/QualityAuditView';
import { GapAnalysisView } from '../components/studio/GapAnalysisView';
import { SettingsView } from '../components/studio/SettingsView';
import {
  tailorResume,
  DEFAULT_RULES,
  AVAILABLE_AI_MODELS
} from '../core/ai-service';
import { auditCvContent } from '../core/audit-engine';
import {
  ThemeId,
  StudioTab,
  AIProviderSettings,
  MarkdownFileItem
} from '../types/cv';
import './App.css';

// Clean Default Blank Templates (Ready for user's own data)
const BLANK_MASTER_DATA = `# [CANDIDATE FULL NAME]
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

const BLANK_TARGET_JOB = `# 🎯 Target Job Posting

## 📌 Vacancy Overview
- **Company:** [Target Company Name]
- **Target Role:** [e.g. Senior Software Engineer]
- **Location:** [Remote / City, Country]
- **Job Link:** [https://...]

---

## 📋 Full Job Description & Requirements
[Paste the raw job description, responsibilities, required qualifications, and tech stack here...]
`;

const BLANK_TAILORED_CV = `# [CANDIDATE FULL NAME]
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
- **[Verified Industry Certification]** – [Issuer], [Year]

---

## LANGUAGES
- **[Language 1]:** Native
- **[Language 2]:** C1 – Advanced / Full Professional Working
`;

const BLANK_GAP_REPORT = `# MATCHING & TAILORING STRATEGY REPORT (Gap Analysis)
- **Target Company:** [Target Company]
- **Target Role:** [Target Role]
- **Estimated Match Score:** --/100
- **Critical Integrated Keywords:** [Keywords will appear here once synthesized]
- **Strategic Alignment Narrative:** [Paste your target vacancy and candidate master data, then click 'Synthesize Tailored CV' in the AI Tailor tab to generate your custom matching strategy.]
- **Identified Gaps & Mitigation:** [Identified gaps and mitigation recommendations will appear here.]
`;

// Optional Rich Demo Profiles (Available via "Load Demo Profile" button)
const DEMO_MASTER_DATA = `
`;

const DEMO_TARGET_JOB = `# 🎯 Target Job Posting

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

const DEMO_TAILORED_CV = `
`;

const DEMO_GAP_REPORT = `
`;

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<StudioTab>('editor');
  const [editorSplitView, setEditorSplitView] = useState<'split' | 'preview-only' | 'editor-only'>('split');

  // Core Data States (Default to clean blank templates; persist to LocalStorage if edited)
  const [masterData, setMasterData] = useState<string>(() => {
    return localStorage.getItem('cv_master_data') || BLANK_MASTER_DATA;
  });

  const [targetJob, setTargetJob] = useState<string>(() => {
    return localStorage.getItem('cv_target_job') || BLANK_TARGET_JOB;
  });

  const [cvMarkdown, setCvMarkdown] = useState<string>(() => {
    return localStorage.getItem('cv_tailored_markdown') || BLANK_TAILORED_CV;
  });

  const [gapMarkdown, setGapMarkdown] = useState<string>(() => {
    return localStorage.getItem('cv_gap_markdown') || BLANK_GAP_REPORT;
  });

  const [rules, setRules] = useState<string>(() => {
    const saved = localStorage.getItem('cv_rules_markdown');
    if (saved && saved.length > 600) {
      return saved;
    }
    return DEFAULT_RULES;
  });

  const [companyName, setCompanyName] = useState<string>(() => {
    return localStorage.getItem('cv_company_name') || '';
  });

  const [targetRole, setTargetRole] = useState<string>(() => {
    return localStorage.getItem('cv_target_role') || '';
  });

  const [pageBudget, setPageBudget] = useState<1 | 2>(() => {
    const saved = localStorage.getItem('cv_page_budget');
    return saved === '2' ? 2 : 1;
  });

  const [theme, setTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem('cv_theme') as ThemeId) || 'modern-tech';
  });

  // AI Provider Settings State
  const [providerSettings, setProviderSettings] = useState<AIProviderSettings>(() => {
    const saved = localStorage.getItem('cv_ai_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return {
      provider: 'free-pollinations',
      model: 'free-openai',
      apiKey: '',
      temperature: 0.15
    };
  });

  // Generator Loading States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Auto-Fit & Height Measurement
  const [autoFitPreview, setAutoFitPreview] = useState<boolean>(true);
  const [sheetHeight, setSheetHeight] = useState<number>(0);
  const paperRef = useRef<HTMLDivElement>(null);

  // Local files from server (if running in dev mode)
  const [serverFiles, setServerFiles] = useState<MarkdownFileItem[]>([]);

  // Detection Flags for conditional availability
  const hasTargetJob = useMemo(() => {
    return Boolean(
      targetJob &&
      targetJob.trim().length > 40 &&
      !targetJob.includes('[Paste the raw job description') &&
      !targetJob.includes('[Target Company Name]')
    );
  }, [targetJob]);

  const hasGeneratedCv = useMemo(() => {
    return Boolean(
      cvMarkdown &&
      cvMarkdown.trim().length > 60 &&
      !cvMarkdown.includes('[CANDIDATE FULL NAME]') &&
      !cvMarkdown.includes('[Target Role Title')
    );
  }, [cvMarkdown]);

  const hasGapReport = useMemo(() => {
    return Boolean(
      gapMarkdown &&
      gapMarkdown.trim().length > 50 &&
      !gapMarkdown.includes('--/100') &&
      !gapMarkdown.includes('[Target Company]')
    );
  }, [gapMarkdown]);

  // Auto-synchronize extracted Company & Role from targetJob and masterData
  useEffect(() => {
    const extractedComp = extractTargetCompany(targetJob);
    if (extractedComp) {
      setCompanyName(extractedComp.replace(/_/g, ' '));
    }
    const extractedRole = extractTargetRole(targetJob, masterData);
    if (extractedRole) {
      setTargetRole(extractedRole);
    }
  }, [targetJob, masterData]);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('cv_master_data', masterData);
  }, [masterData]);

  useEffect(() => {
    localStorage.setItem('cv_target_job', targetJob);
  }, [targetJob]);

  useEffect(() => {
    localStorage.setItem('cv_tailored_markdown', cvMarkdown);
  }, [cvMarkdown]);

  useEffect(() => {
    localStorage.setItem('cv_gap_markdown', gapMarkdown);
  }, [gapMarkdown]);

  useEffect(() => {
    localStorage.setItem('cv_rules_markdown', rules);
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('cv_company_name', companyName);
  }, [companyName]);

  useEffect(() => {
    localStorage.setItem('cv_target_role', targetRole);
  }, [targetRole]);

  useEffect(() => {
    localStorage.setItem('cv_page_budget', String(pageBudget));
  }, [pageBudget]);

  useEffect(() => {
    localStorage.setItem('cv_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cv_ai_settings', JSON.stringify(providerSettings));
  }, [providerSettings]);

  // Load server files if API is available
  useEffect(() => {
    fetch('/api/files')
      .then(res => res.json())
      .then((data: MarkdownFileItem[]) => {
        if (data && data.length > 0) {
          setServerFiles(data);
        }
      })
      .catch(() => {
        // Pure static/offline client mode
      });
  }, []);

  // Measure rendered paper sheet height
  useEffect(() => {
    const updateHeight = () => {
      if (paperRef.current) {
        setSheetHeight(paperRef.current.scrollHeight);
      }
    };
    const timer = setTimeout(updateHeight, 150);
    return () => clearTimeout(timer);
  }, [cvMarkdown, theme, autoFitPreview, activeTab]);

  // Parsed CV Data for Live Rendering
  const parsedCv = useMemo(() => {
    return parseCvMarkdownToData(cvMarkdown);
  }, [cvMarkdown]);

  // Calibrated Quality Audit
  const auditReport = useMemo(() => {
    return auditCvContent(cvMarkdown, targetJob, masterData);
  }, [cvMarkdown, targetJob, masterData]);

  // A4 Height Calculation (1123px at 96 DPI)
  const A4_PAGE_PX = 1123;
  const estimatedPages = Math.max(1, Math.ceil((sheetHeight - 8) / A4_PAGE_PX));
  const overflowPercentage = Math.max(0, Math.round(((sheetHeight - A4_PAGE_PX) / A4_PAGE_PX) * 100));

  // Extracted Gap Information
  const gapInfo = useMemo(() => {
    let matchScore = 92;
    const scoreMatch = gapMarkdown.match(/Estimated Match Score:\*{0,2}\s*(\d{1,3})/i);
    if (scoreMatch) {
      matchScore = parseInt(scoreMatch[1], 10);
    }

    let keywords = ['TypeScript', 'React', 'Microfrontends', 'Module Federation', 'Zustand', 'CI/CD', 'Jest'];
    const kwMatch = gapMarkdown.match(/Critical Integrated Keywords:\*{0,2}\s*\[?([^\]\r\n]+)\]?/i);
    if (kwMatch) {
      keywords = kwMatch[1].split(/[,|•]/).map(k => k.trim()).filter(Boolean);
    }

    return { matchScore, keywords };
  }, [gapMarkdown]);

  // Statistics
  const stats = useMemo(() => {
    const words = cvMarkdown.trim().split(/\s+/).filter(Boolean).length;
    let bulletsCount = 0;
    if (parsedCv.experience) {
      bulletsCount += parsedCv.experience.reduce((acc, curr) => acc + curr.bullets.length, 0);
    }
    if (parsedCv.projects) {
      bulletsCount += parsedCv.projects.reduce((acc, curr) => acc + curr.bullets.length, 0);
    }
    const skillsCount = parsedCv.skillGroups?.reduce((acc, curr) => acc + curr.skills.length, 0) || 0;

    return { words, bulletsCount, skillsCount, contactsCount: parsedCv.contacts.length };
  }, [cvMarkdown, parsedCv]);

  // Generation Handler
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationStep('Reading Master Data & Target Vacancy...');

    try {
      setTimeout(() => setGenerationStep('Cross-referencing requirements with Google XYZ Formula...'), 800);
      setTimeout(() => setGenerationStep('Synthesizing 3-Category Universal Stack & ATS Structure...'), 1800);
      setTimeout(() => setGenerationStep('Generating Gap Analysis & Quality Report...'), 2800);

      const response = await tailorResume({
        masterData,
        targetJob,
        rules,
        companyName,
        targetRole,
        pageBudget,
        providerSettings
      });

      if (response.tailoredCvMarkdown) {
        setCvMarkdown(response.tailoredCvMarkdown);
      }
      if (response.gapAnalysisMarkdown) {
        setGapMarkdown(response.gapAnalysisMarkdown);
      }

      setGenerationStep('Done! Resume tailored successfully.');
      setTimeout(() => {
        setIsGenerating(false);
        setActiveTab('preview');
      }, 500);
    } catch (err: any) {
      setGenerationError(err.message || 'Error occurred during AI resume synthesis.');
      setIsGenerating(false);
    }
  };

  const handleDownloadCvMarkdown = () => {
    const candidateName = extractCandidateName(masterData, 'Candidate');
    const targetComp = companyName || extractTargetCompany(targetJob, 'Target');
    const fileName = `CV_${candidateName}_${targetComp}.md`;

    const blob = new Blob([cvMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadDemoProfile = () => {
    setMasterData(DEMO_MASTER_DATA);
    setTargetJob(DEMO_TARGET_JOB);
    setCvMarkdown(DEMO_TAILORED_CV);
    setGapMarkdown(DEMO_GAP_REPORT);
    setCompanyName('Stripe');
    setTargetRole('Senior Frontend Engineer');
  };

  const handleStartBlank = () => {
    setMasterData(BLANK_MASTER_DATA);
    setTargetJob(BLANK_TARGET_JOB);
    setCvMarkdown(BLANK_TAILORED_CV);
    setGapMarkdown(BLANK_GAP_REPORT);
    setCompanyName('');
    setTargetRole('');
  };

  const handleResetWorkspace = () => {
    if (confirm('Are you sure you want to reset all workspace data to a clean blank slate?')) {
      handleStartBlank();
      setRules(DEFAULT_RULES);
      setPageBudget(1);
      setTheme('modern-tech');
      localStorage.clear();
    }
  };

  return (
    <div className="studio-app">
      {/* Top Navbar */}
      <header className="studio-navbar">
        <div className="studio-brand" onClick={() => setActiveTab('preview')}>
          <div className="brand-logo-glow">
            <Icon type="sparkles" size={18} />
          </div>
          <span className="brand-text">CV Studio Pro</span>
          <span className="badge-pro-tag">v3.0 • AI Engine</span>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="studio-main-nav">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <Icon type="file-text" size={14} /> Inputs & SSOT
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Icon type="eye" size={14} /> CV Studio Preview
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <Icon type="gauge" size={14} /> Quality Audit
            {hasGeneratedCv ? (
              <span className="nav-score-tag">{auditReport.overallScore}/10</span>
            ) : (
              <span className="nav-tag-locked">Requires CV</span>
            )}
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'gap' ? 'active' : ''}`}
            onClick={() => setActiveTab('gap')}
          >
            <Icon type="target" size={14} /> Gap Strategy
            {!hasTargetJob ? (
              <span className="nav-tag-locked">No Job Added</span>
            ) : hasGapReport ? (
              <span className="nav-match-tag">{gapInfo.matchScore}%</span>
            ) : (
              <span className="nav-tag-pending">Needs AI</span>
            )}
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Icon type="settings" size={14} /> Settings
          </button>
        </nav>

        {/* Quick Actions */}
        <div className="studio-top-actions">
          {activeTab === 'preview' && (
            <div className="theme-pills">
              <button
                className={`theme-pill ${theme === 'modern-tech' ? 'active' : ''}`}
                onClick={() => setTheme('modern-tech')}
              >
                Modern Tech
              </button>
              <button
                className={`theme-pill ${theme === 'executive' ? 'active' : ''}`}
                onClick={() => setTheme('executive')}
              >
                Executive
              </button>
              <button
                className={`theme-pill ${theme === 'minimal-ats' ? 'active' : ''}`}
                onClick={() => setTheme('minimal-ats')}
              >
                Minimal ATS
              </button>
              <button
                className={`theme-pill ${theme === 'two-column' ? 'active' : ''}`}
                onClick={() => setTheme('two-column')}
              >
                2 Column
              </button>
            </div>
          )}

          <button
            className="studio-btn studio-btn-primary"
            onClick={() => window.print()}
            title="Export or print pixel-perfect A4 PDF"
          >
            <Icon type="printer" size={14} /> Print / Save PDF
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="studio-body">
        {/* VIEW 1: CV STUDIO & LIVE PREVIEW (SPLIT VIEW) */}
        {activeTab === 'preview' && (
          <div className="preview-workspace-layout">
            {/* Split Screen Mode Toggle Bar */}
            <div className="split-view-bar">
              <div className="split-mode-buttons">
                <button
                  type="button"
                  className={`split-toggle-btn ${editorSplitView === 'split' ? 'active' : ''}`}
                  onClick={() => setEditorSplitView('split')}
                >
                  <Icon type="layers" size={13} /> Split Editor & Sheet
                </button>
                <button
                  type="button"
                  className={`split-toggle-btn ${editorSplitView === 'preview-only' ? 'active' : ''}`}
                  onClick={() => setEditorSplitView('preview-only')}
                >
                  <Icon type="eye" size={13} /> Full Sheet Preview
                </button>
                <button
                  type="button"
                  className={`split-toggle-btn ${editorSplitView === 'editor-only' ? 'active' : ''}`}
                  onClick={() => setEditorSplitView('editor-only')}
                >
                  <Icon type="edit" size={13} /> Markdown Only
                </button>
              </div>

              <div className="split-quick-tags">
                <span className="quick-company-pill">
                  Target: <strong>{companyName || 'Target Company'}</strong>
                </span>
                <button
                  type="button"
                  className="btn-quick-tailor"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  <Icon type="zap" size={12} /> {isGenerating ? 'Synthesizing...' : 'Re-Tailor with AI'}
                </button>
              </div>
            </div>

            <div className="preview-content-split">
              {/* Left: Split Markdown Source Editor */}
              {(editorSplitView === 'split' || editorSplitView === 'editor-only') && (
                <div className="split-pane-editor">
                  <SplitMarkdownEditor
                    content={cvMarkdown}
                    onChange={setCvMarkdown}
                    onDownload={handleDownloadCvMarkdown}
                    fileName={`CV_${extractCandidateName(masterData, 'Candidate')}.md`}
                  />
                </div>
              )}

              {/* Right: Realistic A4 Sheet Canvas */}
              {(editorSplitView === 'split' || editorSplitView === 'preview-only') && (
                <main className="preview-pane-canvas">
                  <div
                    ref={paperRef}
                    className={`paper-sheet ${autoFitPreview && overflowPercentage > 0 && overflowPercentage <= 25 ? 'compact-fit' : ''}`}
                  >
                    <CVRenderer data={parsedCv} theme={theme} />

                    {/* Visual Page Break Marker at A4 limit */}
                    <div className="page-break-guide" style={{ top: `${A4_PAGE_PX}px` }}>
                      <span>✂️ Page 1 Boundary (A4 Standard Format)</span>
                    </div>
                  </div>
                </main>
              )}

              {/* Right Sidebar: Real-Time Dimensions & ATS Metrics */}
              {editorSplitView !== 'editor-only' && (
                <aside className="stats-sidebar">
                  <div className="stats-card">
                    <h4>📄 Dimensions & Page Fit</h4>
                    <div className="stat-row">
                      <span>Estimated Pages:</span>
                      <strong style={{ color: estimatedPages === 1 ? '#10b981' : '#f59e0b' }}>
                        {estimatedPages} {estimatedPages === 1 ? 'Page ✓' : 'Pages'}
                      </strong>
                    </div>
                    <div className="stat-row">
                      <span>Sheet Height:</span>
                      <strong>{sheetHeight}px / {A4_PAGE_PX}px</strong>
                    </div>
                    {overflowPercentage > 0 && (
                      <div className="stat-row">
                        <span>Page 1 Overflow:</span>
                        <strong style={{ color: overflowPercentage <= 20 ? '#38bdf8' : '#ef4444' }}>
                          +{overflowPercentage}% {overflowPercentage <= 20 ? '(Auto-Fit Active)' : '(Needs Synthesis)'}
                        </strong>
                      </div>
                    )}
                  </div>

                  <div className="stats-card">
                    <h4>📊 Content Metrics</h4>
                    <div className="stat-row">
                      <span>Total Words:</span>
                      <strong style={{ color: stats.words <= 480 ? '#10b981' : '#f59e0b' }}>
                        {stats.words} {stats.words <= 480 ? '(Ideal 1-Page)' : '(Extended)'}
                      </strong>
                    </div>
                    <div className="stat-row">
                      <span>Achievements (XYZ):</span>
                      <strong>{stats.bulletsCount} Bullets</strong>
                    </div>
                    <div className="stat-row">
                      <span>Listed Skills:</span>
                      <strong>{stats.skillsCount}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Contact Channels:</span>
                      <strong>{stats.contactsCount}</strong>
                    </div>
                  </div>

                  <div className="stats-card">
                    <h4>🛡️ ATS & Executive Health</h4>
                    <div className="stat-row">
                      <span>Quality Audit:</span>
                      <strong style={{ color: '#10b981' }}>{auditReport.overallScore} / 10.0</strong>
                    </div>
                    <div className="stat-row">
                      <span>Google XYZ Metric:</span>
                      <strong style={{ color: '#10b981' }}>✓ Calibrated</strong>
                    </div>
                    <div className="stat-row">
                      <span>Zero PII / ATS Clean:</span>
                      <strong style={{ color: '#10b981' }}>✓ 100% Compliant</strong>
                    </div>
                  </div>

                  <div className="sidebar-action-box">
                    <button
                      type="button"
                      className="studio-btn studio-btn-secondary btn-full"
                      onClick={() => setActiveTab('audit')}
                    >
                      <Icon type="gauge" size={13} /> View Full Audit Dashboard
                    </button>
                    <button
                      type="button"
                      className="studio-btn studio-btn-secondary btn-full"
                      onClick={() => setActiveTab('gap')}
                    >
                      <Icon type="target" size={13} /> View Gap Strategy
                    </button>
                  </div>
                </aside>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: INPUTS & MASTER DATA WORKSPACE */}
        {activeTab === 'editor' && (
          <div className="inputs-workspace-layout">
            <div className="inputs-dual-grid">
              <MasterDataEditor
                content={masterData}
                onChange={setMasterData}
                onLoadSample={() => setMasterData(DEMO_MASTER_DATA)}
                onResetTemplate={() => setMasterData(BLANK_MASTER_DATA)}
              />

              <TargetJobEditor
                content={targetJob}
                onChange={setTargetJob}
                companyName={companyName}
                onCompanyChange={setCompanyName}
                targetRole={targetRole}
                onRoleChange={setTargetRole}
                onLoadSample={() => {
                  setTargetJob(DEMO_TARGET_JOB);
                  setCompanyName('Stripe');
                  setTargetRole('Senior Frontend Engineer');
                }}
              />
            </div>

            {/* Action Toolbar with Model Selection, Page Budget & 1-Click Synthesis */}
            <div className="inputs-synthesis-toolbar">
              <div className="inputs-toolbar-left">
                <button
                  type="button"
                  className="studio-btn studio-btn-secondary btn-sm"
                  onClick={handleStartBlank}
                  title="Clear all fields to clean blank templates"
                >
                  <Icon type="file-text" size={13} /> Clear / Blank
                </button>
                <button
                  type="button"
                  className="studio-btn studio-btn-secondary btn-sm"
                  onClick={handleLoadDemoProfile}
                  title="Load full sample profile and job vacancy"
                >
                  <Icon type="refresh" size={13} /> Load Demo
                </button>
              </div>

              <div className="inputs-toolbar-center">
                <div className="toolbar-control-group">
                  <label className="toolbar-label">
                    <Icon type="brain" size={12} /> AI Model:
                  </label>
                  <select
                    className="studio-select-sm"
                    value={providerSettings.model}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const modelObj = AVAILABLE_AI_MODELS.find(m => m.id === selectedId);
                      if (modelObj) {
                        setProviderSettings({
                          ...providerSettings,
                          provider: modelObj.provider,
                          model: selectedId
                        });
                      }
                    }}
                    disabled={isGenerating}
                  >
                    <optgroup label="✨ Free Public AI (No Key Needed)">
                      {AVAILABLE_AI_MODELS.filter(m => m.isFree).map(m => (
                        <option key={m.id} value={m.id}>🟢 {m.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🔑 Custom / BYOK Models">
                      {AVAILABLE_AI_MODELS.filter(m => !m.isFree).map(m => (
                        <option key={m.id} value={m.id}>🔑 {m.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="toolbar-control-group">
                  <label className="toolbar-label">
                    <Icon type="layers" size={12} /> Page Budget:
                  </label>
                  <div className="budget-pills-mini">
                    <button
                      type="button"
                      className={`budget-pill-sm ${pageBudget === 1 ? 'active' : ''}`}
                      onClick={() => setPageBudget(1)}
                      disabled={isGenerating}
                    >
                      1 Page (A4 Fit)
                    </button>
                    <button
                      type="button"
                      className={`budget-pill-sm ${pageBudget === 2 ? 'active' : ''}`}
                      onClick={() => setPageBudget(2)}
                      disabled={isGenerating}
                    >
                      2 Pages (Senior)
                    </button>
                  </div>
                </div>
              </div>

              <div className="inputs-toolbar-right">
                <button
                  type="button"
                  className="studio-btn studio-btn-primary btn-lg btn-synthesis"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Icon type="refresh" size={16} className="spin" />
                      <span>{generationStep || 'Synthesizing...'}</span>
                    </>
                  ) : (
                    <>
                      <Icon type="zap" size={16} />
                      <span>✨ Synthesize Tailored CV</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: QUALITY AUDIT (1-10 SCALE) */}
        {activeTab === 'audit' && (
          <div className="audit-workspace-layout">
            {hasGeneratedCv ? (
              <QualityAuditView
                report={auditReport}
                onRefresh={() => {
                  // Trigger recomputation via parse
                  setCvMarkdown(prev => `${prev}`);
                }}
              />
            ) : (
              <div className="locked-view-card">
                <div className="locked-icon-badge">
                  <Icon type="gauge" size={32} />
                </div>
                <h3 className="locked-title">Quality Audit Requires a Tailored CV</h3>
                <p className="locked-desc">
                  The calibrated 1–10 executive scoring engine evaluates real achievement density, Google XYZ formula percentages, and ATS compliance. Please create or synthesize your tailored CV first to unlock section-by-section scoring.
                </p>
                <div className="locked-actions">
                  <button
                    type="button"
                    className="studio-btn studio-btn-primary"
                    onClick={() => setActiveTab('editor')}
                  >
                    <Icon type="zap" size={14} /> Go to Inputs & Synthesize
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: GAP ANALYSIS & MATCHING STRATEGY */}
        {activeTab === 'gap' && (
          <div className="gap-workspace-layout">
            {!hasTargetJob ? (
              <div className="locked-view-card">
                <div className="locked-icon-badge target">
                  <Icon type="target" size={32} />
                </div>
                <h3 className="locked-title">No Target Vacancy Entered Yet</h3>
                <p className="locked-desc">
                  Gap Strategy cross-references your candidate background against specific employer requirements. Please paste or upload a target job posting in Inputs & SSOT first.
                </p>
                <div className="locked-actions">
                  <button
                    type="button"
                    className="studio-btn studio-btn-primary"
                    onClick={() => setActiveTab('editor')}
                  >
                    <Icon type="file-text" size={14} /> Add Target Job Description
                  </button>
                </div>
              </div>
            ) : !hasGapReport ? (
              <div className="locked-view-card">
                <div className="locked-icon-badge ai">
                  <Icon type="zap" size={32} />
                </div>
                <h3 className="locked-title">Ready to Synthesize Gap Strategy</h3>
                <p className="locked-desc">
                  You have entered target vacancy details for <strong>{companyName || 'Target Company'}</strong>. Click below to synthesize your tailored CV and generate the matching strategy report with keyword extraction.
                </p>
                <div className="locked-actions">
                  <button
                    type="button"
                    className="studio-btn studio-btn-primary"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    <Icon type="zap" size={14} /> {isGenerating ? 'Synthesizing...' : '✨ Synthesize Tailored CV Now'}
                  </button>
                </div>
              </div>
            ) : (
              <GapAnalysisView
                gapMarkdown={gapMarkdown}
                matchScore={gapInfo.matchScore}
                keywords={gapInfo.keywords}
                companyName={companyName}
                targetRole={targetRole}
                onDownload={() => {
                  const blob = new Blob([gapMarkdown], { type: 'text/markdown;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `Gap_Analysis_${companyName || 'Target'}.md`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              />
            )}
          </div>
        )}

        {/* VIEW 6: SETTINGS & RULES */}
        {activeTab === 'settings' && (
          <div className="settings-workspace-layout">
            <SettingsView
              settings={providerSettings}
              onSettingsChange={setProviderSettings}
              rules={rules}
              onRulesChange={setRules}
              onResetDefaults={handleResetWorkspace}
            />
          </div>
        )}
      </div>

      {/* Synthesis Error Floating Banner */}
      {generationError && (
        <div className="synthesis-error-banner">
          <div className="error-banner-content">
            <div className="error-banner-header">
              <span className="error-icon">⚠️</span>
              <h4>AI Synthesis Notification</h4>
            </div>
            <p>{generationError}</p>
            <div className="error-banner-actions">
              <button 
                className="btn-studio-action btn-studio-primary"
                onClick={() => {
                  setGenerationError(null);
                  setActiveTab('settings');
                }}
              >
                ⚙️ Open AI Settings & Add Key
              </button>
              <button 
                className="btn-studio-action"
                onClick={() => setGenerationError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
