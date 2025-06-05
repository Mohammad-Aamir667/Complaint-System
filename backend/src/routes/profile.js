const express = require('express');
const { userAuth } = require('../middlewares/auth');
const profileRouter = express.Router();
const multer = require('multer'); 
const { uploadToCloudinary } = require("../utils/cloudinaryConfig");
const { validateEditProfileData } = require('../utils/validation');
const User = require('../models/user');
const upload = multer({ dest: 'uploadImage/' });
profileRouter.get("/user/profile",userAuth,async (req,res)=>{
    try{
       const loggedInUser = req.user; 
     return res.json(loggedInUser);
    }
    catch(err){
         res.status(500).json(err)
    }      
});
profileRouter.post("/editProfile",userAuth,async (req,res)=>{
  try{
   validateEditProfileData(req)
  const loggedInUser = req.user;
  Object.keys(req.body).forEach((key)=>{
   loggedInUser[key] = req.body[key];
  });
  await loggedInUser.save();
  res.json(
  loggedInUser
  )
}
catch (err) {
   if (err.statusCode === 400) {
      return res.status(400).json(err.message);
    }
 res.status(500).send(err.message || "Internal Server Error");
}

})
profileRouter.post("/uploadImage", userAuth, upload.single('file'), async (req, res) => {
  try {
    const user = req.user;
    const imageUrl = await uploadToCloudinary(req.file); 
    user.photoUrl = imageUrl;
    await user.save();
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
profileRouter.post('/removeProfilePhoto', userAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const defaultImageUrl = "/placeholder.svg"; 

    await User.findByIdAndUpdate(userId, { photoUrl: defaultImageUrl });

    res.status(200).json({ message: "Profile photo removed successfully." });
  } catch (err) {
    console.error("Error removing profile photo:", err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = profileRouter;