// const express = require("express");
// const complaintRouter = express.Router();
// const { userAuth, isAdmin } = require("../middlewares/auth");
// const Complaint = require("../models/complaint");
// const User = require("../models/user");
// const { calculatePriorityNLP } = require("../utils/priorityCalculatorNLP");
// const createNotification = require("../utils/createNotification");
// const AuditLog = require("../models/auditSchema");
// complaintRouter.post("/complaints",userAuth,async (req,res)=>{
//     try{ 
//         const user = req.user;
//         const {title,description,category,priority} = req.body;
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const complaintCount = await Complaint.countDocuments({
//             createdBy: user._id,
//             createdAt: { $gte: today }
//         }); 
//         if (complaintCount >= 5) {
//             return res.status(429).json({ message: "Daily complaint limit reached (5 complaints per day)." });
//         }
//         const existingComplaint = await Complaint.findOne({
//             createdBy: user._id,
//             title,
//             category,
//             createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
//         });
//         if (existingComplaint) {
//             return res.status(400).json({ message: "Duplicate complaint already filed within the last 24 hours." });
//         }
//         const unresolvedCount = await Complaint.countDocuments({
//             createdBy: user._id,
//             status: { $ne: 'resolved' }
//         });
        
//         if (unresolvedCount >= 10) {
//             return res.status(400).json({ message: "You have too many unresolved complaints. Please wait for some to be resolved before filing new ones." });
//         }
//         const admins = await User.find({role:"Admin",department:user.category});
//         let leastBusyAdmin = null;
//         let minComplaints = Infinity;
//         for(const admin of admins){
//             const complaintCount = await Complaint.countDocuments({ assignedAdmin: admin._id, status: { $ne: 'resolved' } });
//             if (complaintCount < minComplaints) {
//                 minComplaints = complaintCount;
//                 leastBusyAdmin = admin;
//             }
//         }
//         const UpdatedPriority = calculatePriorityNLP(description);
//         const complaint = new Complaint({
//             title,      
//             description,
//             category,
//             priority:UpdatedPriority,
//             createdBy:user._id,
//             assignedAdmin: leastBusyAdmin._id
//         });
//         await complaint.save();
//         createNotification(leastBusyAdmin._id, `New complaint filed: ${title}`);
//         res.json(complaint);
//     }    
//     catch(err){
//         res.status(400).send("some error " + err);
//     }   
// }       
// )   
// complaintRouter.put("/complaints/:complaintId/assign-manager",userAuth,isAdmin,async (req,res)=>{
//        try{
//         const user = req.user;
//         const { complaintId } = req.params;
//         const complaint = await Complaint.findById(complaintId);
//         if (!complaint) {
//             return res.status(404).json({ message: "Complaint not found" });
//         }
//         if (complaint.assignedManager) {
//             return res.status(400).json({ message: "Manager already assigned to this complaint" });
//         }
//         if(complaint.status === 'resolved'){
//             return res.status(400).json({ message: "Complaint already resolved" });
//         }
//         const managers = await User.find({ role: "Manager", department: complaint.category });  
//         let leastBusyManager = null;
//         let minComplaints = Infinity;
//         for(const manager of managers){
//             const complaintCount = await Complaint.countDocuments({ assignedManager: manager._id, status: { $ne: 'resolved' } });
//             if (complaintCount < minComplaints) {
//                 minComplaints = complaintCount;
//                 leastBusyManager = manager;
//             }
//         }
//         complaint.assignedManager = leastBusyManager._id;
//         await complaint.save();
//         if(complaint.priority === 'high' && complaint.status !== 'resolved'){
//              const age = Date.now() - new Date(complaint.createdAt).getTime();
//                 if(age >= 24 * 60 * 60 * 1000){
//                    await createNotification(complaint.assignedAdmin, `High Priority Complaint Unresolved: ${complaint.title}`);
//                 }
//         }
//        await createNotification(leastBusyManager._id, `New complaint assigned: ${complaint.title}`);
//         res.json(complaint);    
//     }

//        catch{
//               res.status(400).send("some error");
//        }
// });  
// complaintRouter.put("/complaints/:complaintId/assign-manager-manual",userAuth,isAdmin,async (req,res)=>{
//     try{
//      const user = req.user;
//      const { complaintId } = req.params;
//      const { managerId } = req.body;
//      const complaint = await Complaint.findById(complaintId);
//      if (!complaint) {
//          return res.status(404).json({ message: "Complaint not found" });
//      }      
//      const manager = await User.findById(managerId);
//      if (!manager || manager.role !== 'Manager') {
//          return res.status(400).json({ message: "Invalid manager selected" });
//      }
//      if(complaint.status === 'resolved'){
//         return res.status(400).json({ message: "Complaint already resolved" });
//     }
//      complaint.assignedManager = manager._id;
//      await complaint.save();
//      if(complaint.priority === 'high' && complaint.status !== 'resolved'){
//         const age = Date.now() - new Date(complaint.createdAt).getTime();
//            if(age >= 24 * 60 * 60 * 1000){
//               await createNotification(complaint.assignedAdmin, `High Priority Complaint Unresolved: ${complaint.title}`);
//            }
//    }
//      createNotification(managerId, `New complaint assigned: ${complaint.title}`);
//      res.status(200).json({ message: "Complaint manually assigned to manager", complaint });
//  } 
//  catch (err) {
//      res.status(500).json({ message: "Error occurred", error: err.message });
//  }
// }); 
// complaintRouter.put("/complaints/:complaintId/escalate",userAuth,isAdmin,async (req,res)=>{
//    try{      
//            const user = req.user;
//            const { complaintId } = req.params;
//             const {reason} = req.body;
//             const complaint = await Complaint.findById(complaintId);
//             if (!complaint) {
//                 return res.status(404).json({ message: "Complaint not found" });
//             }
//              if(complaint.status === 'resolved'){
//                 return res.status(400).json({ message: "Complaint already resolved" });
//              }
//              if(complaint.priority !== 'high'){
//                 return res.status(400).json({ message: "Complaint priority is not high" });
//              }
//              const prevManagerId = complaint.assignedManager;
//              const managers = await User.find({ role: "Manager", department: complaint.category });
//                 let leastBusyManager = null;
//                 let minComplaints = Infinity;
//                 for(const manager of managers){
//                     const complaintCount = await Complaint.countDocuments({ assignedManager: manager._id, status: { $ne: 'resolved' } });
//                     if (complaintCount < minComplaints && manager._id.toString() !== prevManagerId.toString()) {
//                         minComplaints = complaintCount;
//                         leastBusyManager = manager;
//                     }
//                 }
//                 complaint.assignedManager = leastBusyManager._id;
//                 await complaint.save();
//                 const audit =  new AuditLog({
//                     complaintId: complaint._id,
//                     action: 'Manager Reassignment',
//                     changedBy: user._id,
//                     previousManager: prevManagerId,
//                     newManager: leastBusyManager._id,
//                     reason: reason,
//                 });
//                 await audit.save();
//                 await createNotification(leastBusyManager._id, `Escalated complaint assigned: ${complaint.title}`);
//              res.json({message:"Complaint escalated successfully",complaint});
//             } 

//    catch{
//          res.status(500).json("some error");
//    }
// })
// complaintRouter.put("/complaints/:complaintId/escalate-manual",userAuth,isAdmin,async (req,res)=>{
//     try{
//      const user = req.user;
//      const { complaintId } = req.params;
//      const { newManagerId,reason } = req.body;
//      const complaint = await Complaint.findById(complaintId);
//      if (!complaint) {
//          return res.status(404).json({ message: "Complaint not found" });
//      }      
//      const newManager = await User.findById(newManagerId);
//      if (!newManager || newManager.role !== 'Manager') {
//          return res.status(400).json({ message: "Invalid manager selected" });
//      }
//      if(complaint.status === 'resolved'){
//         return res.status(400).json({ message: "Complaint already resolved" });
//     }
//     if(complaint.priority !== 'high'){
//         return res.status(400).json({ message: "Complaint priority is not high" });
//      }
//      complaint.assignedManager = newManagerId;
//      await complaint.save();
//      const audit =  new AuditLog({
//         complaintId: complaint._id,
//         action: 'Manager Reassignment',
//         changedBy: user._id,
//         previousManager: complaint.assignedManager,
//         newManager: newManagerId,
//         reason: reason,
//     });
//     await audit.save();
//      createNotification(newManagerId, `Escalated complaint assigned: ${complaint.title}`);
//      res.status(200).json({ message: "Escalated complaint manually assigned to manager", complaint });
//  } 
//  catch (err) {
//      res.status(500).json({ message: "Error occurred", error: err.message });
//  }
// }); 
// complaintRouter.put("/complaints/:complaintId/priority-manual",userAuth,isAdmin,async (req,res)=>{
//     try{
//      const user = req.user;
//      const { complaintId } = req.params;
//      const { priority,reason } = req.body;
//      const complaint = await Complaint.findById(complaintId);
//      if (!complaint) {
//          return res.status(404).json({ message: "Complaint not found" });
//      }      
//      if(complaint.status === 'resolved'){
//         return res.status(400).json({ message: "Complaint already resolved" });
//     }
//     const validPriorities = ['low', 'medium', 'high'];
//    if(!validPriorities.includes(priority)) {
//     return res.status(400).json({ message: "Invalid priority value" });
//     }
//       const oldPreviousPriority = complaint.priority;
//         complaint.priority = priority;
//         await complaint.save();
//      const audit =  new AuditLog({
//         complaintId: complaint._id,
//         action: 'Priority Change',
//         changedBy: user._id,
//         previousPriority: oldPreviousPriority,
//         newPriority: priority,
//         reason: reason,
//     });
//     await audit.save();
//      res.status(200).json({ message: "Priority complaint changed", complaint });
//  } 
//  catch (err) {
//      res.status(500).json({ message: "Error occurred", error: err.message });
//  }
// }); 
// module.exports = complaintRouter;