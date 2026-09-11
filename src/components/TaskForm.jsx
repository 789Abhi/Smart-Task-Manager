import { useState, useEffect } from 'react'
import { PRIORITIES, PRIORITY_LABELS, STATUSES } from '../constants/taskConstants'
import { validateTask } from '../utils/taskHelpers'

const PRIORITY_OPTIONS = [
  { value: PRIORITIES.HIGH,   label: 'High',   color: 'bg-rose-100 text-rose-700 ring-rose-200' },
  { value: PRIORITIES.MEDIUM, label: 'Medium', color: 'bg-amber-100 text-amber-700 ring-amber-200' },
  { value: PRIORITIES.LOW,    label: 'Low',    color: 'bg-sky-100 text-sky-700 ring-sky-200' },
]

const EMPTY_FORM = { title: '', description: '', priority: PRIORITIES.MEDIUM, dueDate: '' }

export default function TaskForm({ initialValues, onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || '',
        description: initialValues.description || '',
        priority: initialValues.priority || PRIORITIES.MEDIUM,
        dueDate: initialValues.dueDate || '',
      })
    }
  }, [initialValues])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function setPriority(p) {
    setForm((prev) => ({ ...prev, priority: p }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validateTask(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit(form)
  }

  const isEdit = Boolean(initialValues)
  const charCount = form.title.length

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      role="dialog" aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl animate-fade-in max-h-[95vh] overflow-y-auto">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">{isEdit ? 'Edit Task' : 'Create New Task'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{isEdit ? 'Update task details' : 'Fill in the details below'}</p>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700" htmlFor="title">
                Task title <span className="text-rose-500">*</span>
              </label>
              <span className={`text-xs ${charCount > 100 ? 'text-rose-500' : 'text-slate-400'}`}>
                {charCount}/120
              </span>
            </div>
            <input id="title" name="title" type="text" value={form.title} onChange={handleChange}
              placeholder="What needs to be done?" maxLength={120} autoFocus
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                errors.title
                  ? 'border-rose-300 bg-rose-50 focus:ring-rose-200'
                  : 'border-slate-200 bg-slate-50 focus:ring-indigo-200 focus:border-indigo-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1" role="alert">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="description">
              Description <span className="text-slate-400 font-normal text-xs">(optional)</span>
            </label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange}
              placeholder="Add more context or details…" rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition resize-none"
            />
          </div>

          {/* Priority — visual toggle */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITY_OPTIONS.map((opt) => (
                <button type="button" key={opt.value} onClick={() => setPriority(opt.value)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border-2 transition-all ${
                    form.priority === opt.value
                      ? `${opt.color} ring-1 border-current scale-105 shadow-sm`
                      : 'border-slate-100 text-slate-500 bg-slate-50 hover:border-slate-200'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="dueDate">
              Due date <span className="text-slate-400 font-normal text-xs">(optional)</span>
            </label>
            <div className="relative">
              <input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                  errors.dueDate
                    ? 'border-rose-300 bg-rose-50 focus:ring-rose-200'
                    : 'border-slate-200 bg-slate-50 focus:ring-indigo-200 focus:border-indigo-300'
                }`}
              />
            </div>
            {errors.dueDate && (
              <p className="mt-1.5 text-xs text-rose-500" role="alert">{errors.dueDate}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200">
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
