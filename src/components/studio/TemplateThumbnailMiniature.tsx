import React from 'react';
import { Box, Typography, Tooltip, useTheme, alpha } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { TemplateThumbnailMiniatureProps } from '../../types';
import { getPaletteConfig } from '../../constants/palettes';

export type { TemplateThumbnailMiniatureProps };

export const TemplateThumbnailMiniature: React.FC<TemplateThumbnailMiniatureProps> = ({
  themeId,
  paletteId,
  customColor,
  name,
  category,
  description,
  recommendedFor,
  icon,
  isSelected,
  onClick,
}) => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const pal = getPaletteConfig(paletteId, customColor);

  const renderMiniLayout = () => {
    switch (themeId) {
      case 'formal-legal':
        return (
          <Box
            sx={{
              p: '7px 8px',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '2.5px',
              boxSizing: 'border-box',
              fontFamily: "'Merriweather', 'Georgia', serif",
              bgcolor: '#ffffff',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {/* Centered Formal Classical Header */}
            <Box sx={{ textAlign: 'center', borderBottom: `1.5px double ${pal.accentColor}`, pb: '3px', mb: '1.5px' }}>
              <Typography sx={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: '5.2px', fontWeight: 800, color: pal.accentColor, letterSpacing: '0.8px', textTransform: 'uppercase', lineHeight: 1.1 }}>
                ELENA VÁSQUEZ
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.4px', fontWeight: 600, color: '#475569', letterSpacing: '0.4px', textTransform: 'uppercase', mt: '0.5px' }}>
                PARTNER · CORPORATE LAW & GOVERNANCE
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#64748b', mt: '0.5px' }}>
                Madrid, Spain · +34 91 500 · elena@vasquez-law.com
              </Typography>
            </Box>

            {/* Bar Admissions / Practice Areas Section */}
            <Box sx={{ borderBottom: `0.5px solid ${pal.accentBorder}`, pb: '1px' }}>
              <Typography sx={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: '3.8px', fontWeight: 700, color: pal.accentColor, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                BAR ADMISSIONS & PRACTICE AREAS
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3px', color: '#1e293b', lineHeight: 1.2 }}>
                <Box component="span" sx={{ color: pal.accentColor, fontWeight: 700, mr: '2px' }}>—</Box>
                Madrid Bar Association (Colegio de Abogados) · Admitted 2014
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3px', color: '#1e293b', lineHeight: 1.2 }}>
                <Box component="span" sx={{ color: pal.accentColor, fontWeight: 700, mr: '2px' }}>—</Box>
                Cross-Border M&A, Syndicated Financing & Antitrust Filings
              </Typography>
            </Box>

            {/* Experience Section */}
            <Box sx={{ borderBottom: `0.5px solid ${pal.accentBorder}`, pb: '1px', mt: '1px' }}>
              <Typography sx={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: '3.8px', fontWeight: 700, color: pal.accentColor, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                EXPERIENCE & CASEWORK
              </Typography>
            </Box>
            {/* Casework Item 1 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography sx={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: '3.6px', fontWeight: 700, color: '#0f172a' }}>
                  Garrigues & Asociados
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3px', color: '#64748b', fontStyle: 'italic' }}>
                  2020 – Present
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.2px', fontStyle: 'italic', color: '#475569' }}>
                Senior Associate · Corporate Governance
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
                <Box component="span" sx={{ color: pal.accentColor, fontWeight: 700, mr: '2px' }}>—</Box>
                Led legal counsel on $140M cross-border tech acquisition and regulatory filings.
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
                <Box component="span" sx={{ color: pal.accentColor, fontWeight: 700, mr: '2px' }}>—</Box>
                Advised Board of Directors on ESG compliance and shareholder covenants.
              </Typography>
            </Box>
            {/* Casework Item 2 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', mt: '0.5px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography sx={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: '3.6px', fontWeight: 700, color: '#0f172a' }}>
                  Cuatrecasas
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3px', color: '#64748b', fontStyle: 'italic' }}>
                  2016 – 2020
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
                <Box component="span" sx={{ color: pal.accentColor, fontWeight: 700, mr: '2px' }}>—</Box>
                Supervised legal due diligence for 18 venture capital rounds.
              </Typography>
            </Box>
          </Box>
        );

      case 'modern-tech':
        return (
          <Box
            sx={{
              p: '7px 8px',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '2.5px',
              boxSizing: 'border-box',
              fontFamily: "'Outfit', 'Inter', sans-serif",
              bgcolor: '#ffffff',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {/* Modern Tech Header */}
            <Box sx={{ borderBottom: '1px solid #e2e8f0', pb: '3px', mb: '1px' }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '5.8px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.2px', textTransform: 'uppercase', lineHeight: 1.1 }}>
                ALEX RIVERA
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.8px', fontWeight: 700, color: pal.accentColor, letterSpacing: '0.2px', mt: '0.5px' }}>
                STAFF CLOUD & INFRASTRUCTURE ARCHITECT
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#64748b', mt: '0.5px' }}>
                github.com/arivera · San Francisco, CA · alex@rivera.dev
              </Typography>
            </Box>

            {/* Monospace Tech Badges / Stack */}
            <Box sx={{ display: 'flex', gap: '2px', mb: '1px', flexWrap: 'wrap' }}>
              {['TypeScript', 'React 19', 'Kubernetes', 'Go / WASM'].map((tech) => (
                <Box
                  key={tech}
                  sx={{
                    bgcolor: pal.badgeBg,
                    color: pal.badgeText,
                    border: `0.5px solid ${pal.accentBorder}`,
                    borderRadius: '1.5px',
                    px: '2.5px',
                    py: '0.5px',
                    fontSize: '2.8px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {tech}
                </Box>
              ))}
            </Box>

            {/* Experience Section Title with Vertical Accent Pill */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '2.5px', borderBottom: '0.5px solid #e2e8f0', pb: '1px' }}>
              <Box sx={{ width: '2px', height: '5px', bgcolor: pal.accentColor, borderRadius: '1px', flexShrink: 0 }} />
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '4px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                EXPERIENCE
              </Typography>
            </Box>

            {/* Experience Item 1 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.6px', fontWeight: 700, color: '#0f172a' }}>
                  Vercel · Lead Infrastructure
                </Typography>
                <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '2.8px', color: '#64748b' }}>
                  2021 – Present
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
                <Box component="span" sx={{ color: pal.accentColor, fontWeight: 800, mr: '2px' }}>▪</Box>
                Architected multi-region edge mesh routing 45M req/day with zero downtime.
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
                <Box component="span" sx={{ color: pal.accentColor, fontWeight: 800, mr: '2px' }}>▪</Box>
                Reduced P99 latency by 38% via custom distributed WASM runtime.
              </Typography>
            </Box>

            {/* Experience Item 2 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', mt: '0.5px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.6px', fontWeight: 700, color: '#0f172a' }}>
                  Stripe · Senior Systems Engineer
                </Typography>
                <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '2.8px', color: '#64748b' }}>
                  2018 – 2021
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
                <Box component="span" sx={{ color: pal.accentColor, fontWeight: 800, mr: '2px' }}>▪</Box>
                Scaled distributed telemetry ingestion pipeline across 14 clusters.
              </Typography>
            </Box>
          </Box>
        );

      case 'minimal-ats':
        return (
          <Box
            sx={{
              p: '7px 8px',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '2.5px',
              boxSizing: 'border-box',
              fontFamily: "'Inter', -apple-system, sans-serif",
              bgcolor: '#ffffff',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {/* Pure Clean ATS Monochrome Header */}
            <Box sx={{ borderBottom: '1px solid #0f172a', pb: '3px', mb: '1px' }}>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '5.6px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.1px', textTransform: 'uppercase', lineHeight: 1.1 }}>
                MARCUS VANCE
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.6px', fontWeight: 700, color: '#334155', letterSpacing: '0.3px', textTransform: 'uppercase', mt: '0.5px' }}>
                SOLUTIONS ARCHITECT & CLOUD LEAD
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#475569', mt: '0.5px' }}>
                Austin, TX | (555) 349-2011 | marcus.vance@email.com | linkedin.com/in/mvance
              </Typography>
            </Box>

            {/* Professional Summary */}
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
              Enterprise Solutions Architect with 10+ years optimizing multi-cloud architectures. Saved $2.4M in annual OpEx.
            </Typography>

            {/* Skills Section Title */}
            <Box sx={{ borderBottom: '0.5px solid #0f172a', pb: '1px', mt: '1px' }}>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.8px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                TECHNICAL SKILLS
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#1e293b', lineHeight: 1.2 }}>
              <Box component="span" sx={{ fontWeight: 700 }}>Cloud & DevOps: </Box>AWS (Solutions Architect Pro), GCP, Terraform, CI/CD
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#1e293b', lineHeight: 1.2 }}>
              <Box component="span" sx={{ fontWeight: 700 }}>Databases & Security: </Box>PostgreSQL, Redis, Kafka, SOC2, HIPAA, IAM
            </Typography>

            {/* Experience Section Title */}
            <Box sx={{ borderBottom: '0.5px solid #0f172a', pb: '1px', mt: '1px' }}>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.8px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                PROFESSIONAL EXPERIENCE
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.4px', fontWeight: 700, color: '#0f172a' }}>
                  Oracle Cloud Infrastructure — Lead Architect
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#475569' }}>
                  2021 – Present
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
                • Directed 14-engineer squad migrating 120+ mission-critical services.
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
                • Achieved 99.995% SLA availability across regulated enterprise tiers.
              </Typography>
            </Box>
          </Box>
        );

      case 'executive':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden', bgcolor: '#ffffff', userSelect: 'none', pointerEvents: 'none' }}>
            {/* Full-width Top Banner */}
            <Box sx={{ background: pal.headerBg || pal.accentColor, p: '5px 6px 4px', textAlign: 'center', flexShrink: 0, color: '#ffffff' }}>
              <Box
                sx={{
                  width: '12px',
                  height: '12px',
                  border: '1px solid rgba(255,255,255,0.85)',
                  borderRadius: '2px',
                  margin: '0 auto 2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: '5.5px', color: '#ffffff', fontWeight: 800, lineHeight: 1, fontFamily: "'Inter', sans-serif" }}>
                  DC
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '5.4px', fontWeight: 800, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#ffffff', lineHeight: 1.1 }}>
                DAVID CHEN
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.4px', fontWeight: 600, color: 'rgba(255,255,255,0.92)', textTransform: 'uppercase', mt: '0.5px' }}>
                CHIEF OPERATING OFFICER · VP OPERATIONS
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: 'rgba(255,255,255,0.75)', mt: '0.5px' }}>
                Zurich, CH · +41 79 · david.chen@executive.com
              </Typography>
            </Box>

            {/* 2-Column Body */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '4px', p: '5px 5px', flex: 1, boxSizing: 'border-box' }}>
              {/* Left Main */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.6px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: `0.5px solid ${pal.accentBorder}`, pb: '1px' }}>
                  EXECUTIVE LEADERSHIP
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.3px', fontWeight: 700, color: '#0f172a' }}>
                    Novartis — Global VP Ops
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
                    • Managed $240M P&L across 8 European facilities.
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
                    • Expanded operating margin +4.8% via automation.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', mt: '1px' }}>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.3px', fontWeight: 700, color: '#0f172a' }}>
                    Roche — Director Supply Chain
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
                    • Directed operational merger of 4,200 FTEs.
                  </Typography>
                </Box>
              </Box>

              {/* Right Column */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: '0.5px solid #e2e8f0', pl: '3.5px' }}>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.4px', fontWeight: 800, color: pal.accentColor, textTransform: 'uppercase', borderBottom: `0.5px solid ${pal.accentBorder}`, pb: '1px' }}>
                  GOVERNANCE & BOARDS
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
                  • Non-Exec Board Member, MedTech EU
                </Typography>

                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.4px', fontWeight: 800, color: pal.accentColor, textTransform: 'uppercase', borderBottom: `0.5px solid ${pal.accentBorder}`, pb: '1px', mt: '1px' }}>
                  CORE EXPERTISE
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: '#475569', lineHeight: 1.25 }}>
                  P&L · M&A · Scale · Global Governance · ESG Strategy
                </Typography>
              </Box>
            </Box>
          </Box>
        );

      case 'two-column':
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: '62% 38%', height: '100%', width: '100%', overflow: 'hidden', bgcolor: '#ffffff', userSelect: 'none', pointerEvents: 'none' }}>
            {/* Left Main */}
            <Box sx={{ p: '6px 5px', display: 'flex', flexDirection: 'column', gap: '2px', boxSizing: 'border-box' }}>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '5.6px', fontWeight: 800, color: pal.accentColor, lineHeight: 1.1 }}>
                SOPHIA MARTÍNEZ
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                PRINCIPAL PRODUCT MANAGER
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.25, my: '1px' }}>
                Product strategist scaled B2B ARR from $5M to $48M.
              </Typography>

              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.6px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '0.5px solid #e2e8f0', pb: '1px' }}>
                EXPERIENCE
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.3px', fontWeight: 700, color: '#0f172a' }}>
                  Datadog — Group PM
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
                  • Launched APM Next-Gen ($18M ARR Year 1).
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
                  • Grew enterprise adoption +64% in 9 months.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', mt: '0.5px' }}>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.3px', fontWeight: 700, color: '#0f172a' }}>
                  Shopify — Senior PM
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
                  • Built Merchant API for 450k developers.
                </Typography>
              </Box>
            </Box>

            {/* Right Solid Colored Sidebar */}
            <Box sx={{ background: pal.sidebarBg || pal.accentColor, p: '6px 4px', display: 'flex', flexDirection: 'column', gap: '2.5px', color: '#ffffff', boxSizing: 'border-box' }}>
              {/* Geometric Emblem */}
              <Box sx={{ width: '13px', height: '13px', bgcolor: '#ffffff', borderRadius: '2px', margin: '0 auto 1.5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: '6px', height: '6px', transform: 'rotate(45deg)', bgcolor: pal.accentColor }} />
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: 'rgba(255,255,255,0.95)', textAlign: 'center' }}>
                Berlin · sophia@pm.io
              </Typography>

              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.3px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', borderBottom: '0.5px solid rgba(255,255,255,0.3)', pb: '1px', mt: '1px' }}>
                CORE SKILLS
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: 'rgba(255,255,255,0.9)' }}>
                  • Product Strategy
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: 'rgba(255,255,255,0.9)' }}>
                  • SQL & Analytics
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: 'rgba(255,255,255,0.9)' }}>
                  • Enterprise B2B SaaS
                </Typography>
              </Box>

              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.3px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', borderBottom: '0.5px solid rgba(255,255,255,0.3)', pb: '1px', mt: '1px' }}>
                EDUCATION
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.6px', color: 'rgba(255,255,255,0.85)' }}>
                BSc Computer Science, TU Munich
              </Typography>
            </Box>
          </Box>
        );

      case 'designer-uiux':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', p: '5px 5px', gap: '3px', overflow: 'hidden', bgcolor: '#ffffff', boxSizing: 'border-box', userSelect: 'none', pointerEvents: 'none' }}>
            {/* Top Grid with Floating Tinted Pastel Card */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '4px', alignItems: 'start' }}>
              {/* Pastel Tinted Card */}
              <Box sx={{ bgcolor: pal.badgeBg || pal.accentLight, border: `0.5px solid ${pal.accentBorder}`, borderRadius: '3px', p: '3.5px 3px' }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '4.8px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                  LIAM NGUYEN
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.2px', fontWeight: 700, color: pal.accentColor, mt: '0.5px' }}>
                  LEAD PRODUCT DESIGNER
                </Typography>
                <Box sx={{ height: '0.5px', bgcolor: 'rgba(0,0,0,0.1)', my: '1.5px' }} />
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.6px', color: '#475569' }}>
                  liam.design · Stockholm, SE
                </Typography>
              </Box>
              {/* Top Summary */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.4px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  DESIGN PHILOSOPHY
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#475569', lineHeight: 1.25 }}>
                  Human-centered leader crafting multi-modal systems, tokens, and micro-interactions for 10M+ users.
                </Typography>
              </Box>
            </Box>

            {/* Bottom 2 Columns */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '4px', flex: 1 }}>
              {/* Left Column */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.3px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                  DESIGN SYSTEMS
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: '#64748b', lineHeight: 1.2 }}>
                  Figma Tokens, Storybook, Swift UI, Framer Motion, WCAG AAA
                </Typography>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.3px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', mt: '1px' }}>
                  AWARDS
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.6px', color: '#64748b', lineHeight: 1.2 }}>
                  • Red Dot: Best of Best 2024
                </Typography>
              </Box>

              {/* Right Column */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.4px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '0.5px solid #e2e8f0', pb: '0.5px' }}>
                  DESIGN LEADERSHIP
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.2px', fontWeight: 700, color: '#0f172a' }}>
                    Spotify — Staff Product Designer
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#475569', lineHeight: 1.2 }}>
                    • Led global Audio UI redesign on iOS & Android.
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#475569', lineHeight: 1.2 }}>
                    • Unified token system across 60+ squads.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        );

      case 'academic-research':
      default:
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: '36% 64%', height: '100%', width: '100%', overflow: 'hidden', bgcolor: '#ffffff', userSelect: 'none', pointerEvents: 'none' }}>
            {/* Dark Slate Left Sidebar */}
            <Box sx={{ bgcolor: '#1e293b', p: '5px 4px', display: 'flex', flexDirection: 'column', gap: '2px', color: '#ffffff', boxSizing: 'border-box' }}>
              {/* Circular Avatar Monogram */}
              <Box
                sx={{
                  width: '13px',
                  height: '13px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.6)',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  margin: '0 auto 1.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: '5.2px', color: '#ffffff', fontWeight: 800, fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>
                  CW
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.6px', color: '#cbd5e1', textAlign: 'center' }}>
                ETH Zurich · cw@ethz.ch
              </Typography>

              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.2px', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', borderBottom: '0.5px solid rgba(255,255,255,0.2)', pb: '0.5px', mt: '1px' }}>
                RESEARCH FOCUS
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.6px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.2 }}>
                Deep Learning · Symbolic AI · Quantum Alignment
              </Typography>

              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.2px', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', borderBottom: '0.5px solid rgba(255,255,255,0.2)', pb: '0.5px', mt: '1px' }}>
                METRICS
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.6px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.2 }}>
                h-index: 24 · 3,800+ Cites · 18 Papers
              </Typography>
            </Box>

            {/* Right Column with Soft Header Banner */}
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Soft Header Banner */}
              <Box sx={{ bgcolor: pal.accentLight, p: '4px 5px', borderBottom: `0.5px solid ${pal.accentBorder}` }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '5.2px', fontWeight: 800, color: pal.accentColor, lineHeight: 1.1 }}>
                  DR. CLARA WEISS, PH.D.
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.2px', fontWeight: 600, color: '#334155', textTransform: 'uppercase', mt: '0.5px' }}>
                  ASSOCIATE PROFESSOR · COMPUTER SCIENCE
                </Typography>
              </Box>

              {/* Body */}
              <Box sx={{ p: '4px 5px', display: 'flex', flexDirection: 'column', gap: '1.5px', flex: 1, boxSizing: 'border-box' }}>
                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.4px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '0.5px solid #e2e8f0', pb: '0.5px' }}>
                  ACADEMIC APPOINTMENTS
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.1px', fontWeight: 700, color: '#0f172a' }}>
                    ETH Zurich — Associate Professor
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: '#475569', lineHeight: 1.2 }}>
                    • PI of Scalable Reasoning Lab (12 Ph.D. researchers).
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: '#475569', lineHeight: 1.2 }}>
                    • Keynote Speaker at NeurIPS 2024 & ICML.
                  </Typography>
                </Box>

                <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.4px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '0.5px solid #e2e8f0', pb: '0.5px', mt: '1px' }}>
                  GRANTS & HONORS
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: '#475569', lineHeight: 1.2 }}>
                  • ERC Horizon 2020 (€1.8M PI) · 2 US Patents
                </Typography>
              </Box>
            </Box>
          </Box>
        );
    }
  };

  const getLayoutBadge = () => {
    switch (themeId) {
      case 'formal-legal':
        return 'Serif · 1 Col';
      case 'modern-tech':
        return 'Tech · 1 Col';
      case 'minimal-ats':
        return '100% ATS';
      case 'executive':
        return 'Banner · 2 Col';
      case 'two-column':
        return 'Sidebar · 2 Col';
      case 'designer-uiux':
        return 'Editorial · Card';
      case 'academic-research':
        return 'Dual-Tone · 2 Col';
      default:
        return '1 Col';
    }
  };

  const tooltipContent = recommendedFor
    ? `${name} — ${description || ''}\nIdeal for: ${recommendedFor}`
    : `${name} — ${description || ''}`;

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <Box
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.75,
          p: 0.5,
          borderRadius: '12px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-3px)',
          },
        }}
      >
        {/* Miniature Sheet Canvas Card */}
        <Box
          sx={{
            width: '100%',
            aspectRatio: '1 / 1.414',
            bgcolor: '#ffffff',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            border: isSelected
              ? `2.5px solid ${muiTheme.palette.primary.main}`
              : `1px solid ${isDark ? 'rgba(255,255,255,0.14)' : '#e2e8f0'}`,
            boxShadow: isSelected
              ? `0 0 0 2px ${alpha(muiTheme.palette.primary.main, 0.25)}, 0 8px 24px ${alpha(pal.accentColor, 0.25)}`
              : isDark
              ? '0 3px 10px rgba(0,0,0,0.4)'
              : '0 3px 10px rgba(0,0,0,0.07)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: muiTheme.palette.primary.main,
              boxShadow: `0 8px 24px ${alpha(pal.accentColor, 0.28)}`,
            },
          }}
        >
          {/* Render High-Fidelity Miniature Layout */}
          {renderMiniLayout()}

          {/* Selected Checkmark Badge */}
          {isSelected && (
            <Box
              sx={{
                position: 'absolute',
                top: 6,
                right: 6,
                bgcolor: 'primary.main',
                color: '#ffffff',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                zIndex: 3,
                animation: 'scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '@keyframes scaleIn': {
                  '0%': { transform: 'scale(0.5)', opacity: 0 },
                  '100%': { transform: 'scale(1)', opacity: 1 },
                },
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 17 }} />
            </Box>
          )}
        </Box>

        {/* Template Name & Dynamic Layout Pill Badge */}
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: isSelected ? 800 : 700,
              fontSize: '0.78rem',
              color: isSelected ? 'primary.main' : 'text.primary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              lineHeight: 1.2,
            }}
          >
            {icon && <span>{icon}</span>}
            {name}
          </Typography>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 0.4,
              px: 0.9,
              py: 0.15,
              borderRadius: '9999px',
              bgcolor: isSelected
                ? alpha(muiTheme.palette.primary.main, 0.1)
                : isDark
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(0,0,0,0.05)',
              border: `1px solid ${
                isSelected
                  ? alpha(muiTheme.palette.primary.main, 0.3)
                  : isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.08)'
              }`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.64rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: isSelected ? 'primary.main' : 'text.secondary',
                lineHeight: 1.1,
              }}
            >
              {getLayoutBadge()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Tooltip>
  );
};
