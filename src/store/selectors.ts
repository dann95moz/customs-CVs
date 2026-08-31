import { useMemo } from 'react';
import { useResumeStore } from './useResumeStore';
import { parseCvMarkdownToData } from '../core/parser';
import { auditCvContent } from '../core/audit-engine';
import { CVData, QualityAuditReport } from '../types/cv';

export const extractGapInfo = (gapMarkdown: string): { matchScore: number; keywords: string[] } => {
  let matchScore = 92;
  const scoreMatch = gapMarkdown.match(/Estimated Match Score:\*{0,2}\s*(\d{1,3})/i);
  if (scoreMatch) {
    matchScore = parseInt(scoreMatch[1], 10);
  }

  let keywords = ['TypeScript', 'React', 'Microfrontends', 'Module Federation', 'Zustand', 'CI/CD', 'Jest'];
  const kwMatch = gapMarkdown.match(/Critical Integrated Keywords:\*{0,2}\s*\[?([^\]\r\n]+)\]?/i);
  if (kwMatch) {
    keywords = kwMatch[1].split(/[,|•]/).map((k) => k.trim()).filter(Boolean);
  }

  return { matchScore, keywords };
};

export const checkHasTargetJob = (targetJob: string): boolean => {
  return Boolean(targetJob && targetJob.trim().length > 20);
};

export const checkHasGeneratedCv = (cvMarkdown: string): boolean => {
  return Boolean(cvMarkdown && cvMarkdown.trim().length > 30);
};

export const checkHasGapReport = (gapMarkdown: string): boolean => {
  return Boolean(gapMarkdown && gapMarkdown.trim().length > 30);
};

/**
 * Hook to get memoized parsed CV data from current tailored Markdown
 */
export const useParsedCv = (): CVData => {
  const cvMarkdown = useResumeStore((s) => s.cvMarkdown);
  return useMemo(() => parseCvMarkdownToData(cvMarkdown), [cvMarkdown]);
};

/**
 * Hook to get memoized parsed Master CV data from candidate master data
 */
export const useParsedMasterCv = (): CVData => {
  const masterData = useResumeStore((s) => s.masterData);
  return useMemo(() => parseCvMarkdownToData(masterData), [masterData]);
};

/**
 * Hook to get memoized Quality Audit Report
 */
export const useAuditReport = (): QualityAuditReport => {
  const cvMarkdown = useResumeStore((s) => s.cvMarkdown);
  const targetJob = useResumeStore((s) => s.targetJob);
  const masterData = useResumeStore((s) => s.masterData);
  return useMemo(() => auditCvContent(cvMarkdown, targetJob, masterData), [cvMarkdown, targetJob, masterData]);
};

/**
 * Hook to get memoized Gap Analysis Information
 */
export const useGapInfo = (): { matchScore: number; keywords: string[] } => {
  const gapMarkdown = useResumeStore((s) => s.gapMarkdown);
  return useMemo(() => extractGapInfo(gapMarkdown), [gapMarkdown]);
};

/**
 * Hook to get validation flags for target job, tailored CV, and gap report
 */
export const useDerivedFlags = () => {
  const targetJob = useResumeStore((s) => s.targetJob);
  const cvMarkdown = useResumeStore((s) => s.cvMarkdown);
  const gapMarkdown = useResumeStore((s) => s.gapMarkdown);

  const hasTargetJob = useMemo(() => checkHasTargetJob(targetJob), [targetJob]);
  const hasGeneratedCv = useMemo(() => checkHasGeneratedCv(cvMarkdown), [cvMarkdown]);
  const hasGapReport = useMemo(() => checkHasGapReport(gapMarkdown), [gapMarkdown]);

  return { hasTargetJob, hasGeneratedCv, hasGapReport };
};
