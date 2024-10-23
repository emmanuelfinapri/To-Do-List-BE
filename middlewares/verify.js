const jwt = require("jsonwebtoken");

const logoutVerify = async (req, res, next) => {
  // Check if the user is already logged in via the cookie
  const { user_token } = req.cookies;
  if (user_token) {
    // Verify the token
    jwt.verify(user_token, process.env.JWT_SECRET, (error, info) => {
      if (error) {
        return res.status(401).json({ message: "Invalid token" });
      }
      // If valid, user is still logged in
      return res.status(400).json({
        message: `You are still logged in as ${info.email}. Please log out first.`,
      });
    });
  } else {
    // Proceed if no token is found
    next();
  }
};

const loginVerify = (req, res, next) => {
  const { user_token } = req.cookies;

  // Check if token exists
  if (!user_token) {
    return res.json({ message: "you are not logged in" });
  }
  // Verify the token
  jwt.verify(user_token, process.env.JWT_SECRET, (error, info) => {
    if (error) {
      return res.json({ message: "invalid token" });
    }
    // Attach user info to request
    req.user = info;

    next();
  });
};

const adminAndSuperAdminVerify = (req, res, next) => {
  const { role, username } = req.user;

  // Check if the user is an Admin or SuperAdmin
  if (role !== "Admin" && role !== "SuperAdmin") {
    return res.json({
      message: `Sorry ${username} you are not an Admin or Super Admin so you can't make changes`,
    });
  }

  next();
};

const superAdminVerify = (req, res, next) => {
  const { role, username } = req.user;

  // Check if the user is a SuperAdmin
  if (role !== "SuperAdmin") {
    return res.status(400).json({
      message: `Sorry ${username} you are not a Super Admin so you don't have Super Admin privileges`,
    });
  }

  next();
};

module.exports = {
  logoutVerify,
  loginVerify,
  adminAndSuperAdminVerify,
  superAdminVerify,
};
