const express = require("express");
const moment = require("moment");
const userComplaintRouter = express.Router();
const Complaint = require("../../models/complaint");
const User = require("../../models/user");
const AuditLog = require("../../models/auditLog");
const createNotification = require("../../utils/createNotification");
const { userAuth } = require("../../middlewares/auth");
const { calculatePriorityNLP } = require("../../utils/priorityCalculatorNLP");
const multer = require("multer");
const { uploadToCloudinary } = require("../../utils/cloudinaryConfig");
const upload = multer({ dest: "uploads/" });
userComplaintRouter.post("/complaint/lodge",upload.single("attachment"),userAuth,async (req,res)=>{
    try{ 
        const user = req.user;
        const {title,description,category} = req.body;
        if(category !== 'HR' && category !== 'Finance' && category !== 'IT' && category !== 'Facilities' && category !== 'General') {
            return res.status(400).json({ message: "Invalid category. Please select a valid category." });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const complaintCount = await Complaint.countDocuments({
            createdBy: user._id,
            createdAt: { $gte: today }
        }); 
        if (complaintCount >= 5) {
            return res.status(429).json({ message: "Daily complaint limit reached (5 complaints per day)." });
        }
        const existingComplaint = await Complaint.findOne({
            createdBy: user._id,
            title,
            category,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });
        if (existingComplaint) {
            return res.status(400).json({ message: "Duplicate complaint already filed within the last 24 hours." });
        }
        const unresolvedCount = await Complaint.countDocuments({
            createdBy: user._id,
            status: { $ne: 'resolved' }
        });
        
        if (unresolvedCount >= 10) {
            return res.status(400).json({ message: "You have too many unresolved complaints. Please wait for some to be resolved before filing new ones." });
        }
        const admins = await User.find({role:"admin",department:category});

        if (admins.length === 0) {
            return res.status(400).json({ message: "No admins available for this category." });
        }
        
        let leastBusyAdmin = null;
        let minComplaints = Infinity;
        for(const admin of admins){
            const complaintCount = await Complaint.countDocuments({ assignedAdmin: admin._id, status: { $ne: 'resolved' } });
            if (complaintCount < minComplaints ) {
                minComplaints = complaintCount;
                leastBusyAdmin = admin;
            }
        }
        const todayTime = moment().format("YYYYMMDD");
        const count = await Complaint.countDocuments({
          createdAt: {
            $gte: moment().startOf("day"),
            $lte: moment().endOf("day"),
          },
        });
    
        const complaintId = `CMP-${todayTime}-${String(count + 1).padStart(4, "0")}`;
        const UpdatedPriority = calculatePriorityNLP(description);
        let attachmentUrl = null;
        if(req.file){
         attachmentUrl = await uploadToCloudinary(req.file);
}
        const complaint = new Complaint({
            title,      
            description,
            category,
            priority:UpdatedPriority,
            createdBy:user._id,
            assignedAdmin: leastBusyAdmin._id,
            complaintId: complaintId,
             attachments: attachmentUrl? [
                {
                    fileName: req.file.originalname,
                    fileUrl: attachmentUrl,
                    uploadedBy: user._id,
                    uploadedAt: new Date()
                }
             ] : undefined,
        });
        await complaint.save();
        const audit = new AuditLog({
            complaintId: complaint._id,
            action: 'Complaint Filed',
            changedBy: user._id,
            reason: 'Complaint filed by user',
        });
        await audit.save();
        createNotification(leastBusyAdmin._id, `New complaint filed: ${title}`);
        res.json(complaint);
    }    
    catch(err){
        res.status(400).send("some error " + err);
    }   
}       
);
userComplaintRouter.get("/user/complaints",userAuth,async (req,res)=>{
    try{ 
        const user = req.user;
        const complaints = await Complaint.find({createdBy:user._id}).populate("assignedAdmin","name email").sort({createdAt:-1});
        res.json(complaints);
    }
    catch(err){
        res.status(500).send("some error " + err);
    }
});

module.exports = userComplaintRouter;