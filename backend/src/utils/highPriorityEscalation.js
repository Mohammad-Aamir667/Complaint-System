const Complaint = require("../models/complaint");
const User = require("../models/user");

const escalateHighPriorityComplaints = async () => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const complaints = await Complaint.find({
        priority: 'high',
        status: { $ne: 'resolved' },
        createdAt: { $lt: twentyFourHoursAgo },
        escalated: false  
    });

    for (const complaint of complaints) {
        await createNotification(complaint.assignedAdmin, `High Priority Complaint Unresolved: ${complaint.title}`);
        const superAdmin = await User.findOne({ role: 'superAdmin' , department: complaint.category });
        if (superAdmin) {
            await createNotification(superAdmin._id, `High Priority Complaint Unresolved: ${complaint.title}`);
        }
        complaint.escalated = true;
        await complaint.save();
    }}
    
module.exports = escalateHighPriorityComplaints;
