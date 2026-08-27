import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { GeneratedCvVersion } from '../../../types/cv';
import { getPaletteConfig } from '../../../constants/palettes';

export interface ApplicationCardProps {
  version: GeneratedCvVersion;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (v: GeneratedCvVersion) => void;
}

/**
 * Card rendering an individual saved CV version with metrics and action buttons.
 * Principle: Single Responsibility (S) - encapsulates individual application card display.
 */
export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  version,
  onLoad,
  onDelete,
  onDownload,
}) => {
  const theme = useTheme();
  const palConfig = getPaletteConfig(version.palette);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Header: Company & Date */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: alpha(palConfig.accentColor || theme.palette.primary.main, 0.15),
                color: palConfig.accentColor || theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BusinessRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                {version.companyName || 'Target Company'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayRoundedIcon sx={{ fontSize: 11 }} /> {formatDate(version.createdAt)}
              </Typography>
            </Box>
          </Box>

          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(version.id)}
            title="Delete this tailored version"
            sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Target Role */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
          {version.targetRole || 'Specialist Role'}
        </Typography>

        {/* Badges: Match Score, Quality, Theme */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            label={`${version.matchScore || 92}% Match`}
            size="small"
            color="success"
            sx={{ fontWeight: 700, fontSize: '0.72rem' }}
          />
          <Chip
            label={`Score: ${version.qualityScore || 9.0}/10`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: '0.72rem' }}
          />
          <Chip
            label={`${version.pageBudget || 1} Page`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.72rem' }}
          />
          <Chip
            label={version.theme || 'modern-tech'}
            size="small"
            sx={{ fontSize: '0.72rem', bgcolor: alpha(palConfig.accentColor || '#38bdf8', 0.1), color: palConfig.accentColor }}
          />
        </Box>

        {/* Target Job Snippet */}
        {version.targetJobSnippet && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
              fontStyle: 'italic',
            }}
          >
            &quot;{version.targetJobSnippet}...&quot;
          </Typography>
        )}
      </CardContent>

      <Divider />

      <CardActions sx={{ p: 1.5, px: 2.5, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<LaunchRoundedIcon />}
          onClick={() => onLoad(version.id)}
          sx={{ fontWeight: 700, fontSize: '0.78rem' }}
        >
          View &amp; Edit in Studio
        </Button>

        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<FileDownloadRoundedIcon />}
          onClick={() => onDownload(version)}
          sx={{ fontSize: '0.75rem' }}
        >
          .MD
        </Button>
      </CardActions>
    </Card>
  );
};
