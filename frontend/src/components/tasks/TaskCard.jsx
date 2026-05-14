import React, { useState } from 'react';
import { updateTask } from "../../api/taskApi"; // Assumes this API exists

const getPriorityClass = (priority = '') => {
  const normalizedPriority = priority.toLowerCase()

  if (normalizedPriority === 'high') {
    return 'bg-rose-100 text-rose-800'
  }

  if (normalizedPriority === 'medium') {
    return 'bg-amber-100 text-amber-800'
  }

  return 'bg-emerald-50 text-emerald-800'
}

const getStatusClass = (status = '') => {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus === 'completed' || normalizedStatus === 'done') {
    return 'bg-emerald-50 text-emerald-800'
  }

  if (normalizedStatus === 'in progress') {
    return 'bg-sky-100 text-sky-800'
  }

  return 'bg-stone-100 text-stone-700'
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
        'relative rounded-lg border border-stone-200 bg-white p-4 sm:p-5 shadow-sm shadow-stone-200/60',
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
                className="block w-full rounded border border-stone-300 px-3 py-2 text-xl font-bold text-stone-950 focus:border-blue-400 focus:ring-blue-400 truncate"
                value={editValues.title}
                onChange={handleChange}
                required
                placeholder="Title"
                maxLength={120}
              />
              <textarea
                name="description"
                className="block w-full rounded border border-stone-300 px-3 py-2 text-stone-700 focus:border-blue-400 focus:ring-blue-400 resize-none"
                value={editValues.description}
                onChange={handleChange}
                placeholder="Description"
                rows={2}
                maxLength={500}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  name="priority"
                  className="rounded border px-2 py-1 text-sm focus:border-blue-400 focus:ring-blue-400 truncate"
                  value={editValues.priority}
                  onChange={handleChange}
                >
                  {PRIORITY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  name="status"
                  className="rounded border px-2 py-1 text-sm focus:border-blue-400 focus:ring-blue-400 truncate"
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
                  <span className="inline-flex items-center rounded px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium truncate">
                    Due: <span className="ml-1 font-semibold">{formattedDueDate}</span>
                  </span>
                </div>
              )}
              {error && (
                <div className="text-rose-600 text-sm">{error}</div>
              )}
              <div className="mt-2 flex flex-col xs:flex-row gap-2 w-full">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full xs:w-auto bg-emerald-700 text-white px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  className="w-full xs:w-auto bg-stone-200 text-stone-700 px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="mb-2 text-xl font-bold text-stone-950 truncate" title={title}>{title}</h2>
              <p className="text-stone-600 whitespace-pre-line break-words text-sm sm:text-base overflow-hidden">{description ? description : 'No description provided.'}</p>
              {formattedDueDate && (
                <div className="mt-3">
                  <span className="inline-flex items-center rounded px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium truncate">
                    Due: <span className="ml-1 font-semibold">{formattedDueDate}</span>
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row md:gap-2 md:justify-end md:items-center mt-4 md:mt-0">
          {editing ? null : (
            <div className="flex flex-row flex-wrap gap-2 w-full md:w-auto md:flex-nowrap">
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
              <button
                type="button"
                className="w-full md:w-auto mt-2 md:mt-0 inline-flex justify-center items-center bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                onClick={handleEditClick}
                aria-label="Edit Task"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
      {onDelete && (
        <button
          className="absolute left-4 right-4 top-auto bottom-4 md:top-4 md:bottom-auto md:right-4 md:left-auto bg-rose-600 text-white px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400 transition
          w-full md:w-auto"
          type="button"
          onClick={onDelete}
          aria-label="Delete Task"
        >
          Delete
        </button>
      )}
      {onComplete && !isCompleted && !editing && (
        <button
          className="absolute left-4 right-4 bottom-4 md:left-auto md:right-4 bg-emerald-700 text-white px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition
          w-full md:w-auto"
          type="button"
          onClick={onComplete}
          aria-label="Mark Complete"
        >
          Mark Complete
        </button>
      )}
    </article>
  )
}

export default TaskCard
