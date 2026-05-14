import TaskCard from './TaskCard'

function TaskList({ tasks = [], onDelete, onComplete }) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return null
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onDelete={onDelete ? () => onDelete(task._id) : undefined}
          onComplete={
            onComplete &&
            !['completed', 'done'].includes((task.status || '').toLowerCase())
              ? () => onComplete(task._id)
              : undefined
          }
        />
      ))}
    </div>
  )
}

export default TaskList