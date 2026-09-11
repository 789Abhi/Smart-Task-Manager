import { useState, useEffect, useCallback } from 'react'
import { loadTasks, saveTasks } from '../utils/storage'
import { generateId, sortTasks } from '../utils/taskHelpers'
import { STATUSES, PRIORITIES } from '../constants/taskConstants'

/**
 * useTasks — central hook for all task state and operations.
 * All mutating functions are memoised with useCallback so child components
 * that receive them as props only re-render when the function identity changes.
 */
export function useTasks() {
  const [tasks, setTasks] = useState(() => loadTasks())

  // Persist on every change
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((fields) => {
    const newTask = {
      id: generateId(),
      title: fields.title.trim(),
      description: fields.description?.trim() || '',
      status: STATUSES.TODO,
      priority: fields.priority || PRIORITIES.MEDIUM,
      dueDate: fields.dueDate || null,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
    return newTask
  }, [])

  const editTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updates,
              title: updates.title?.trim() ?? t.title,
              description: updates.description?.trim() ?? t.description,
            }
          : t
      )
    )
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const moveTask = useCallback((id, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    )
  }, [])

  // Memoised sort is handled in App via useMemo — hook just exposes raw tasks
  return { tasks, addTask, editTask, deleteTask, moveTask }
}
