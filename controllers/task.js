const taskModel = require("../models/task");

const createTask = async (req, res) => {
  try {
    {
      const { title, description, category, deadline, ...others } = req.body;
      const newTask = new taskModel({
        title,
        description,
        category,
        deadline,
        ...others,
      });
    }
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    res.status(500).json({ message: error.message });
  }
};
