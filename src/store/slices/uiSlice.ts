import { StateCreator } from 'zustand';
import { StudioTab, WizardStep } from '../../types/cv';
import { ResumeStore, UiSlice } from '../types';

const getInitialTab = (): StudioTab => {
  if (typeof window !== 'undefined' && window.location.hash) {
    const hash = window.location.hash.replace('#', '') as StudioTab;
    const validTabs: StudioTab[] = ['landing', 'wizard', 'editor', 'preview', 'audit', 'gap', 'history', 'settings'];
    if (validTabs.includes(hash)) {
      return hash;
    }
  }
  return 'landing';
};

export const createUiSlice: StateCreator<ResumeStore, [], [], UiSlice> = (set, get) => ({
  activeTab: getInitialTab(),
  wizardStep: 'profile',
  globalNotification: null,

  setActiveTab: (tab: StudioTab) => {
    set({ activeTab: tab });
    if (typeof window !== 'undefined' && window.location.hash !== `#${tab}`) {
      window.location.hash = `#${tab}`;
    }
  },

  setWizardStep: (step: WizardStep) => {
    set({ wizardStep: step });
  },

  showNotification: (notif) => {
    set({ globalNotification: { ...notif, open: true } });
  },

  hideNotification: () => {
    set((state) => ({
      globalNotification: state.globalNotification
        ? { ...state.globalNotification, open: false }
        : null,
    }));
  },


  handleStartWizard: () => {
    get().setActiveTab('wizard');
    get().setWizardStep('profile');
  },

  handleExploreDemo: () => {
    get().handleLoadDemoProfile();
    get().setActiveTab('wizard');
    get().setWizardStep('preview');
  },
});
