import React, { useState } from "react";
import { updateTask } from "../../api/taskApi";

const getPriorityClass = (priority = "") => {
  const normalizedPriority = priority.toLowerCase();
  if (normalizedPriority === "high") {
    return "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100";
  }
  if (normalizedPriority === "medium") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100";
  }
  return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100";
};

const getStatusClass = (status = "") => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === "completed" || normalizedStatus === "done") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100";
  }
  if (normalizedStatus === "in progress") {
    return "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-100";
  }
  return "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300";
};

const formatLabel = (value) => {
  if (!value) return "Pending";
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDueDate = (dueDate) => {
  if (!dueDate) return "";
  const dateObj = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  if (isNaN(dateObj)) return "";
  return dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const PRIORITY_OPTIONS = [
  { value: "", label: "Select" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
const STATUS_OPTIONS = [
  { value: "", label: "Pending" },
  { value: "in progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "done", label: "Done" },
];

function TaskCard({ task, className = "", onDelete, onComplete, onUpdate }) {
  const { id, title, description, priority, status, dueDate } = task;
  const normalizedStatus = status ? status.toLowerCase() : "";
  const isCompleted =
    normalizedStatus === "completed" || normalizedStatus === "done";
  const formattedDueDate = dueDate ? formatDueDate(dueDate) : null;

  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    title: title || "",
    description: description || "",
    priority: priority || "",
    status: status || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleEditClick = () => {
    setEditValues({
      title: title || "",
      description: description || "",
      priority: priority || "",
      status: status || "",
    });
    setEditing(true);
    setError("");
  };

  const handleCancel = () => {
    setEditing(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateTask(id, editValues);
      setEditing(false);
      setSaving(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      setSaving(false);
      setError("Failed to update task. Please try again.");
    }
  };

  return (
    <article
      className={[
        // Modern SaaS/Notion card styling
        "relative rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 px-5 py-6 transition-shadow shadow group",
        "hover:shadow-2xl hover:shadow-blue-100/40 dark:hover:shadow-blue-950/20 duration-200",
        "shadow-stone-100 dark:shadow-stone-900",
        "flex flex-col gap-4 min-w-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      tabIndex={0}
      style={{
        outline: "none",
      }}
    >
      {/* Editing Form */}
      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Title row */}
          <input
            name="title"
            className="block w-full rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-lg font-semibold text-stone-900 dark:text-white focus:border-blue-400 focus:ring-blue-200 focus:ring-2 outline-none truncate"
            value={editValues.title}
            onChange={handleChange}
            required
            placeholder="Title"
            maxLength={120}
          />
          {/* Description */}
          <textarea
            name="description"
            className="block w-full rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-stone-600 dark:text-stone-300 focus:border-blue-400 focus:ring-blue-200 focus:ring-2 resize-none outline-none"
            value={editValues.description}
            onChange={handleChange}
            placeholder="Description"
            rows={2}
            maxLength={500}
          />
          {/* Priority/Status */}
          <div className="flex flex-col xs:flex-row gap-2 w-full">
            <select
              name="priority"
              className="rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-2 py-1 text-sm dark:text-stone-200 focus:border-blue-400 focus:ring-blue-200 focus:ring-2 truncate outline-none"
              value={editValues.priority}
              onChange={handleChange}
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              name="status"
              className="rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-2 py-1 text-sm dark:text-stone-200 focus:border-blue-400 focus:ring-blue-200 focus:ring-2 truncate outline-none"
              value={editValues.status}
              onChange={handleChange}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {/* Due date */}
          {formattedDueDate && (
            <div>
              <span className="inline-flex items-center rounded-md px-2 py-0.5 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-200 text-xs font-medium tracking-wide truncate border border-slate-200 dark:border-slate-800">
                Due:
                <span className="ml-1 font-semibold">{formattedDueDate}</span>
              </span>
            </div>
          )}
          {/* Error message */}
          {error && (
            <div className="text-rose-600 dark:text-rose-400 text-sm">{error}</div>
          )}
          {/* Actions horizontally, right-aligned */}
          <div className="flex flex-row gap-2 justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600 px-4 py-2 rounded-md text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-800 transition disabled:opacity-70 disabled:cursor-wait"
              style={{ minWidth: 85 }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-100 px-4 py-2 rounded-md text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-700 transition"
              onClick={handleCancel}
              disabled={saving}
              style={{ minWidth: 85 }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* HEADER: Row: Title & Badges */}
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
            <div className="flex items-center min-w-0 gap-3">
              <h2
                className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-white truncate"
                title={title}
                style={{
                  letterSpacing: "-0.01em",
                  lineHeight: 1.18,
                }}
              >
                {title}
              </h2>
              {/* Badges: priority/status */}
              <div className="flex flex-row gap-2 items-center flex-shrink-0 ml-0 xs:ml-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold max-w-full truncate border border-transparent ${getPriorityClass(
                    priority
                  )}`}
                  title={formatLabel(priority)}
                  style={{ minWidth: 64, justifyContent: "center" }}
                >
                  {formatLabel(priority)}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold max-w-full truncate border border-transparent ${getStatusClass(
                    status
                  )}`}
                  title={formatLabel(status)}
                  style={{ minWidth: 80, justifyContent: "center" }}
                >
                  {formatLabel(status)}
                </span>
              </div>
            </div>
            {formattedDueDate && (
              <div className="ml-0 xs:ml-4 mt-1 xs:mt-0">
                <span className="inline-flex items-center rounded-md px-2 py-0.5 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-200 text-xs font-medium tracking-wide border border-slate-200 dark:border-slate-800 truncate">
                  <span className="hidden sm:inline">Due:</span>
                  <span className="ml-1 font-semibold">{formattedDueDate}</span>
                </span>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <p className="mt-2 text-stone-500 dark:text-stone-400 whitespace-pre-line break-words text-sm sm:text-base overflow-hidden min-h-[1.5rem]">
            {description ? description : "No description provided."}
          </p>

          {/* ACTIONS: bottom right, horizontally arranged, no oversized buttons */}
          <div className="flex flex-row items-center justify-end mt-4 gap-2 w-full select-none">
            {/* Edit btn */}
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-900 group/edit"
              onClick={handleEditClick}
              aria-label="Edit Task"
              style={{ minWidth: 64, fontWeight: 500 }}
            >
              {/* Edit Icon */}
              <svg width="16" height="16" fill="none" className="inline mr-1" viewBox="0 0 24 24"><path d="M5 19h14M15.305 5.417a2.145 2.145 0 0 1 3.032 3.032l-9.2 9.2-3.156.123.123-3.156 9.2-9.2Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
              Edit
            </button>
            {/* Mark Complete btn */}
            {onComplete && !isCompleted && (
              <button
                type="button"
                onClick={onComplete}
                aria-label="Mark Complete"
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-md shadow-sm text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-900"
                style={{ minWidth: 78 }}
              >
                <svg width="16" height="16" fill="none" className="inline mr-1" viewBox="0 0 24 24"><path d="M6 12.727l4.242 4.243 7.07-7.071" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
                Complete
              </button>
            )}
            {/* Delete btn */}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                aria-label="Delete Task"
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white rounded-md shadow-sm text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-900"
                style={{ minWidth: 64 }}
              >
                <svg width="16" height="16" fill="none" className="inline mr-1" viewBox="0 0 24 24"><path d="M6 7v13h12V7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/><path d="M3 7h18" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/></svg>
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </article>
  );
}

export default TaskCard;
