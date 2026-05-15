import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getTasks, deleteTask, updateTask } from '../api/taskApi'
import TaskCard from '../components/tasks/TaskCard'
import TaskForm from '../components/tasks/TaskForm'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingTaskId, setDeletingTaskId] = useState(null)
  const [updatingTaskId, setUpdatingTaskId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showTaskForm, setShowTaskForm] = useState(false)

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const onUpdate = async () => {
    setIsLoading(true)
    setError('')
    try {
      const taskData = await getTasks()
      setTasks(taskData)
    } catch (apiError) {
      setError(
        apiError.response?.data?.message ||
        'Unable to load tasks. Please try again.'
      )
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    setDeletingTaskId(taskId)
    try {
      setError('')
      await deleteTask(taskId)
      await onUpdate()
    } catch (apiError) {
      setError(
        apiError.response?.data?.message ||
        'Unable to delete task. Please try again.'
      )
    } finally {
      setDeletingTaskId(null)
    }
  }

  const handleMarkComplete = async (taskId) => {
    setUpdatingTaskId(taskId)
    try {
      setError('')
      await updateTask(taskId, { status: 'completed' })
      await onUpdate()
    } catch (apiError) {
      setError(
        apiError.response?.data?.message ||
        'Unable to update task. Please try again.'
      )
    } finally {
      setUpdatingTaskId(null)
    }
  }

  // Handler for successful task creation to close the form and update list
  const handleTaskCreated = async () => {
    await onUpdate()
    setShowTaskForm(false)
  }

  useEffect(() => {
    onUpdate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stats = useMemo(() => {
    const completedTasks = tasks.filter((task) => {
      const status = task.status?.toLowerCase()
      return status === 'completed' || status === 'done'
    }).length

    return {
      total: tasks.length,
      pending: tasks.length - completedTasks,
      completed: completedTasks,
    }
  }, [tasks])

  const filteredTasks = useMemo(() => {
    let filtered = tasks
    if (filter === 'completed') {
      filtered = filtered.filter(task => {
        const status = task.status?.toLowerCase()
        return status === 'completed' || status === 'done'
      })
    } else if (filter === 'pending') {
      filtered = filtered.filter(task => {
        const status = task.status?.toLowerCase()
        return status !== 'completed' && status !== 'done'
      })
    }
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.trim().toLowerCase()
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(lowerSearch)
      )
    }
    return filtered
  }, [tasks, filter, searchTerm])

  // Responsive filter button styling
  const filterButtonClass = (btn) =>
    `px-3 md:px-4 py-2 rounded-md font-semibold text-xs md:text-sm border transition
     ${filter === btn
      ? 'bg-stone-900 text-white border-stone-900 shadow'
      : 'bg-white text-stone-800 border-stone-200 hover:bg-amber-50'}
     focus:outline-none focus:ring-2 focus:ring-amber-300`

  return (
    <section className="flex flex-col gap-6 px-2 sm:px-4 md:px-8 py-4 max-w-3xl md:max-w-5xl mx-auto w-full" aria-labelledby="dashboard-title">
      {/* Header Section */}
      <div className="relative flex flex-col gap-6 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Logout Button Top-Right */}
        <button
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition duration-200 shadow-sm dark:bg-emerald-500 dark:hover:bg-emerald-600"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
        <div>
          <p className="mb-1 text-xs md:text-sm font-bold uppercase tracking-normal text-amber-700">
            Workspace
          </p>
          <h1 id="dashboard-title" className="text-2xl md:text-3xl font-bold text-stone-950">
            Dashboard
          </h1>
        </div>
        <button
          className="min-h-11 rounded-md bg-emerald-700 px-4 md:px-5 py-2 font-semibold text-xs md:text-sm text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 w-full sm:w-auto"
          type="button"
          onClick={() => setShowTaskForm(v => !v)}
        >
          {showTaskForm ? "Close" : "New task"}
        </button>
      </div>

      {/* Stats Cards: Responsive grid */}
      <div className="grid gap-3 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 w-full">
        <article className="flex flex-col min-h-24 items-center justify-center gap-1 rounded-lg border border-stone-200 bg-white py-5 px-2 text-center">
          <span className="text-stone-600 text-sm md:text-base">Total</span>
          <strong className="text-3xl md:text-4xl text-stone-950">{stats.total}</strong>
        </article>
        <article className="flex flex-col min-h-24 items-center justify-center gap-1 rounded-lg border border-stone-200 bg-white py-5 px-2 text-center">
          <span className="text-stone-600 text-sm md:text-base">Pending</span>
          <strong className="text-3xl md:text-4xl text-stone-950">{stats.pending}</strong>
        </article>
        <article className="flex flex-col min-h-24 items-center justify-center gap-1 rounded-lg border border-stone-200 bg-white py-5 px-2 text-center">
          <span className="text-stone-600 text-sm md:text-base">Completed</span>
          <strong className="text-3xl md:text-4xl text-stone-950">{stats.completed}</strong>
        </article>
      </div>

      {/* Responsive Task Form, only show if showTaskForm is true */}
      {showTaskForm && (
        <div className="w-full max-w-full md:max-w-lg mx-auto flex flex-col gap-2">
          <TaskForm onUpdate={handleTaskCreated} />
          <button
            type="button"
            className="mt-1 self-end px-4 py-2 rounded-md bg-stone-200 text-stone-800 hover:bg-stone-300 text-xs md:text-sm font-semibold transition border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-300"
            onClick={() => setShowTaskForm(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Filter/Search Controls: stack vertically on mobile */}
      <div className="flex flex-col md:flex-row md:justify-between gap-3 items-stretch md:items-end">
        {/* Task Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-1">
          <button
            type="button"
            className={filterButtonClass('all')}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={filterButtonClass('pending')}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            type="button"
            className={filterButtonClass('completed')}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        {/* Task Search Input */}
        <div className="w-full md:w-80">
          <input
            type="text"
            className="w-full px-4 py-2 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-xs md:text-sm"
            placeholder="Search tasks by title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-8" aria-label="Loading tasks">
          <span className="text-stone-700 text-base font-semibold">Loading...</span>
          <div className="grid gap-3 w-full">
            {[1, 2, 3].map((item) => (
              <article
                className="min-h-[112px] md:min-h-[132px] animate-pulse rounded-lg border border-stone-200 bg-white p-4 md:p-5"
                key={item}
              >
                <div className="mb-3 h-4 md:h-5 w-2/5 rounded bg-stone-200" />
                <div className="mb-5 md:mb-6 h-3 md:h-4 w-4/5 rounded bg-stone-100" />
                <div className="flex gap-2">
                  <div className="h-7 md:h-8 w-20 md:w-24 rounded-full bg-stone-100" />
                  <div className="h-7 md:h-8 w-20 md:w-24 rounded-full bg-stone-100" />
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-2 md:px-4 py-3 text-xs md:text-sm font-semibold text-rose-800 text-center">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && filteredTasks.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-5 md:p-8 text-center">
          <h2 className="mb-2 text-lg md:text-xl font-bold text-stone-950">No tasks yet</h2>
          <p className="text-stone-600 text-sm md:text-base">
            {tasks.length === 0
              ? 'Your tasks will appear here once you create them.'
              : (searchTerm.trim() !== '' 
                ? 'No tasks found matching your search.' 
                : 'No tasks found for this filter.')}
          </p>
        </div>
      )}

      {/* Tasks list */}
      {!isLoading && !error && filteredTasks.length > 0 && (
        <div className="grid gap-3">
          {filteredTasks.map((task) => {
            const status = task.status?.toLowerCase()
            const isCompleted = status === 'completed' || status === 'done'
            return (
              <div key={task._id} className="relative group">
                <TaskCard task={task} />
                {/* Delete button */}
                <button
                  className="absolute top-3 md:top-4 right-3 md:right-4 opacity-0 group-hover:opacity-100 transition bg-rose-600 text-white px-3 py-1 rounded-md text-xs md:text-sm font-semibold shadow hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  type="button"
                  onClick={() => handleDelete(task._id)}
                  disabled={deletingTaskId === task._id}
                  aria-label="Delete Task"
                >
                  {deletingTaskId === task._id ? 'Deleting...' : 'Delete'}
                </button>
                {/* Mark Complete button - show only if task is not completed */}
                {!isCompleted && (
                  <button
                    className="absolute top-3 md:top-4 left-3 md:left-4 opacity-0 group-hover:opacity-100 transition bg-emerald-600 text-white px-3 py-1 rounded-md text-xs md:text-sm font-semibold shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    type="button"
                    onClick={() => handleMarkComplete(task._id)}
                    disabled={updatingTaskId === task._id}
                    aria-label="Mark Complete"
                  >
                    {updatingTaskId === task._id ? 'Updating...' : 'Mark Complete'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Dashboard
