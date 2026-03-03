const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Attach io to app so routes can access it via req.app.get('io')
app.set("io", io);

io.on("connection", (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`✂️  Socket disconnected: ${socket.id}`);
    });
});

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}));
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));

// Health check
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "PulseNet API Running" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`\n🚀 PulseNet backend running on http://localhost:${PORT}`);
    console.log(`⚡ Socket.IO ready`);
});