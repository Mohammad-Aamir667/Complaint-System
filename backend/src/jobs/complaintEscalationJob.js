const cron = require("node-cron");
const highPriorityEscalation = require("../utils/highPriorityEscalation");
cron.schedule('0,* * * * ', async () => {
    await highPriorityEscalation();
});