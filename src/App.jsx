import { useState, useCallback, useMemo } from 'react'
import { useTasks } from './hooks/useTasks'
import TaskBoard from './components/TaskBoard'
import TaskForm from './components/TaskForm'
import FilterBar from './components/FilterBar'
import { STATUSES } from './constants/taskConstants'
import { isOverdue, sortTasks, filterTasks } from './utils/taskHelpers'

const DEFAULT_FILTERS = { status: 'all', priority: 'all' }

export default function App() {
  const { tasks, addTask, editTask, deleteTask, moveTask } = useTasks()
  const [showAddForm, setShowAddForm] = useState(false)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  // ── Memoised derived values ──────────────────────────────────────────────

  /** Sorted + filtered task list — only recomputes when tasks or filters change */
  const displayTasks = useMemo(
    () => filterTasks(sortTasks(tasks), filters),
    [tasks, filters]
  )

  /** Stats — only recompute when tasks change */
  const stats = useMemo(() => ({
    total: tasks.length,
    overdue: tasks.filter(isOverdue).length,
    done: tasks.filter((t) => t.status === STATUSES.DONE).length,
    inProgress: tasks.filter((t) => t.status === STATUSES.IN_PROGRESS).length,
    todo: tasks.filter((t) => t.status === STATUSES.TODO).length,
    filtered: tasks.filter(
      (t) =>
        (filters.status === 'all' || t.status === filters.status) &&
        (filters.priority === 'all' || t.priority === filters.priority)
    ).length,
  }), [tasks, filters])

  // ── Stable callbacks ─────────────────────────────────────────────────────

  const handleAddTask = useCallback((fields) => {
    addTask(fields)
    setShowAddForm(false)
  }, [addTask])

  const openAddForm = useCallback(() => setShowAddForm(true), [])
  const closeAddForm = useCallback(() => setShowAddForm(false), [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-gray-900 leading-tight">Smart Task Manager</p>
                <p className="text-xs text-gray-400 leading-tight hidden sm:block">Track your work across stages</p>
              </div>
            </div>

            {/* Centre stats */}
            {stats.total > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <StatChip value={stats.todo}       label="Todo"        dotColor="bg-gray-400" />
                <StatChip value={stats.inProgress} label="In Progress" dotColor="bg-blue-500" />
                <StatChip value={stats.done}       label="Done"        dotColor="bg-emerald-500" />
                {stats.overdue > 0 && (
                  <StatChip value={stats.overdue} label="Overdue" dotColor="bg-rose-500" danger />
                )}
              </div>
            )}

            <button
              onClick={openAddForm}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Task</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Filter sub-bar ── */}
      {stats.total > 0 && (
        <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <FilterBar
              filters={filters}
              onChange={setFilters}
              totalCount={stats.total}
              filteredCount={stats.filtered}
            />
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {stats.total === 0 ? (
          <EmptyWelcome onAdd={openAddForm} />
        ) : (
          <TaskBoard
            tasks={displayTasks}
            editTask={editTask}
            deleteTask={deleteTask}
            moveTask={moveTask}
          />
        )}
      </main>

      {showAddForm && (
        <TaskForm onSubmit={handleAddTask} onClose={closeAddForm} />
      )}
    </div>
  )
}

// ── Sub-components (no props drill, kept local) ───────────────────────────

const StatChip = ({ value, label, dotColor, danger }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
    danger ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-gray-50 border-gray-200 text-gray-600'
  }`}>
    <span className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`} />
    <span className="font-bold">{value}</span>
    <span className="font-medium opacity-70">{label}</span>
  </div>
)

const EmptyWelcome = ({ onAdd }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-3xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center mb-5">
      <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    </div>
    <h2 className="text-xl font-bold text-gray-800 mb-2">No tasks yet</h2>
    <p className="text-gray-400 text-sm mb-6 max-w-sm">
      Create your first task to start tracking your work across Todo, In Progress, and Done.
    </p>
    <button onClick={onAdd}
      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
      + Create your first task
    </button>
  </div>
)
