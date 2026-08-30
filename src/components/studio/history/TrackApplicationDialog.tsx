import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  Paper,
  Chip,
  Alert,
  MenuItem,
  IconButton,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { useTranslation } from 'react-i18next';
import { TrackApplicationDialogProps, GeneratedCvVersion } from '../../../types';
import { getLocalizedColumnTitle } from '../../../utils/kanbanUtils';

export const TrackApplicationDialog: React.FC<TrackApplicationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  prefillCompany = '',
  prefillRole = '',
  prefillVersionId,
  defaultColumnId,
  savedVersions,
  existingApplications,
  columns,
}) => {
  const { t, i18n } = useTranslation(['history', 'common', 'target', 'preview', 'gap']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [company, setCompany] = useState(prefillCompany);
  const [role, setRole] = useState(prefillRole);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  const [columnId, setColumnId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [showExtraDetails, setShowExtraDetails] = useState(false);

  // Initialize or reset fields on open
  useEffect(() => {
    if (open) {
      const initialCompany = prefillCompany || 'Target Company';
      const initialRole = prefillRole || 'Specialist';
      setCompany(initialCompany);
      setRole(initialRole);
      setNotes('');
      setSalary('');
      setLocation('');
      setShowExtraDetails(false);

      const defaultCol = defaultColumnId || (columns.length > 0 ? columns[0].id : 'applied');
      setColumnId(defaultCol);

      // Find matching versions for this company
      const matching = savedVersions.filter(
        (v) => v.companyName.toLowerCase().trim() === initialCompany.toLowerCase().trim()
      );

      if (prefillVersionId && savedVersions.some((v) => v.id === prefillVersionId)) {
        setSelectedVersionId(prefillVersionId);
      } else if (matching.length > 0) {
        setSelectedVersionId(matching[0].id);
      } else if (savedVersions.length > 0) {
        setSelectedVersionId(savedVersions[0].id);
      } else {
        setSelectedVersionId('');
      }
    }
  }, [open, prefillCompany, prefillRole, prefillVersionId, defaultColumnId, savedVersions, columns]);

  // Matching versions for current company input
  const matchingVersions = useMemo(() => {
    const trimmed = company.trim().toLowerCase();
    if (!trimmed) return savedVersions;
    const directMatches = savedVersions.filter((v) => v.companyName.toLowerCase().trim() === trimmed);
    return directMatches.length > 0 ? directMatches : savedVersions;
  }, [company, savedVersions]);

  // Check if there is already an active application for Company + Role
  const hasActiveDuplicate = useMemo(() => {
    const trimmedComp = company.trim().toLowerCase();
    const trimmedRole = role.trim().toLowerCase();
    if (!trimmedComp) return false;
    return existingApplications.some(
      (app) =>
        !app.isArchived &&
        app.companyName.toLowerCase().trim() === trimmedComp &&
        app.targetRole.toLowerCase().trim() === trimmedRole
    );
  }, [company, role, existingApplications]);

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString(i18n.language || 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const handleConfirm = () => {
    if (!company.trim() || !selectedVersionId) return;

    onConfirm({
      companyName: company.trim(),
      targetRole: role.trim() || 'Specialist',
      appliedVersionId: selectedVersionId,
      columnId: columnId || (columns[0]?.id ?? 'applied'),
      notes: notes.trim() || undefined,
      salary: salary.trim() || undefined,
      location: location.trim() || undefined,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '18px',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.8)' : '0 16px 40px rgba(0,0,0,0.12)',
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BusinessRoundedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {t('history:trackModal.title', 'Track Job Application')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('history:trackModal.subtitle', 'Link a tailored CV version to your Kanban board')}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        {/* Duplicate Active Application Warning (Soft & Informative) */}
        {hasActiveDuplicate && (
          <Alert
            severity="warning"
            icon={<WarningAmberRoundedIcon />}
            sx={{
              borderRadius: '12px',
              fontSize: '0.82rem',
              '& .MuiAlert-message': { fontWeight: 500 },
            }}
          >
            {t(
              'history:trackModal.duplicateWarning',
              'You already have an active application with {{company}} for {{role}}. A new tracking card will be created alongside it.',
              { company: company.trim(), role: role.trim() }
            )}
          </Alert>
        )}

        {/* Company & Role Inputs */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
          <TextField
            label={t('target:fields.company', 'Company Name')}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            fullWidth
            size="small"
            required
            autoFocus
          />
          <TextField
            label={t('target:fields.role', 'Target Role / Position')}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
            size="small"
          />
        </Box>

        {/* Multi-Version Selection Prompt */}
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75, display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CheckCircleRoundedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            {matchingVersions.length > 1
              ? t(
                  'history:trackModal.multiVersionPrompt',
                  'You have {{count}} versions for {{company}} — which one did you apply with?',
                  { count: matchingVersions.length, company: company || 'this company' }
                )
              : t('history:trackModal.singleVersionPrompt', 'Attached CV Version:')}
          </Typography>

          {matchingVersions.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{ p: 2, textAlign: 'center', borderRadius: '12px', bgcolor: alpha(theme.palette.divider, 0.05) }}
            >
              <Typography variant="body2" color="text.secondary">
                {t('history:trackModal.noVersionsFound', 'No saved resume versions found for this company. Please save or synthesize a CV first.')}
              </Typography>
            </Paper>
          ) : (
            <RadioGroup
              value={selectedVersionId}
              onChange={(e) => setSelectedVersionId(e.target.value)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
            >
              {matchingVersions.map((v: GeneratedCvVersion, index: number) => {
                const isSelected = selectedVersionId === v.id;
                return (
                  <Paper
                    key={v.id}
                    variant="outlined"
                    onClick={() => setSelectedVersionId(v.id)}
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      bgcolor: isSelected
                        ? alpha(theme.palette.primary.main, isDark ? 0.12 : 0.04)
                        : 'background.paper',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1, minWidth: 0 }}>
                      <FormControlLabel
                        value={v.id}
                        control={<Radio size="small" />}
                        label=""
                        sx={{ m: 0, mr: -0.5 }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            v{matchingVersions.length - index} • {v.targetRole || 'Specialist'}
                          </Typography>
                          <Chip
                            label={`${v.matchScore || 92}% ${t('gap:matchScore', 'Match')}`}
                            size="small"
                            color="success"
                            sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                          />
                          <Chip
                            label={v.theme || 'modern-tech'}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.68rem' }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}
                        >
                          <CalendarTodayRoundedIcon sx={{ fontSize: 11 }} /> {formatDate(v.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </RadioGroup>
          )}
        </Box>

        {/* Initial Column Stage */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
          <TextField
            select
            label={t('history:trackModal.initialColumn', 'Initial Stage')}
            value={columnId}
            onChange={(e) => setColumnId(e.target.value)}
            fullWidth
            size="small"
          >
            {columns.map((col) => (
              <MenuItem key={col.id} value={col.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: col.color || theme.palette.primary.main,
                    }}
                  />
                  {getLocalizedColumnTitle(col, t)}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={t('history:trackModal.salary', 'Salary / Budget (Optional)')}
            placeholder="$120k - $140k"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            fullWidth
            size="small"
          />
        </Box>

        {/* Optional Extra Fields Toggle */}
        <Button
          size="small"
          color="inherit"
          onClick={() => setShowExtraDetails((prev) => !prev)}
          endIcon={showExtraDetails ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
          sx={{ alignSelf: 'flex-start', fontSize: '0.76rem', color: 'text.secondary' }}
        >
          {showExtraDetails
            ? t('history:trackModal.hideDetails', 'Hide additional details')
            : t('history:trackModal.addDetails', '+ Add location & notes')}
        </Button>

        <Collapse in={showExtraDetails}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 0.5 }}>
            <TextField
              label={t('history:trackModal.location', 'Location / Remote Policy')}
              placeholder="San Francisco, CA / Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label={t('history:trackModal.notes', 'Personal Notes & Interview Contact')}
              placeholder="Referred by Alex; Interviewer highlighted performance engineering..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              multiline
              rows={2}
              size="small"
            />
          </Box>
        </Collapse>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
          {t('common:actions.cancel', 'Cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={!company.trim() || !selectedVersionId}
          sx={{ fontWeight: 700, px: 2.5 }}
        >
          {t('history:trackModal.confirm', 'Track in Kanban Board')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
