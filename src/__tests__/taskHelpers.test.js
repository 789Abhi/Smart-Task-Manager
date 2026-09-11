import { describe, it, expect } from 'vitest'
import {
  validateTask,
  isOverdue,
  filterTasks,
  groupByStatus,
  sortTasks,
  generateId,
  formatDate,
} from '../utils/taskHelpers'
import { PRIORITIES, STATUSES } from '../constants/taskConstants'

// ─── validateTask ────────────────────────────────────────────────────────────

describe('validateTask', () => {
  it('returns no errors for a valid task', () => {
    const errs = validateTask({ title: 'Fix bug', dueDate: '2030-01-01' })
    expect(Object.keys(errs)).toHaveLength(0)
  })

  it('returns title error when title is empty', () => {
    expect(validateTask({ title: '' })).toHaveProperty('title')
  })

  it('returns title error when title is only whitespace', () => {
    expect(validateTask({ title: '   ' })).toHaveProperty('title')
  })

  it('returns title error when title exceeds 120 characters', () => {
    const longTitle = 'a'.repeat(121)
    expect(validateTask({ title: longTitle })).toHaveProperty('title')
  })

  it('accepts a title of exactly 120 characters', () => {
    const errs = validateTask({ title: 'a'.repeat(120) })
    expect(errs).not.toHaveProperty('title')
  })

  it('returns dueDate error for an invalid date string', () => {
    expect(validateTask({ title: 'Task', dueDate: 'not-a-date' })).toHaveProperty('dueDate')
  })

  it('allows missing dueDate', () => {
    const errs = validateTask({ title: 'Task' })
    expect(errs).not.toHaveProperty('dueDate')
  })
})

// ─── isOverdue ───────────────────────────────────────────────────────────────

describe('isOverdue', () => {
  it('returns false if no dueDate', () => {
    expect(isOverdue({ dueDate: null, status: STATUSES.TODO })).toBe(false)
  })

  it('returns false if status is done', () => {
    expect(isOverdue({ dueDate: '2000-01-01', status: STATUSES.DONE })).toBe(false)
  })

  it('returns true for a past date with todo status', () => {
    expect(isOverdue({ dueDate: '2000-01-01', status: STATUSES.TODO })).toBe(true)
  })

  it('returns true for a past date with in-progress status', () => {
    expect(isOverdue({ dueDate: '2000-01-01', status: STATUSES.IN_PROGRESS })).toBe(true)
  })

  it('returns false for a future date', () => {
    expect(isOverdue({ dueDate: '2099-12-31', status: STATUSES.TODO })).toBe(false)
  })
})

// ─── filterTasks ─────────────────────────────────────────────────────────────

const sampleTasks = [
  { id: '1', status: STATUSES.TODO, priority: PRIORITIES.HIGH },
  { id: '2', status: STATUSES.IN_PROGRESS, priority: PRIORITIES.MEDIUM },
  { id: '3', status: STATUSES.DONE, priority: PRIORITIES.HIGH },
  { id: '4', status: STATUSES.TODO, priority: PRIORITIES.LOW },
]

describe('filterTasks', () => {
  it('returns all tasks when filters are "all"', () => {
    expect(filterTasks(sampleTasks, { status: 'all', priority: 'all' })).toHaveLength(4)
  })

  it('filters by status correctly', () => {
    const result = filterTasks(sampleTasks, { status: STATUSES.TODO, priority: 'all' })
    expect(result).toHaveLength(2)
    result.forEach((t) => expect(t.status).toBe(STATUSES.TODO))
  })

  it('filters by priority correctly', () => {
    const result = filterTasks(sampleTasks, { status: 'all', priority: PRIORITIES.HIGH })
    expect(result).toHaveLength(2)
    result.forEach((t) => expect(t.priority).toBe(PRIORITIES.HIGH))
  })

  it('filters by both status and priority', () => {
    const result = filterTasks(sampleTasks, { status: STATUSES.TODO, priority: PRIORITIES.HIGH })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })

  it('returns empty array when no match', () => {
    const result = filterTasks(sampleTasks, { status: STATUSES.DONE, priority: PRIORITIES.LOW })
    expect(result).toHaveLength(0)
  })
})

// ─── groupByStatus ────────────────────────────────────────────────────────────

describe('groupByStatus', () => {
  it('groups tasks into correct buckets', () => {
    const grouped = groupByStatus(sampleTasks)
    expect(grouped[STATUSES.TODO]).toHaveLength(2)
    expect(grouped[STATUSES.IN_PROGRESS]).toHaveLength(1)
    expect(grouped[STATUSES.DONE]).toHaveLength(1)
  })

  it('produces empty arrays for missing statuses', () => {
    const grouped = groupByStatus([])
    expect(grouped[STATUSES.TODO]).toHaveLength(0)
    expect(grouped[STATUSES.IN_PROGRESS]).toHaveLength(0)
    expect(grouped[STATUSES.DONE]).toHaveLength(0)
  })
})

// ─── sortTasks ────────────────────────────────────────────────────────────────

describe('sortTasks', () => {
  it('sorts high priority tasks before medium and low', () => {
    const tasks = [
      { id: 'a', priority: PRIORITIES.LOW, createdAt: '2024-01-01' },
      { id: 'b', priority: PRIORITIES.HIGH, createdAt: '2024-01-01' },
      { id: 'c', priority: PRIORITIES.MEDIUM, createdAt: '2024-01-01' },
    ]
    const sorted = sortTasks(tasks)
    expect(sorted[0].priority).toBe(PRIORITIES.HIGH)
    expect(sorted[1].priority).toBe(PRIORITIES.MEDIUM)
    expect(sorted[2].priority).toBe(PRIORITIES.LOW)
  })

  it('does not mutate the original array', () => {
    const tasks = [
      { id: 'a', priority: PRIORITIES.LOW, createdAt: '2024-01-01' },
    ]
    const sorted = sortTasks(tasks)
    expect(sorted).not.toBe(tasks)
  })
})

// ─── generateId ──────────────────────────────────────────────────────────────

describe('generateId', () => {
  it('generates a non-empty string', () => {
    expect(typeof generateId()).toBe('string')
    expect(generateId().length).toBeGreaterThan(0)
  })

  it('generates unique IDs on successive calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})

// ─── formatDate ──────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('returns null for falsy input', () => {
    expect(formatDate(null)).toBeNull()
    expect(formatDate('')).toBeNull()
  })

  it('returns a non-empty string for a valid date', () => {
    const result = formatDate('2025-06-15')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})
