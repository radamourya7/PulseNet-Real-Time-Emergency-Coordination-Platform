# ⚡ PulseNet — Real-Time Emergency Coordination Platform

> A full-stack MERN application for real-time emergency coordination, live GPS tracking, and SOS alert management — built for security teams, event coordinators, and first responders.

---

## 🚀 Features

### 👤 User Dashboard
- **Live GPS tracking** — broadcasts real coordinates via browser geolocation
- **SOS Panic Button** — one tap sends an emergency alert with your GPS coordinates to all admins instantly
- **My Alert History** — tracks all alerts sent in the current session
- **Role-aware sidebar** — navigation adapts based on user/admin role

### 🛡️ Admin Command Center
- **Real-time Leaflet.js map** — alerts appear as live pins on an interactive dark-theme map (OpenStreetMap / CartoDB)
- **Socket.IO live feed** — new SOS alerts appear on the map in real time, no refresh needed
- **Alert management** — filter by severity, search by name, mark alerts as resolved
- **Role-based access** — only `admin` and `superadmin` can access the command center

### 🔐 Authentication
- JWT-based auth with role support (`user`, `admin`, `superadmin`)
- Protected routes on both frontend and backend
- Passwords hashed with bcryptjs

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router v7 |
| **Styling** | Vanilla CSS (custom design system) |
| **Map** | Leaflet.js + CartoDB dark tiles |
| **Real-time** | Socket.IO |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT + bcryptjs |

---

## 📁 Project Structure

```
PulseNet/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── middleware/     # JWT auth + role guards
│   ├── models/         # User, Alert schemas
│   ├── routes/         # /api/auth, /api/alerts
│   ├── server.js       # Express + Socket.IO server
│   └── .env.example    # Environment variable template
├── src/
│   ├── components/     # Sidebar (role-aware)
│   ├── hooks/          # useSocket.js
│   ├── pages/          # Landing, Login, Register, Dashboard, Admin, Events
│   ├── api.js          # Centralized fetch helper + JWT utils
│   └── App.jsx         # Routing + ProtectedRoute
└── vite.config.js      # Vite proxy → backend:5000
```

---

## ⚙️ Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/radamourya7/PulseNet-Real-Time-Emergency-Coordination-Platform.git
cd PulseNet-Real-Time-Emergency-Coordination-Platform
```

### 2. Configure environment variables
```bash
cd backend
cp .env.example .env
# Fill in your MongoDB URI and JWT secret
```

### 3. Install dependencies
```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

### 4. Run the app

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 5000)
cd backend
node server.js

# Terminal 2 — Frontend (port 5173)
cd ..
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Register a new user |
| `POST` | `/api/auth/login` | — | Login, returns JWT |
| `POST` | `/api/alerts` | User | Create SOS alert |
| `GET` | `/api/alerts` | Admin | Get all alerts |
| `PATCH` | `/api/alerts/:id` | Admin | Update alert status |
| `DELETE` | `/api/alerts/:id` | Admin | Delete alert |

---

## 🔔 Real-Time Events (Socket.IO)

| Event | Direction | Description |
|---|---|---|
| `new-alert` | Server → Client | Emitted when a user sends SOS |
| `alert-updated` | Server → Client | Emitted when an admin resolves an alert |
| `alert-deleted` | Server → Client | Emitted when an alert is deleted |

---

## 🔒 Roles

| Role | Access |
|---|---|
| `user` | Dashboard, Events, own alerts |
| `admin` | Everything above + Command Center map + alert management |
| `superadmin` | All admin powers + Super Admin badge |

---

## 📄 License

MIT — free to use and modify.
