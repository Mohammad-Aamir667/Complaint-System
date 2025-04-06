const Notification = require("../models/notification");

const createNotification = async(userId,message)=>{
      const notification = new Notification({
        user:userId,
        message,
      });
      await notification.save();
}
module.exports = createNotification;