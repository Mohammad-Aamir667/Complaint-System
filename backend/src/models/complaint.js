const mongoose = require("mongoose");
const complaintSchema = new mongoose.Schema({

    title: { type: String, required: true ,maxLength:50},
    description: { type: String, required: true ,maxLength:500},
    category: { type: String, enum: ['HR', 'Finance', 'IT', 'Facilities', 'General'], required: true },
    status: { type: String, enum: ['pending', 'in progress', 'resolved'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }, 
    critical: {
        type: Boolean,
        default: false, 
        validate: {
            validator:function(value){
                return !value || this.role === "admin";  
            },

            message: "Only admins can mark a complaint as critical",
        }
    },
    complaintId: {
        type: String,
        unique: true,
        required: true
      },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attachments: [{
        fileName: String,
        fileUrl: String,
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        uploadedAt: { type: Date, default: Date.now }
    }],
    resolutionNotes: {type:String,maxLength:500},
    escalated: {
        type: Boolean,
        default: false
    },
    
    assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
    assignedManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});
complaintSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});
module.exports = mongoose.model("Complaint", complaintSchema); 