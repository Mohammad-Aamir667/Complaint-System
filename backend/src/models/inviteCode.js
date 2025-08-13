const mongoose = require('mongoose');

const inviteCodeSchema = new mongoose.Schema({
  emailId: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  role: { type: String, enum: ["employee", "admin","manager"], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  used: { type: Boolean, default: false },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
 expiresAt: { type: Date, required: true }});
module.exports = mongoose.model('InviteCode', inviteCodeSchema);

