const mongoose = require('mongoose');
const auditLogSchema = new mongoose.Schema({
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
    action: { type: String, required: true },  
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    previousManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    newManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    previousPriority: { type: String },
    newPriority: { type: String },

    previousStatus: { type: String },
    newStatus: { type: String },
    previousUserStatus: { type: String },
    newUserStatus: { type: String },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    inviteCode: { type: mongoose.Schema.Types.ObjectId, ref: 'InviteCode' },
    targetEmail: { type: String },   // For actions involving non-registered users
    roleInvited: { type: String },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('AuditLog', auditLogSchema);
