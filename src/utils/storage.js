const STORAGE_KEY = 'smart-task-manager-tasks'

/**
 * Load tasks array from localStorage.
 * Returns empty array if nothing stored or JSON is corrupt.
 */
export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

/**
 * Persist tasks array to localStorage.
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Silently fail (e.g. private browsing quota exceeded)
  }
}
