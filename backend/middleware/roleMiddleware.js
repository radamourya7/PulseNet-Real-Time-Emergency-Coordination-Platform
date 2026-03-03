/**
 * Role-based access middleware.
 * Use after the `protect` middleware (which sets req.user).
 */

// Allow admins and superadmins
const requireAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (req.user.role === "admin" || req.user.role === "superadmin") return next();
    return res.status(403).json({ message: "Admin access required" });
};

// Only superadmins
const requireSuperAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (req.user.role === "superadmin") return next();
    return res.status(403).json({ message: "Super-admin access required" });
};

module.exports = { requireAdmin, requireSuperAdmin };
