import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { createTask } from '../../api/taskApi'

const initialFormData = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
}

function TaskForm({ onTaskCreated }) {
  const [formData, setFormData] = useState(initialFormData)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  // Handles successful task creation side effects
  const handleSuccess = (task) => {
    setFormData(initialFormData)
    // Ensure callback runs after successful creation
    if (onTaskCreated) {
      onTaskCreated(task)
    }
    toast.success('Task created successfully!')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // handle empty string for dueDate
      const taskPayload = {
        ...formData,
        dueDate: formData.dueDate ? formData.dueDate : undefined,
      }
      const task = await createTask(taskPayload)
      // Make sure success side effects complete before submitting is set to false
      handleSuccess(task)
    } catch (apiError) {
      const errorMsg =
        apiError.response?.data?.message || 'Unable to create task. Please try again.'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/60"
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-xl font-bold text-stone-950">Create task</h2>
        <p className="mt-1 text-sm text-stone-600">
          Add a focused task to your workspace.
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">
          {error}
        </p>
      )}

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-stone-800" htmlFor="task-title">
          Title
        </label>
        <input
          className="min-h-11 rounded-md border border-stone-300 bg-white px-3 text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
          id="task-title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-2">
        <label
          className="text-sm font-semibold text-stone-800"
          htmlFor="task-description"
        >
          Description
        </label>
        <textarea
          className="min-h-28 resize-y rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
          id="task-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-2">
        <label
          className="text-sm font-semibold text-stone-800"
          htmlFor="task-priority"
        >
          Priority
        </label>
        <select
          className="min-h-11 rounded-md border border-stone-300 bg-white px-3 text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
          id="task-priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label
          className="text-sm font-semibold text-stone-800"
          htmlFor="task-dueDate"
        >
          Due Date
        </label>
        <input
          className="min-h-11 rounded-md border border-stone-300 bg-white px-3 text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
          id="task-dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      <button
        className="min-h-11 rounded-md bg-emerald-700 px-4 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-stone-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Creating task...' : 'Create task'}
      </button>
    </form>
  )
}

export default TaskForm
