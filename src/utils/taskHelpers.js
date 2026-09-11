import { PRIORITIES, PRIORITY_ORDER, STATUSES } from '../constants/taskConstants'

/**
 * Validate a task form payload.
 * Returns an object of { field: errorMessage } or empty object if valid.
 */
export function validateTask(fields) {
  const errors = {}
  if (!fields.title || fields.title.trim() === '') {
    errors.title = 'Title is required.'
  } else if (fields.title.trim().length > 120) {
    errors.title = 'Title must be 120 characters or fewer.'
  }
  if (fields.dueDate) {
    const d = new Date(fields.dueDate)
    if (isNaN(d.getTime())) {
      errors.dueDate = 'Invalid date.'
    }
  }
  return errors
}

/**
 * Returns true if a task is overdue:
 *  - Has a dueDate
 *  - That date is in the past (compared to start of today)
 *  - Status is NOT 'done'
 */
export function isOverdue(task) {
  if (!task.dueDate || task.status === STATUSES.DONE) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(task.dueDate) < today
}

/**
 * Filter an array of tasks by status and/or priority.
 * 'all' as a value means no filter applied for that dimension.
 */
export function filterTasks(tasks, { status = 'all', priority = 'all' } = {}) {
  return tasks.filter((task) => {
    const statusMatch = status === 'all' || task.status === status
    const priorityMatch = priority === 'all' || task.priority === priority
    return statusMatch && priorityMatch
  })
}

/**
 * Group an array of tasks by status.
 * Returns { todo: [], 'in-progress': [], done: [] }
 */
export function groupByStatus(tasks) {
  return tasks.reduce(
    (acc, task) => {
      const key = task.status
      if (acc[key]) acc[key].push(task)
      return acc
    },
    { [STATUSES.TODO]: [], [STATUSES.IN_PROGRESS]: [], [STATUSES.DONE]: [] }
  )
}

/**
 * Sort tasks: high priority first, then by createdAt descending.
 */
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority] ?? 99
    const pb = PRIORITY_ORDER[b.priority] ?? 99
    if (pa !== pb) return pa - pb
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

/**
 * Generate a simple unique ID (no external dependency needed).
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Format a date string (YYYY-MM-DD) to a human-readable form.
 */
export function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
