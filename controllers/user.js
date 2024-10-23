const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Update UserInfo, Update PW, Delete User and Update Role

const updateUserInfo = async (req, res) => {
  try {
    const { updateUsername, updateEmail, updateGender } = req.body;
    const { user_token } = req.cookies;

    // Decode the existing JWT
    const decoded = jwt.verify(user_token, process.env.JWT_SECRET);

    // Find the user by email and update their username and gender
    const updatedUser = await userModel.findOneAndUpdate(
      { email: decoded.email },
      { email: updateEmail, username: updateUsername, gender: updateGender },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Update the decoded token info with the new data
    decoded.username = updatedUser.username;
    decoded.email = updatedUser.email;
    decoded.gender = updatedUser.gender;

    // Re-sign the updated token with the new info
    const token = jwt.sign(decoded, process.env.JWT_SECRET);
    res.cookie("user_token", token);

    // Send the updated user data as a response
    return res.status(200).json({ message: "User info updated", updatedUser });
  } catch (error) {
    // Log the error and send a 500 status response if something goes wron
    res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { password, email, username } = req.user;
    const { user_token } = req.cookies;

    // Decode the existing JWT
    const decoded = jwt.verify(user_token, process.env.JWT_SECRET);

    const verify = await bcrypt.compare(oldPassword, password);

    if (!verify) {
      return res.status(400).json({
        message: `Hey ${username} The old password you inputted is invalid!`,
      });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    const updatedPassword = await userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    // Update the decoded token info with the new data
    decoded.password = updatedPassword.password;

    // Re-sign the updated token with the new info
    const token = jwt.sign(decoded, process.env.JWT_SECRET);
    res.cookie("user_token", token);

    res.status(200).json({
      message: `Your password has been updated successfully, ${username}`,
    });
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Function to handle forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const userExists = await userModel.findOne({ email });
    if (!userExists) {
      return res.status(400).json({
        message: `Sorry email ${email} doesn't exist in our database. Try a different email or register a new account with this email `,
      });
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await userModel.findOneAndUpdate({ email }, { password: hashedPassword });
    return res.status(200).json({
      message: `The password for this email '${email}' has been reset successfully`,
    });
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.user;

    await userModel.findOneAndDelete({ email });
    res.clearCookie("user_token"); // Clear the authentication token (cookie)
    res.status(200).json({
      message: `Your Account ${email} has successfully been deleted `,
    });
  } catch (error) {
    // Log the error and send a 500 status response if something goes wrong
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete all users from the database
const deleteAllUsers = async (req, res) => {
  try {
    await userModel.deleteMany({}); // Delete all users
    res.clearCookie("user_token"); // Clear the authentication token (cookie)
    res.status(200).json({
      message: `You have successfully deleted every account in this application`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Handle server error
  }
};

module.exports = {
  updateUserInfo,
  updatePassword,
  deleteUser,
  forgotPassword,
  deleteAllUsers,
};
