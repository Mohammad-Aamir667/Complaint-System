const Complaint = require("../models/complaint");

const escalateHighPriorityComplaints  = async ()=>{
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const complaints = await Complaint.find({ priority: 'high' ,status:{$ne:'resolved'},createdAt:{$lt:twentyFourHoursAgo}});
    for (const complaint of complaints) {  
           await createNotification(complaint.assignedAdmin,`High Priority Complaint Unresolved: ${complaint.title}`);
    }
}
module.exports = escalateHighPriorityComplaints ;