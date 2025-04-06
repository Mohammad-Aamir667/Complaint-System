require("dotenv").config()
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cookieParser = require("cookie-parser");
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000
const authRouter = require("./routes/auth");
const userComplaintRouter = require("./routes/complaints/userComplaint");
const adminComplaintRouter = require("./routes/complaints/adminComplaint");
const managerComplaintRouter = require("./routes/complaints/managerComplaint");
app.use("/",authRouter);
app.use("/",userComplaintRouter);
app.use("/",adminComplaintRouter);
app.use("/",managerComplaintRouter);
connectDB().then(()=>{
    console.log("connected successfully")
    server.listen(PORT,"0.0.0.0",()=>{
        console.log("server is successfully connected");
        console.log(PORT);
    })
  }).catch((err)=>{
    console.log(err);
    console.log("could not connect")
  });