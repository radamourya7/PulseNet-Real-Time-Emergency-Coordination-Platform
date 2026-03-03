const bcrypt = require("bcryptjs");
const User = require("../models/user");

async function seedSuperAdmin() {
    try {
        const hashedPassword = await bcrypt.hash("PulseNet@SuperAdmin2026", 10);

        // Upsert: create if not exists, always enforce correct role + status
        const result = await User.findOneAndUpdate(
            { email: "superadmin@pulsenet.com" },
            {
                $setOnInsert: { name: "Super Admin", password: hashedPassword },
                $set: { role: "superadmin", status: "approved" },
            },
            { upsert: true, new: true }
        );

        const wasCreated = result.createdAt?.getTime() === result.updatedAt?.getTime();
        if (wasCreated) {
            console.log("✅ Superadmin account created:");
            console.log("   📧 Email:    superadmin@pulsenet.com");
            console.log("   🔑 Password: PulseNet@SuperAdmin2026");
        } else {
            console.log("✅ Superadmin account verified (role: superadmin, status: approved)");
        }
    } catch (err) {
        console.error("❌ Failed to seed superadmin:", err.message);
    }
}

module.exports = seedSuperAdmin;
