const taskModel = require("../models/task");
const { use } = require("../routes/auth");

const createTask = async (req, res) => {
  try {
    {
      const { title, description, category, deadline, taskOwner, ...others } =
        req.body;
      const { username } = req.user;
      const newTask = new taskModel({
        title,
        description,
        category,
        deadline,
        taskOwner: username,
        others,
      });

      // save task in Database
      newTask.save();

      res.status(200).json({
        message: `Hey ${username} you have successfully created a new task`,
      });
    }
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    res.status(500).json({ message: error.message });
  }
};

const viewTasks = async (req, res) => {
  try {
    const { username } = req.user;

    const tasks = await taskModel.find({ taskOwner: username });
    // Return the tasks to the client
    return res.status(200).json({ tasks });
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    res.status(500).json({ message: error.message });
  }
};

const viewTasksByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const { username } = req.user;

    const tasks = await taskModel.find({ category, taskOwner: username });
    // Return the tasks to the client
    return res.status(200).json({ tasks });
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { status, ...others } = req.body;
    const { taskId } = req.query;
    const { username } = req.user; // Get username from the request user object

    // Find the task to be updated by its ID
    const taskInfo = await taskModel.findById(taskId);

    // If the tatsk doesn't exist, send a 400 error response
    if (!taskInfo) {
      return res
        .status(400)
        .json({ message: "Sorry, this task does not exist" });
    }

    // Ensure the task belongs to the user making the request
    if (taskInfo.taskOwner !== username) {
      return res.status(400).json({
        message: `Hey ${username} You do not have permission to edit this task`,
      });
    }
    await taskModel.findByIdAndUpdate(taskId, { ...others });
    return res.status(200).json({
      message: `Hey ${username} you have successfully updated your task`,
    });
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.query;
    const { username } = req.user; // Get username from the request user object

    // Find the task to be updated by its ID
    const taskInfo = await taskModel.findById(taskId);

    // If the tatsk doesn't exist, send a 400 error response
    if (!taskInfo) {
      return res
        .status(400)
        .json({ message: "Sorry, this task does not exist" });
    }

    // Ensure the task belongs to the user making the request
    if (taskInfo.taskOwner !== username) {
      return res.status(400).json({
        message: `Hey ${username} You do not have permission to delete this task`,
      });
    }
    await taskModel.findByIdAndDelete(taskId);
    return res.status(200).json({
      message: `Hey ${username} you have successfully deleted your task`,
    });
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    res.status(500).json({ message: error.message });
  }
};
// Delete all tasks from the database (Super Admin Access Only)
const deleteAllTasks = async (req, res) => {
  try {
    await postModel.deleteMany({}); // Delete all users
    res.status(200).json({
      message: `You have successfully deleted every Post in this application`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle server error
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.query;
    const { username } = req.user; // Get username from the request user object

    // Find the task to be updated by its ID
    const taskInfo = await taskModel.findById(taskId);

    // If the tatsk doesn't exist, send a 400 error response
    if (!taskInfo) {
      return res
        .status(400)
        .json({ message: "Sorry, this task does not exist" });
    }

    // Ensure the task belongs to the user making the request
    if (taskInfo.taskOwner !== username) {
      return res.status(400).json({
        message: `Hey ${username} You do not have permission to edit this task`,
      });
    }
    if (taskInfo.status === "complete") {
      const updatedTask = await taskModel.findByIdAndUpdate(taskId, {
        status: "incomplete",
      });
      return res.status(200).json({
        message: `Hey ${username} your task is incomplete`,
      });
    } else {
      const updatedTask = await taskModel.findByIdAndUpdate(taskId, {
        status: "complete",
      });
      return res.status(200).json({
        message: `Hey ${username} your task is complete`,
      });
    }
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  viewTasks,
  viewTasksByCategory,
  updateTask,
  deleteTask,
  deleteAllTasks,
  updateTaskStatus,
};
