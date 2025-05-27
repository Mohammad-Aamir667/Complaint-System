const express = require("express");
const { isManager, userAuth } = require("../../middlewares/auth");
const Complaint = require("../../models/complaint");
const AuditLog = require("../../models/auditLog");
const createNotification = require("../../utils/createNotification");
const managerComplaintRouter = express.Router();
managerComplaintRouter.put("/complaints/:complaintId/accept",userAuth,isManager,async (req,res)=>{
    try{    
            const manager = req.user     
            const {complaintId} = req.params;
            const complaint = await Complaint.findById(complaintId);
            if(!complaint){
                return res.status(404).json({message:"Complaint not found"});
            }
            if(manager._id.toString() !== complaint.assignedManager.toString()){
                return res.status(403).json({ message: "Access denied: Not your assigned complaint" });
            }
            if(complaint.status === "resolved" || complaint.status === "in progress"){
                return res.status(400).json({message:`Complaint is already ${complaint.status} `});
            }         
            complaint.status = "in progress";
            const audit = new AuditLog({
                complaintId: complaint._id,
                action: "Complaint accepted",
                changedBy: manager._id,
                previousStatus: complaint.status,
                newStatus: "in progress",
                reason: "Complaint accepted by manager"
            });
            await audit.save();
            await complaint.save();
            createNotification(complaint.createdBy,`Complaint ${complaint.title} in progess`);
            res.status(200).json({message:"Complaint accepted successfully",complaint});

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
managerComplaintRouter.put("/complaints/:complaintId/resolve",userAuth,isManager,async (req,res)=>{
    try{
        const manager = req.user;
        const {complaintId} = req.params;
        const complaint = await Complaint.findById(complaintId);
        if(!complaint){
            return res.status(404).json({message:"Complaint not found"});
        }
        if(manager._id.toString() !== complaint.assignedManager.toString()){
            return res.status(403).json({ message: "Access denied: Not your assigned complaint" });
        }
        if(complaint.status === "resolved"){
            return res.status(400).json({message:"Complaint already resolved"});
        }
        complaint.status = "resolved";
        const audit = new AuditLog({
            complaintId: complaint._id,
            action: "Complaint resolved",
            changedBy: manager._id,
            previousStatus: complaint.status,
            newStatus: "resolved",
            reason: "Complaint resolved by manager"
        });
        await audit.save();
        await complaint.save();
        createNotification(complaint.createdBy,`Complaint ${complaint.title} resolved`);
        res.status(200).json({message:"Complaint resolved successfully",complaint});
}
catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
}
})
module.exports = managerComplaintRouter;