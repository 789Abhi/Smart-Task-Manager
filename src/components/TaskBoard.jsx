import { useState, useCallback, useMemo, memo } from 'react'
import TaskCard from './TaskCard'
import EmptyState from './EmptyState'
import ConfirmDialog from './ConfirmDialog'
import TaskForm from './TaskForm'
import { COLUMN_ORDER, STATUS_LABELS, STATUSES } from '../constants/taskConstants'
import { groupByStatus } from '../utils/taskHelpers'

const COLUMN_CONFIG = {
  [STATUSES.TODO]: {
    label: 'Todo',
    dotColor: 'bg-gray-400',
    headerBg: 'bg-gray-50',
    headerBorder: 'border-gray-200',
    headerText: 'text-gray-700',
    countBg: 'bg-gray-100',
    countText: 'text-gray-600',
    columnBg: 'bg-gray-50/50',
    columnBorder: 'border-gray-200',
    topAccent: 'bg-gray-400',
  },
  [STATUSES.IN_PROGRESS]: {
    label: 'In Progress',
    dotColor: 'bg-blue-500',
    headerBg: 'bg-blue-50',
    headerBorder: 'border-blue-200',
    headerText: 'text-blue-800',
    countBg: 'bg-blue-100',
    countText: 'text-blue-700',
    columnBg: 'bg-blue-50/30',
    columnBorder: 'border-blue-200',
    topAccent: 'bg-blue-500',
  },
  [STATUSES.DONE]: {
    label: 'Done',
    dotColor: 'bg-emerald-500',
    headerBg: 'bg-emerald-50',
    headerBorder: 'border-emerald-200',
    headerText: 'text-emerald-800',
    countBg: 'bg-emerald-100',
    countText: 'text-emerald-700',
    columnBg: 'bg-emerald-50/30',
    columnBorder: 'border-emerald-200',
    topAccent: 'bg-emerald-500',
  },
}

/**
 * TaskBoard — receives pre-filtered + pre-sorted tasks from App.
 * Internal modal state (edit / delete) lives here so App stays clean.
 */
function TaskBoard({ tasks, editTask, deleteTask, moveTask }) {
  const [editingTask, setEditingTask]     = useState(null)
  const [deletingTaskId, setDeletingTaskId] = useState(null)
  const [activeTab, setActiveTab]         = useState(STATUSES.TODO)

  // Group once per tasks change
  const grouped = useMemo(() => groupByStatus(tasks), [tasks])

  // Stable callbacks so KanbanColumn / TaskCard don't re-render unnecessarily
  const openEdit   = useCallback((task) => setEditingTask(task), [])
  const openDelete = useCallback((id)   => setDeletingTaskId(id), [])
  const closeEdit  = useCallback(()     => setEditingTask(null), [])
  const closeDelete = useCallback(()    => setDeletingTaskId(null), [])

  const handleEditSubmit = useCallback((fields) => {
    editTask(editingTask.id, fields)
    setEditingTask(null)
  }, [editTask, editingTask])

  const handleDeleteConfirm = useCallback(() => {
    deleteTask(deletingTaskId)
    setDeletingTaskId(null)
  }, [deleteTask, deletingTaskId])

  return (
    <>
      {/* ── Mobile tab bar ── */}
      <div className="flex md:hidden mb-4 bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
        {COLUMN_ORDER.map((status) => {
          const cfg   = COLUMN_CONFIG[status]
          const count = grouped[status]?.length || 0
          const isActive = activeTab === status
          return (
            <button key={status} onClick={() => setActiveTab(status)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 border-r last:border-r-0 border-gray-200 transition-colors ${
                isActive ? 'bg-indigo-600' : 'bg-white hover:bg-gray-50'
              }`}>
              <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>{cfg.label}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : `${cfg.countBg} ${cfg.countText}`
              }`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* ── Desktop 3-column grid ── */}
      <div className="hidden md:grid md:grid-cols-3 gap-5">
        {COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={grouped[status] || []}
            cfg={COLUMN_CONFIG[status]}
            onEdit={openEdit}
            onDelete={openDelete}
            onMove={moveTask}
          />
        ))}
      </div>

      {/* ── Mobile single column ── */}
      <div className="md:hidden">
        <KanbanColumn
          status={activeTab}
          tasks={grouped[activeTab] || []}
          cfg={COLUMN_CONFIG[activeTab]}
          onEdit={openEdit}
          onDelete={openDelete}
          onMove={moveTask}
        />
      </div>

      {editingTask && (
        <TaskForm initialValues={editingTask} onSubmit={handleEditSubmit} onClose={closeEdit} />
      )}
      {deletingTaskId && (
        <ConfirmDialog
          title="Delete task?"
          message="This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={closeDelete}
        />
      )}
    </>
  )
}

/**
 * KanbanColumn — wrapped in React.memo.
 * Only re-renders when its own tasks array or handlers change.
 */
const KanbanColumn = memo(function KanbanColumn({ status, tasks, cfg, onEdit, onDelete, onMove }) {
  return (
    <div className={`flex flex-col rounded-2xl border-2 ${cfg.columnBorder} ${cfg.columnBg} overflow-hidden`}>
      <div className={`h-1 w-full ${cfg.topAccent}`} />

      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 ${cfg.headerBg} border-b-2 ${cfg.headerBorder}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotColor}`} />
          <h2 className={`text-sm font-bold ${cfg.headerText}`}>{cfg.label}</h2>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.countBg} ${cfg.countText}`}>
          {tasks.length}
        </span>
      </div>

      {/* Scrollable cards area */}
      <div
        className="flex flex-col gap-3 p-3 overflow-y-auto scrollbar-thin"
        style={{ height: '65vh', maxHeight: '65vh' }}
      >
        {tasks.length === 0 ? (
          <EmptyState label={`No ${cfg.label.toLowerCase()} tasks`} />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))
        )}
      </div>
    </div>
  )
})

export default TaskBoard
