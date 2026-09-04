import { useResumeStore } from '../store';
import { StudioTab } from '../types';

/**
 * Domain hook encapsulating navigation state and application badge counts for StudioNavbar.
 * Decouples the UI component from direct Zustand store references.
 */
export function useNavbarWorkflow() {
  const activeTab = useResumeStore((s) => s.activeTab);
  const setActiveTab = useResumeStore((s) => s.setActiveTab);
  const activeApplicationsCount = useResumeStore((s) => (s.applications || []).filter((a) => !a.isArchived).length);
  const savedVersionsCount = useResumeStore((s) => s.savedVersions.length);
  const displayBadgeCount = activeApplicationsCount > 0 ? activeApplicationsCount : savedVersionsCount;

  const handleSelectTab = (tab: StudioTab) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    displayBadgeCount,
    handleSelectTab,
  };
}
