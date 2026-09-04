import { useState, useEffect, useRef, useCallback } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { downloadTextFile, buildTimestampedFileName } from '../utils/fileUtils';
import { extractCandidateName } from '../core/parser';

export const useBackupReminder = () => {
  const lastBackupTimestamp = useResumeStore((s) => s.lastBackupTimestamp);
  const unsavedChangesCount = useResumeStore((s) => s.unsavedChangesCount);
  const masterData = useResumeStore((s) => s.masterData);
  const recordBackup = useResumeStore((s) => s.recordBackup);

  const [toastOpen, setToastOpen] = useState(false);
  const hasShownToastThisSession = useRef(false);

  const handleExportBackup = useCallback(() => {
    const candidateName = extractCandidateName(masterData, 'Candidate');
    const baseName = `CV_Backup_${candidateName.replace(/\s+/g, '_')}`;
    const fileName = buildTimestampedFileName(baseName, 'md');

    downloadTextFile(masterData, fileName);
    recordBackup();
    setToastOpen(false);
  }, [masterData, recordBackup]);

  useEffect(() => {
    if (hasShownToastThisSession.current) return;

    const daysElapsed = Math.floor(
      Math.max(0, Date.now() - (lastBackupTimestamp || Date.now())) / (1000 * 60 * 60 * 24)
    );

    // Trigger toast if 3+ changes and 3+ days since last export, or >= 5 unsaved changes in session
    if ((unsavedChangesCount >= 3 && daysElapsed >= 3) || unsavedChangesCount >= 5) {
      // Delay slightly after mount so it's not jarring
      const timer = setTimeout(() => {
        setToastOpen(true);
        hasShownToastThisSession.current = true;
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [unsavedChangesCount, lastBackupTimestamp]);

  return {
    lastBackupTimestamp,
    unsavedChangesCount,
    toastOpen,
    handleCloseToast: () => setToastOpen(false),
    handleExportBackup,
  };
};
