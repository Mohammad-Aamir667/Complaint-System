const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Notification = require("../models/notification");
const notificationRouter = express.Router();
notificationRouter.get("/notifications",userAuth,async(req,res)=>{
          try{  const user = req.user;
            const allNotifications =  await Notification.find({user:user._id});
            if(!allNotifications){
         return res.status(404).json({ message: "No notifications found" }); 
            }
         return   res.status(200).json(allNotifications);
        }
           catch(err){
            return res.status(500).json({ message: "Internal server error" });

           }
});
notificationRouter.put("/notification/read:id",userAuth,async(req,res)=>{
   try{
                 
                 const user = req.user;
                 const notiId = req.params.id.trim();
                 const notification = await Notification.findById({_id:notiId});
                 if(!notification){
                  return res.status(404).json({ message: "No notifications found" }); 
               }
               notification.isRead = true;
               await notification.save();
               return res.status(200).json(notification);
      
   }
   catch(err){
      return res.status(500).json(err);

   }
})
module.exports = notificationRouter;