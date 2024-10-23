// Import necessary modules for user authentication and management
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Function to handle user registration
const register = async (req, res) => {
  try {
    const { username, password, email, gender } = req.body;

    // Check if the email already exists in the database
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        message: `Sorry, the email ${email} is already in use. Please use a different one.`,
      });
    }

    // Check if the username already exists in the database
    const usernameExists = await userModel.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({
        message: `Sorry, the username ${username} is already taken. Please choose another one.`,
      });
    }

    // Hash the password before saving the user
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user instance with hashed password and other data
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      gender,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Send a success response with the saved user data
    res.status(200).json({
      message: "Account created successfully",
      user: savedUser,
    });
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Function to handle user login
const login = async (req, res) => {
  try {
    const { password, email } = req.body;

    // Check if the user exists in the database
    const userInfo = await userModel.findOne({ email });
    if (!userInfo) {
      return res
        .status(400)
        .json({ message: "User not found, register your account" });
    }

    // Compare the provided password with the hashed password in the database
    const verify = bcrypt.compareSync(password, userInfo.password);
    if (!verify) {
      return res.status(400).json({ message: "Password does not match" });
    }

    // Create a JWT token with user details
    const aboutUser = {
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      role: userInfo.role,
      password: userInfo.password,
    };

    // Sign the token using a secret and store it in a cookie
    const token = jwt.sign(aboutUser, process.env.JWT_SECRET);
    res.cookie("user_token", token);

    // Send a success response
    res.status(200).json({
      message: `Welcome ${userInfo.username}, you are now logged in`,
    });
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Function to handle user logout
const logout = async (req, res) => {
  const { username } = req.user;
  try {
    // Clear the user token from the cookies and send a success response
    res
      .clearCookie("user_token")
      .status(200)
      .json({ message: `Logged out ${username} successfully` });
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Export the register, login, and logout functions
module.exports = { register, login, logout };
