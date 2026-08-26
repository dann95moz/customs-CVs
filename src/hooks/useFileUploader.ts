import React, { useRef, useCallback } from 'react';

interface UseFileUploaderOptions {
  onFileLoaded: (content: string, fileName: string) => void;
  onError?: (error: Error) => void;
}

export function useFileUploader({ onFileLoaded, onError }: UseFileUploaderOptions) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        onFileLoaded(text, file.name);
      }
    };
    reader.onerror = (event) => {
      const err = new Error(event.target?.error?.message || 'Error reading file');
      if (onError) onError(err);
    };
    reader.readAsText(file);
  }, [onFileLoaded, onError]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
      // Reset input value so the same file can be re-selected if needed
      e.target.value = '';
    }
  }, [readFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readFile(file);
    }
  }, [readFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    handleFileUpload,
    handleDrop,
    handleDragOver,
    openFileDialog
  };
}
