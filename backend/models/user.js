const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    // superadmin = all admin powers + user management
    role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
