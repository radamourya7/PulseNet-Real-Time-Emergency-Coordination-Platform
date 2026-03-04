const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const seedSuperAdmin = require("./scripts/seedSuperAdmin");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// ── CORS ──────────────────────────────────────────────────────────────────────
// In production: set CORS_ORIGIN env var to your Vercel frontend URL.
// e.g. CORS_ORIGIN=https://pulsenet.vercel.app
// In development: allow all local network IPs automatically.
function isAllowedOrigin(origin) {
    if (!origin) return true;  // curl / Postman
    if (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN) return true;
    // Allow any HTTPS origin in production (Vercel preview URLs change)
    if (process.env.NODE_ENV === "production" && origin.startsWith("https://")) return true;
    // Local dev — allow any local network IP
    return (
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.") ||
        origin.startsWith("http://192.168.") ||
        origin.startsWith("http://10.") ||
        origin.startsWith("http://172.")
    );
}

const corsOptions = {
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) callback(null, true);
        else callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
};

// ── Socket.IO ─────────────────────────────────────────────────────────────────
const io = new Server(server, { cors: corsOptions });
app.set("io", io);

io.on("connection", (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    socket.on("join-admin-room", (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role === "admin") {
                socket.join(`admin:${decoded.id}`);
                console.log(`🏠 Admin ${decoded.id} joined room admin:${decoded.id}`);
            }
            if (decoded.role === "superadmin") {
                socket.join("superadmin-room");
                console.log(`🏠 Superadmin joined superadmin-room`);
            }
        } catch {
            console.warn("join-admin-room: invalid token");
        }
    });

    // Any authenticated user joins their personal room to receive resolve notifications
    socket.on("join-user-room", (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.join(`user:${decoded.id}`);
            console.log(`🏠 User ${decoded.id} joined room user:${decoded.id}`);
        } catch {
            console.warn("join-user-room: invalid token");
        }
    });

    socket.on("disconnect", () => {
        console.log(`✂️  Socket disconnected: ${socket.id}`);
    });
});

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json());

// Database + seed superadmin
connectDB().then(() => seedSuperAdmin());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => res.json({ status: "ok", message: "PulseNet API Running" }));

// ── Listen ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 PulseNet backend on http://0.0.0.0:${PORT}`);
    if (process.env.NODE_ENV !== "production") {
        console.log(`📱 Network: http://172.20.10.3:${PORT}`);
    }
    console.log(`⚡ Socket.IO ready`);
});