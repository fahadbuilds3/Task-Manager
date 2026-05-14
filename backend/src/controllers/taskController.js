const Task = require("../models/Task");

const getUserId = (req) => req.user?._id || req.user?.id;

const getTaskPayload = (body = {}) => {
  const allowedFields = [
    "title",
    "description",
    "status",
    "priority",
    "dueDate",
  ];
  const payload = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
  });

  return payload;
};

const handleTaskError = (res, error, fallbackMessage) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid task id" });
  }

  return res.status(500).json({
    message: fallbackMessage,
    error: error.message,
  });
};

const createTask = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const taskData = getTaskPayload(req.body);

    if (!taskData.title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      ...taskData,
      user: userId,
    });

    return res.status(201).json(task);
  } catch (error) {
    return handleTaskError(res, error, "Failed to create task");
  }
};

const getTasks = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json(tasks);
  } catch (error) {
    return handleTaskError(res, error, "Failed to get tasks");
  }
};

const updateTask = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updateData = getTaskPayload(req.body);

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    return handleTaskError(res, error, "Failed to update task");
  }
};

const deleteTask = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return handleTaskError(res, error, "Failed to delete task");
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
