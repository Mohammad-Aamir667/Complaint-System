const express = require("express"); 
const adminComplaintRouter = express.Router();
const Complaint = require("../../models/complaint");
const User = require("../../models/user");
const createNotification = require("../../utils/createNotification");
const AuditLog = require("../../models/auditLog");
const { userAuth, isAdmin } = require("../../middlewares/auth");
adminComplaintRouter.put("/complaints/:complaintId/assign-manager",userAuth,isAdmin,async (req,res)=>{
    try{
     const user = req.user;
     const { complaintId } = req.params;
     const {critical} = req.body;
     const complaint = await Complaint.findOne({_id:complaintId,category:user.department,assignedAdmin:user._id});
     if (!complaint) {
         return res.status(404).json({ message: "Complaint not found" });
     }
     if (complaint.assignedManager) {
         return res.status(400).json({ message: "Manager already assigned to this complaint" });
     }
     if(complaint.status === 'resolved'){
         return res.status(400).json({ message: "Complaint already resolved" });
     }
     const managers = await User.find({ role: "manager", department: complaint.category,status:"active" });  
     let leastBusyManager = null;
     let minComplaints = Infinity;
     for(const manager of managers){
         const complaintCount = await Complaint.countDocuments({ assignedManager: manager._id, status: { $ne: 'resolved' }, });
         if (complaintCount < minComplaints) {
             minComplaints = complaintCount;
             leastBusyManager = manager;
         }
     }
     complaint.assignedManager = leastBusyManager._id;

     await complaint.save();
     const populatedComplaint = await Complaint.findById(complaint._id)
     .populate('assignedManager', 'firstName lastName emailId department') // Specify fields you need
     .exec();
     const audit =  new AuditLog({
            complaintId: complaint._id,
            action: 'Manager Assignment',
            changedBy: user._id,
            reason : 'Manager assigned automatically',
            newManager: leastBusyManager._id,
    }); 
    await audit.save();
    if (critical === true) {
        complaint.critical = true;
        const superAdmin = await User.findOne({ role: 'superAdmin', department: complaint.category });
        if (superAdmin) {
            await createNotification(superAdmin._id, `Critical Complaint Assigned: ${complaint.title}`);   
        }

        const audit = new AuditLog({
            complaintId: complaint._id,
            action: "Marked as critical",
            changedBy: user._id,
            reason: "Marked as critical during complaint assignment",
            newManager: leastBusyManager._id,
        });
        await audit.save();
    }
    

    await createNotification(leastBusyManager._id, `New complaint assigned: ${complaint.title}`);
    res.status(200).json({ message: "Complaint automatically assigned to manager",complaint: populatedComplaint });
 }

    catch{
           res.status(400).send("some error");
    }
});  
adminComplaintRouter.put("/complaints/:complaintId/assign-manager-manual",userAuth,isAdmin,async (req,res)=>{
 try{
  const user = req.user;
  const { complaintId } = req.params;
  const { managerId,critical } = req.body;
     const complaint = await Complaint.findOne({_id:complaintId,category:user.department,assignedAdmin:user._id});
  if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
  }      
  const manager = await User.findOne({_id:managerId,department:user.department});
  if(manager.status !== "active"){
    return res.status(400).json({message:"the manager is not active"});
  }
  if (!manager || manager.role !== 'manager') {
      return res.status(400).json({ message: "Invalid manager selected" });
  }
  if(complaint.status === 'resolved'){
     return res.status(400).json({ message: "Complaint already resolved" });
 }
  complaint.assignedManager = manager._id;
  await complaint.save();
  const populatedComplaint = await Complaint.findById(complaint._id)
  .populate('assignedManager', 'firstName lastName emailId department') // Specify fields you need
  .exec();
  const audit =  new AuditLog({
    complaintId: complaint._id,
    action: 'Manager Manual Assignment',
    changedBy: user._id,
    reason : 'Manager assigned manually',
    newManager: leastBusyManager._id,
}); 
await audit.save();
if (critical === true) {
    complaint.critical = true;
    const superAdmin = await User.findOne({ role: 'superAdmin', department: complaint.category });
    if (superAdmin) {
        await createNotification(superAdmin._id, `Critical Complaint Assigned: ${complaint.title}`);
    }
    const audit = new AuditLog({
        complaintId: complaint._id,
        action: "Marked as critical",
        changedBy: user._id,
        reason: "Marked as critical during complaint assignment",
        newManager: leastBusyManager._id,
    });
    await audit.save();
}
  createNotification(managerId, `New complaint assigned: ${complaint.title}`);
  res.status(200).json({ message: "Complaint manually assigned to manager", complaint:populatedComplaint });
} 
catch (err) {
  res.status(500).json({ message: "Error occurred", error: err.message });
}
}); 
adminComplaintRouter.put("/complaints/:complaintId/escalate",userAuth,isAdmin,async (req,res)=>{
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
                 assignedAdmin:user._id,
                 category: user.department,  
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
adminComplaintRouter.put("/complaints/:complaintId/escalate-manual",userAuth,isAdmin,async (req,res)=>{
 try{
  const user = req.user;
  const { complaintId } = req.params;
  const { newManagerId,reason } = req.body;
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const complaint = await Complaint.findOne({_id:complaintId, createdAt: { $lt: twentyFourHoursAgo },category:user.department,assignedAdmin:user._id});
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
             .populate('assignedManager', 'firstName lastName emailId department') // Specify fields you need
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
adminComplaintRouter.put("/complaints/:complaintId/priority-manual",userAuth,isAdmin,async (req,res)=>{
 try{
  const user = req.user;
  const { complaintId } = req.params;
  const { priority,reason } = req.body;
  const complaint = await Complaint.findOne({_id:complaintId,category:user.department,assignedAdmin:user._id});
  if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
  }      
  if(complaint.status === 'resolved'){
     return res.status(400).json({ message: "Complaint already resolved" });
 }
 const validPriorities = ['low', 'medium', 'high'];
if(!validPriorities.includes(priority)) {
 return res.status(400).json({ message: "Invalid priority value" });
 }
   const oldPreviousPriority = complaint.priority;
     complaint.priority = priority;
     await complaint.save();
  const audit =  new AuditLog({
     complaintId: complaint._id,
     action: 'Priority Change',
     changedBy: user._id,
     previousPriority: oldPreviousPriority,
     newPriority: priority,
     reason: reason,
 });
 await audit.save();
  res.status(200).json({ message: "Priority complaint changed", complaint });
} 
catch (err) {
  res.status(500).json({ message: "Error occurred", error: err.message });
}
}); 
adminComplaintRouter.get("/admin/complaints",userAuth,isAdmin,async (req,res)=>{
     try{
         const user = req.user;
         const allComplaints = await Complaint.find({assignedAdmin: user._id,category:user.department}).populate('createdBy', 'firstName lastName emailId role department').populate('assignedManager', 'firstName lastName emailId department').exec();
         if (!allComplaints || allComplaints.length === 0) {
             return res.status(404).json({ message: "No complaints found for this admin" });
         }
            res.status(200).json(allComplaints);
     }
     catch(err){
            res.status(500).json({ message: "Error occurred", error: err.message });
     }
});

module.exports = adminComplaintRouter;