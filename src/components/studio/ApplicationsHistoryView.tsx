import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store';
import { GeneratedCvVersion, KanbanColumn } from '../../types/cv';
import { ApplicationsStatsHeader } from './history/ApplicationsStatsHeader';
import { KanbanBoard } from './history/KanbanBoard';
import { ArchivedApplicationsView } from './history/ArchivedApplicationsView';
import { ApplicationCard } from './history/ApplicationCard';
import { TrackApplicationDialog } from './history/TrackApplicationDialog';
import { ColumnEditDialog } from './history/ColumnEditDialog';

export const ApplicationsHistoryView: React.FC = () => {
  const { t } = useTranslation(['history', 'common']);
  const theme = useTheme();

  const savedVersions = useResumeStore((s) => s.savedVersions);
  const applications = useResumeStore((s) => s.applications || []);
  const kanbanColumns = useResumeStore((s) => s.kanbanColumns || []);

  const handleLoadVersion = useResumeStore((s) => s.handleLoadVersion);
  const handleDeleteVersion = useResumeStore((s) => s.handleDeleteVersion);
  const handleAddApplication = useResumeStore((s) => s.handleAddApplication);
  const handleDeleteApplication = useResumeStore((s) => s.handleDeleteApplication);
  const handleMoveApplication = useResumeStore((s) => s.handleMoveApplication);
  const handleArchiveApplication = useResumeStore((s) => s.handleArchiveApplication);
  const handleUnarchiveApplication = useResumeStore((s) => s.handleUnarchiveApplication);
  const handleArchiveColumn = useResumeStore((s) => s.handleArchiveColumn);
  const handleSetAttachedVersion = useResumeStore((s) => s.handleSetAttachedVersion);
  const handleAddColumn = useResumeStore((s) => s.handleAddColumn);
  const handleUpdateColumn = useResumeStore((s) => s.handleUpdateColumn);
  const handleDeleteColumn = useResumeStore((s) => s.handleDeleteColumn);

  const setActiveTab = useResumeStore((s) => s.setActiveTab);
  const setWizardStep = useResumeStore((s) => s.setWizardStep);

  const [activeView, setActiveView] = useState<'board' | 'archived' | 'versions'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);

  // Dialog states
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackPrefillColumnId, setTrackPrefillColumnId] = useState<string | undefined>();
  const [trackPrefillVersion, setTrackPrefillVersion] = useState<GeneratedCvVersion | undefined>();
  const [isColumnEditOpen, setIsColumnEditOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<KanbanColumn | null>(null);

  // Filtered lists and stats
  const activeApplications = applications.filter((app) => !app.isArchived);
  const archivedApplications = applications.filter((app) => app.isArchived);

  const totalActive = activeApplications.length;
  const totalArchived = archivedApplications.length;
  const totalInterviews = activeApplications.filter(
    (a) => a.columnId === 'interview' || a.columnId === 'tech_test'
  ).length;
  const totalOffers = activeApplications.filter((a) => a.columnId === 'offer').length;

  const avgMatchScore =
    totalActive > 0
      ? Math.round(
          activeApplications.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / totalActive
        )
      : 0;

  // Filtered saved versions for the "versions" tab
  const filteredVersions = savedVersions.filter(
    (v) =>
      v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.targetRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleOpenTrackModal = (columnId?: string, version?: GeneratedCvVersion) => {
    setTrackPrefillColumnId(columnId);
    setTrackPrefillVersion(version);
    setIsTrackModalOpen(true);
  };

  const handleOpenEditColumn = (col?: KanbanColumn) => {
    setEditingColumn(col || null);
    setIsColumnEditOpen(true);
  };

  const handleSaveColumn = (title: string, color: string) => {
    if (editingColumn) {
      handleUpdateColumn(editingColumn.id, { title, color });
    } else {
      handleAddColumn(title, color);
    }
    setIsColumnEditOpen(false);
    setEditingColumn(null);
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
          maxWidth: activeView === 'board' && totalActive > 0 ? '100%' : 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* Top Summary Banner & Controls */}
        <ApplicationsStatsHeader
          totalActiveApplications={totalActive}
          totalInterviews={totalInterviews}
          totalOffers={totalOffers}
          totalArchived={totalArchived}
          avgMatchScore={avgMatchScore}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onTrackNewApplication={() => handleOpenTrackModal()}
          onStartNewResume={() => {
            setActiveTab('wizard');
            setWizardStep('target');
          }}
          activeView={activeView}
          onViewChange={setActiveView}
          savedVersionsCount={savedVersions.length}
        />

        {/* 1. KANBAN BOARD VIEW */}
        {activeView === 'board' && (
          <>
            {totalActive === 0 && savedVersions.length === 0 ? (
              <Card
                variant="outlined"
                sx={{
                  p: { xs: 3, sm: 5 },
                  maxWidth: 720,
                  mx: 'auto',
                  width: '100%',
                  textAlign: 'center',
                  borderRadius: '16px',
                  borderStyle: 'dashed',
                  bgcolor: 'background.paper',
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, p: '0 !important' }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ViewKanbanRoundedIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {t('history:empty.title', 'No Applications Tracked Yet')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460 }}>
                    {t(
                      'history:empty.desc',
                      'Synthesize or save a tailored resume in Resume Studio, then click "Track Application" to organize your recruitment pipeline on the Kanban board.'
                    )}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AutoAwesomeRoundedIcon />}
                    onClick={() => {
                      setActiveTab('wizard');
                      setWizardStep('target');
                    }}
                    sx={{ mt: 1, fontWeight: 700, px: 2.5 }}
                  >
                    {t('history:empty.action', 'Start New Application')}
                  </Button>
                </CardContent>
              </Card>
            ) : totalActive === 0 && savedVersions.length > 0 ? (
              <Card
                variant="outlined"
                sx={{
                  p: { xs: 3, sm: 4.5 },
                  maxWidth: 720,
                  mx: 'auto',
                  width: '100%',
                  textAlign: 'center',
                  borderRadius: '16px',
                  bgcolor: 'background.paper',
                  border: `1.5px dashed ${alpha(theme.palette.primary.main, 0.35)}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, p: '0 !important' }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '14px',
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AddRoundedIcon fontSize="medium" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {t('history:emptyBoardWithVersions.title', {
                      count: savedVersions.length,
                      defaultValue:
                        savedVersions.length === 1
                          ? 'You have 1 tailored CV ready to track'
                          : `You have ${savedVersions.length} tailored CVs ready to track`,
                    })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, lineHeight: 1.5 }}>
                    {t(
                      'history:emptyBoardWithVersions.desc',
                      'Select which CV version was actually submitted to an employer to add it to your active Kanban board.'
                    )}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddRoundedIcon />}
                    onClick={() => handleOpenTrackModal()}
                    sx={{ mt: 0.75, fontWeight: 700, px: 3, py: 1, borderRadius: '10px' }}
                  >
                    {t('history:actions.trackApp', '+ Track Application')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <KanbanBoard
                columns={kanbanColumns}
                applications={applications}
                savedVersions={savedVersions}
                searchQuery={searchQuery}
                onMoveApplication={handleMoveApplication}
                onLoadVersionInStudio={handleLoadVersion}
                onSetAttachedVersion={handleSetAttachedVersion}
                onArchiveApplication={handleArchiveApplication}
                onDeleteApplication={handleDeleteApplication}
                onDownloadPdf={handleDownloadPdf}
                isDownloadingPdfId={downloadingPdfId}
                onAddColumn={() => handleOpenEditColumn()}
                onEditColumn={handleOpenEditColumn}
                onDeleteColumn={handleDeleteColumn}
                onArchiveColumn={handleArchiveColumn}
                onQuickAddApplication={handleOpenTrackModal}
              />
            )}
          </>
        )}

        {/* 2. ARCHIVED APPLICATIONS VIEW */}
        {activeView === 'archived' && (
          <ArchivedApplicationsView
            archivedApplications={archivedApplications}
            savedVersions={savedVersions}
            searchQuery={searchQuery}
            onRestore={handleUnarchiveApplication}
            onDeletePermanently={handleDeleteApplication}
            onLoadInStudio={handleLoadVersion}
            onDownloadPdf={handleDownloadPdf}
            isDownloadingPdfId={downloadingPdfId}
          />
        )}

        {/* 3. ALL SAVED RESUME VERSIONS (Historical Database) */}
        {activeView === 'versions' && (
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
                onTrack={(version) => handleOpenTrackModal(undefined, version)}
                isDownloadingPdf={downloadingPdfId === v.id}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Opt-in Track Application Dialog */}
      <TrackApplicationDialog
        open={isTrackModalOpen}
        onClose={() => {
          setIsTrackModalOpen(false);
          setTrackPrefillVersion(undefined);
        }}
        onConfirm={handleAddApplication}
        prefillCompany={trackPrefillVersion?.companyName}
        prefillRole={trackPrefillVersion?.targetRole}
        prefillVersionId={trackPrefillVersion?.id}
        defaultColumnId={trackPrefillColumnId}
        savedVersions={savedVersions}
        existingApplications={applications}
        columns={kanbanColumns}
      />

      {/* Column Add / Edit Dialog */}
      <ColumnEditDialog
        open={isColumnEditOpen}
        column={editingColumn}
        onClose={() => {
          setIsColumnEditOpen(false);
          setEditingColumn(null);
        }}
        onSave={handleSaveColumn}
      />
    </Box>
  );
};
