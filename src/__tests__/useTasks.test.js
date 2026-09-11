import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTasks } from '../hooks/useTasks'
import { STATUSES, PRIORITIES } from '../constants/taskConstants'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value) },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

beforeEach(() => {
  localStorageMock.clear()
})

const SAMPLE_FIELDS = {
  title: 'Write tests',
  description: 'Cover all edge cases',
  priority: PRIORITIES.HIGH,
  dueDate: '2030-01-01',
}

describe('useTasks', () => {
  it('starts with an empty task list', () => {
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toHaveLength(0)
  })

  it('adds a task with correct fields', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask(SAMPLE_FIELDS) })

    expect(result.current.tasks).toHaveLength(1)
    const task = result.current.tasks[0]
    expect(task.title).toBe('Write tests')
    expect(task.status).toBe(STATUSES.TODO)
    expect(task.priority).toBe(PRIORITIES.HIGH)
    expect(task.id).toBeDefined()
    expect(task.createdAt).toBeDefined()
  })

  it('trims whitespace from task title on add', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask({ ...SAMPLE_FIELDS, title: '  Trimmed  ' }) })
    expect(result.current.tasks[0].title).toBe('Trimmed')
  })

  it('edits a task', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask(SAMPLE_FIELDS) })
    const id = result.current.tasks[0].id

    act(() => { result.current.editTask(id, { title: 'Updated title' }) })
    expect(result.current.tasks[0].title).toBe('Updated title')
  })

  it('deletes a task', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask(SAMPLE_FIELDS) })
    const id = result.current.tasks[0].id

    act(() => { result.current.deleteTask(id) })
    expect(result.current.tasks).toHaveLength(0)
  })

  it('moves a task to a new status', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask(SAMPLE_FIELDS) })
    const id = result.current.tasks[0].id

    act(() => { result.current.moveTask(id, STATUSES.IN_PROGRESS) })
    expect(result.current.tasks[0].status).toBe(STATUSES.IN_PROGRESS)
  })

  it('does not affect other tasks when deleting one', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask({ ...SAMPLE_FIELDS, title: 'Task A' })
      result.current.addTask({ ...SAMPLE_FIELDS, title: 'Task B' })
    })
    const idA = result.current.tasks.find((t) => t.title === 'Task A').id

    act(() => { result.current.deleteTask(idA) })
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('Task B')
  })

  it('persists tasks to localStorage on add', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask(SAMPLE_FIELDS) })

    const stored = JSON.parse(localStorageMock.getItem('smart-task-manager-tasks'))
    expect(stored).toHaveLength(1)
    expect(stored[0].title).toBe('Write tests')
  })

  it('stores multiple tasks independently', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask({ ...SAMPLE_FIELDS, title: 'Low', priority: PRIORITIES.LOW })
      result.current.addTask({ ...SAMPLE_FIELDS, title: 'High', priority: PRIORITIES.HIGH })
    })
    expect(result.current.tasks).toHaveLength(2)
    expect(result.current.tasks.map((t) => t.title)).toContain('Low')
    expect(result.current.tasks.map((t) => t.title)).toContain('High')
  })
})
