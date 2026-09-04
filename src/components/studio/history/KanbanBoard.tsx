import React, { useState } from 'react';
import {
  Box,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useTranslation } from 'react-i18next';
import { KanbanBoardProps, ApplicationItem } from '../../../types';
import { HorizontalScrollContainer } from '../common/HorizontalScrollContainer';
import { KanbanColumnComponent } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';
import { RADIUS_TOKENS } from '../../../theme/dimensions';

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  applications,
  savedVersions,
  searchQuery,
  onMoveApplication,
  onLoadVersionInStudio,
  onSetAttachedVersion,
  onArchiveApplication,
  onDeleteApplication,
  onDownloadPdf,
  isDownloadingPdfId,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onArchiveColumn,
  onQuickAddApplication,
}) => {
  const { t } = useTranslation(['history', 'common']);
  const theme = useTheme();
  const [activeApp, setActiveApp] = useState<ApplicationItem | null>(null);
  const [scheduleModalApp, setScheduleModalApp] = useState<ApplicationItem | null>(null);

  const isInterviewStage = (colId: string) => {
    if (colId === 'interview') return true;
    const col = columns.find((c) => c.id === colId);
    const title = (col?.title || '').toLowerCase();
    return (
      title.includes('interview') ||
      title.includes('entrevista') ||
      title.includes('gespräch') ||
      title.includes('entretien') ||
      title.includes('colloquio')
    );
  };

  const checkInterviewTransition = (app: ApplicationItem, targetColId: string) => {
    if (app.columnId !== targetColId && isInterviewStage(targetColId)) {
      setScheduleModalApp(app);
    }
  };

  // Configure sensors: MouseSensor for desktop mouse, TouchSensor with long-press for mobile/touch devices
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter active (non-archived) applications by search query
  const filteredApps = applications.filter((app) => {
    if (app.isArchived) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      app.companyName.toLowerCase().includes(query) ||
      app.targetRole.toLowerCase().includes(query) ||
      (app.notes && app.notes.toLowerCase().includes(query)) ||
      (app.location && app.location.toLowerCase().includes(query))
    );
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const app = applications.find((a) => a.id === active.id);
    if (app) {
      setActiveApp(app);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveApp(null);

    if (!over) return;

    const activeAppId = active.id as string;
    const overId = over.id as string;

    const sourceApp = applications.find((a) => a.id === activeAppId);
    if (!sourceApp) return;

    const overData = over.data.current;

    // 1. Dropped directly onto a column container
    if (overData?.type === 'column' || columns.some((c) => c.id === overId)) {
      const targetColumnId = overData?.column?.id || overId;
      if (sourceApp.columnId !== targetColumnId) {
        checkInterviewTransition(sourceApp, targetColumnId);
        onMoveApplication(activeAppId, targetColumnId);
      }
      return;
    }

    // 2. Dropped over another card
    if (overData?.type === 'card' || applications.some((a) => a.id === overId)) {
      const targetApp = applications.find((a) => a.id === overId);
      if (targetApp) {
        const targetColumnId = targetApp.columnId;
        const columnApps = applications.filter((a) => a.columnId === targetColumnId && !a.isArchived);
        const targetIndex = columnApps.findIndex((a) => a.id === overId);
        if (sourceApp.columnId !== targetColumnId) {
          checkInterviewTransition(sourceApp, targetColumnId);
        }
        onMoveApplication(activeAppId, targetColumnId, targetIndex >= 0 ? targetIndex : undefined);
      }
    }
  };

  // Active item for overlay
  const activeAttachedVersion = activeApp
    ? savedVersions.find((v) => v.id === activeApp.appliedVersionId)
    : undefined;
  const activeMatchingVersions = activeApp
    ? savedVersions.filter((v) => v.companyName.toLowerCase().trim() === activeApp.companyName.toLowerCase().trim())
    : [];

  return (
    <>
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <HorizontalScrollContainer
        fadeWidth={56}
        scrollStep={320}
        contentSx={{
          gap: { xs: 1.5, sm: 2, md: 2.5 },
          pb: 2,
          pt: 0.5,
          px: 0.5,
          minHeight: '62vh',
          alignItems: 'stretch',
        }}
      >
        {columns.map((column) => {
          const colApps = filteredApps.filter((a) => a.columnId === column.id);

          return (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              allColumns={columns}
              applications={colApps}
              savedVersions={savedVersions}
              onMoveApplication={onMoveApplication}
              onLoadVersionInStudio={onLoadVersionInStudio}
              onSetAttachedVersion={onSetAttachedVersion}
              onArchiveApplication={onArchiveApplication}
              onDeleteApplication={onDeleteApplication}
              onDownloadPdf={onDownloadPdf}
              isDownloadingPdfId={isDownloadingPdfId}
              onEditColumn={onEditColumn}
              onDeleteColumn={onDeleteColumn}
              onArchiveColumn={onArchiveColumn}
              onQuickAdd={onQuickAddApplication}
            />
          );
        })}

        {/* Add Column Button */}
        <Box sx={{ width: { xs: '180px', sm: '220px' }, minWidth: { xs: '180px', sm: '220px' }, flexShrink: 0 }}>
          <Button
            variant="outlined"
            onClick={onAddColumn}
            startIcon={<AddRoundedIcon />}
            sx={{
              width: '100%',
              height: '100%',
              minHeight: '120px',
              borderStyle: 'dashed',
              borderRadius: RADIUS_TOKENS.xl,
              borderWidth: '1.5px',
              borderColor: alpha(theme.palette.divider, 0.8),
              color: 'text.secondary',
              fontWeight: 700,
              fontSize: '0.84rem',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            {t('history:board.addColumn', '+ Add Stage')}
          </Button>
        </Box>
      </HorizontalScrollContainer>

      {/* Drag Overlay with active card preview */}
      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeApp ? (
          <Box sx={{ width: { xs: '260px', sm: '290px', md: '310px' }, transform: 'rotate(2.5deg)', pointerEvents: 'none' }}>
            <KanbanCard
              application={activeApp}
              attachedVersion={activeAttachedVersion}
              allMatchingVersions={activeMatchingVersions}
              onLoadInStudio={() => {}}
              onSetAttachedVersion={() => {}}
              onArchive={() => {}}
              onDelete={() => {}}
              onDownloadPdf={() => {}}
              isDraggingOverlay={true}
            />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>

    <ScheduleInterviewModal
      open={Boolean(scheduleModalApp)}
      application={scheduleModalApp}
      onClose={() => setScheduleModalApp(null)}
    />
  </>
  );
};
