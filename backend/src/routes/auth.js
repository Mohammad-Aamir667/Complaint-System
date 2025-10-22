const express = require("express");
const crypto = require("crypto");
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");
const nodemailer = require("nodemailer");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
require("dotenv").config();
const InviteCode = require("../models/inviteCode");
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password, role, department, inviteCode } = req.body;
    const codeDoc = await InviteCode.findOne({ emailId: emailId, code: inviteCode, used: false });
    if (!codeDoc) {
      return res.status(400).json({ message: "Invalid or already used invite code" });
    }
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    if (!["employee", "admin", "manager", "superadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Please select a valid role." });
    }
    if (role === "employee" && !["HR", "IT", "Finance"].includes(department)) {
      return res.status(400).json({ message: "Invalid department for employee role. Please select HR, IT, or Finance." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      role,
      department,
    });
    codeDoc.used = true;
    codeDoc.usedBy = user._id;
    await codeDoc.save();
    await user.save();
    const token = await user.getJWT();
    const userData = user.toObject();
    delete userData.password;
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,  // ✅ Required for HTTPS (Render & Vercel)
      sameSite: "none",  // ✅ Allow cross-origin cookies
    });
    res.json(userData);
  }
  catch (err) {

    res.status(400).send("some error " + err);
  }

})
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).send("emailId and password are required");
    }
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    }
    if (user.status !== "active") {
      let message = "Your account is not active.";

      switch (user.status) {
        case "pending":
          message = "Your account is pending approval. Please wait or contact admin.";
          break;
        case "inactive":
          message = "Your account is inactive. Please contact the administrator.";
          break;
        case "suspended":
          message = "Your account has been suspended. Contact support for more info.";
          break;
        case "terminated":
          message = "Your account has been terminated. Access is no longer available.";
          break;
      }

      return res.status(403).json({
        success: false,
        message,
      });
    }


    const token = await user.getJWT();
    const userData = user.toObject();
    delete userData.password;
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,  // ✅ Required for HTTPS (Render & Vercel)
      sameSite: "none",  // ✅ Allow cross-origin cookies
    });

    res.cookie("token", token);
    res.json(userData);


  }
  catch (err) {
    res.status(500).send("Error " + err.message);
  }
})
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(0),
      path: "/"
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Logout failed", error: err.message });
  }
});

authRouter.post("/forget-password", async (req, res) => {
  try {
    const { emailId } = req.body;
    if (!emailId || !validator.isEmail(emailId)) {
      return res.status(400).json({ message: "Valid emailId is required" })
    };
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999);
    const otpExpireTime = 10 * 60 * 1000;
    user.forgetPasswordOtp = otp;
    user.forgetPasswordOtpExpires = Date.now() + otpExpireTime;
    await user.save();
    console.log("EMAIL:", process.env.GMAIL_PASS_KEY);
    console.log("Length:", process.env.GMAIL_PASS_KEY?.length);


    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "aamireverlasting786@gmail.com",
        pass: process.env.GMAIL_PASS_KEY,
      },
    });

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="background-color: #4f46e5; color: white; padding: 15px 20px; font-size: 20px; font-weight: bold;">
            Password Reset Request
          </div>
          <div style="padding: 20px; color: #333;">
            <p>Hi ${user.firstName || "User"},</p>
            <p>We received a request to reset your password. Use the OTP below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 12px 20px; border: 2px dashed #4f46e5; border-radius: 6px; background: #f3f4f6; color: #4f46e5;">
                ${otp}
              </span>
            </div>
            <p>This OTP is valid for <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.</p>
            <p style="margin-top: 20px;">Best regards,<br><strong>GrievincePro Team</strong></p>
          </div>
          <div style="background: #f3f4f6; color: #666; padding: 10px; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} GrievincePro. All rights reserved.
          </div>
        </div>
      </div>
    `;

    // Send Email
    await transporter.sendMail({
      to: emailId,
      subject: "7",
      html: htmlTemplate,
    });

    return res.json({
      message: "OTP sent to your email",
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.post("/reset-password", async (req, res) => {
  try {
    const { emailId, otp, newPassword } = req.body;
    if (!emailId || !otp || !newPassword) {
      return res.status(400).json({ message: "emailId,opt,newPassword are required" })
    };





    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({
        message: 'user not found'
      });
    }
    if (user.forgetPasswordOtp !== parseInt(otp)) {
      return res.status(400).json({
        message: "invalid OTP"
      })
    }
    if (Date.now() > user.forgetPasswordOtpExpires) {
      return res.status(400).json({
        message: "OTP expired"
      })
    }
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: "enter a strong password!"
      })
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash;
    user.forgetPasswordOtp = null;
    user.forgetPasswordOtpExpires = null;
    await user.save();
    return res.json({
      message: "password reset successfully"
    })
  }
  catch (err) {
    res.status(400).json({
      message: "something went wrong " + err.message,
    }
    )
  }
})
module.exports = authRouter;