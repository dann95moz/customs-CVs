import { useState } from 'react';
import { ActionModalState } from '../types/audit';
import { useResumeWorkspace } from '../context/ResumeWorkspaceContext';

export interface UseAuditActionsReturn {
  modalState: ActionModalState;
  snackbarMessage: string | null;
  handleOpenAction: (actionText: string, sectionName: string) => void;
  handleApplyAction: () => void;
  handleCloseModal: () => void;
  handleCloseSnackbar: () => void;
  handleInputChange: (value: string) => void;
  getActionButtonLabel: (action: string) => string;
}

/**
 * Hook providing action modal handlers and direct 1-click CV insertions
 * for Quality Audit and Preview Gap Drawers.
 * Principle: Single Responsibility & DRY (SOLID).
 */
export function useAuditActions(): UseAuditActionsReturn {
  const { cvMarkdown, setCvMarkdown, masterData, setMasterData } = useResumeWorkspace();

  const [modalState, setModalState] = useState<ActionModalState>({
    open: false,
    sectionName: '',
    title: '',
    description: '',
    type: 'generic',
    inputValue: '',
    presets: []
  });

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleOpenAction = (actionText: string, sectionName: string) => {
    const lower = actionText.toLowerCase();

    if (lower.includes('aws') || lower.includes('cloud') || lower.includes('certif') || sectionName.toLowerCase().includes('education')) {
      setModalState({
        open: true,
        sectionName,
        title: 'Add Industry-Recognized Cloud Certification',
        description: 'Incorporate an official cloud or architecture credential to establish verified technical authority.',
        type: 'certification',
        inputValue: 'AWS Certified Solutions Architect – Associate (2024)',
        presets: [
          'AWS Certified Solutions Architect – Associate (2024)',
          'Google Cloud Certified – Professional Cloud Architect (2024)',
          'Meta Certified Front-End Developer (2023)',
          'Certified Kubernetes Administrator (CKA, 2024)',
          'HashiCorp Certified: Terraform Associate (2023)'
        ]
      });
    } else if (lower.includes('metric') || lower.includes('business outcome') || lower.includes('impact') || lower.includes('revenue') || sectionName.toLowerCase().includes('summary')) {
      setModalState({
        open: true,
        sectionName,
        title: 'Incorporate Business Impact Metric in Summary',
        description: 'Connect your engineering competencies to commercial business impact (transaction volume, retention, or team efficiency).',
        type: 'summary_metric',
        inputValue: 'with a proven track record processing over $80M+ USD in annual transaction volume and reducing production incidents by 40%.',
        presets: [
          'scaling architectures for over 1.5M active users while processing $80M+ USD annually.',
          'accelerating customer onboarding velocity by 32% and saving 120+ monthly engineering hours.',
          'optimizing mission-critical transaction workflows with 99.99% uptime and zero unscheduled downtime.'
        ]
      });
    } else if (lower.includes('github') || lower.includes('portfolio') || lower.includes('repo') || sectionName.toLowerCase().includes('header') || sectionName.toLowerCase().includes('contact')) {
      setModalState({
        open: true,
        sectionName,
        title: 'Add GitHub / Portfolio Public Code Link',
        description: 'Provide technical recruiters with a direct link to public repositories or demonstrable projects.',
        type: 'github_link',
        inputValue: 'https://github.com/alexmorgan-eng',
        presets: [
          'https://github.com/your-username',
          'https://linkedin.com/in/your-profile',
          'https://alexmorgan.dev'
        ]
      });
    } else if (lower.includes('percentage') || lower.includes('google xyz') || lower.includes('xyz') || lower.includes('quantitative') || lower.includes('achievement') || sectionName.toLowerCase().includes('experience')) {
      setModalState({
        open: true,
        sectionName,
        title: 'Calibrate Achievement with Google XYZ Formula',
        description: 'Add an achievement with an explicit quantitative metric (%) following the Google XYZ formula.',
        type: 'google_xyz',
        inputValue: '- **Optimized** core infrastructure cutting latency by **38%** for over **1.2M daily requests** through microfrontend architecture.',
        presets: [
          '- **Optimized** core infrastructure cutting latency by **38%** for over **1.2M daily requests**.',
          '- **Redesigned** CI/CD pipeline using GitHub Actions, cutting build durations by **52%**.',
          '- **Increased** test coverage from 38% to **84%**, preventing **40% of production regressions**.'
        ]
      });
    } else if (lower.includes('3 categories') || lower.includes('categor') || sectionName.toLowerCase().includes('skill')) {
      setModalState({
        open: true,
        sectionName,
        title: 'Reorganize Skills into 3 Universal Categories',
        description: 'Group your competencies into Core Languages, Frameworks & Libraries, and Tools & Cloud.',
        type: 'skills_3cat',
        inputValue: '### Core Technologies\nReact, TypeScript, Next.js, Node.js, GraphQL\n\n### Frameworks & Libraries\nRedux Toolkit, Tailwind CSS, Material-UI, Jest, Cypress\n\n### Cloud & Infrastructure\nAWS (S3, CloudFront), Docker, GitHub Actions, CI/CD, Vite',
        presets: [
          '### Core Technologies\nReact, TypeScript, Next.js, Node.js\n\n### Tools & Libraries\nRedux, Material UI, Tailwind CSS, Jest\n\n### DevOps & Cloud\nDocker, AWS, GitHub Actions, CI/CD'
        ]
      });
    } else {
      setModalState({
        open: true,
        sectionName,
        title: `Apply Enhancement: ${sectionName || 'Recommendation'}`,
        description: actionText,
        type: 'generic',
        inputValue: actionText,
        presets: []
      });
    }
  };

  const handleApplyAction = () => {
    const { type, inputValue } = modalState;
    if (!inputValue.trim()) return;

    let updatedCv = cvMarkdown;
    let updatedMaster = masterData;

    if (type === 'certification') {
      const certLine = `\n- **${inputValue.replace(/^\*+|\*+$/g, '')}**`;
      if (updatedCv.includes('## EDUCATION')) {
        updatedCv = updatedCv.replace(/(## EDUCATION[^\n]*\n)/i, `$1${certLine}\n`);
      } else if (updatedCv.includes('## EDUCACI')) {
        updatedCv = updatedCv.replace(/(## EDUCACI[^\n]*\n)/i, `$1${certLine}\n`);
      } else {
        updatedCv += `\n\n## EDUCATION & CERTIFICATIONS${certLine}\n`;
      }

      if (updatedMaster.includes('## EDUCATION') || updatedMaster.includes('## 🎓 EDUCATION')) {
        updatedMaster = updatedMaster.replace(/(## [^\n]*EDUCATION[^\n]*\n)/i, `$1${certLine}\n`);
      }
    } else if (type === 'summary_metric') {
      if (updatedCv.includes('## PROFESSIONAL SUMMARY')) {
        updatedCv = updatedCv.replace(/(## PROFESSIONAL SUMMARY\n[^\n]+)/i, `$1 ${inputValue.trim()}`);
      } else {
        updatedCv += `\n\n## PROFESSIONAL SUMMARY\n${inputValue.trim()}\n`;
      }
    } else if (type === 'github_link') {
      if (updatedCv.includes('http')) {
        updatedCv = updatedCv.replace(/(\[LinkedIn\]\([^\)]+\))/i, `$1 • [GitHub](${inputValue.trim()})`);
      } else {
        updatedCv = updatedCv.replace(/(#[^\n]+\n)/, `$1[GitHub](${inputValue.trim()}) • `);
      }
    } else if (type === 'google_xyz') {
      const bulletLine = inputValue.startsWith('- ') ? inputValue : `- ${inputValue}`;
      if (updatedCv.includes('### **')) {
        updatedCv = updatedCv.replace(/(### \*\*[^\n]+\n\*?[^\n]*\*?\n)/, `$1${bulletLine}\n`);
      } else {
        updatedCv += `\n${bulletLine}\n`;
      }
    } else {
      updatedCv += `\n\n<!-- Strategic Lever Applied: ${modalState.sectionName} -->\n${inputValue}\n`;
    }

    setCvMarkdown(updatedCv);
    setMasterData(updatedMaster);
    setSnackbarMessage(`Successfully applied "${modalState.title}" to your tailored CV!`);
    setModalState(prev => ({ ...prev, open: false }));
  };

  const getActionButtonLabel = (action: string): string => {
    const lower = action.toLowerCase();
    if (lower.includes('aws') || lower.includes('cloud') || lower.includes('certif')) {
      return 'Add Official Certification';
    }
    if (lower.includes('metric') || lower.includes('business') || lower.includes('revenue') || lower.includes('impact')) {
      return 'Add Business Impact Metric';
    }
    if (lower.includes('github') || lower.includes('portfolio') || lower.includes('code')) {
      return 'Link GitHub / Portfolio';
    }
    if (lower.includes('percentage') || lower.includes('xyz') || lower.includes('quantitative') || lower.includes('achievement')) {
      return 'Add Google XYZ Achievement';
    }
    if (lower.includes('3 categories') || lower.includes('categor')) {
      return 'Reorganize into 3 Categories';
    }
    return 'Apply Action';
  };

  return {
    modalState,
    snackbarMessage,
    handleOpenAction,
    handleApplyAction,
    handleCloseModal: () => setModalState(prev => ({ ...prev, open: false })),
    handleCloseSnackbar: () => setSnackbarMessage(null),
    handleInputChange: (inputValue: string) => setModalState(prev => ({ ...prev, inputValue })),
    getActionButtonLabel,
  };
}
