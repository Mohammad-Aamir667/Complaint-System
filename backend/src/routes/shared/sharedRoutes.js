const User = require("../../models/user");
const Complaint = require("../../models/complaint");
const { userAuth } = require("../../middlewares/auth");
const sharedRouter = require("express").Router();
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
module.exports = sharedRouter;

