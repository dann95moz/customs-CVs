/**
 * CV Studio Pro - Audit & Quality Evaluation Types
 * 
 * Domain-specific type definitions for resume quality auditing, scoring,
 * strategic recommendations, and modal states.
 */

export interface AuditSectionResult {
  sectionName: string;
  score: number; // Scale 1.0 - 10.0
  status: '🟢 Optimal' | '🟡 Solid with Headroom' | '🔴 Needs Attention';
  comment: string;
  identifiedGaps?: string[];
  actionToTen?: string[];
}

export interface StrategicGrowthPillar {
  pillarName: string;
  impactLevel: 'High' | 'Medium-High' | 'Strategic';
  diagnostic: string;
  recommendationForMasterData: string;
}

export interface QualityAuditReport {
  candidateName: string;
  targetCompany: string;
  overallScore: number;
  sections: AuditSectionResult[];
  strategicPillars: StrategicGrowthPillar[];
  markdownReport: string;
}

export interface ActionModalState {
  open: boolean;
  sectionName: string;
  title: string;
  description: string;
  type: 'certification' | 'summary_metric' | 'github_link' | 'google_xyz' | 'skills_3cat' | 'generic';
  inputValue: string;
  presets: string[];
}
