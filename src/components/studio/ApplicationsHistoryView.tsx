import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  alpha
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store';
import { GeneratedCvVersion } from '../../types/cv';
import { ApplicationsStatsHeader } from './history/ApplicationsStatsHeader';
import { ApplicationCard } from './history/ApplicationCard';

export const ApplicationsHistoryView: React.FC = () => {
  const { t } = useTranslation(['history', 'common']);
  const theme = useTheme();

  const savedVersions = useResumeStore((s) => s.savedVersions);
  const handleLoadVersion = useResumeStore((s) => s.handleLoadVersion);
  const handleDeleteVersion = useResumeStore((s) => s.handleDeleteVersion);
  const setActiveTab = useResumeStore((s) => s.setActiveTab);
  const setWizardStep = useResumeStore((s) => s.setWizardStep);

  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);

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

  const handleDownloadPdf = async (v: GeneratedCvVersion) => {
    setDownloadingPdfId(v.id);
    try {
      const { generateVersionDirectPdf } = await import('../../core/pdfGenerator');
      await generateVersionDirectPdf(v);
    } catch (error) {
      console.error('Failed to generate version PDF:', error);
    } finally {
      setDownloadingPdfId(null);
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
        {/* Top Banner and Summary Counters */}
        <ApplicationsStatsHeader
          totalApplications={totalApplications}
          avgMatchScore={avgMatchScore}
          uniqueCompanies={uniqueCompanies}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewApplication={() => {
            setActiveTab('wizard');
            setWizardStep('target');
          }}
        />

        {/* List Grid or Empty State */}
        {filteredVersions.length === 0 ? (
          <Card
            variant="outlined"
            sx={{
              p: 5,
              textAlign: 'center',
              borderRadius: '16px',
              borderStyle: 'dashed',
              bgcolor: 'background.paper',
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AutoAwesomeRoundedIcon fontSize="large" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {searchQuery ? 'No tailored resumes match your search' : t('history:empty.title', 'No Applications Saved Yet')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460 }}>
                {searchQuery
                  ? 'Try searching for a different company or job title.'
                  : t('history:empty.desc', 'Whenever you synthesize a tailored resume for a specific company, it will be automatically saved here for tracking.')}
              </Typography>
              {!searchQuery && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AutoAwesomeRoundedIcon />}
                  onClick={() => {
                    setActiveTab('wizard');
                    setWizardStep('target');
                  }}
                  sx={{ mt: 1, fontWeight: 700 }}
                >
                  {t('history:empty.action', 'Start New Application')}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 2.5,
            }}
          >
            {filteredVersions.map((v) => (
              <ApplicationCard
                key={v.id}
                version={v}
                onLoad={handleLoadVersion}
                onDelete={handleDeleteVersion}
                onDownload={handleDownloadMarkdown}
                onDownloadPdf={handleDownloadPdf}
                isDownloadingPdf={downloadingPdfId === v.id}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
