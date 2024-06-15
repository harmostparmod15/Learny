const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth middleware for checking the user token
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }
    // verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    next();
  } catch (error) {
    console.log("error in auth middleware ", error);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating token",
    });
  }
};

// is student middleware
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "Protected routes for Students only",
      });
    }
    next();
  } catch (error) {
    console.log("error in isStudent middleware ", error);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

// is instructor middleware
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "Protected routes for Instructor only",
      });
    }
    next();
  } catch (error) {
    console.log("error in isInstructor middleware ", error);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

// is admin middleware
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Protected routes for Admin only",
      });
    }
    next();
  } catch (error) {
    console.log("error in isAdmin middleware ", error);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};
