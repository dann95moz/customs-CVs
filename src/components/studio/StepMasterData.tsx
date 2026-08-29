import React, { useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { extractCandidateName, parseCvMarkdownToData } from '../../core/parser';
import { useFileUploader } from '../../hooks/useFileUploader';
import { GuidedProfileForm } from './GuidedProfileForm';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { ButtonGroup } from '@mui/material';
import { StepMasterDataProps } from '../../types';

export type { StepMasterDataProps };

export const StepMasterData: React.FC<StepMasterDataProps> = ({
  content,
  onChange,
  onLoadSample,
  onResetTemplate,
  onPrevStep,
  onNextStep
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [editMode, setEditMode] = React.useState<'guided' | 'markdown'>('guided');

  const { fileInputRef, handleFileUpload, handleDrop, handleDragOver } = useFileUploader({
    onFileLoaded: (text) => onChange(text)
  });

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'master-profile.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const candidateName = extractCandidateName(content, 'Your Full Name').replace(/_/g, ' ');
  const parsed = parseCvMarkdownToData(content);
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const expCount = parsed.experience?.length || 0;
  const skillsCount = parsed.skillGroups?.reduce((acc, curr) => acc + curr.skills.length, 0) || 0;

  const completedSections = [
    Boolean(parsed.name && parsed.name.trim() && !parsed.name.includes('[CANDIDATE')),
    Boolean(parsed.summary && parsed.summary.trim() && !parsed.summary.includes('[Write freely')),
    Boolean(parsed.skillGroups && parsed.skillGroups.length > 0 && parsed.skillGroups.some(g => g.skills.length > 0)),
    Boolean(parsed.experience && parsed.experience.length > 0),
    Boolean(parsed.education && parsed.education.length > 0),
    Boolean(parsed.languages && parsed.languages.length > 0)
  ];
  const completedCount = completedSections.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 6) * 100);

  const hasData = content.trim().length > 50 && !content.includes('[CANDIDATE FULL NAME]');

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        p: { xs: 1.5, sm: 2, md: 3 },
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* Simplified Guiding Hero Banner */}
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
              icon={<PersonRoundedIcon sx={{ fontSize: '16px !important' }} />}
              label="Step 1 of 3 • Candidate Profile"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mb: 1, fontWeight: 700 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Your Career Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
              Add your career history and skills once. We&apos;ll automatically adapt it for every job you apply to.
              <Tooltip
                title="Integrity safeguard active: Guarantees tailored resumes stay 100% faithful to your real experience without hallucinating skills or fake metrics."
                arrow
                placement="top"
              >
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'help',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                    transition: 'color 0.2s ease',
                  }}
                  aria-label="Integrity safeguard active"
                >
                  <ShieldRoundedIcon sx={{ fontSize: '1.05rem' }} />
                </Box>
              </Tooltip>
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshRoundedIcon />}
              onClick={onLoadSample}
            >
              Load Sample Profile
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
              Upload File (.md)
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDownloadRoundedIcon />}
              onClick={handleDownload}
            >
              Export Backup
            </Button>

            <Button
              variant="text"
              size="small"
              color="inherit"
              startIcon={<RestartAltRoundedIcon />}
              onClick={onResetTemplate}
            >
              Start Blank
            </Button>
          </Stack>
        </Paper>

        {/* Profile Completion & Summary Strip */}


        {/* Mode Switcher & Dedicated Editor Area */}
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
              flexWrap: 'wrap',
              gap: 1,
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditNoteRoundedIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {editMode === 'markdown' ? 'Natural Freeform Dossier (Markdown / Natural Language)' : 'Structured Profile Assistant'}
              </Typography>
            </Box>

            <ButtonGroup size="small" variant="outlined">
              <Button
                variant={editMode === 'guided' ? 'contained' : 'outlined'}
                startIcon={<FormatListBulletedRoundedIcon />}
                onClick={() => setEditMode('guided')}
                sx={{ fontWeight: 600, fontSize: '0.8rem' }}
              >
                Guided Assistant
              </Button>
              <Button
                variant={editMode === 'markdown' ? 'contained' : 'outlined'}
                startIcon={<CodeRoundedIcon />}
                onClick={() => setEditMode('markdown')}
                sx={{ fontWeight: 600, fontSize: '0.8rem' }}
              >
                Mardown Editor
              </Button>

            </ButtonGroup>
          </Box>

          {/* Natural Language Freedom Tip */}

          {editMode === 'guided' ? (
            <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 350px)' }}>
              <GuidedProfileForm markdownContent={content} onChange={onChange} />
            </Box>
          ) : (
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
                placeholder="# [CANDIDATE FULL NAME]&#10;**Primary Professional Role / Specialization**&#10;City, Country • candidate.email@example.com • +1 234 567 8900&#10;&#10;## CAREER HISTORY & ACHIEVEMENTS&#10;Write your companies, roles, and achievements here..."
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
          )}
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
            borderRadius: '12px',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {hasData ? (
              <Chip
                icon={<CheckCircleRoundedIcon />}
                label="Master profile ready for tailoring"
                color="success"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            ) : (
              <Chip
                icon={<InfoRoundedIcon />}
                label="Tip: Click 'Load Sample Profile' to test right away"
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
            Continue to Target Vacancy (Step 2)
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};
