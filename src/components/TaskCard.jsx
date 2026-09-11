import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { PRIORITIES, PRIORITY_LABELS, STATUSES, STATUS_LABELS, COLUMN_ORDER } from '../constants/taskConstants'
import { isOverdue, formatDate } from '../utils/taskHelpers'

const PRIORITY_STYLES = {
  [PRIORITIES.HIGH]:   { badge: 'bg-rose-50 text-rose-700 border border-rose-200',     dot: 'bg-rose-500' },
  [PRIORITIES.MEDIUM]: { badge: 'bg-amber-50 text-amber-700 border border-amber-200',   dot: 'bg-amber-400' },
  [PRIORITIES.LOW]:    { badge: 'bg-sky-50 text-sky-700 border border-sky-200',         dot: 'bg-sky-400' },
}

const STATUS_MOVE_OPTIONS = {
  [STATUSES.TODO]:        { color: 'text-gray-600',    hoverBg: 'hover:bg-gray-50',    dotColor: 'bg-gray-400' },
  [STATUSES.IN_PROGRESS]: { color: 'text-blue-600',    hoverBg: 'hover:bg-blue-50',    dotColor: 'bg-blue-500' },
  [STATUSES.DONE]:        { color: 'text-emerald-600', hoverBg: 'hover:bg-emerald-50', dotColor: 'bg-emerald-500' },
}

/**
 * TaskCard — wrapped in React.memo.
 * Only re-renders when task data or handler references change.
 * Handlers (onEdit, onDelete, onMove) come from TaskBoard with stable useCallback refs.
 */
const TaskCard = memo(function TaskCard({ task, onEdit, onDelete, onMove }) {
  const [showMoveMenu, setShowMoveMenu] = useState(false)
  const menuRef  = useRef(null)
  const overdue  = isOverdue(task)
  const formatted = formatDate(task.dueDate)
  const pStyle   = PRIORITY_STYLES[task.priority]
  const isDone   = task.status === STATUSES.DONE

  // Close dropdown on outside click
  useEffect(() => {
    if (!showMoveMenu) return
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMoveMenu(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [showMoveMenu])

  const handleEdit   = useCallback(() => onEdit(task), [onEdit, task])
  const handleDelete = useCallback(() => onDelete(task.id), [onDelete, task.id])
  const toggleMenu   = useCallback(() => setShowMoveMenu((v) => !v), [])

  const otherStatuses = COLUMN_ORDER.filter((s) => s !== task.status)

  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all duration-150 hover:shadow-md group ${
        overdue
          ? 'border-rose-300 shadow-sm shadow-rose-100'
          : isDone
          ? 'border-gray-200 opacity-80'
          : 'border-gray-200 hover:border-indigo-200'
      }`}
      data-testid="task-card"
    >
      {/* Priority top accent */}
      <div className={`h-1 w-full rounded-t-lg ${pStyle.dot}`} />

      <div className="p-3">
        {/* Row 1: badge + actions */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${pStyle.badge}`}
            data-testid="priority-badge"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`} />
            {PRIORITY_LABELS[task.priority]}
          </span>

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button onClick={handleEdit} aria-label="Edit task" title="Edit"
              className="p-1.5 rounded-lg text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button onClick={handleDelete} aria-label="Delete task" title="Delete"
              className="p-1.5 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-sm font-bold leading-snug mb-1 ${isDone ? 'line-through text-gray-400' : 'text-gray-800'}`}
          data-testid="task-title"
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-2">{task.description}</p>
        )}

        {/* Footer */}
        <div className="border-t border-dashed border-gray-100 mt-2 pt-2 flex items-center justify-between gap-2">

          {/* Due date chip */}
          {formatted ? (
            <span
              className={`flex items-center gap-1 text-xs font-semibold rounded-lg px-2 py-1 ${
                overdue
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-gray-50 text-gray-500 border border-gray-200'
              }`}
              data-testid={overdue ? 'overdue-badge' : 'due-date'}
            >
              {overdue ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              {overdue ? `Overdue · ${formatted}` : formatted}
            </span>
          ) : <span />}

          {/* Move dropdown */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={toggleMenu}
              aria-label="Move task to another status"
              title="Move to…"
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border-2 transition-all ${
                showMoveMenu
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Move
            </button>

            {showMoveMenu && (
              <div className="absolute bottom-full right-0 mb-1.5 bg-white border-2 border-gray-200 rounded-xl shadow-lg py-1.5 min-w-[150px] z-20 animate-fade-in">
                <p className="text-xs text-gray-400 font-medium px-3 pb-1.5 border-b border-gray-100 mb-1">Move to…</p>
                {otherStatuses.map((s) => {
                  const opt = STATUS_MOVE_OPTIONS[s]
                  return (
                    <button key={s}
                      onClick={() => { onMove(task.id, s); setShowMoveMenu(false) }}
                      className={`w-full flex items-center gap-2 text-left text-xs font-semibold px-3 py-2 transition-colors ${opt.color} ${opt.hoverBg}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${opt.dotColor} flex-shrink-0`} />
                      {STATUS_LABELS[s]}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

export default TaskCard
