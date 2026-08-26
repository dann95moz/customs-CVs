import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import { useResumeWorkspace } from '../../context/ResumeWorkspaceContext';
import { GeneratedCvVersion } from '../../types/cv';
import { getPaletteConfig } from '../../constants/palettes';

export const ApplicationsHistoryView: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const {
    savedVersions,
    handleLoadVersion,
    handleDeleteVersion,
    setActiveTab,
    setWizardStep
  } = useResumeWorkspace();

  const [searchQuery, setSearchQuery] = useState('');

  // Filtered versions by company or role
  const filteredVersions = savedVersions.filter(v => 
    v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.targetRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics
  const totalApplications = savedVersions.length;
  const avgMatchScore = totalApplications > 0
    ? Math.round(savedVersions.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / totalApplications)
    : 0;
  const uniqueCompanies = new Set(savedVersions.map(v => v.companyName.toLowerCase())).size;

  const handleDownloadMarkdown = (v: GeneratedCvVersion) => {
    const fileName = `CV_${v.candidateName.replace(/\s+/g, '_')}_${v.companyName.replace(/\s+/g, '_')}.md`;
    const blob = new Blob([v.cvMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

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
        {/* Top Banner with Key Metrics */}
        <Paper
        sx={{
          p: { xs: 2, md: 2.5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: isDark ? 'rgba(16, 22, 35, 0.8)' : '#ffffff',
          borderRadius: '16px',
        }}
      >
        <Box>
          <Chip
            icon={<BusinessRoundedIcon sx={{ fontSize: '16px !important' }} />}
            label="Application History • 1 Master Profile ➔ N Target CVs"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 1, fontWeight: 700 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            Generated Resumes Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your tailored resumes across target companies and roles. Each version preserves its calibrated scores, palette, and ATS alignment.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AutoAwesomeRoundedIcon />}
          onClick={() => {
            setActiveTab('wizard');
            setWizardStep('target');
          }}
          sx={{ fontWeight: 700, borderRadius: '10px', whiteSpace: 'nowrap' }}
        >
          + New AI Tailored Resume
        </Button>
      </Paper>

      {/* Metrics Summary Strip */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LayersRoundedIcon />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Generated Resumes
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {totalApplications} {totalApplications === 1 ? 'version' : 'versions'}
            </Typography>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.success.main, 0.12),
              color: theme.palette.success.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrackChangesRoundedIcon />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Average Match Score
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.success.main }}>
              {avgMatchScore}%
            </Typography>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.secondary.main, 0.12),
              color: theme.palette.secondary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BusinessRoundedIcon />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Target Companies
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {uniqueCompanies} {uniqueCompanies === 1 ? 'company' : 'companies'}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Search Bar */}
      <TextField
        placeholder="Search by company or job title (e.g. Stripe, Frontend Engineer)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '10px',
        }}
      />

      {/* Applications Cards Grid */}
      {filteredVersions.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: 'center',
            border: `1px dashed ${theme.palette.divider}`,
            borderRadius: '16px',
            bgcolor: 'background.paper',
          }}
        >
          <BusinessRoundedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.6 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {searchQuery ? 'No matching applications found' : 'No generated resumes yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 2.5 }}>
            {searchQuery
              ? 'Try searching for a different company or clear your search input.'
              : 'When you tailor your resume for a job in Step 3 or click "Save Version", it will be archived here automatically.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AutoAwesomeRoundedIcon />}
            onClick={() => {
              setActiveTab('wizard');
              setWizardStep('tailor');
            }}
            sx={{ fontWeight: 700 }}
          >
            Go to AI Resume Tailor
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {filteredVersions.map((item) => {
            const palConfig = getPaletteConfig(item.palette);
            return (
              <Card
                key={item.id}
                variant="outlined"
                sx={{
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: isDark
                      ? '0 6px 20px rgba(0,0,0,0.5)'
                      : '0 6px 20px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <CardContent sx={{ p: 2.5, flex: 1 }}>
                  {/* Card Top: Avatar & Scores */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          bgcolor: alpha(palConfig.accentColor, 0.12),
                          color: palConfig.accentColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                        }}
                      >
                        {item.companyName ? item.companyName.charAt(0).toUpperCase() : 'C'}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h6" noWrap sx={{ fontWeight: 800, fontSize: '1rem' }}>
                          {item.companyName || 'Target Company'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                          {item.targetRole || 'Specialist Role'}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={`${item.matchScore}% Match`}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 800, height: 24, fontSize: '0.75rem' }}
                    />
                  </Box>

                  {/* Metadata Chips */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
                    <Chip
                      label={item.theme}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                    <Chip
                      avatar={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: palConfig.previewColor }} />}
                      label={palConfig.name}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                    <Chip
                      label={`${item.qualityScore} / 10.0`}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayRoundedIcon sx={{ fontSize: 13 }} />
                    Generated on {formatDate(item.createdAt)}
                  </Typography>
                </CardContent>

                <Divider />

                <CardActions sx={{ p: 1.5, px: 2, justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<LaunchRoundedIcon sx={{ fontSize: '15px !important' }} />}
                    onClick={() => handleLoadVersion(item.id)}
                    sx={{ fontWeight: 700, fontSize: '0.78rem' }}
                  >
                    Load in Studio
                  </Button>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={() => handleDownloadMarkdown(item)}
                      title="Download Markdown"
                    >
                      <FileDownloadRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        if (confirm(`Delete saved version for ${item.companyName}?`)) {
                          handleDeleteVersion(item.id);
                        }
                      }}
                      title="Delete from history"
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  </Box>
  );
};
