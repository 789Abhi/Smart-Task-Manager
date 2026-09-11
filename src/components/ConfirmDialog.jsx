import { memo, useCallback } from 'react'

const ConfirmDialog = memo(function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog" aria-modal="true" aria-label="Confirm action"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in border-2 border-gray-100">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 border-2 border-rose-200 flex items-center justify-center">
            <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 border-2 border-gray-200 rounded-xl hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} autoFocus
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-700 active:scale-95 transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
})

export default ConfirmDialog
