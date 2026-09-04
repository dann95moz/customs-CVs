import { useState, useRef, useEffect, useCallback } from 'react';
import { extractCandidateName } from '../core/parser';
import { useFileUploader } from './useFileUploader';
import { useTranslation } from 'react-i18next';
import { downloadTextFile, buildTimestampedFileName } from '../utils/fileUtils';
import { PdfImportResult } from '../core/pdf-extractor';

interface UseMasterDataWorkflowProps {
  content: string;
  onChange: (value: string) => void;
  onNextStep: () => void;
}

export const useMasterDataWorkflow = ({
  content,
  onChange,
  onNextStep,
}: UseMasterDataWorkflowProps) => {
  const { t } = useTranslation(['profile', 'common']);

  const [editMode, setEditMode] = useState<'guided' | 'markdown'>('guided');
  const [manualText, setManualText] = useState(content);
  const manualTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setManualText(content);
  }, [content]);

  useEffect(() => {
    return () => {
      if (manualTimerRef.current) {
        clearTimeout(manualTimerRef.current);
        manualTimerRef.current = null;
      }
    };
  }, []);

  const flushManual = useCallback(() => {
    if (manualTimerRef.current) {
      clearTimeout(manualTimerRef.current);
      manualTimerRef.current = null;
      onChange(manualText);
    }
  }, [manualText, onChange]);

  const handleManualTextChange = (val: string) => {
    setManualText(val);
    if (manualTimerRef.current) {
      clearTimeout(manualTimerRef.current);
    }
    manualTimerRef.current = setTimeout(() => {
      manualTimerRef.current = null;
      onChange(val);
    }, 250);
  };

  const handleManualBlur = () => {
    if (manualTimerRef.current) {
      clearTimeout(manualTimerRef.current);
      manualTimerRef.current = null;
    }
    if (manualText !== content) {
      onChange(manualText);
    }
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showClearConfirmDialog, setShowClearConfirmDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<{
    content: string;
    fileName: string;
    isPdf?: boolean;
    details?: PdfImportResult;
  } | null>(null);

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'error';
    usedAI?: boolean;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const hasData = Boolean(content && content.trim().length > 20);

  const handleApplyImportedData = (
    importedText: string,
    fileName: string,
    isPdf?: boolean,
    details?: PdfImportResult
  ) => {
    onChange(importedText);
    const candidateName = extractCandidateName(importedText, fileName.replace(/\.pdf$/i, ''));

    setNotification({
      open: true,
      message: t('profile:status.pdfSuccess', {
        fileName,
        defaultValue: `Successfully imported career profile for ${candidateName} from ${fileName}`,
      }),
      severity: 'success',
      usedAI: details?.usedAI,
    });
  };

  const handleFileLoaded = (
    loadedContent: string,
    fileName: string,
    isPdf?: boolean,
    details?: PdfImportResult
  ) => {
    if (hasData) {
      setPendingFile({ content: loadedContent, fileName, isPdf, details });
      setShowConfirmDialog(true);
    } else {
      handleApplyImportedData(loadedContent, fileName, isPdf, details);
    }
  };

  const handleConfirmReplace = () => {
    if (pendingFile) {
      handleApplyImportedData(
        pendingFile.content,
        pendingFile.fileName,
        pendingFile.isPdf,
        pendingFile.details
      );
      setPendingFile(null);
    }
    setShowConfirmDialog(false);
  };

  const handleCancelReplace = () => {
    setPendingFile(null);
    setShowConfirmDialog(false);
  };

  const handleConfirmClear = () => {
    onChange('');
    setShowClearConfirmDialog(false);
    setNotification({
      open: true,
      message: t('profile:status.clearedSuccess', 'Career profile cleared. You can start from a blank slate.'),
      severity: 'info',
    });
  };

  const {
    fileInputRef,
    isProcessing,
    isDragging,
    handleFileUpload,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    openFileDialog,
  } = useFileUploader({
    onFileLoaded: handleFileLoaded,
    onError: (err) => {
      setNotification({
        open: true,
        message: err.message || 'Error processing uploaded file',
        severity: 'error',
      });
    },
  });

  const handleDownload = () => {
    const candidateName = extractCandidateName(content, '');
    const baseName = candidateName ? `master-profile_${candidateName.replace(/\s+/g, '_')}` : 'master-profile';
    const fileName = buildTimestampedFileName(baseName, 'md');
    downloadTextFile(content, fileName);
  };

  const handleContinue = () => {
    flushManual();
    onNextStep();
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return {
    editMode,
    setEditMode,
    manualText,
    handleManualTextChange,
    handleManualBlur,
    hasData,
    showConfirmDialog,
    showClearConfirmDialog,
    setShowClearConfirmDialog,
    pendingFile,
    notification,
    handleCloseNotification,
    handleConfirmReplace,
    handleCancelReplace,
    handleConfirmClear,
    handleDownload,
    handleContinue,
    // File upload handlers & state
    fileInputRef,
    isProcessing,
    isDragging,
    handleFileUpload,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    openFileDialog,
  };
};
