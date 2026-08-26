import React from 'react';
import { Icon, IconType } from '../Icons';
import { WizardStep } from '../../types/cv';

interface WizardStepperProps {
  currentStep: WizardStep;
  onSelectStep: (step: WizardStep) => void;
  hasMasterData: boolean;
  hasTargetJob: boolean;
  hasGeneratedCv: boolean;
}

interface StepMeta {
  id: WizardStep;
  number: number;
  label: string;
  shortLabel: string;
  subtitle: string;
  icon: IconType;
}

const STEPS: StepMeta[] = [
  {
    id: 'profile',
    number: 1,
    label: 'Candidate Profile',
    shortLabel: 'Profile',
    subtitle: 'Career history & master data',
    icon: 'user'
  },
  {
    id: 'target',
    number: 2,
    label: 'Target Job & Vacancy',
    shortLabel: 'Target Job',
    subtitle: 'Employer & vacancy details',
    icon: 'target'
  },
  {
    id: 'tailor',
    number: 3,
    label: 'AI Tailoring Studio',
    shortLabel: 'AI Tailor',
    subtitle: 'Google XYZ alignment & budget',
    icon: 'sparkles'
  },
  {
    id: 'preview',
    number: 4,
    label: 'Tailored CV & PDF',
    shortLabel: 'CV & PDF',
    subtitle: 'A4 live preview & download',
    icon: 'printer'
  }
];

export const WizardStepper: React.FC<WizardStepperProps> = ({
  currentStep,
  onSelectStep,
  hasMasterData,
  hasTargetJob,
  hasGeneratedCv
}) => {
  const isStepComplete = (stepId: WizardStep): boolean => {
    switch (stepId) {
      case 'profile':
        return hasMasterData;
      case 'target':
        return hasTargetJob;
      case 'tailor':
        return hasGeneratedCv;
      case 'preview':
        return hasGeneratedCv;
      default:
        return false;
    }
  };

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <nav className="wizard-stepper" aria-label="Resume creation steps">
      <div className="wizard-stepper-container">
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = isStepComplete(step.id) && step.id !== currentStep;
          const isPassed = index < currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              {/* Connector line between steps */}
              {index > 0 && (
                <div 
                  className={`wizard-connector ${index <= currentStepIndex ? 'filled' : ''}`}
                  aria-hidden="true"
                >
                  <div className="wizard-connector-bar" />
                </div>
              )}

              {/* Step Button */}
              <button
                type="button"
                className={`wizard-step-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isPassed ? 'passed' : ''}`}
                onClick={() => onSelectStep(step.id)}
                title={`Go to Step ${step.number}: ${step.label}`}
                aria-current={isActive ? 'step' : undefined}
              >
                <div className="wizard-step-badge">
                  {isCompleted ? (
                    <Icon type="check" size={14} className="step-icon-check" />
                  ) : (
                    <span className="step-number">{step.number}</span>
                  )}
                </div>

                <div className="wizard-step-content">
                  <div className="wizard-step-header">
                    <span className="wizard-step-title">{step.label}</span>
                    {isCompleted && <span className="wizard-status-tag">Done ✓</span>}
                    {isActive && <span className="wizard-status-tag active">Active</span>}
                  </div>
                  <span className="wizard-step-subtitle">{step.subtitle}</span>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
