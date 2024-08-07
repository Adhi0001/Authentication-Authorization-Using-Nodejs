const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../database/model/user");

async function initAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log("Admin user already exists.");
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash("admin_password", 10); // Replace with actual password
        const adminUser = new User({
            name: "Admin",
            username: "admin",
            email: "admin@example.com",
            password: hashedPassword,
            role: "admin"
        });

        await adminUser.save();
        console.log("Admin user created successfully.");

    } catch (error) {
        console.error("Error initializing admin user:", error);
    } finally {
        // Disconnect from MongoDB
        mongoose.disconnect();
    }
}

module.exports={initAdminUser}
