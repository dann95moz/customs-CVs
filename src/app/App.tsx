import React from 'react';
import {
  useResumeStore,
  useAuditReport,
  useGapInfo,
  useDerivedFlags,
} from '../store';
import { StudioNavbar } from '../components/studio/StudioNavbar';
import { WizardStepper } from '../components/studio/WizardStepper';
import { StepMasterData } from '../components/studio/StepMasterData';
import { StepTargetJob } from '../components/studio/StepTargetJob';
import { StepPreview } from '../components/studio/StepPreview';
import { QualityAuditView } from '../components/studio/QualityAuditView';
import { GapAnalysisView } from '../components/studio/GapAnalysisView';
import { SettingsView } from '../components/studio/SettingsView';
import { ApplicationsHistoryView } from '../components/studio/ApplicationsHistoryView';
import { LockedViewCard } from '../components/studio/LockedViewCard';
import { SynthesisErrorBanner } from '../components/studio/SynthesisErrorBanner';
import { WelcomeLandingView } from '../components/landing/WelcomeLandingView';
import {
  BLANK_MASTER_DATA,
  DEMO_MASTER_DATA,
  DEMO_TARGET_JOB,
} from '../constants/templates';
import './App.css';

export const App: React.FC = () => {
  const activeTab = useResumeStore((s) => s.activeTab);
  const setActiveTab = useResumeStore((s) => s.setActiveTab);
  const wizardStep = useResumeStore((s) => s.wizardStep);
  const setWizardStep = useResumeStore((s) => s.setWizardStep);
  const masterData = useResumeStore((s) => s.masterData);
  const setMasterData = useResumeStore((s) => s.setMasterData);
  const targetJob = useResumeStore((s) => s.targetJob);
  const setTargetJob = useResumeStore((s) => s.setTargetJob);
  const companyName = useResumeStore((s) => s.companyName);
  const setCompanyName = useResumeStore((s) => s.setCompanyName);
  const targetRole = useResumeStore((s) => s.targetRole);
  const setTargetRole = useResumeStore((s) => s.setTargetRole);
  const providerSettings = useResumeStore((s) => s.providerSettings);
  const setProviderSettings = useResumeStore((s) => s.setProviderSettings);
  const rules = useResumeStore((s) => s.rules);
  const setRules = useResumeStore((s) => s.setRules);
  const gapMarkdown = useResumeStore((s) => s.gapMarkdown);
  const setCvMarkdown = useResumeStore((s) => s.setCvMarkdown);
  const isGenerating = useResumeStore((s) => s.isGenerating);
  const generationStep = useResumeStore((s) => s.generationStep);
  const handleGenerate = useResumeStore((s) => s.handleGenerate);
  const handleResetWorkspace = useResumeStore((s) => s.handleResetWorkspace);

  // Derived state via optimized memoized hooks
  const { hasTargetJob, hasGeneratedCv, hasGapReport } = useDerivedFlags();
  const auditReport = useAuditReport();
  const gapInfo = useGapInfo();



  return (
    <div className="studio-app">
      {/* Top Navbar */}
      <StudioNavbar />

      {/* Stepper Bar for Guided Wizard */}
      {activeTab === 'wizard' && (
        <WizardStepper
          currentStep={wizardStep}
          onSelectStep={setWizardStep}
          hasMasterData={Boolean(masterData && masterData.trim().length > 60 && !masterData.includes('[CANDIDATE FULL NAME]'))}
          hasTargetJob={hasTargetJob}
          hasGeneratedCv={hasGeneratedCv}
        />
      )}

      {/* Main Workspace Body */}
      <div className="studio-body">
        {/* VIEW: WELCOME & ONBOARDING LANDING */}
        {activeTab === 'landing' && <WelcomeLandingView />}

        {/* WIZARD FLOW: 3 STREAMLINED STEPS */}
        {activeTab === 'wizard' && (
          <>
            {wizardStep === 'profile' && (
              <StepMasterData
                content={masterData}
                onChange={setMasterData}
                onLoadSample={() => setMasterData(DEMO_MASTER_DATA)}
                onResetTemplate={() => setMasterData(BLANK_MASTER_DATA)}
                onNextStep={() => setWizardStep('target')}
              />
            )}

            {wizardStep === 'target' && (
              <StepTargetJob
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
                onPrevStep={() => setWizardStep('profile')}
                onNextStep={() => setWizardStep('preview')}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                generationStep={generationStep}
                hasGeneratedCv={hasGeneratedCv}
              />
            )}

            {(wizardStep === 'preview' || wizardStep === 'tailor') && <StepPreview />}
          </>
        )}

        {/* VIEW: QUALITY AUDIT (1-10 SCALE) */}
        {activeTab === 'audit' && (
          <div className="audit-workspace-layout">
            {hasGeneratedCv ? (
              <QualityAuditView
                report={auditReport}
                onRefresh={() => setCvMarkdown((prev: string) => `${prev}`)}
              />
            ) : (
              <LockedViewCard
                iconType="gauge"
                title="Quality Audit Requires a Tailored CV"
                description="The calibrated 1–10 executive scoring engine evaluates real achievement density, Google XYZ formula percentages, and ATS compliance. Please create or synthesize your tailored CV first to unlock section-by-section scoring."
                actionText="Go to Target Job & Tailor"
                actionIcon="zap"
                onAction={() => {
                  setActiveTab('wizard');
                  setWizardStep('target');
                }}
              />
            )}
          </div>
        )}

        {/* VIEW: GAP ANALYSIS & MATCHING STRATEGY */}
        {activeTab === 'gap' && (
          <div className="gap-workspace-layout">
            {!hasTargetJob ? (
              <LockedViewCard
                iconType="target"
                badgeVariant="target"
                title="No Target Vacancy Entered Yet"
                description="Gap Strategy cross-references your candidate background against specific employer requirements. Please paste or upload a target job posting in the wizard first."
                actionText="Add Target Job in Wizard"
                actionIcon="file-text"
                onAction={() => {
                  setActiveTab('wizard');
                  setWizardStep('target');
                }}
              />
            ) : !hasGapReport ? (
              <LockedViewCard
                iconType="zap"
                badgeVariant="ai"
                title="Ready to Synthesize Gap Strategy"
                description={
                  <>
                    You have entered target vacancy details for <strong>{companyName || 'Target Company'}</strong>. Click below to synthesize your tailored CV and generate the matching strategy report with keyword extraction.
                  </>
                }
                actionText={isGenerating ? 'Synthesizing...' : '✨ Synthesize Tailored CV Now'}
                actionIcon="zap"
                isDisabled={isGenerating}
                onAction={handleGenerate}
              />
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

        {/* VIEW: APPLICATIONS & CV VERSIONS HISTORY */}
        {activeTab === 'history' && (
          <div className="history-workspace-layout" style={{ height: '100%' }}>
            <ApplicationsHistoryView />
          </div>
        )}

        {/* VIEW: SETTINGS & RULES */}
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
      <SynthesisErrorBanner />
    </div>
  );
};
