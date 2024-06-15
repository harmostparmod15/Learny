const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// reset password token
exports.restPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Your emails is not registered with us",
      });
    }

    // generate token
    const token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
      { email },
      { token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail containing the urk
    await mailSender(
      email,
      "Password reset link ",
      `Reset your password here : ${url}`
    );

    return res.json({
      success: true,
      message: "Please check your email for password reset",
    });
  } catch (error) {
    console.log("error in resetpasswordtoken controller ", error);
    return res.status(500).json({
      success: false,
      messsage: "Something went wrong while resetting your password",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password dont match ",
      });
    }

    // fetch user details
    const userDetails = await User.findOne({ token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }

    // token timing check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired",
      });
    }

    // hash new passwordc
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password in db
    await User.findOneAndUpdate(
      { token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfull",
    });
  } catch (error) {
    console.log("error in resetpassword controller ", error);
    return res.status(500).json({
      success: false,
      messsage: "Something went wrong while resetting your password",
    });
  }
};
