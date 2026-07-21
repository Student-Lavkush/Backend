import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../src/models/user.js"; 

dotenv.config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        // Create admin
        const admin = await User.create({
            fullName: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
        });

        console.log("✅ Admin created successfully!");
        console.log({
            email: admin.email,
            password: "Admin@123",
        });

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

seedAdmin();