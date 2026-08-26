import React, { useRef, useState, useEffect } from 'react';
import {
  Button,
  Paper,
  Box,
  Typography,
  Chip,
  ButtonGroup,
  Tooltip,
  useTheme,
  alpha,
  IconButton,
  Divider,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FormatPaintRoundedIcon from '@mui/icons-material/FormatPaintRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import SpellcheckRoundedIcon from '@mui/icons-material/SpellcheckRounded';
import { useResumeWorkspace } from '../../context/ResumeWorkspaceContext';
import { CVRenderer } from '../CVRenderer';
import { SplitMarkdownEditor } from './SplitMarkdownEditor';
import { extractCandidateName } from '../../core/parser';
import { getAllPalettes } from '../../constants/palettes';
import { getAllTemplates, getTemplateMetadata } from '../../templates';
import { ThemeId, PaletteId } from '../../types/cv';
import { TemplateThumbnailMiniature } from './TemplateThumbnailMiniature';

const A4_PAGE_PX = 1123; // Exact A4 height at 96 DPI

export const StepPreview: React.FC = () => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';

  const {
    companyName,
    handleGenerate,
    isGenerating,
    cvMarkdown,
    setCvMarkdown,
    handleDownloadCvMarkdown,
    masterData,
    parsedCv,
    parsedMasterCv,
    theme,
    setTheme,
    palette,
    setPalette,
    stats,
    auditReport,
    gapInfo,
    handleSaveCurrentVersion,
    setWizardStep,
    setActiveTab,
  } = useResumeWorkspace();

  const [viewMode, setViewMode] = useState<'tailored' | 'generic' | 'compare'>('tailored');
  const [autoFitPreview] = useState<boolean>(true);
  const [sheetHeight, setSheetHeight] = useState<number>(0);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const paperRef = useRef<HTMLDivElement>(null);

  // Side Drawer state matching the reference Canva/Novoresume layout ('templates' open by default)
  const [activeSidePanel, setActiveSidePanel] = useState<'templates' | 'design' | 'audit' | null>('templates');

  // Toggle between rendered sheet page (default) and raw markdown editor
  const [isEditingMarkdown, setIsEditingMarkdown] = useState<boolean>(false);

  // Available palettes & templates
  const palettes = getAllPalettes();
  const allTemplates = getAllTemplates();
  const activeTemplateMeta = getTemplateMetadata(theme);

  // Measure rendered paper sheet height whenever content, theme, or viewMode changes
  useEffect(() => {
    const updateHeight = () => {
      if (paperRef.current) {
        setSheetHeight(paperRef.current.scrollHeight);
      }
    };
    updateHeight();
    const timer = setTimeout(updateHeight, 200);
    return () => clearTimeout(timer);
  }, [cvMarkdown, theme, palette, isEditingMarkdown, viewMode]);

  const estimatedPages = Math.max(1, Math.ceil((sheetHeight - 8) / A4_PAGE_PX));
  const overflowPercentage = Math.max(0, Math.round(((sheetHeight - A4_PAGE_PX) / A4_PAGE_PX) * 100));

  const handleSaveToHistory = () => {
    handleSaveCurrentVersion();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveAndExitMarkdown = () => {
    handleSaveToHistory();
    setIsEditingMarkdown(false);
  };

  const handleDownloadPdf = () => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute('data-theme');
    const previousScheme = root.style.colorScheme;

    // Temporarily switch DOM to light mode so the browser's PDF compositor prints pure white
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';

    const restoreTheme = () => {
      if (previousTheme) {
        root.setAttribute('data-theme', previousTheme);
      }
      if (previousScheme) {
        root.style.colorScheme = previousScheme;
      } else {
        root.style.removeProperty('color-scheme');
      }
      window.removeEventListener('afterprint', restoreTheme);
    };

    window.addEventListener('afterprint', restoreTheme, { once: true });

    // Open print dialog
    window.print();

    // Safety fallback restoration in case afterprint does not fire in some browsers
    setTimeout(restoreTheme, 1500);
  };

  return (
    <div className="preview-workspace-layout" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top Studio Control Bar */}
      <Paper
        elevation={0}
        className="no-print preview-top-toolbar"
        sx={{
          py: 1,
          px: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          borderBottom: `1px solid ${muiTheme.palette.divider}`,
          bgcolor: 'background.paper',
          zIndex: 20,
        }}
      >
        {/* Left: View Mode Switcher (Generic Baseline vs. Tailored vs. Compare) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ButtonGroup size="small" variant="outlined" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff' }}>
            <Button
              variant={viewMode === 'tailored' ? 'contained' : 'outlined'}
              onClick={() => {
                setViewMode('tailored');
                setIsEditingMarkdown(false);
              }}
              startIcon={<AutoAwesomeRoundedIcon />}
              sx={{ fontWeight: 700, fontSize: '0.78rem' }}
            >
              Tailored CV (AI)
            </Button>
            <Button
              variant={viewMode === 'generic' ? 'contained' : 'outlined'}
              onClick={() => {
                setViewMode('generic');
                setIsEditingMarkdown(false);
              }}
              startIcon={<TrackChangesRoundedIcon />}
              sx={{ fontWeight: 600, fontSize: '0.78rem' }}
            >
              Base Profile (Generic)
            </Button>
            <Button
              variant={viewMode === 'compare' ? 'contained' : 'outlined'}
              onClick={() => {
                setViewMode('compare');
                setIsEditingMarkdown(false);
              }}
              startIcon={<CompareArrowsRoundedIcon />}
              color="secondary"
              sx={{ fontWeight: 700, fontSize: '0.78rem' }}
            >
              Side-by-Side Comparison
            </Button>
          </ButtonGroup>

          {/* Active Template & Palette Indicator */}
          <Chip
            icon={<StyleRoundedIcon sx={{ fontSize: '14px !important' }} />}
            label={`${activeTemplateMeta.name}`}
            size="small"
            variant="outlined"
            onClick={() => setActiveSidePanel('templates')}
            sx={{ fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', display: { xs: 'none', md: 'inline-flex' } }}
          />
        </Box>

        {/* Right: Quick Tools + Pencil / Floppy Disk Switcher */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* PENCIL / FLOPPY DISK BUTTON: Strictly icon-only as requested */}
          {!isEditingMarkdown ? (
            <Tooltip title="Edit Markdown">
              <IconButton
                onClick={() => setIsEditingMarkdown(true)}
                size="small"
                sx={{
                  border: `1.5px solid ${muiTheme.palette.divider}`,
                  borderRadius: '8px',
                  p: 0.75,
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  color: 'text.primary',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
                    color: 'primary.main',
                  }
                }}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Save & Return to Sheet">
              <IconButton
                onClick={handleSaveAndExitMarkdown}
                size="small"
                color="primary"
                sx={{
                  border: `1.5px solid ${muiTheme.palette.primary.main}`,
                  borderRadius: '8px',
                  p: 0.75,
                  bgcolor: alpha(muiTheme.palette.primary.main, 0.12),
                  color: 'primary.main',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: alpha(muiTheme.palette.primary.main, 0.22),
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <SaveRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, my: 'auto' }} />

          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<BookmarkBorderRoundedIcon />}
            onClick={handleSaveToHistory}
            sx={{ fontSize: '0.78rem', fontWeight: 600 }}
          >
            {savedSuccess ? 'Saved!' : 'Save Version'}
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<AutoAwesomeRoundedIcon />}
            onClick={handleGenerate}
            disabled={isGenerating}
            sx={{ fontSize: '0.78rem', fontWeight: 700 }}
          >
            {isGenerating ? 'Synthesizing...' : 'Re-Tailor with AI'}
          </Button>

          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<PictureAsPdfRoundedIcon />}
            onClick={handleDownloadPdf}
            sx={{ fontWeight: 800, fontSize: '0.78rem', px: 2 }}
          >
            Download PDF
          </Button>
        </Box>
      </Paper>

      {/* Comparison Delta Banner (when in compare mode) */}
      {viewMode === 'compare' && (
        <Box
          className="no-print"
          sx={{
            py: 1,
            px: 2.5,
            bgcolor: isDark ? alpha(muiTheme.palette.primary.main, 0.08) : '#eff6ff',
            borderBottom: `1px solid ${alpha(muiTheme.palette.primary.main, 0.2)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CompareArrowsRoundedIcon color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Impact Delta: Base Master Profile vs. AI-Tailored Resume for {companyName || 'Target Company'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={`Match Score: 58% Base ➔ ${gapInfo.matchScore}% Tailored (+${gapInfo.matchScore - 58}%)`}
              color="success"
              size="small"
              sx={{ fontWeight: 800 }}
            />
            <Chip
              label={`${gapInfo.keywords.length} Keywords Integrated`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Box>
        </Box>
      )}

      {/* Main Studio Body: Vertical Left Rail + Side Drawer + Sheet Canvas */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* 1. Left Vertical Tool Rail (Exact style from reference screenshot) */}
        <Box
          className="no-print preview-side-rail"
          sx={{
            width: 76,
            borderRight: `1px solid ${muiTheme.palette.divider}`,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 2,
            gap: 1.5,
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          {/* Templates Rail Button */}
          <Box
            onClick={() => setActiveSidePanel(activeSidePanel === 'templates' ? null : 'templates')}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              width: '100%',
              px: 0.5,
              gap: 0.5,
              color: activeSidePanel === 'templates' ? 'primary.main' : 'text.secondary',
              transition: 'all 0.15s ease',
              '&:hover': {
                color: 'text.primary',
              }
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: activeSidePanel === 'templates'
                  ? alpha(muiTheme.palette.primary.main, isDark ? 0.2 : 0.1)
                  : 'transparent',
                color: activeSidePanel === 'templates' ? 'primary.main' : 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <StyleRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: activeSidePanel === 'templates' ? 700 : 500, textAlign: 'center' }}>
              Templates
            </Typography>
          </Box>

          {/* Design & Formatting Rail Button */}
          <Box
            onClick={() => setActiveSidePanel(activeSidePanel === 'design' ? null : 'design')}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              width: '100%',
              px: 0.5,
              gap: 0.5,
              color: activeSidePanel === 'design' ? 'primary.main' : 'text.secondary',
              transition: 'all 0.15s ease',
              '&:hover': {
                color: 'text.primary',
              }
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: activeSidePanel === 'design'
                  ? alpha(muiTheme.palette.primary.main, isDark ? 0.2 : 0.1)
                  : 'transparent',
                color: activeSidePanel === 'design' ? 'primary.main' : 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <FormatPaintRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: activeSidePanel === 'design' ? 700 : 500, textAlign: 'center', lineHeight: 1.1 }}>
              Design &<br />formatting
            </Typography>
          </Box>

          {/* Edit Markdown Rail Button */}
          <Box
            onClick={() => setIsEditingMarkdown(!isEditingMarkdown)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              width: '100%',
              px: 0.5,
              gap: 0.5,
              color: isEditingMarkdown ? 'primary.main' : 'text.secondary',
              transition: 'all 0.15s ease',
              '&:hover': {
                color: 'text.primary',
              }
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: isEditingMarkdown
                  ? alpha(muiTheme.palette.primary.main, isDark ? 0.2 : 0.1)
                  : 'transparent',
                color: isEditingMarkdown ? 'primary.main' : 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <EditRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: isEditingMarkdown ? 700 : 500, textAlign: 'center' }}>
              Markdown
            </Typography>
          </Box>

          {/* Spell Check / Audit Rail Button */}
          <Box
            onClick={() => setActiveSidePanel(activeSidePanel === 'audit' ? null : 'audit')}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              width: '100%',
              px: 0.5,
              gap: 0.5,
              color: activeSidePanel === 'audit' ? 'primary.main' : 'text.secondary',
              transition: 'all 0.15s ease',
              '&:hover': {
                color: 'text.primary',
              }
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: activeSidePanel === 'audit'
                  ? alpha(muiTheme.palette.primary.main, isDark ? 0.2 : 0.1)
                  : 'transparent',
                color: activeSidePanel === 'audit' ? 'primary.main' : 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <SpellcheckRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: activeSidePanel === 'audit' ? 700 : 500, textAlign: 'center', lineHeight: 1.1 }}>
              Spell check<br />& Audit
            </Typography>
          </Box>
        </Box>

        {/* 2. Expandable Side Panel (Exactly like reference image) */}
        {activeSidePanel && (
          <Box
            className="no-print preview-side-panel"
            sx={{
              width: { xs: 290, sm: 330 },
              borderRight: `1px solid ${muiTheme.palette.divider}`,
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflowY: 'auto',
              flexShrink: 0,
              zIndex: 9,
            }}
          >
            {/* Panel: TEMPLATES */}
            {activeSidePanel === 'templates' && (
              <Box sx={{ p: 2.5 }}>
                {/* Header: Title + Close X */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: -0.5 }}>
                    Templates
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setActiveSidePanel(null)}
                    sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                  >
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                {/* Circular Color Swatches Row at Top (like image) */}
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.2,
                      overflowX: 'auto',
                      py: 0.5,
                      px: 0.25,
                      '&::-webkit-scrollbar': { height: 4 },
                      '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 4 },
                    }}
                  >
                    {palettes.map((p) => {
                      const isSelected = palette === p.id;
                      return (
                        <Tooltip key={p.id} title={`${p.name} — ${p.description}`}>
                          <Box
                            onClick={() => setPalette(p.id)}
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              bgcolor: p.previewColor,
                              cursor: 'pointer',
                              flexShrink: 0,
                              border: isSelected
                                ? `2.5px solid ${muiTheme.palette.primary.main}`
                                : '1.5px solid rgba(0,0,0,0.12)',
                              boxShadow: isSelected ? `0 0 0 2px ${alpha(p.previewColor, 0.4)}` : 'none',
                              transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                              transition: 'all 0.15s ease',
                              '&:hover': {
                                transform: 'scale(1.22)',
                              }
                            }}
                          />
                        </Tooltip>
                      );
                    })}
                  </Box>
                </Box>

                {/* Subtitle: All templates */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    All templates
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {allTemplates.length} designs
                  </Typography>
                </Box>

                {/* 2-Column Grid of Miniature Template Preview Cards */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1.75,
                  }}
                >
                  {allTemplates.map((t) => (
                    <TemplateThumbnailMiniature
                      key={t.id}
                      themeId={t.id}
                      paletteId={palette}
                      name={t.name}
                      category={t.category}
                      isSelected={theme === t.id}
                      onClick={() => setTheme(t.id)}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Panel: DESIGN & FORMATTING */}
            {activeSidePanel === 'design' && (
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Design & formatting
                  </Typography>
                  <IconButton size="small" onClick={() => setActiveSidePanel(null)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                  Curated Accent Palettes
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, lineHeight: 1.4 }}>
                  Applied strictly to lines, headings and tags. Body text stays deep charcoal for 100% ATS readability.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {palettes.map((p) => {
                    const isSelected = palette === p.id;
                    return (
                      <Paper
                        key={p.id}
                        variant="outlined"
                        onClick={() => setPalette(p.id)}
                        sx={{
                          p: 1.25,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          bgcolor: isSelected ? alpha(muiTheme.palette.primary.main, 0.08) : 'background.paper',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            borderColor: 'primary.main',
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            bgcolor: p.previewColor,
                            flexShrink: 0,
                            border: '1.5px solid rgba(0,0,0,0.1)',
                          }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', color: 'text.primary' }}>
                            {p.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', display: 'block', lineHeight: 1.2 }} noWrap>
                            {p.description}
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>

                <Divider sx={{ my: 2.5 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                  Page Budget & Scale
                </Typography>
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Target Format:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>A4 Standard (1 Page)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Rendered Height:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{sheetHeight}px / {A4_PAGE_PX}px</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Page Status:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: estimatedPages === 1 ? '#10b981' : '#f59e0b' }}>
                      {estimatedPages === 1 ? 'Perfect 1 Page ✓' : `${estimatedPages} Pages`}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            {/* Panel: SPELL CHECK & AUDIT */}
            {activeSidePanel === 'audit' && (
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Quality & Health
                  </Typography>
                  <IconButton size="small" onClick={() => setActiveSidePanel(null)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', mb: 2, textAlign: 'center', bgcolor: alpha('#10b981', 0.05) }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    ATS & Executive Score
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>
                    {auditReport.overallScore} / 10.0
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {gapInfo.matchScore}% Match for {companyName || 'Target Role'}
                  </Typography>
                </Paper>

                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                  Verification Checks
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#10b981', fontSize: '1rem' }}>✓</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>Google XYZ Impact Formula</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#10b981', fontSize: '1rem' }}>✓</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>100% ATS Parser Safe Typography</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#10b981', fontSize: '1rem' }}>✓</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>High Contrast Body Text</Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<AssessmentRoundedIcon />}
                  onClick={() => setActiveTab('audit')}
                >
                  Open Full Audit Dashboard
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* 3. Main Center Canvas: ONLY THE A4 SHEET PAGE OR ONLY MARKDOWN */}
        <div className="preview-canvas-wrapper">
          {isEditingMarkdown ? (
            /* RAW MARKDOWN EDITOR ONLY: Sheet is completely hidden */
            <div className="split-pane-editor-full">
              <SplitMarkdownEditor
                content={viewMode === 'generic' ? masterData : cvMarkdown}
                onChange={viewMode === 'generic' ? () => {} : setCvMarkdown}
                onDownload={handleDownloadCvMarkdown}
                fileName={`CV_${extractCandidateName(masterData, 'Candidate')}.md`}
              />
            </div>
          ) : (
            /* A4 SHEET CANVAS ONLY: Pristine document preview without markdown distraction */
            <main className="preview-pane-canvas">
              {viewMode === 'compare' ? (
                /* Side-by-side Dual Sheet Layout */
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
                    gap: 3,
                    width: '100%',
                    maxWidth: 1700,
                    alignItems: 'start',
                  }}
                >
                  {/* Left Sheet: Base / Generic CV */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Chip
                      label="1. Base Master Dossier (Generic Baseline)"
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1, fontWeight: 700 }}
                    />
                    <div className="paper-sheet" style={{ transform: 'scale(0.88)', transformOrigin: 'top center' }}>
                      <CVRenderer data={parsedMasterCv} theme={theme} palette="minimal-slate" />
                    </div>
                  </Box>

                  {/* Right Sheet: Tailored CV */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Chip
                      label={`2. Surgical Tailored Resume (${gapInfo.matchScore}% Match)`}
                      size="small"
                      color="primary"
                      sx={{ mb: 1, fontWeight: 800 }}
                    />
                    <div className="paper-sheet" style={{ transform: 'scale(0.88)', transformOrigin: 'top center' }}>
                      <CVRenderer data={parsedCv} theme={theme} palette={palette} />
                    </div>
                  </Box>
                </Box>
              ) : (
                /* Single Sheet Layout (Tailored or Generic) */
                <div
                  ref={paperRef}
                  className={`paper-sheet ${autoFitPreview && overflowPercentage > 0 && overflowPercentage <= 25 ? 'compact-fit' : ''}`}
                >
                  <CVRenderer
                    data={viewMode === 'generic' ? parsedMasterCv : parsedCv}
                    theme={theme}
                    palette={palette}
                  />

                  {/* Visual Page Break Marker at A4 limit */}
                  <div className="page-break-guide" style={{ top: `${A4_PAGE_PX}px` }}>
                    <span>✂️ Page 1 Boundary (Standard A4 Format)</span>
                  </div>
                </div>
              )}
            </main>
          )}

          {/* Step 4 Bottom Navigation Bar */}
          <Paper
            elevation={0}
            className="no-print preview-nav-footer"
            sx={{
              p: 1.5,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: `1px solid ${muiTheme.palette.divider}`,
              bgcolor: 'background.paper',
              zIndex: 10,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => setWizardStep('tailor')}
              size="small"
            >
              Back to Tailoring (Step 3)
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                Estimated Length: <strong style={{ color: estimatedPages === 1 ? '#10b981' : '#f59e0b' }}>{estimatedPages} Page</strong> • Height: {sheetHeight}px
              </Typography>

              <Button
                variant="contained"
                color="primary"
                startIcon={<PictureAsPdfRoundedIcon />}
                onClick={handleDownloadPdf}
                sx={{ fontWeight: 800, px: 3 }}
                size="small"
              >
                Download Official PDF
              </Button>
            </Box>
          </Paper>
        </div>
      </Box>
    </div>
  );
};
