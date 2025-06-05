const cron = require("node-cron");
const escalateHighPriorityComplaints = require("../utils/highPriorityEscalation");
cron.schedule('0,* * * * ', async () => {
    await escalateHighPriorityComplaints();
});