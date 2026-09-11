import { memo, useCallback } from 'react'
import { STATUSES, STATUS_LABELS, PRIORITIES, PRIORITY_LABELS } from '../constants/taskConstants'

/**
 * FilterBar — memo-wrapped; only re-renders when filters/counts change.
 */
const FilterBar = memo(function FilterBar({ filters, onChange, totalCount, filteredCount }) {
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    onChange((prev) => ({ ...prev, [name]: value }))
  }, [onChange])

  const clearAll = useCallback(() => onChange({ status: 'all', priority: 'all' }), [onChange])
  const removeStatus   = useCallback(() => onChange((prev) => ({ ...prev, status: 'all' })), [onChange])
  const removePriority = useCallback(() => onChange((prev) => ({ ...prev, priority: 'all' })), [onChange])

  const isFiltered = filters.status !== 'all' || filters.priority !== 'all'

  return (
    <div className="flex flex-wrap items-center gap-2">

      {/* Status filter */}
      <label className="flex items-center gap-2 border-2 border-gray-200 rounded-xl bg-white px-3 py-2 cursor-pointer hover:border-gray-300 transition-colors">
        <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="text-xs font-semibold text-gray-500">Status</span>
        <select name="status" value={filters.status} onChange={handleChange}
          className="text-xs font-bold text-gray-700 bg-transparent focus:outline-none cursor-pointer">
          <option value="all">All</option>
          {Object.values(STATUSES).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </label>

      {/* Priority filter */}
      <label className="flex items-center gap-2 border-2 border-gray-200 rounded-xl bg-white px-3 py-2 cursor-pointer hover:border-gray-300 transition-colors">
        <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        <span className="text-xs font-semibold text-gray-500">Priority</span>
        <select name="priority" value={filters.priority} onChange={handleChange}
          className="text-xs font-bold text-gray-700 bg-transparent focus:outline-none cursor-pointer">
          <option value="all">All</option>
          {Object.values(PRIORITIES).map((p) => (
            <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
          ))}
        </select>
      </label>

      {/* Active chips */}
      {filters.status !== 'all' && (
        <ActiveChip label={`Status: ${STATUS_LABELS[filters.status]}`} onRemove={removeStatus} />
      )}
      {filters.priority !== 'all' && (
        <ActiveChip label={`Priority: ${PRIORITY_LABELS[filters.priority]}`} onRemove={removePriority} />
      )}

      {isFiltered && (
        <button onClick={clearAll}
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 border-2 border-rose-200 hover:border-rose-300 bg-rose-50 px-3 py-2 rounded-xl transition-colors">
          Clear all
        </button>
      )}

      {/* Count badge */}
      <div className="ml-auto border-2 border-gray-200 bg-white rounded-xl px-3 py-2">
        <span className="text-xs font-bold text-gray-700">{isFiltered ? filteredCount : totalCount}</span>
        <span className="text-xs text-gray-400 font-medium">
          {isFiltered ? ` / ${totalCount}` : ''} task{totalCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
})

// Chip for active filter — memo so it doesn't flicker on unrelated filter changes
const ActiveChip = memo(function ActiveChip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 border-2 border-indigo-200 px-2.5 py-1.5 rounded-xl">
      {label}
      <button onClick={onRemove} aria-label={`Remove filter: ${label}`}
        className="hover:text-indigo-900 transition-colors">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
})

export default FilterBar
