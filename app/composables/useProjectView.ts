/**
 * Composable for tracking unique project views
 *
 * This composable provides client-side unique view tracking for projects using localStorage.
 * It considers a view "unique" based on the following criteria:
 *
 * - Same project ID
 * - Same user agent (browser fingerprint)
 * - Within a time window (default: 24 hours)
 *
 * How it works:
 * 1. When a user views a project, we check localStorage for recent views
 * 2. If the same user-agent viewed the same project within 24 hours, it's NOT unique
 * 3. If it's unique, we track the view and increment the project's view count
 * 4. Old view records (>24 hours) are automatically cleaned up
 *
 * Usage:
 * ```ts
 * const { trackView } = useProjectView();
 * const isUniqueView = await trackView(projectId);
 *
 * if (isUniqueView) {
 *   projectStore.incrementViews(projectId);
 * }
 * ```
 *
 * @example
 * // In a project detail page's onMounted hook:
 * onMounted(async () => {
 *   const { trackView } = useProjectView();
 *   const isUniqueView = await trackView(projectId);
 *   if (isUniqueView && project.value) {
 *     projectStore.incrementViews(project.value.id);
 *   }
 * });
 */

interface ViewRecord {
  projectId: string | number;
  timestamp: number;
  userAgent: string;
}

const VIEW_STORAGE_KEY = "gic_project_views";
const VIEW_TIME_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useProjectView = () => {
  /**
   * Get all view records from localStorage
   */
  const getViewRecords = (): ViewRecord[] => {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(VIEW_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading view records:", error);
      return [];
    }
  };

  /**
   * Save view records to localStorage
   */
  const saveViewRecords = (records: ViewRecord[]): void => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error("Error saving view records:", error);
    }
  };

  /**
   * Clean up old view records that are outside the time window
   */
  const cleanupOldRecords = (records: ViewRecord[]): ViewRecord[] => {
    const now = Date.now();
    return records.filter(
      (record) => now - record.timestamp < VIEW_TIME_WINDOW,
    );
  };

  /**
   * Check if a project has been viewed within the time window
   */
  const hasRecentView = (projectId: string | number): boolean => {
    if (typeof window === "undefined") return false;

    const records = getViewRecords();
    const now = Date.now();
    const userAgent = navigator.userAgent;

    // Check if there's a recent view for this project with the same user agent
    const recentView = records.find(
      (record) =>
        record.projectId?.toString() === projectId?.toString() &&
        record.userAgent === userAgent &&
        now - record.timestamp < VIEW_TIME_WINDOW,
    );

    return !!recentView;
  };

  /**
   * Track a project view (returns true if it's a unique view)
   */
  const trackView = async (projectId: string | number): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    // Check if already viewed recently
    if (hasRecentView(projectId)) {
      console.log(
        `🔄 Project ${projectId} - Already viewed within 24 hours (not counting)`,
      );
      return false;
    }

    // Add new view record
    let records = getViewRecords();

    // Clean up old records first
    const oldCount = records.length;
    records = cleanupOldRecords(records);
    const cleanedCount = oldCount - records.length;
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} old view record(s)`);
    }

    // Add new view
    const newRecord: ViewRecord = {
      projectId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    records.push(newRecord);
    saveViewRecords(records);

    console.log(
      `✅ Project ${projectId} - Unique view tracked! Total tracked: ${records.length}`,
    );
    return true;
  };

  /**
   * Get view statistics (optional - for debugging)
   */
  const getViewStats = () => {
    if (typeof window === "undefined")
      return { totalViews: 0, uniqueProjects: 0 };

    const records = cleanupOldRecords(getViewRecords());
    const uniqueProjects = new Set(records.map((r) => r.projectId));

    return {
      totalViews: records.length,
      uniqueProjects: uniqueProjects.size,
    };
  };

  /**
   * Clear all view records (optional - for testing/debugging)
   */
  const clearViewRecords = (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(VIEW_STORAGE_KEY);
  };

  return {
    trackView,
    hasRecentView,
    getViewStats,
    clearViewRecords,
  };
};
