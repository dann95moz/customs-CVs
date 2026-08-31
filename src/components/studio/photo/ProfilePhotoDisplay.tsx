import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Popover,
  Slider,
  Chip,
  IconButton,
  Button,
  ButtonGroup,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded';
import CropRoundedIcon from '@mui/icons-material/CropRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { useTranslation } from 'react-i18next';
import { ProfilePhotoConfig, ThemeId } from '../../../types/cv';
import { useResumeStore } from '../../../store';
import { PhotoCropperModal } from './PhotoCropperModal';

export interface ProfilePhotoDisplayProps {
  photo?: ProfilePhotoConfig | null;
  maskShape?: 'circle' | 'rounded' | 'squircle';
  size?: number | string;
  width?: number | string;
  height?: number | string;
  border?: string;
  boxShadow?: string;
  fallbackInitials?: string;
  fallbackIcon?: 'diamond' | 'monogram' | 'none';
  editable?: boolean;
  activeTheme?: ThemeId;
  className?: string;
  style?: React.CSSProperties;
}

export const ProfilePhotoDisplay: React.FC<ProfilePhotoDisplayProps> = ({
  photo: propPhoto,
  maskShape = 'rounded',
  size,
  width,
  height,
  border = '2px solid rgba(255, 255, 255, 0.85)',
  boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)',
  fallbackInitials,
  fallbackIcon = 'monogram',
  editable = true,
  activeTheme,
  className,
  style,
}) => {
  const { t } = useTranslation(['preview', 'common']);
  const muiTheme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cropperOpen, setCropperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const storePhoto = useResumeStore((s) => s.photo);
  const setProfilePhoto = useResumeStore((s) => s.setProfilePhoto);
  const storeTheme = useResumeStore((s) => s.theme);

  const currentPhoto = propPhoto !== undefined ? propPhoto : storePhoto;
  const currentTheme = activeTheme || storeTheme;

  const getBorderRadius = () => {
    switch (maskShape) {
      case 'circle':
        return '50%';
      case 'squircle':
        return '14px';
      case 'rounded':
      default:
        return '8px';
    }
  };

  // Priority: photo configuration size > explicit prop size > default 108px (clear, high-detail portrait)
  const configuredSize = currentPhoto?.size || (typeof size === 'number' ? size : 108);
  // Max bounds to respect template margins & avoid layout breakage: 120px in top banner, 144px in sidebars
  const maxSafeSize = currentTheme === 'executive' ? 120 : currentTheme === 'designer-uiux' ? 132 : 144;
  const minSafeSize = 80;
  const clampedSize = Math.max(minSafeSize, Math.min(maxSafeSize, configuredSize));

  const finalWidth = width || (size && typeof size === 'string' ? size : clampedSize);
  const finalHeight = height || (size && typeof size === 'string' ? size : clampedSize);
  const borderRadius = getBorderRadius();
  const hasActivePhoto = Boolean(currentPhoto && currentPhoto.enabled && currentPhoto.url);

  const handleContainerClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!editable) return;
    e.stopPropagation();

    if (hasActivePhoto) {
      setAnchorEl(e.currentTarget);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo file size is too large (max 5MB). Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const newPhoto: ProfilePhotoConfig = {
          url: event.target.result,
          crop: { x: 0, y: 0, zoom: 1.0 },
          enabled: true,
          size: currentPhoto?.size || 108,
        };
        setProfilePhoto(newPhoto);
        setCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleLiveSizeChange = (newSize: number) => {
    if (!currentPhoto) return;
    const bounded = Math.max(minSafeSize, Math.min(maxSafeSize, newSize));
    setProfilePhoto({
      ...currentPhoto,
      size: bounded,
    });
  };

  const tooltipTitle = hasActivePhoto
    ? t('preview:panels.design.photoEditTooltip', 'Click to adjust framing or change photo')
    : t('preview:panels.design.photoUploadTooltip', 'Click to upload profile photo');

  const isPopoverOpen = Boolean(anchorEl);

  return (
    <>
      {/* Hidden File Input for direct canvas click */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      <Tooltip title={editable && !isPopoverOpen ? tooltipTitle : ''} arrow placement="top">
        <Box
          onClick={handleContainerClick}
          className={`cv-profile-photo-container ${className || ''}`}
          sx={{
            width: finalWidth,
            height: finalHeight,
            borderRadius,
            border,
            boxShadow,
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
            cursor: editable ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'width 0.18s ease-out, height 0.18s ease-out, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': editable
              ? {
                  transform: 'scale(1.04)',
                  boxShadow: `0 6px 18px ${alpha(muiTheme.palette.primary.main, 0.35)}`,
                }
              : {},
            ...style,
          }}
        >
          {/* 1. Render Active Cropped Photo */}
          {hasActivePhoto && currentPhoto ? (
            <img
              src={currentPhoto.url}
              alt="Candidate Profile"
              className="cv-profile-photo-img"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `translate(${currentPhoto.crop.x}%, ${currentPhoto.crop.y}%) scale(${currentPhoto.crop.zoom})`,
                transformOrigin: 'center center',
                pointerEvents: 'none',
                userSelect: 'none',
                display: 'block',
              }}
            />
          ) : fallbackIcon === 'diamond' ? (
            /* Diamond fallback for TwoColumn template */
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <svg viewBox="0 0 24 24" style={{ width: '55%', height: '55%', fill: 'var(--cv-accent-color, #1d4ed8)' }}>
                <path d="M12 2L15 9.5L22 12L15 14.5L12 22L9 14.5L2 12L9 9.5Z" />
              </svg>
              {fallbackInitials && (
                <Typography sx={{ fontSize: '9px', fontWeight: 800, color: 'var(--cv-accent-color, #1d4ed8)', mt: '-2px' }}>
                  {fallbackInitials}
                </Typography>
              )}
            </Box>
          ) : fallbackInitials ? (
            /* Monogram Initials Fallback */
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: typeof finalWidth === 'number' ? Math.round(finalWidth * 0.38) : '1.1rem',
                  lineHeight: 1,
                  color: '#ffffff',
                }}
              >
                {fallbackInitials}
              </Typography>
            </Box>
          ) : (
            <AddAPhotoRoundedIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
          )}

          {/* 2. Live Hot Edit Hover Overlay with Pencil / Camera Icon (Hidden on Print) */}
          {editable && (
            <Box
              className="no-print cv-photo-edit-overlay"
              sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(15, 23, 42, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                opacity: 0,
                transition: 'opacity 0.18s ease-in-out',
                '&:hover': {
                  opacity: 1,
                },
                // On touch screens / mobile, show subtle pencil badge in corner
                '@media (hover: none)': {
                  opacity: 0,
                },
              }}
            >
              {hasActivePhoto ? (
                <EditRoundedIcon sx={{ fontSize: 20, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
              ) : (
                <AddAPhotoRoundedIcon sx={{ fontSize: 20, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
              )}
            </Box>
          )}

          {/* 3. Mobile Touch Pencil Badge in corner (Visible on touch/mobile) */}
          {editable && (
            <Box
              className="no-print"
              sx={{
                display: { xs: 'flex', md: 'none' },
                position: 'absolute',
                bottom: 2,
                right: 2,
                bgcolor: 'primary.main',
                color: '#ffffff',
                borderRadius: '50%',
                width: 18,
                height: 18,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                border: '1px solid #ffffff',
                zIndex: 2,
              }}
            >
              {hasActivePhoto ? (
                <EditRoundedIcon sx={{ fontSize: 11 }} />
              ) : (
                <AddAPhotoRoundedIcon sx={{ fontSize: 11 }} />
              )}
            </Box>
          )}
        </Box>
      </Tooltip>

      {/* Floating In-Place Quick Popover for Live Resizing & Actions */}
      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        className="no-print"
        slotProps={{
          paper: {
            sx: {
              p: 2.25,
              width: { xs: 'calc(100vw - 32px)', sm: 330 },
              maxWidth: 350,
              borderRadius: '16px',
              bgcolor: 'background.paper',
              backgroundImage: 'none',
              boxShadow: '0 16px 40px rgba(0,0,0,0.28)',
              border: `1px solid ${muiTheme.palette.divider}`,
              mt: 1,
            },
          },
        }}
      >
        {/* Popover Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.85rem' }}>
            {t('preview:panels.design.photoTitle', 'Profile Photo')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Chip
              label={`${clampedSize}px`}
              size="small"
              color="primary"
              variant="filled"
              sx={{ fontWeight: 800, height: 22, fontSize: '0.72rem', px: 0.5 }}
            />
            <IconButton size="small" onClick={handleClosePopover} sx={{ p: 0.4 }}>
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Live Photo Size Stepper & Slider */}
        <Box sx={{ my: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.74rem' }}>
              {t('preview:panels.design.photoSize', 'Live Display Size')}
            </Typography>
            <ButtonGroup size="small" variant="outlined" sx={{ borderRadius: '999px', height: 24 }}>
              <IconButton
                size="small"
                onClick={() => handleLiveSizeChange(clampedSize - 4)}
                disabled={clampedSize <= minSafeSize}
                sx={{ p: 0.3, width: 24, height: 24 }}
              >
                <RemoveRoundedIcon sx={{ fontSize: 15 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleLiveSizeChange(clampedSize + 4)}
                disabled={clampedSize >= maxSafeSize}
                sx={{ p: 0.3, width: 24, height: 24 }}
              >
                <AddRoundedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </ButtonGroup>
          </Box>

          <Slider
            size="small"
            value={clampedSize}
            min={minSafeSize}
            max={maxSafeSize}
            step={4}
            onChange={(_, val) => handleLiveSizeChange(val as number)}
            sx={{ mb: 1.25 }}
          />

          {/* Quick Presets (S / M / L / XL) in a 4-column responsive grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 0.75,
            }}
          >
            {[
              { label: 'S (88px)', val: 88 },
              { label: 'M (104px)', val: 104 },
              { label: 'L (120px)', val: 120 },
              { label: 'XL (140px)', val: Math.min(140, maxSafeSize) },
            ].map((preset) => (
              <Chip
                key={preset.val}
                label={preset.label}
                size="small"
                variant={clampedSize === preset.val ? 'filled' : 'outlined'}
                color={clampedSize === preset.val ? 'primary' : 'default'}
                onClick={() => handleLiveSizeChange(preset.val)}
                sx={{
                  fontSize: '0.68rem',
                  fontWeight: clampedSize === preset.val ? 800 : 600,
                  height: 24,
                  width: '100%',
                  cursor: 'pointer',
                  '& .MuiChip-label': { px: 0.5 },
                }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Action Buttons: Crop & Pan / Change File / Remove */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<CropRoundedIcon />}
            onClick={() => {
              handleClosePopover();
              setCropperOpen(true);
            }}
            fullWidth
            sx={{ fontSize: '0.78rem', textTransform: 'none', py: 0.6, whiteSpace: 'nowrap' }}
          >
            {t('preview:panels.design.photoEdit', 'Adjust Framing & Zoom')}
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<AddAPhotoRoundedIcon />}
              onClick={() => {
                handleClosePopover();
                fileInputRef.current?.click();
              }}
              sx={{ flex: 1.2, fontSize: '0.72rem', textTransform: 'none', py: 0.5, whiteSpace: 'nowrap' }}
            >
              {t('preview:panels.design.photoChangeAction', 'Change Image')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={() => {
                handleClosePopover();
                setProfilePhoto(null);
              }}
              sx={{ flex: 0.8, fontSize: '0.72rem', textTransform: 'none', py: 0.5, whiteSpace: 'nowrap' }}
            >
              {t('preview:panels.design.photoDeleteAction', 'Remove')}
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Pan & Zoom Cropper Modal */}
      {cropperOpen && (
        <PhotoCropperModal
          open={cropperOpen}
          onClose={() => setCropperOpen(false)}
          photo={currentPhoto || null}
          onSave={(updatedPhoto) => {
            setProfilePhoto(updatedPhoto);
          }}
          activeTheme={currentTheme}
        />
      )}
    </>
  );
};
