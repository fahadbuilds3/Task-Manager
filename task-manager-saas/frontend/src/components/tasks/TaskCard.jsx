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

function TaskCard({ task, className = '', onDelete, onComplete }) {
  const { title, description, priority, status } = task
  const normalizedStatus = status ? status.toLowerCase() : ''
  const isCompleted = normalizedStatus === 'completed' || normalizedStatus === 'done'

  return (
    <article
      className={[
        'relative rounded-lg border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/60',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="mb-2 text-xl font-bold text-stone-950">{title}</h2>
          <p className="text-stone-600">
            {description || 'No description provided.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          <span
            className={`inline-flex min-h-8 items-center rounded-full px-3 text-sm font-bold ${getPriorityClass(
              priority,
            )}`}
          >
            {formatLabel(priority)}
          </span>
          <span
            className={`inline-flex min-h-8 items-center rounded-full px-3 text-sm font-bold ${getStatusClass(
              status,
            )}`}
          >
            {formatLabel(status)}
          </span>
        </div>
      </div>
      {onDelete && (
        <button
          className="absolute top-4 right-4 bg-rose-600 text-white px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
          type="button"
          onClick={onDelete}
          aria-label="Delete Task"
        >
          Delete
        </button>
      )}
      {onComplete && !isCompleted && (
        <button
          className="absolute bottom-4 right-4 bg-emerald-700 text-white px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
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
