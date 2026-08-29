import { StateCreator } from 'zustand';
import { ResumeStore, DesignSlice } from '../types';
import { ThemeId, PaletteId, FontFamilyId, SpacingDensity, PageFormat } from '../../types/cv';

export const createDesignSlice: StateCreator<ResumeStore, [], [], DesignSlice> = (set) => ({
  pageBudget: 1,
  pageFormat: 'a4',
  theme: 'modern-tech',
  palette: 'corporate-blue',
  customColor: '#1d4ed8',
  fontFamily: 'inter',
  spacingDensity: 'standard',

  setPageBudget: (pageBudget: 1 | 2) => set({ pageBudget }),
  setPageFormat: (pageFormat: PageFormat) => set({ pageFormat }),
  setTheme: (theme: ThemeId) => set({ theme }),
  setPalette: (palette: PaletteId) => set({ palette }),
  setCustomColor: (customColor: string) => set({ customColor }),
  setFontFamily: (fontFamily: FontFamilyId) => set({ fontFamily }),
  setSpacingDensity: (spacingDensity: SpacingDensity) => set({ spacingDensity }),
});
