import React, { useState } from 'react';
import { updateTask } from "../../api/taskApi"; // Assumes this API exists

const getPriorityClass = (priority = '') => {
  const normalizedPriority = priority.toLowerCase()

  if (normalizedPriority === 'high') {
    return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100'
  }

  if (normalizedPriority === 'medium') {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
  }

  return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
}

const getStatusClass = (status = '') => {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus === 'completed' || normalizedStatus === 'done') {
    return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
  }

  if (normalizedStatus === 'in progress') {
    return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100'
  }

  return 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
}

const formatLabel = (value) => {
  if (!value) {
    return 'Pending'
  }

  return value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Util: Format the due date professionally (e.g., Mar 18, 2024)
const formatDueDate = (dueDate) => {
  if (!dueDate) return ''

  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  if (isNaN(dateObj)) return ''
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const PRIORITY_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]
const STATUS_OPTIONS = [
  { value: '', label: 'Pending' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'done', label: 'Done' },
]

function TaskCard({ task, className = '', onDelete, onComplete, onUpdate }) {
  const { id, title, description, priority, status, dueDate } = task
  const normalizedStatus = status ? status.toLowerCase() : ''
  const isCompleted = normalizedStatus === 'completed' || normalizedStatus === 'done'
  const formattedDueDate = dueDate ? formatDueDate(dueDate) : null

  const [editing, setEditing] = useState(false)
  const [editValues, setEditValues] = useState({
    title: title || '',
    description: description || '',
    priority: priority || '',
    status: status || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleEditClick = () => {
    setEditValues({
      title: title || '',
      description: description || '',
      priority: priority || '',
      status: status || '',
    })
    setEditing(true)
    setError('')
  }

  const handleCancel = () => {
    setEditing(false)
    setError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateTask(id, editValues)
      setEditing(false)
      setSaving(false)
      if (onUpdate) onUpdate()
    } catch (err) {
      setSaving(false)
      setError('Failed to update task. Please try again.')
    }
  }

  return (
    <article
      className={[
        // Responsive padding, space, and positioning
        'relative rounded-lg border border-stone-200 bg-white dark:bg-stone-900 p-4 sm:p-5 shadow-sm shadow-stone-200/60 dark:shadow-stone-900/30',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-4 md:items-start md:justify-between">
        <div className="flex-1 min-w-0 break-words">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-3">
              <input
                name="title"
                className="block w-full rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-xl font-bold text-stone-950 dark:text-white focus:border-blue-400 focus:ring-blue-400 truncate"
                value={editValues.title}
                onChange={handleChange}
                required
                placeholder="Title"
                maxLength={120}
              />
              <textarea
                name="description"
                className="block w-full rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-stone-700 dark:text-stone-200 focus:border-blue-400 focus:ring-blue-400 resize-none"
                value={editValues.description}
                onChange={handleChange}
                placeholder="Description"
                rows={2}
                maxLength={500}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  name="priority"
                  className="rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-2 py-1 text-sm dark:text-stone-200 focus:border-blue-400 focus:ring-blue-400 truncate"
                  value={editValues.priority}
                  onChange={handleChange}
                >
                  {PRIORITY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  name="status"
                  className="rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-2 py-1 text-sm dark:text-stone-200 focus:border-blue-400 focus:ring-blue-400 truncate"
                  value={editValues.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {formattedDueDate && (
                <div>
                  <span className="inline-flex items-center rounded px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium truncate">
                    Due: <span className="ml-1 font-semibold">{formattedDueDate}</span>
                  </span>
                </div>
              )}
              {error && (
                <div className="text-rose-600 dark:text-rose-400 text-sm">{error}</div>
              )}
              <div className="mt-2 flex flex-col xs:flex-row gap-2 w-full">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full xs:w-auto bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-800 dark:hover:bg-emerald-700 px-4 py-2 rounded-md text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-emerald-400 transition min-h-[40px]"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  className="w-full xs:w-auto bg-stone-200 hover:bg-stone-300 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-100 px-4 py-2 rounded-md text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-stone-400 transition min-h-[40px]"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="mb-2 text-xl font-bold text-stone-950 dark:text-white truncate" title={title}>{title}</h2>
              <p className="text-stone-600 dark:text-stone-300 whitespace-pre-line break-words text-sm sm:text-base overflow-hidden">{description ? description : 'No description provided.'}</p>
              {formattedDueDate && (
                <div className="mt-3">
                  <span className="inline-flex items-center rounded px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium truncate">
                    Due: <span className="ml-1 font-semibold">{formattedDueDate}</span>
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action & Status section */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto md:flex-nowrap md:justify-end md:items-center mt-4 md:mt-0">
          {editing ? null : (
            <>
              {/* Priority & Status Badges */}
              <span
                className={`inline-flex min-h-8 items-center rounded-full px-3 text-sm font-bold max-w-full truncate ${getPriorityClass(
                  priority,
                )}`}
                title={formatLabel(priority)}
              >
                {formatLabel(priority)}
              </span>
              <span
                className={`inline-flex min-h-8 items-center rounded-full px-3 text-sm font-bold max-w-full truncate ${getStatusClass(
                  status,
                )}`}
                title={formatLabel(status)}
              >
                {formatLabel(status)}
              </span>
              {/* Edit Button */}
              <button
                type="button"
                className="min-h-[40px] flex-1 md:flex-none grow-0 shrink-0 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                onClick={handleEditClick}
                aria-label="Edit Task"
              >
                Edit
              </button>
              {/* Responsive Delete/Complete Buttons */}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  aria-label="Delete Task"
                  className="min-h-[40px] flex-1 md:flex-none grow-0 shrink-0 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600 px-4 py-2 rounded-md text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                >
                  Delete
                </button>
              )}
              {onComplete && !isCompleted && (
                <button
                  type="button"
                  onClick={onComplete}
                  aria-label="Mark Complete"
                  className="min-h-[40px] flex-1 md:flex-none grow-0 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600 px-4 py-2 rounded-md text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                >
                  Mark Complete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default TaskCard
