const express = require('express');
const {userAuth, isSuperAdmin } = require('../../middlewares/auth');
const Complaint = require('../../models/complaint');
const superAdminComplaintRouter = express.Router();
const User = require("../../models/user");

superAdminComplaintRouter.get("/superadmin/complaints",userAuth,isSuperAdmin,async(req,res)=>{
    const user= req.user;
    const criticalComplaints = await Complaint.find({category:user.department}).populate('createdBy', 'firstName lastName emailId role department').populate('assignedAdmin', 'firstName lastName emailId department').populate('assignedManager', 'firstName lastName emailId department').exec();
    if(criticalComplaints.length === 0) return res.status(404).json({message:"No Complaints found"});
    return res.status(200).json(criticalComplaints)
});
superAdminComplaintRouter.put("/complaints/:complaintId/escalate",userAuth,isSuperAdmin,async (req,res)=>{
try{      
        const user = req.user;
        const { complaintId } = req.params;
         const {reason} = req.body;     
          const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
             const complaint = await Complaint.findOne({
                 _id:complaintId,
                 priority: 'high',
                 status: { $ne: 'resolved' },
                 createdAt: { $lt: twentyFourHoursAgo },
                 escalated: false,
                 category:user.department,

             });
             if (!complaint){
                return res.status(404).json({ message: "Complaint not found" });
            }
        

  
          const prevManagerId = complaint.assignedManager;
          const managers = await User.find({ role: "manager", department: complaint.category ,status:"active"});
             let leastBusyManager = null;
             let minComplaints = Infinity;
             for(const manager of managers){
                 const complaintCount = await Complaint.countDocuments({ assignedManager: manager._id, status: { $ne: 'resolved' } })
                 if (
                    complaintCount < minComplaints &&
                    (!prevManagerId || manager._id.toString() !== prevManagerId.toString())
                  ) {
                    minComplaints = complaintCount;
                    leastBusyManager = manager;
             }}
             complaint.assignedManager = leastBusyManager._id;
             complaint.escalated = true;
             await complaint.save();
             const populatedComplaint = await Complaint.findById(complaint._id)
             .populate('assignedManager', 'firstName lastName emailId department') 
             .exec();
             const audit =  new AuditLog({
                 complaintId: complaint._id,
                 action: 'Manager Reassignment',
                 changedBy: user._id,
                 previousManager: prevManagerId,
                 newManager: leastBusyManager._id,
                 reason: reason,
             });
             await audit.save();
             await createNotification(leastBusyManager._id, `Escalated complaint assigned: ${complaint.title}`);
          res.json({message:"Complaint escalated successfully",complaint:populatedComplaint});
         } 

catch{
      res.status(500).json("some error");
}
})
superAdminComplaintRouter.put("/complaints/:complaintId/escalate-manual",userAuth,isSuperAdmin,async (req,res)=>{
 try{
  const user = req.user;
  const { complaintId } = req.params;
  const { newManagerId,reason } = req.body;
  const complaint = await Complaint.findOne({_id:complaintId,category:user.department});
  if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
  }  
 
  const newManager = await User.findOne({_id:newManagerId,department:user.department});
  if (!newManager || newManager.role !== 'manager') {
      return res.status(400).json({ message: "Invalid manager selected" });
  }
  if(newManager.status !== "active"){
    return res.status(400).json({message:"the manager is not active"});
  }
  if(complaint.status === 'resolved'){
     return res.status(400).json({ message: "Complaint already resolved" });
 }
 if(complaint.priority !== 'high'){
     return res.status(400).json({ message: "Complaint priority is not high" });
  }
  if(complaint.assignedManager.toString() === newManagerId.toString()){
    return res.status(400).json({message:"cannot assign the same manager"});
  }
 
  complaint.assignedManager = newManagerId;
  complaint.escalated = true;
  await complaint.save();
  const populatedComplaint = await Complaint.findById(complaint._id)
             .populate('assignedManager', 'firstName lastName emailId department') 
             .exec();
  const audit =  new AuditLog({
     complaintId: complaint._id,
     action: 'Manager Reassignment',
     changedBy: user._id,
     previousManager: complaint.assignedManager,
     newManager: newManagerId,
     reason: reason,
 });
 await audit.save();
  createNotification(newManagerId, `Escalated complaint assigned: ${complaint.title}`);
  res.status(200).json({ message: "Escalated complaint manually assigned to manager", complaint:populatedComplaint });
} 
catch (err) {
  res.status(500).json({ message: "Error occurred", error: err.message });
}
}); 
superAdminComplaintRouter.get("/complaints/pending-escalation",userAuth,isSuperAdmin,async(req,res)=>{
    const user = req.user;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
             const complaint = await Complaint.find({
                 priority: 'high',
                 status: { $ne: 'resolved' },
                 createdAt: { $lt: twentyFourHoursAgo },
                 escalated: false,
                 category:user.department,
             }).populate('createdBy', 'firstName lastName emailId role department').populate('assignedAdmin', 'firstName lastName emailId department').populate('assignedManager', 'firstName lastName emailId department').exec();
             if(complaint.length === 0) 
                return res.status(404).json({message:"No pending escalation"});
    return res.status(200).json(complaint);
})
superAdminComplaintRouter.get("/complaints/escalated-complaints",userAuth,isSuperAdmin,async(req,res)=>{
        const user = req.user;
        const escalatedComplaints = await Complaint.find({escalated: true,category:user.department}).populate('createdBy', 'firstName lastName emailId role department').populate('assignedAdmin', 'firstName lastName emailId department').populate('assignedManager', 'firstName lastName emailId department').exec();
        if(escalatedComplaints.length === 0) return res.status(404).json({message:"No escalated complaints found"});
        return res.status(200).json(escalatedComplaints);
});
superAdminComplaintRouter.get("superadmin/complaints", userAuth, isSuperAdmin, async (req, res) => {
    try {
        const user = req.user;
        const complaints = await Complaint.find({ category: user.department })
            .populate('createdBy', 'firstName lastName emailId role department')
            .populate('assignedAdmin', 'firstName lastName emailId department')
            .populate('assignedManager', 'firstName lastName emailId department')
            .exec();
        
        if (complaints.length === 0) {
            return res.status(404).json({ message: "No complaints found" });
        }
        
        return res.status(200).json(complaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
  });
superAdminComplaintRouter.get("/admins/complaint-stats", userAuth,isSuperAdmin, async (req, res) => {
    try {
        const admins = await User.aggregate([
          { $match: { role: "admin" ,  department : req.user.department} },
          {
            $lookup: {
              from: "complaints",
              localField: "_id",
              foreignField: "assignedAdmin",
              as: "complaints"
            }
          },
          {
            $project: {
              firstName: 1,
              lastName:1,
              emailId: 1,
              department: 1,
              photoUrl:1,
              totalComplaints: { $size: "$complaints" },
              resolved: {
                $size: {
                  $filter: {
                    input: "$complaints",
                    as: "c",
                    cond: { $eq: ["$$c.status", "resolved"] }
                  }
                }
              },
              inProgress: {
                $size: {
                  $filter: {
                    input: "$complaints",
                    as: "c",
                    cond: { $eq: ["$$c.status", "in progress"] }
                  }
                }
              },
              pending: {
                $size: {
                  $filter: {
                    input: "$complaints",
                    as: "c",
                    cond: { $eq: ["$$c.status", "pending"] }
                  }
                }
              }
            }
          }
        ]);
    
        res.status(200).json(admins);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});

module.exports = superAdminComplaintRouter;