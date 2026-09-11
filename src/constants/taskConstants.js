export const STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
}

export const STATUS_LABELS = {
  [STATUSES.TODO]: 'Todo',
  [STATUSES.IN_PROGRESS]: 'In Progress',
  [STATUSES.DONE]: 'Done',
}

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

export const PRIORITY_LABELS = {
  [PRIORITIES.LOW]: 'Low',
  [PRIORITIES.MEDIUM]: 'Medium',
  [PRIORITIES.HIGH]: 'High',
}

export const PRIORITY_ORDER = {
  [PRIORITIES.HIGH]: 0,
  [PRIORITIES.MEDIUM]: 1,
  [PRIORITIES.LOW]: 2,
}

export const COLUMN_ORDER = [STATUSES.TODO, STATUSES.IN_PROGRESS, STATUSES.DONE]
