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
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'completed'

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const fetchTasks = async () => {
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
      await fetchTasks()
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
      await fetchTasks()
    } catch (apiError) {
      setError(
        apiError.response?.data?.message ||
          'Unable to update task. Please try again.'
      )
    } finally {
      setUpdatingTaskId(null)
    }
  }

  useEffect(() => {
    fetchTasks()
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

  // Filter tasks based on current filter
  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks
    if (filter === 'completed') {
      return tasks.filter(task => {
        const status = task.status?.toLowerCase()
        return status === 'completed' || status === 'done'
      })
    }
    // pending
    return tasks.filter(task => {
      const status = task.status?.toLowerCase()
      return status !== 'completed' && status !== 'done'
    })
  }, [tasks, filter])

  // Filter button styling
  const filterButtonClass = (btn) =>
    `px-4 py-2 rounded-md font-semibold text-sm border transition 
     ${
       filter === btn
         ? 'bg-stone-900 text-white border-stone-900 shadow'
         : 'bg-white text-stone-800 border-stone-200 hover:bg-amber-50'
     }
     focus:outline-none focus:ring-2 focus:ring-amber-300`

  return (
    <section className="grid gap-6" aria-labelledby="dashboard-title">
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Logout Button Top-Right */}
        <button
          className="absolute top-0 right-0 mt-2 mr-2 rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-300"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-normal text-amber-700">
            Workspace
          </p>
          <h1 id="dashboard-title" className="text-3xl font-bold text-stone-950">
            Dashboard
          </h1>
        </div>
        <button
          className="min-h-11 rounded-md bg-emerald-700 px-5 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          type="button"
        >
          New task
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="grid min-h-28 content-center gap-2 rounded-lg border border-stone-200 bg-white p-5">
          <span className="text-stone-600">Total</span>
          <strong className="text-4xl text-stone-950">{stats.total}</strong>
        </article>
        <article className="grid min-h-28 content-center gap-2 rounded-lg border border-stone-200 bg-white p-5">
          <span className="text-stone-600">Pending</span>
          <strong className="text-4xl text-stone-950">{stats.pending}</strong>
        </article>
        <article className="grid min-h-28 content-center gap-2 rounded-lg border border-stone-200 bg-white p-5">
          <span className="text-stone-600">Completed</span>
          <strong className="text-4xl text-stone-950">{stats.completed}</strong>
        </article>
      </div>

      <TaskForm onTaskCreated={fetchTasks} />

      {/* Task Filter Buttons */}
      <div className="flex flex-wrap gap-2">
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

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-8" aria-label="Loading tasks">
          <span className="text-stone-700 text-base font-semibold">Loading...</span>
          <div className="grid gap-3 w-full">
            {[1, 2, 3].map((item) => (
              <article
                className="min-h-[132px] animate-pulse rounded-lg border border-stone-200 bg-white p-5"
                key={item}
              >
                <div className="mb-4 h-5 w-2/5 rounded bg-stone-200" />
                <div className="mb-6 h-4 w-4/5 rounded bg-stone-100" />
                <div className="flex gap-2">
                  <div className="h-8 w-24 rounded-full bg-stone-100" />
                  <div className="h-8 w-24 rounded-full bg-stone-100" />
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 text-center">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && filteredTasks.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
          <h2 className="mb-2 text-xl font-bold text-stone-950">No tasks yet</h2>
          <p className="text-stone-600">
            {tasks.length === 0
              ? 'Your tasks will appear here once you create them.'
              : 'No tasks found for this filter.'}
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
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition bg-rose-600 text-white px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
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
                    className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition bg-emerald-600 text-white px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
