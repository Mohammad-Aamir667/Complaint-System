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
     const complaint = await Complaint.findById(complaintId);
     if (!complaint) {
         return res.status(404).json({ message: "Complaint not found" });
     }
     if (complaint.assignedManager) {
         return res.status(400).json({ message: "Manager already assigned to this complaint" });
     }
     if(complaint.status === 'resolved'){
         return res.status(400).json({ message: "Complaint already resolved" });
     }
     const managers = await User.find({ role: "manager", department: complaint.category });  
     let leastBusyManager = null;
     let minComplaints = Infinity;
     for(const manager of managers){
         const complaintCount = await Complaint.countDocuments({ assignedManager: manager._id, status: { $ne: 'resolved' } });
         if (complaintCount < minComplaints) {
             minComplaints = complaintCount;
             leastBusyManager = manager;
         }
     }
     complaint.assignedManager = leastBusyManager._id;

     await complaint.save();
     const audit =  new AuditLog({
            complaintId: complaint._id,
            action: 'Manager Assignment',
            changedBy: user._id,
            reason : 'Manager assigned automatically',
            newManager: leastBusyManager._id,
    }); 
    await audit.save();
     if(complaint.priority === 'high' && complaint.status !== 'resolved'){
          const age = Date.now() - new Date(complaint.createdAt).getTime();
             if(age >= 24 * 60 * 60 * 1000){
                await createNotification(complaint.assignedAdmin, `High Priority Complaint Unresolved: ${complaint.title}`);
             }
     }

    await createNotification(leastBusyManager._id, `New complaint assigned: ${complaint.title}`);
    res.status(200).json({ message: "Complaint automatically assigned to manager", complaint });
 }

    catch{
           res.status(400).send("some error");
    }
});  
adminComplaintRouter.put("/complaints/:complaintId/assign-manager-manual",userAuth,isAdmin,async (req,res)=>{
 try{
  const user = req.user;
  const { complaintId } = req.params;
  const { managerId } = req.body;
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
  }      
  const manager = await User.findById(managerId);
  if (!manager || manager.role !== 'manager') {
      return res.status(400).json({ message: "Invalid manager selected" });
  }
  if(complaint.status === 'resolved'){
     return res.status(400).json({ message: "Complaint already resolved" });
 }
  complaint.assignedManager = manager._id;
  await complaint.save();
  const audit =  new AuditLog({
    complaintId: complaint._id,
    action: 'Manager Manual Assignment',
    changedBy: user._id,
    reason : 'Manager assigned manually',
    newManager: leastBusyManager._id,
}); 
await audit.save();
  if(complaint.priority === 'high' && complaint.status !== 'resolved'){
     const age = Date.now() - new Date(complaint.createdAt).getTime();
        if(age >= 24 * 60 * 60 * 1000){
           await createNotification(complaint.assignedAdmin, `High Priority Complaint Unresolved: ${complaint.title}`);
        }
}
  createNotification(managerId, `New complaint assigned: ${complaint.title}`);
  res.status(200).json({ message: "Complaint manually assigned to manager", complaint });
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
         const complaint = await Complaint.findById(complaintId);
         if (!complaint) {
             return res.status(404).json({ message: "Complaint not found" });
         }
          if(complaint.status === 'resolved'){
             return res.status(400).json({ message: "Complaint already resolved" });
          }
          if(complaint.priority !== 'high'){
             return res.status(400).json({ message: "Complaint priority is not high" });
          }
          const prevManagerId = complaint.assignedManager;
          const managers = await User.find({ role: "manager", department: complaint.category });
             let leastBusyManager = null;
             let minComplaints = Infinity;
             for(const manager of managers){
                 const complaintCount = await Complaint.countDocuments({ assignedManager: manager._id, status: { $ne: 'resolved' } });
                 if (complaintCount < minComplaints && manager._id.toString() !== prevManagerId.toString()) {
                     minComplaints = complaintCount;
                     leastBusyManager = manager;
                 }
             }
             complaint.assignedManager = leastBusyManager._id;
             await complaint.save();
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
          res.json({message:"Complaint escalated successfully",complaint});
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
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
  }      
  const newManager = await User.findById(newManagerId);
  if (!newManager || newManager.role !== 'manager') {
      return res.status(400).json({ message: "Invalid manager selected" });
  }
  if(complaint.status === 'resolved'){
     return res.status(400).json({ message: "Complaint already resolved" });
 }
 if(complaint.priority !== 'high'){
     return res.status(400).json({ message: "Complaint priority is not high" });
  }
  complaint.assignedManager = newManagerId;
  await complaint.save();
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
  res.status(200).json({ message: "Escalated complaint manually assigned to manager", complaint });
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
  const complaint = await Complaint.findById(complaintId);
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
module.exports = adminComplaintRouter;