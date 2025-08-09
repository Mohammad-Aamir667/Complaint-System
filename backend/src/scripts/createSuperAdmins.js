const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("../config/db");
const User = require("../models/user");
require("dotenv").config();

async function createSuperAdmins() {
    try {
        await connectDB();
        console.log("Connected to the database.");

        const superAdmins = [
            {
                firstName: "Aarav",
                lastName: "Sharma",
                emailId: "aarav123@gmail.com",
                password: process.env.SUPER_ADMIN_PASSWORD_HR,
                department: "HR",
                gender: "male"
            },
            {
                firstName: "Priya",
                lastName: "Mehta",
                emailId: "priya123@gmail.com",
                password: process.env.SUPER_ADMIN_PASSWORD_IT,
                department: "IT",
                gender: "female"
            },
            {
                firstName: "Rohan",
                lastName: "Kapoor",
                emailId: "rohan123@gmail.com",
                password: process.env.SUPER_ADMIN_PASSWORD_FACILITIES,
                department: "Facilities",
                gender: "male"
            },
            {
                firstName: "Sneha",
                lastName: "Iyer",
                emailId: "sneha123@gmail.com",
                password: process.env.SUPER_ADMIN_PASSWORD_FINANCE,
                department: "Finance",
                gender: "female"
            }
        ];

        for (const admin of superAdmins) {
            const existing = await User.findOne({ emailId: admin.emailId });
            if (existing) {
                console.log(`Super Admin ${admin.department} already exists. Skipping.`);
                continue;
            }
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            const newAdmin = new User({
                ...admin,
                password: hashedPassword,
                role: "superadmin"
            });
            await newAdmin.save();
            console.log(`Super Admin ${admin.department} created successfully!`);
        }

    } catch (err) {
        console.error("Error creating superadmins:", err);
    } finally {
        mongoose.connection.close();
        console.log("Database connection closed.");
    }
}

createSuperAdmins();
