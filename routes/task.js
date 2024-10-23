const express = require("express");
const routes = express.Router(); // Create an instance of the router
const {
  createTask,
  viewTasks,
  viewTasksByCategory,
  updateTask,
  deleteTask,
  deleteAllTasks,
  updateTaskStatus,
} = require("../controllers/task"); // Import controller functions
const {
  loginVerify,
  logoutVerify,
  superAdminVerify,
} = require("../middlewares/verify");

// route to create task
routes.post("/create-task", loginVerify, createTask);
// route to view tasks of user
routes.get("/view-tasks", loginVerify, viewTasks);
// route to view tasks of user by category
routes.get("/view-tasks-by-category", loginVerify, viewTasksByCategory);
// route to update tasks of user
routes.put("/update-task", loginVerify, updateTask);
// route to update task status of user
routes.put("/update-task-status", loginVerify, updateTaskStatus);
// route to delete task of user
routes.delete("/delete-task", loginVerify, deleteTask);
// route to delete every task in the DataBase (Super Admin Access)
routes.delete(
  "/delete-all-tasks",
  loginVerify,
  superAdminVerify,
  deleteAllTasks
);

// Export the router to be used in other parts of the application
module.exports = routes;
