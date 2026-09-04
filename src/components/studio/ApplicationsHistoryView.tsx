import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SelectAllRoundedIcon from '@mui/icons-material/SelectAllRounded';
import DeselectRoundedIcon from '@mui/icons-material/DeselectRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import DifferenceRoundedIcon from '@mui/icons-material/DifferenceRounded';
import { useTranslation } from 'react-i18next';
import { GeneratedCvVersion, KanbanColumn } from '../../types/cv';
import { ApplicationsStatsHeader } from './history/ApplicationsStatsHeader';
import { KanbanBoard } from './history/KanbanBoard';
import { ArchivedApplicationsView } from './history/ArchivedApplicationsView';
import { ApplicationCard } from './history/ApplicationCard';
import { TrackApplicationDialog } from './history/TrackApplicationDialog';
import { ColumnEditDialog } from './history/ColumnEditDialog';
import { VersionDiffModal } from './history/VersionDiffModal';
import { useApplicationsHistory } from '../../hooks/useApplicationsHistory';

export const ApplicationsHistoryView: React.FC = () => {
  const { t } = useTranslation(['history', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const {
    savedVersions,
    applications,
    kanbanColumns,
    activeApplications,
    archivedApplications,
    filteredVersions,
    activeView,
    searchQuery,
    setSearchQuery,
    downloadingPdfId,
    isSelectionMode,
    selectedVersionIds,
    isBulkDeleteDialogOpen,
    isTrackModalOpen,
    trackPrefillColumnId,
    trackPrefillVersion,
    isColumnEditOpen,
    editingColumn,
    isDiffModalOpen,
    diffSelectedVersionId,
    totalActive,
    totalArchived,
    totalInterviews,
    totalOffers,
    avgMatchScore,
    activeLinkedVersionIds,
    selectedTotalCount,
    selectedProtectedCount,
    selectedDeletableCount,
    visibleVersionIds,
    isAllVisibleSelected,
    handleToggleSelect,
    handleToggleSelectAllVisible,
    handleStartSelectionMode,
    handleExitSelectionMode,
    handleConfirmBulkDelete,
    handleDownloadMarkdown,
    handleDownloadPdf,
    handleOpenTrackModal,
    handleCloseTrackModal,
    handleOpenEditColumn,
    handleCloseEditColumn,
    handleSaveColumn,
    handleOpenDiffModal,
    handleCloseDiffModal,
    handleOpenBulkDeleteModal,
    handleCloseBulkDeleteModal,
    handleStartNewResume,
    handleViewChange,
    handleLoadVersion,
    handleDeleteVersion,
    handleAddApplication,
    handleDeleteApplication,
    handleMoveApplication,
    handleArchiveApplication,
    handleUnarchiveApplication,
    handleArchiveColumn,
    handleSetAttachedVersion,
    handleDeleteColumn,
  } = useApplicationsHistory();

  return (
    <Box
      sx={{
        flex: 1,
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        p: { xs: 1.5, sm: 2, md: 3 },
        pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 48px)', sm: 5, md: 6 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: activeView === 'board' && totalActive > 0 ? '100%' : 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          boxSizing: 'border-box',
          minWidth: 0,
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
          onStartNewResume={handleStartNewResume}
          activeView={activeView}
          onViewChange={handleViewChange}
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
                    onClick={handleStartNewResume}
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
                    sx={{ mt: 0.75, fontWeight: 700, px: 3, py: 1 }}
                  >
                    {t('history:actions.trackApp', 'Track Application')}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Version List Control / Selection Bar */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.25, sm: 1.75 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1.5,
                borderRadius: '12px',
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: isSelectionMode
                  ? alpha(theme.palette.primary.main, isDark ? 0.12 : 0.04)
                  : 'background.paper',
                transition: 'all 0.2s ease',
              }}
            >
              {isSelectionMode ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={t('history:selection.selectedCount', '{{count}} selected', {
                        count: selectedTotalCount,
                      })}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />

                    {selectedProtectedCount > 0 && (
                      <Chip
                        icon={<LockRoundedIcon sx={{ fontSize: '13px !important' }} />}
                        label={t('history:selection.protectedNotice', '{{count}} linked to Kanban (protected)', {
                          count: selectedProtectedCount,
                        })}
                        color="warning"
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      onClick={handleToggleSelectAllVisible}
                      startIcon={
                        isAllVisibleSelected ? (
                          <DeselectRoundedIcon sx={{ fontSize: 16 }} />
                        ) : (
                          <SelectAllRoundedIcon sx={{ fontSize: 16 }} />
                        )
                      }
                      sx={{ fontWeight: 600, fontSize: '0.78rem' }}
                    >
                      {isAllVisibleSelected
                        ? t('history:selection.deselectAll', 'Deselect All')
                        : searchQuery
                        ? t('history:selection.selectAllFiltered', 'Select Filtered ({{count}})', {
                            count: visibleVersionIds.length,
                          })
                        : t('history:selection.selectAll', 'Select All')}
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      disabled={selectedDeletableCount === 0}
                      onClick={handleOpenBulkDeleteModal}
                      startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />}
                      sx={{ fontWeight: 700, fontSize: '0.78rem' }}
                    >
                      {t('history:selection.deleteButton', 'Delete ({{count}})', {
                        count: selectedDeletableCount,
                      })}
                    </Button>

                    <Button
                      size="small"
                      variant="text"
                      color="inherit"
                      onClick={handleExitSelectionMode}
                      startIcon={<CloseRoundedIcon sx={{ fontSize: 16 }} />}
                      sx={{ fontWeight: 600, fontSize: '0.78rem' }}
                    >
                      {t('common:actions.cancel', 'Cancel')}
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HistoryRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                      {searchQuery
                        ? t('history:selection.showingFiltered', 'Showing {{filtered}} of {{total}} saved versions', {
                            filtered: filteredVersions.length,
                            total: savedVersions.length,
                          })
                        : t('history:selection.totalSaved', '{{count}} total saved versions', {
                            count: savedVersions.length,
                          })}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      disabled={savedVersions.length === 0}
                      onClick={() => handleOpenDiffModal()}
                      startIcon={<DifferenceRoundedIcon sx={{ fontSize: 16 }} />}
                      sx={{ fontWeight: 700, fontSize: '0.78rem' }}
                    >
                      {t('history:diff.compareButton', 'Compare Versions (Diff)')}
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      disabled={savedVersions.length === 0}
                      onClick={handleStartSelectionMode}
                      startIcon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />}
                      sx={{ fontWeight: 700, fontSize: '0.78rem' }}
                    >
                      {t('history:selection.enterSelectMode', 'Select to Delete')}
                    </Button>
                  </Box>
                </>
              )}
            </Paper>

            {/* Empty States */}
            {filteredVersions.length === 0 ? (
              <Card
                variant="outlined"
                sx={{
                  p: { xs: 3, sm: 4.5 },
                  textAlign: 'center',
                  borderRadius: '16px',
                  bgcolor: 'background.paper',
                  borderStyle: 'dashed',
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, p: '0 !important' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {searchQuery
                      ? t('history:selection.noFilteredTitle', 'No CV versions match your filter')
                      : t('history:selection.noVersionsTitle', 'No Tailored CV Versions Yet')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460 }}>
                    {searchQuery
                      ? t('history:selection.noFilteredDesc', 'Try adjusting your search query or clear the filter.')
                      : t('history:selection.noVersionsDesc', 'Generate or save tailored CVs in Studio to maintain your application history here.')}
                  </Typography>
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
                    onTrack={(version) => handleOpenTrackModal(undefined, version)}
                    isDownloadingPdf={downloadingPdfId === v.id}
                    selectionMode={isSelectionMode}
                    isSelected={selectedVersionIds.includes(v.id)}
                    onToggleSelect={handleToggleSelect}
                    isLinkedToActiveApp={activeLinkedVersionIds.has(v.id)}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Dedicated End-of-Scroll Safe Spacer */}
        <Box sx={{ height: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 36px)', sm: 20 }, flexShrink: 0 }} />
      </Box>

      {/* Bulk Delete Confirmation Dialog with Exact Counts & Kanban Protection Notice */}
      <Dialog
        open={isBulkDeleteDialogOpen}
        onClose={handleCloseBulkDeleteModal}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              p: 1,
              bgcolor: 'background.paper',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteOutlineRoundedIcon color="error" />
          {selectedProtectedCount > 0 && selectedDeletableCount === 0
            ? t('history:bulkDeleteDialog.titleAllProtected', 'Protected CV Versions')
            : selectedProtectedCount > 0
            ? t('history:bulkDeleteDialog.titlePartial', 'Delete {{count}} versions?', {
                count: selectedDeletableCount,
              })
            : t('history:bulkDeleteDialog.title', {
                count: selectedTotalCount,
                defaultValue:
                  selectedTotalCount === 1
                    ? 'Delete 1 CV version?'
                    : `Delete ${selectedTotalCount} CV versions?`,
              })}
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          {selectedProtectedCount > 0 && (
            <Alert
              severity="warning"
              variant="outlined"
              sx={{ mb: 1.5, py: 0.75, fontSize: '0.82rem', borderRadius: '8px' }}
            >
              {t(
                'history:bulkDeleteDialog.protectedAlert',
                '{{protectedCount}} of the {{totalCount}} selected versions are linked to active applications on your Kanban board and will not be deleted.',
                { protectedCount: selectedProtectedCount, totalCount: selectedTotalCount }
              )}
            </Alert>
          )}

          <DialogContentText sx={{ fontSize: '0.88rem', color: 'text.secondary' }}>
            {selectedProtectedCount > 0 && selectedDeletableCount === 0
              ? t(
                  'history:bulkDeleteDialog.messageAllProtected',
                  'All selected versions are currently attached to active applications in your Kanban pipeline. To delete them, first archive or delete the corresponding Kanban applications.'
                )
              : selectedProtectedCount > 0
              ? t(
                  'history:bulkDeleteDialog.messagePartial',
                  'Are you sure you want to delete the remaining {{deletableCount}} versions? This action is permanent and cannot be undone.',
                  { deletableCount: selectedDeletableCount }
                )
              : t(
                  'history:bulkDeleteDialog.message',
                  {
                    count: selectedTotalCount,
                    defaultValue:
                      selectedTotalCount === 1
                        ? 'Delete 1 CV version? This action is permanent and cannot be undone.'
                        : `Delete ${selectedTotalCount} CV versions? This action is permanent and cannot be undone.`,
                  }
                )}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 1.5, gap: 1 }}>
          <Button
            onClick={handleCloseBulkDeleteModal}
            color="inherit"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 700 }}
          >
            {selectedProtectedCount > 0 && selectedDeletableCount === 0
              ? t('common:actions.close', 'Close')
              : t('common:actions.cancel', 'Cancel')}
          </Button>

          {selectedDeletableCount > 0 && (
            <Button
              onClick={handleConfirmBulkDelete}
              color="error"
              variant="contained"
              size="small"
              startIcon={<DeleteOutlineRoundedIcon />}
              sx={{ fontWeight: 700 }}
            >
              {t('history:selection.confirmDelete', 'Delete {{count}} Versions', {
                count: selectedDeletableCount,
              })}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Opt-in Track Application Dialog */}
      <TrackApplicationDialog
        open={isTrackModalOpen}
        onClose={handleCloseTrackModal}
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
        onClose={handleCloseEditColumn}
        onSave={handleSaveColumn}
      />

      {/* Visual Version Diff Modal */}
      <VersionDiffModal
        open={isDiffModalOpen}
        onClose={handleCloseDiffModal}
        initialVersionBId={diffSelectedVersionId}
      />
    </Box>
  );
};
