import { memo } from 'react'

const EmptyState = memo(function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center flex-1">
      <div className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-3 bg-white">
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p className="text-xs font-semibold text-gray-300">{label || 'No tasks here'}</p>
    </div>
  )
})

export default EmptyState
