import { StateCreator } from 'zustand';
import { ResumeStore, HistorySlice } from '../types';
import { GeneratedCvVersion, ApplicationItem, KanbanColumn, DEFAULT_KANBAN_COLUMNS } from '../../types/cv';
import {
  extractCandidateName,
  extractTargetCompany,
  extractTargetRole,
} from '../../core/parser';
import { auditCvContent } from '../../core/audit-engine';

export const createHistorySlice: StateCreator<ResumeStore, [], [], HistorySlice> = (set, get) => ({
  savedVersions: [],
  applications: [],
  kanbanColumns: DEFAULT_KANBAN_COLUMNS,

  handleSaveCurrentVersion: (customTitle?: string) => {
    const {
      masterData,
      companyName,
      targetJob,
      targetRole,
      gapMarkdown,
      cvMarkdown,
      theme,
      palette,
      pageBudget,
      photo,
      savedVersions,
    } = get();

    const candName = extractCandidateName(masterData, 'Candidate').replace(/_/g, ' ');
    const comp = customTitle || companyName || extractTargetCompany(targetJob, 'Target Company');
    const role = targetRole || extractTargetRole(targetJob, masterData, 'Specialist');

    // Duplicate prevention: if an identical version already exists, avoid creating a redundant clone
    const existingDuplicate = savedVersions.find(
      (v) =>
        v.cvMarkdown.trim() === cvMarkdown.trim() &&
        v.companyName.trim().toLowerCase() === comp.trim().toLowerCase() &&
        v.targetRole.trim().toLowerCase() === role.trim().toLowerCase() &&
        v.theme === theme &&
        v.palette === palette &&
        v.pageBudget === pageBudget
    );

    if (existingDuplicate) {
      return existingDuplicate.id;
    }

    let matchScore = 92;
    const scoreMatch = gapMarkdown.match(/Estimated Match Score:\*{0,2}\s*(\d{1,3})/i);
    if (scoreMatch) {
      matchScore = parseInt(scoreMatch[1], 10);
    }

    const audit = auditCvContent(cvMarkdown, targetJob, masterData);
    const newVersionId = `cv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newVersion: GeneratedCvVersion = {
      id: newVersionId,
      createdAt: new Date().toISOString(),
      candidateName: candName,
      companyName: comp,
      targetRole: role,
      matchScore: matchScore || 92,
      qualityScore: audit.overallScore || 8.8,
      theme,
      palette,
      pageBudget,
      cvMarkdown,
      gapMarkdown,
      targetJobSnippet: targetJob.slice(0, 280),
      photo: photo || undefined,
    };

    set({
      savedVersions: [newVersion, ...savedVersions.filter((v) => v.id !== newVersion.id)],
    });

    return newVersionId;
  },

  handleLoadVersion: (id: string) => {
    const found = get().savedVersions.find((v) => v.id === id);
    if (found) {
      set({
        cvMarkdown: found.cvMarkdown,
        ...(found.gapMarkdown ? { gapMarkdown: found.gapMarkdown } : {}),
        ...(found.companyName ? { companyName: found.companyName } : {}),
        ...(found.targetRole ? { targetRole: found.targetRole } : {}),
        ...(found.theme ? { theme: found.theme } : {}),
        ...(found.palette ? { palette: found.palette } : {}),
        ...(found.pageBudget ? { pageBudget: found.pageBudget } : {}),
        photo: found.photo || null,
        activeTab: 'wizard',
        wizardStep: 'preview',
      });
    }
  },

  handleDeleteVersion: (id: string) => {
    set({
      savedVersions: get().savedVersions.filter((v) => v.id !== id),
    });
  },

  handleDeleteMultipleVersions: (ids: string[]) => {
    const { applications, savedVersions } = get();
    // Protect versions that are linked to active (non-archived) Kanban applications
    const activeApps = applications.filter((app) => !app.isArchived);
    const protectedIds = new Set(
      activeApps.map((app) => app.appliedVersionId).filter((id): id is string => Boolean(id))
    );

    const idsToDelete = new Set(ids.filter((id) => !protectedIds.has(id)));
    set({
      savedVersions: savedVersions.filter((v) => !idsToDelete.has(v.id)),
    });
  },

  handleAddApplication: (appData) => {
    const { savedVersions, applications, kanbanColumns } = get();
    const appId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const attachedVersion = savedVersions.find((v) => v.id === appData.appliedVersionId);
    const targetColId = appData.columnId || (kanbanColumns[0]?.id ?? 'applied');

    const newApp: ApplicationItem = {
      id: appId,
      companyName: appData.companyName.trim(),
      targetRole: appData.targetRole.trim(),
      columnId: targetColId,
      appliedVersionId: appData.appliedVersionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      appliedDate: new Date().toISOString(),
      matchScore: attachedVersion?.matchScore || 92,
      qualityScore: attachedVersion?.qualityScore || 8.8,
      notes: appData.notes || '',
      salary: appData.salary || '',
      location: appData.location || '',
      isArchived: false,
    };

    set({
      applications: [newApp, ...applications],
    });

    return appId;
  },

  handleUpdateApplication: (id, updates) => {
    set({
      applications: get().applications.map((app) =>
        app.id === id
          ? {
              ...app,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : app
      ),
    });
  },

  handleDeleteApplication: (id) => {
    set({
      applications: get().applications.filter((app) => app.id !== id),
    });
  },

  handleMoveApplication: (id, targetColumnId, newIndex) => {
    const currentApps = [...get().applications];
    const appIndex = currentApps.findIndex((a) => a.id === id);
    if (appIndex === -1) return;

    const [movedApp] = currentApps.splice(appIndex, 1);
    const updatedApp: ApplicationItem = {
      ...movedApp,
      columnId: targetColumnId,
      updatedAt: new Date().toISOString(),
    };

    if (typeof newIndex === 'number' && newIndex >= 0) {
      currentApps.splice(newIndex, 0, updatedApp);
    } else {
      currentApps.unshift(updatedApp);
    }

    set({ applications: currentApps });
  },

  handleArchiveApplication: (id) => {
    set({
      applications: get().applications.map((app) =>
        app.id === id
          ? {
              ...app,
              isArchived: true,
              archivedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : app
      ),
    });
  },

  handleUnarchiveApplication: (id) => {
    set({
      applications: get().applications.map((app) =>
        app.id === id
          ? {
              ...app,
              isArchived: false,
              archivedAt: undefined,
              updatedAt: new Date().toISOString(),
            }
          : app
      ),
    });
  },

  handleArchiveColumn: (columnId) => {
    set({
      applications: get().applications.map((app) =>
        app.columnId === columnId && !app.isArchived
          ? {
              ...app,
              isArchived: true,
              archivedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : app
      ),
    });
  },

  handleSetAttachedVersion: (applicationId, versionId) => {
    const version = get().savedVersions.find((v) => v.id === versionId);
    set({
      applications: get().applications.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              appliedVersionId: versionId,
              matchScore: version?.matchScore ?? app.matchScore,
              qualityScore: version?.qualityScore ?? app.qualityScore,
              updatedAt: new Date().toISOString(),
            }
          : app
      ),
    });
  },

  handleAddColumn: (title, color) => {
    const newColId = `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newCol: KanbanColumn = {
      id: newColId,
      title: title.trim(),
      color: color || '#0284c7',
    };
    set({
      kanbanColumns: [...get().kanbanColumns, newCol],
    });
  },

  handleUpdateColumn: (columnId, updates) => {
    set({
      kanbanColumns: get().kanbanColumns.map((col) =>
        col.id === columnId ? { ...col, ...updates } : col
      ),
    });
  },

  handleDeleteColumn: (columnId, fallbackColumnId) => {
    const columns = get().kanbanColumns.filter((c) => c.id !== columnId);
    const targetColId = fallbackColumnId || columns[0]?.id || 'applied';

    // Reassign existing applications in this column to targetColId
    const updatedApps = get().applications.map((app) =>
      app.columnId === columnId ? { ...app, columnId: targetColId } : app
    );

    set({
      kanbanColumns: columns,
      applications: updatedApps,
    });
  },

  handleReorderColumns: (columnIds) => {
    const currentCols = get().kanbanColumns;
    const sorted = columnIds
      .map((id) => currentCols.find((c) => c.id === id))
      .filter((c): c is KanbanColumn => Boolean(c));
    set({ kanbanColumns: sorted });
  },

  handleResetKanbanColumns: () => {
    set({ kanbanColumns: DEFAULT_KANBAN_COLUMNS });
  },
});

