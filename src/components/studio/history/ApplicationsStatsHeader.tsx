import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  TextField,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export interface ApplicationsStatsHeaderProps {
  totalApplications: number;
  avgMatchScore: number;
  uniqueCompanies: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewApplication: () => void;
}

/**
 * Header and stats bar for Applications History view.
 * Principle: Single Responsibility (S) - displays application metrics and search controls.
 */
export const ApplicationsStatsHeader: React.FC<ApplicationsStatsHeaderProps> = ({
  totalApplications,
  avgMatchScore,
  uniqueCompanies,
  searchQuery,
  onSearchChange,
  onNewApplication,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <>
      {/* Top Banner */}
      <Paper
        sx={{
          p: { xs: 2, md: 2.5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: isDark ? 'rgba(16, 22, 35, 0.8)' : '#ffffff',
          borderRadius: '16px',
        }}
      >
        <Box>
          <Chip
            icon={<BusinessRoundedIcon sx={{ fontSize: '16px !important' }} />}
            label="Application History • 1 Master Profile ➔ N Target CVs"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 1, fontWeight: 700 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            Generated Resumes Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your tailored resumes across target companies and roles. Each version preserves its calibrated scores, palette, and ATS alignment.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AutoAwesomeRoundedIcon />}
          onClick={onNewApplication}
          sx={{ fontWeight: 700, borderRadius: '10px', whiteSpace: 'nowrap' }}
        >
          + New AI Tailored Resume
        </Button>
      </Paper>

      {/* Metrics Summary Strip */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LayersRoundedIcon />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
              Total Tailored CVs
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {totalApplications}
            </Typography>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.success.main, 0.12),
              color: theme.palette.success.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrackChangesRoundedIcon />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
              Avg. Match Score
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main' }}>
              {avgMatchScore}%
            </Typography>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.secondary.main, 0.12),
              color: theme.palette.secondary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BusinessRoundedIcon />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
              Target Companies
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {uniqueCompanies}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Search Input */}
      {totalApplications > 0 && (
        <TextField
          size="small"
          placeholder="Filter by company name or target role..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }
          }}
          sx={{ maxWidth: 450 }}
        />
      )}
    </>
  );
};
