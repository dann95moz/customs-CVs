import React, { useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
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
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { extractCandidateName, parseCvMarkdownToData } from '../../core/parser';
import { useFileUploader } from '../../hooks/useFileUploader';
import { GuidedProfileForm } from './GuidedProfileForm';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { ButtonGroup } from '@mui/material';

interface StepMasterDataProps {
  content: string;
  onChange: (value: string) => void;
  onLoadSample: () => void;
  onResetTemplate: () => void;
  onNextStep: () => void;
}

export const StepMasterData: React.FC<StepMasterDataProps> = ({
  content,
  onChange,
  onLoadSample,
  onResetTemplate,
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
              icon={<PersonRoundedIcon sx={{ fontSize: '16px !important' }} />}
              label="Step 1 of 4 • Master Career Dossier (SSOT)"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mb: 1, fontWeight: 700 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Your Master Professional Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This dossier holds your permanent career history, technical stack, and achievements.
              <strong> The AI strictly uses this as its Single Source of Truth</strong> to synthesize targeted resumes without hallucinations.
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

        {/* Summary Metrics Strip */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 1.5,
          }}
        >
          <Paper
            sx={{
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PersonRoundedIcon fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Candidate
              </Typography>
              <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                {candidateName}
              </Typography>
            </Box>
          </Paper>

          <Paper
            sx={{
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: alpha(theme.palette.secondary.main, 0.12),
                color: theme.palette.secondary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LayersRoundedIcon fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Experience Roles
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {expCount} roles recorded
              </Typography>
            </Box>
          </Paper>

          <Paper
            sx={{
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: alpha(theme.palette.warning.main, 0.12),
                color: theme.palette.warning.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StarRoundedIcon fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Tech Competencies
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {skillsCount} technologies
              </Typography>
            </Box>
          </Paper>

          <Paper
            sx={{
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: alpha(theme.palette.success.main, 0.12),
                color: theme.palette.success.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DescriptionRoundedIcon fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Profile Length
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {wordCount} words
              </Typography>
            </Box>
          </Paper>
        </Box>

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
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            Continue to Target Job
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};
