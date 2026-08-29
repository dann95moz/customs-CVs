import React from 'react';
import {
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useResumeStore } from '../../store';
import { APP_LINKS } from '../../constants/links';

export interface WelcomeLandingViewProps {
  onStart?: () => void;
  onExploreDemo?: () => void;
}

export const WelcomeLandingView: React.FC<WelcomeLandingViewProps> = ({
  onStart,
  onExploreDemo,
}) => {
  const handleStartWizard = useResumeStore((s) => s.handleStartWizard);
  const handleExploreDemo = useResumeStore((s) => s.handleExploreDemo);
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';


  const handleStart = () => {
    if (onStart) {
      onStart();
    } else {
      handleStartWizard();
    }
  };

  const handleDemo = () => {
    if (onExploreDemo) {
      onExploreDemo();
    } else {
      handleExploreDemo();
    }
  };

  return (
    <div className="welcome-landing-wrapper">
      <div className="welcome-landing-content">
        {/* Badge Pill */}
        <div className="welcome-badge">
          <span className="pulse-dot" />
          <span>Free &amp; 100% Private</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="welcome-hero-header">
          <Typography variant="h1" className="welcome-hero-title">
            Tailor High-Impact Resumes{' '}
            <span className="welcome-gradient-text">for Every Opportunity</span>
          </Typography>
          <Typography variant="body1" className="welcome-hero-subtitle">
            Transform your master career data into tailored, ATS-compliant resumes with 
            Google XYZ-formula bullets, real-time 1–10 quality scoring, and 1-page design precision.
          </Typography>
        </div>

        {/* 3 Streamlined Process Cards */}
        <div className="welcome-steps-grid">
          {/* Step 1 */}
          <div className="welcome-step-card">
            <div className="welcome-step-header">
              <span className="welcome-step-number">STEP 01</span>
              <div className="welcome-step-icon">
                <DescriptionRoundedIcon fontSize="small" />
              </div>
            </div>
            <Typography variant="h6" className="welcome-step-title">
              Master Career Vault
            </Typography>
            <Typography variant="body2" className="welcome-step-desc">
              Store your complete career history, technical stack, projects, and achievements in structured Markdown or guided forms.
            </Typography>
          </div>

          {/* Step 2 */}
          <div className="welcome-step-card">
            <div className="welcome-step-header">
              <span className="welcome-step-number">STEP 02</span>
              <div className="welcome-step-icon">
                <TrackChangesRoundedIcon fontSize="small" />
              </div>
            </div>
            <Typography variant="h6" className="welcome-step-title">
              Target Vacancy &amp; Tailoring
            </Typography>
            <Typography variant="body2" className="welcome-step-desc">
              Paste target job postings to synthesize aligned bullets with Google XYZ formula and employer keywords.
            </Typography>
          </div>

          {/* Step 3 */}
          <div className="welcome-step-card">
            <div className="welcome-step-header">
              <span className="welcome-step-number">STEP 03</span>
              <div className="welcome-step-icon">
                <AssessmentRoundedIcon fontSize="small" />
              </div>
            </div>
            <Typography variant="h6" className="welcome-step-title">
              Live CV &amp; Quality Audit
            </Typography>
            <Typography variant="body2" className="welcome-step-desc">
              Inspect calibrated 1–10 quality scores, customize across 7 ATS themes, and export print-perfect PDFs.
            </Typography>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="welcome-actions-row">
          <Button
            variant="contained"
            size="large"
            onClick={handleStart}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
            }}
          >
            Start Building Resume
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={handleDemo}
            startIcon={<AutoAwesomeRoundedIcon sx={{ color: '#a78bfa' }} />}
            sx={{
              px: 3.5,
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            }}
          >
            Try with Sample Data
          </Button>
        </div>

        {/* Capabilities Pill Ribbon */}
        <div className="welcome-capabilities-ribbon">
          <div className="welcome-pill">
            <LockRoundedIcon sx={{ fontSize: 14, color: '#10b981' }} />
            <span>100% Local-First & Private</span>
          </div>
          <div className="welcome-pill">
            <CheckCircleRoundedIcon sx={{ fontSize: 14, color: '#38bdf8' }} />
            <span>Google XYZ Formula</span>
          </div>
          <div className="welcome-pill">
            <SpeedRoundedIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
            <span>Calibrated 1–10 Audit</span>
          </div>
          <div className="welcome-pill">
            <StyleRoundedIcon sx={{ fontSize: 14, color: '#a78bfa' }} />
            <span>7 Precision ATS Themes</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="welcome-footer-note" style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
          <span>All data remains in your browser storage. You can switch back here anytime via the top logo.</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            Crafted by <strong>{APP_LINKS.AUTHOR_NAME}</strong> ·{' '}
            <a
              href={APP_LINKS.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontWeight: 600,
                borderBottom: '1px dotted currentColor',
              }}
            >
              Open source on GitHub <StarRoundedIcon sx={{ fontSize: 13, color: 'primary.main', verticalAlign: 'middle' }} />
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};
