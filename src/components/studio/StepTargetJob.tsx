import React, { useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { extractTargetCompany } from '../../core/parser';
import { useFileUploader } from '../../hooks/useFileUploader';

interface StepTargetJobProps {
  content: string;
  onChange: (value: string) => void;
  companyName: string;
  onCompanyChange: (value: string) => void;
  targetRole: string;
  onRoleChange: (value: string) => void;
  onLoadSample: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const StepTargetJob: React.FC<StepTargetJobProps> = ({
  content,
  onChange,
  companyName,
  onCompanyChange,
  targetRole,
  onRoleChange,
  onLoadSample,
  onPrevStep,
  onNextStep
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { fileInputRef, handleFileUpload, handleDrop, handleDragOver } = useFileUploader({
    onFileLoaded: (text) => {
      onChange(text);
      const inferred = extractTargetCompany(text);
      if (inferred && !companyName) {
        onCompanyChange(inferred.replace(/_/g, ' '));
      }
    }
  });

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `target-job-${companyName || 'posting'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const hasJob = content.trim().length > 40 && !content.includes('[Paste the raw job description');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', gap: 2, p: { xs: 1.5, md: 2.5 } }}>
      {/* Guiding Hero Banner */}
      <Paper
        sx={{
          p: { xs: 2, md: 2.5 },
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: { xs: 'flex-start', lg: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          background: isDark
            ? 'linear-gradient(135deg, rgba(16, 22, 35, 0.8) 0%, rgba(21, 29, 46, 0.9) 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ maxWidth: 900 }}>
          <Chip
            icon={<WorkRoundedIcon sx={{ fontSize: '16px !important' }} />}
            label="Step 2 of 4 • Target Job & Vacancy Specs"
            size="small"
            color="secondary"
            variant="outlined"
            sx={{ mb: 1, fontWeight: 700 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            The Target Role You Are Applying For
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Paste the job posting description directly.
            <strong> The AI will analyze the requirements and align your real achievements</strong> from Step 1 so your resume easily clears ATS filters and catches recruiters' attention.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshRoundedIcon />}
            onClick={onLoadSample}
          >
            Load Sample Vacancy
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".md,.txt"
            onChange={handleFileUpload}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<CloudUploadRoundedIcon />}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Job File
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadRoundedIcon />}
            onClick={handleDownload}
          >
            Export File
          </Button>
        </Stack>
      </Paper>

      {/* Target Metadata & Metric Inputs */}
      <Paper
        sx={{
          p: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 200px' },
          gap: 2,
          alignItems: 'center',
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TextField
          label="Target Company / Employer"
          placeholder="e.g. Stripe, Nubank, Mercado Libre"
          value={companyName}
          onChange={(e) => onCompanyChange(e.target.value)}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessRoundedIcon fontSize="small" color="primary" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          label="Target Role / Job Title"
          placeholder="e.g. Senior Full Stack Engineer, Tech Lead"
          value={targetRole}
          onChange={(e) => onRoleChange(e.target.value)}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeRoundedIcon fontSize="small" color="secondary" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1,
            borderRadius: '10px',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <DescriptionRoundedIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Vacancy Length
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {wordCount} words
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Spacious Dedicated Editor Area */}
      <Paper
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 450,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            py: 1,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditNoteRoundedIcon fontSize="small" color="secondary" />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Job Description Markdown
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Paste the job requirements, responsibilities, and qualifications.
          </Typography>
        </Box>

        <Box
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            flex: 1,
            position: 'relative',
            p: 0,
            display: 'flex',
          }}
        >
          <textarea
            className="studio-textarea"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="# Senior Full Stack Engineer - Stripe&#10;&#10;## About the Role&#10;We are looking for a Senior Engineer with deep React and Node.js expertise...&#10;&#10;## Requirements&#10;- 5+ years building distributed web applications&#10;- Strong experience in TypeScript, React, PostgreSQL"
            spellCheck={false}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              outline: 'none',
              padding: '16px',
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              fontSize: '0.88rem',
              lineHeight: 1.65,
              resize: 'none',
              backgroundColor: 'transparent',
              color: isDark ? '#f8fafc' : '#0f172a',
            }}
          />
        </Box>
      </Paper>

      {/* Navigation Footer */}
      <Paper
        sx={{
          p: 1.5,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={onPrevStep}
        >
          Back to Profile
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {hasJob ? (
            <Chip
              icon={<CheckCircleRoundedIcon />}
              label="Job vacancy ready for AI synthesis"
              color="success"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          ) : (
            <Chip
              icon={<InfoRoundedIcon />}
              label="Tip: Click 'Load Sample Vacancy' to test"
              color="warning"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={onNextStep}
          sx={{ fontWeight: 700, px: 3 }}
        >
          Continue to AI Tailor
        </Button>
      </Paper>
    </Box>
  );
};
