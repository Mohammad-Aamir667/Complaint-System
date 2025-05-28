const express = require("express");
const crypto = require("crypto");
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");
const nodemailer = require("nodemailer");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
authRouter.post("/signup", async (req, res)=>{
    try {
       validateSignUpData(req); 
       const {firstName,lastName,emailId,password,role,department} = req.body;
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
       const passwordHash = await bcrypt.hash(password,10);
       const user = new User({
           firstName,
           lastName,
           emailId,
           password:passwordHash,
           role,          
           department,
       });
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
catch(err){
    
   res.status(400).send("some error " + err);
}

})
authRouter.post("/login",async (req,res)=>{
   try{ 
        const {emailId,password} = req.body;
     const user = await User.findOne({emailId});
     if(!user){
      return res.status(401).send("Invalid credentials");
     }
    const isPasswordValid = await user.validatePassword(password);
    if(!isPasswordValid){
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

       res.cookie("token",token);
       res.json(userData);
    
   
   }
    catch(err){
       res.status(500).send("Error "+ err.message);
    }
})
authRouter.post("/logout",async (req,res)=>{
     res.cookie("token",null,{
       expires:new Date(Date.now())
     });
     res.send("logout successfully");
});
module.exports = authRouter;