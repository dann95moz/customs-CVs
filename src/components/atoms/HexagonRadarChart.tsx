import React, { useState } from 'react';
import { Box, Typography, Tooltip, useTheme, alpha } from '@mui/material';

export interface RadarDimension {
  key: string;
  label: string;
  score: number; // 0 to 10
  maxScore?: number; // default 10
  recommendation?: string;
}

export interface HexagonRadarChartProps {
  dimensions: RadarDimension[];
  size?: number;
  className?: string;
}

/**
 * Native, lightweight SVG Hexagonal Radar Chart for multidimensional ATS affinity.
 * Zero external charting dependencies (no recharts bloat), 100% compatible with React 19 and MUI theming.
 */
export const HexagonRadarChart: React.FC<HexagonRadarChartProps> = ({
  dimensions,
  size = 320,
  className = '',
}) => {
  const theme = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Must have at least 3 vertices to form a polygon (defaulting to 6 for standard hexagon)
  const numAxes = dimensions.length;
  if (numAxes < 3) return null;

  const center = size / 2;
  const maxRadius = (size / 2) - 44; // leave margin for outer labels

  const angleStep = (2 * Math.PI) / numAxes;
  // Rotate so top vertex points vertically up (-PI/2)
  const startAngle = -Math.PI / 2;

  const getCoordinates = (index: number, radius: number) => {
    const angle = startAngle + index * angleStep;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Concentric grid levels (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const gridPolygons = gridLevels.map((level) => {
    const points = Array.from({ length: numAxes })
      .map((_, i) => {
        const { x, y } = getCoordinates(i, maxRadius * level);
        return `${x},${y}`;
      })
      .join(' ');
    return points;
  });

  // Calculate data polygon points
  const dataPoints = dimensions
    .map((dim, i) => {
      const max = dim.maxScore || 10;
      const normalizedScore = Math.max(0, Math.min(1, dim.score / max));
      const { x, y } = getCoordinates(i, maxRadius * normalizedScore);
      return `${x},${y}`;
    })
    .join(' ');

  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;
  const gridColor = theme.palette.divider;

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: size + 60,
        mx: 'auto',
        position: 'relative',
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="100%"
        style={{ overflow: 'visible', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }}
      >
        {/* Background Radial Spokes & Concentric Grid Polygons */}
        {gridPolygons.map((pts, idx) => (
          <polygon
            key={`grid-${idx}`}
            points={pts}
            fill={idx === gridPolygons.length - 1 ? alpha(primaryColor, 0.02) : 'none'}
            stroke={gridColor}
            strokeWidth={idx === gridPolygons.length - 1 ? '1.5' : '1'}
            strokeDasharray={idx < gridPolygons.length - 1 ? '3 3' : undefined}
          />
        ))}

        {dimensions.map((_, i) => {
          const outer = getCoordinates(i, maxRadius);
          return (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              stroke={gridColor}
              strokeWidth="1"
            />
          );
        })}

        {/* Shaded Data Polygon */}
        <polygon
          points={dataPoints}
          fill={alpha(primaryColor, 0.22)}
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        {/* Vertex Dots with Hover Micro-interactions */}
        {dimensions.map((dim, i) => {
          const max = dim.maxScore || 10;
          const normalizedScore = Math.max(0, Math.min(1, dim.score / max));
          const { x, y } = getCoordinates(i, maxRadius * normalizedScore);
          const isHovered = hoveredIndex === i;

          return (
            <g key={`vertex-${dim.key}`}>
              {/* Invisible larger hit circle for touch/mouse */}
              <circle
                cx={x}
                cy={y}
                r="16"
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* Visible animated dot */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : 4}
                fill={isHovered ? secondaryColor : primaryColor}
                stroke={theme.palette.background.paper}
                strokeWidth="2"
                style={{
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  filter: isHovered ? `drop-shadow(0 0 6px ${primaryColor})` : undefined,
                }}
              />
            </g>
          );
        })}

        {/* Labels around the perimeter */}
        {dimensions.map((dim, i) => {
          const labelCoord = getCoordinates(i, maxRadius + 24);
          const isHovered = hoveredIndex === i;

          // Align text depending on position relative to center
          let textAnchor: 'middle' | 'start' | 'end' = 'middle';
          if (labelCoord.x > center + 15) textAnchor = 'start';
          if (labelCoord.x < center - 15) textAnchor = 'end';

          return (
            <text
              key={`label-${dim.key}`}
              x={labelCoord.x}
              y={labelCoord.y}
              textAnchor={textAnchor}
              dominantBaseline="central"
              fill={isHovered ? primaryColor : theme.palette.text.primary}
              fontSize="11"
              fontWeight={isHovered ? 800 : 600}
              style={{
                userSelect: 'none',
                cursor: 'pointer',
                transition: 'fill 0.2s ease',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {dim.label} ({dim.score})
            </text>
          );
        })}
      </svg>

      {/* Active Hover Dimension Hint / Recommendation Tooltip Pill */}
      {hoveredIndex !== null && dimensions[hoveredIndex] && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.25,
            px: 2,
            borderRadius: 2,
            bgcolor: alpha(primaryColor, 0.08),
            border: `1px solid ${alpha(primaryColor, 0.25)}`,
            textAlign: 'center',
            maxWidth: 320,
            transition: 'all 0.2s ease',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block' }}>
            {dimensions[hoveredIndex].label} — {dimensions[hoveredIndex].score}/{dimensions[hoveredIndex].maxScore || 10}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
            {dimensions[hoveredIndex].recommendation || 'Dimensión optimizada para cumplimiento y escaneo ATS.'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
