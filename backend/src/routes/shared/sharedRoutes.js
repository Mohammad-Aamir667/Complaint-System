const User = require("../../models/user");
const Complaint = require("../../models/complaint");
const { userAuth } = require("../../middlewares/auth");
const InviteCode  = require("../../models/inviteCode");
const sharedRouter = require("express").Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const AuditLog = require("../../models/auditLog");
sharedRouter.get("/managers/complaint-stats", userAuth, async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied" });
          }
          
        const managers = await User.aggregate([
          { $match: { role: "manager" ,  department : req.user.department} },
          {
            $lookup: {
              from: "complaints",
              localField: "_id",
              foreignField: "assignedManager",
              as: "complaints"
            }
          },
          {
            $project: {
              firstName: 1,
              lastName:1,
              emailId: 1,
              department: 1,
              photoUrl:1,
              status:1,
              totalComplaints: { $size: "$complaints" },
              resolved: {
                $size: {
                  $filter: {
                    input: "$complaints",
                    as: "c",
                    cond: { $eq: ["$$c.status", "resolved"] }
                  }
                }
              },
              inProgress: {
                $size: {
                  $filter: {
                    input: "$complaints",
                    as: "c",
                    cond: { $eq: ["$$c.status", "in progress"] }
                  }
                }
              },
              pending: {
                $size: {
                  $filter: {
                    input: "$complaints",
                    as: "c",
                    cond: { $eq: ["$$c.status", "pending"] }
                  }
                }
              }
            }
          }
        ]);
    
        res.status(200).json(managers);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});
sharedRouter.get("/employees/complaint-stats", userAuth, async (req, res) => {
  try {
    if (req.user.role === "employee") {
      return res.status(403).json({ message: "Access denied" });
    }

    const employees = await User.aggregate([
      { 
        $match: { 
          role: "employee",  
        } 
      },
      {
        $lookup: {
          from: "complaints",
          localField: "_id",
          foreignField: "createdBy", 
          as: "complaints"
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          emailId: 1,
          department: 1,
          photoUrl: 1,
          status: 1,
          totalComplaints: { $size: "$complaints" },
          resolved: {
            $size: {
              $filter: {
                input: "$complaints",
                as: "c",
                cond: { $eq: ["$$c.status", "resolved"] }
              }
            }
          },
          inProgress: {
            $size: {
              $filter: {
                input: "$complaints",
                as: "c",
                cond: { $eq: ["$$c.status", "in progress"] }
              }
            }
          },
          pending: {
            $size: {
              $filter: {
                input: "$complaints",
                as: "c",
                cond: { $eq: ["$$c.status", "pending"] }
              }
            }
          }
        }
      }
    ]);

    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
sharedRouter.put("/employees/:employeeId/status", userAuth, async (req, res) => {
    try {
       if (req.user.role !== "admin" && req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied" });
          }
        const user = req.user;
        const status = req.body.status;
                  console.log("status",status)

        if(!status || !['active', 'inactive', 'suspended', 'terminated'].includes(status)) return res.status(400).json({ message: "Invalid status" });
        const id = req.params.employeeId;
        const employee = await User.findOne({_id:id,role:"employee"});
        if(employee.status === status) return res.status(400).json({ message: "Employee already has this status" });
        employee.status = status;
        await employee.save();
       const audit = new AuditLog({
            action: 'Status Update',
            changedBy: user._id,
            previousStatus: employee.status,
            newStatus: status,
              targetUser: employee._id,
            previousUserStatus: employee.status,
            newUserStatus: status,
        });

        await audit.save();

        res.status(200).json({ message: "Employee status updated successfully", employee });
        
    } catch (error) {
        return res.status(500).json(error);
    }
});  
sharedRouter.post("/generate-invite-code", userAuth, async (req, res) => {
  try {
    const { role, emailId } = req.body;
    console.log(req.body);

    const existingMail = await User.findOne({ emailId });
    if (existingMail) {
      return res.status(400).json({ message: "Email already signed up" });
    }

    if (!role || !emailId) {
      return res.status(400).json({ message: "Role and emailId are required" });
    }

    if (req.user.role !== "superadmin" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (req.user.role === "admin" && role !== "employee") {
      return res.status(403).json({ message: "Admin can only invite employees" });
    }

    const code = crypto.randomBytes(6).toString("hex");
    const expiresInHours = 24;
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    const newCode = await InviteCode.create({
      emailId,
      code,
      role,
      createdBy: req.user._id,
      expiresAt,
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "aamireverlasting786@gmail.com",
        pass: process.env.GMAIL_PASS_KEY,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; border: 1px solid #e5e5e5;">
        <h2 style="color: #333333; text-align: center;">🔑 Invitation to Join</h2>
        <p style="color: #555555; font-size: 16px;">
          Hello,
        </p>
        <p style="color: #555555; font-size: 16px;">
          You have been invited to join our platform as a <strong>${role}</strong>. Please use the following code to complete your signup:
        </p>
        <div style="background: #f4f4f4; border: 1px dashed #999; padding: 15px; font-size: 20px; font-weight: bold; text-align: center; margin: 20px 0; border-radius: 6px;">
          ${code}
        </div>
        <p style="color: #777777; font-size: 14px;">
          This code will expire in <strong>${expiresInHours} hours</strong>. Please do not share it with anyone.
        </p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://your-frontend-url/signup" style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Complete Signup
          </a>
        </div>
        <p style="color: #aaa; font-size: 12px; text-align: center; margin-top: 20px;">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `;

    // Send the email
    await transporter.sendMail({
      from: `"Admin Team" <aamireverlasting786@gmail.com>`,
      to: emailId,
      subject: "Signup Invite Code",
      html: htmlContent,
    });
    const audit = new AuditLog({
      action: 'Invite Code Generation',
      changedBy: req.user._id,
      inviteCode: newCode._id,
      targetEmail: emailId,
      roleInvited: role,
    });
    await audit.save();
    res.json({ code: newCode.code, message: "Invite sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = sharedRouter;

