# 🚦 SPHN — Smart Traffic Violation Reporting & Analytics System

A full-stack web application enabling citizens to report traffic violations, and providing traffic police with an analytics dashboard for manual verification and enforcement.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)

---

## 📁 Project Structure

```
Project SPHN/
├── client/          # React frontend (Vite)
├── server/          # Node.js + Express backend
└── README.md
```

## ✨ Features

### 👤 User Features
- Registration & secure JWT login
- Capture/upload photos and videos of violations
- Automatic GPS location detection
- Select violation type (10+ categories)
- View report history with status tracking

### 🛡️ Admin/Police Features
- Secure admin dashboard
- View all reports with evidence
- Interactive map with violation markers
- Approve/reject reports with notes
- Manually enter verified vehicle data
- User management

### 📈 Analytics
- Bar charts: most common violations
- Pie charts: status distribution, vehicle types
- Line charts: daily/weekly/monthly trends
- Interactive heatmap of violation hotspots
- Area-wise violation statistics

### 🎨 Design
- Modern responsive UI with glassmorphism
- Dark and light mode toggle
- Mobile-first responsive design
- Smooth micro-animations
- Inter font, gradient accents

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and npm
- **MongoDB** (local or Atlas cloud)

### 1. Backend Setup

```bash
cd server
npm install
```

Create `.env` file (already included with defaults):
```env
MONGO_URI=mongodb://localhost:27017/sphn
JWT_SECRET=sphn_super_secret_key_2024
PORT=5000
```

Start the server:
```bash
npm start
```

Server runs on `http://localhost:5000`. An admin user is auto-seeded:
- **Email:** admin@sphn.com
- **Password:** admin123

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## 📡 API Endpoints

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/register` | POST | — | Register user |
| `/api/auth/login` | POST | — | Login, returns JWT |
| `/api/auth/me` | GET | User | Get profile |
| `/api/reports` | POST | User | Create report (multipart) |
| `/api/reports/my` | GET | User | Get user's reports |
| `/api/reports/:id` | GET | User | Get single report |
| `/api/admin/reports` | GET | Admin | All reports (filterable) |
| `/api/admin/reports/:id` | PUT | Admin | Update report status |
| `/api/admin/reports/:id` | DELETE | Admin | Delete report |
| `/api/admin/users` | GET | Admin | List all users |
| `/api/analytics/summary` | GET | Admin | Violation statistics |
| `/api/analytics/heatmap` | GET | Admin | Location data for heatmap |
| `/api/analytics/areas` | GET | Admin | Area-wise stats |
| `/api/health` | GET | — | Server health check |

---

## 🗄️ Database Schema

### Users
| Field | Type | Notes |
|---|---|---|
| name | String | Required, max 50 chars |
| email | String | Unique, required |
| password | String | bcrypt hashed, min 6 chars |
| role | String | 'user' or 'admin' |
| timestamps | Date | Auto (createdAt, updatedAt) |

### Reports
| Field | Type | Notes |
|---|---|---|
| user | ObjectId | Ref → Users |
| violationType | String | Enum (10 types) |
| description | String | Optional, max 500 chars |
| media | Array | `[{ url, type: 'image'|'video' }]` |
| location | GeoJSON | `{ coordinates: [lng, lat], address }` |
| verifiedNumberPlate | String | Populated by police during review |
| verifiedVehicleType | String | Populated by police during review |
| status | String | pending / approved / rejected |
| adminNotes | String | Review notes |
| timestamps | Date | Auto |

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Recharts, Leaflet |
| Backend | Node.js, Express, Mongoose, JWT, Multer |
| Database | MongoDB |
| Maps | Leaflet + OpenStreetMap |
| Auth | JWT (JSON Web Tokens) |
| Styling | Vanilla CSS with custom properties |

---

## 📱 Pages

| Page | Path | Access |
|---|---|---|
| Home | `/` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Dashboard | `/dashboard` | User |
| Submit Report | `/submit-report` | User |
| Report History | `/report-history` | User |
| Admin Dashboard | `/admin` | Admin |
| Admin Reports | `/admin/reports` | Admin |
| Admin Users | `/admin/users` | Admin |
| Analytics | `/analytics` | Admin |

---

## 🔐 Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@sphn.com | admin123 |

---

## 📦 Deployment

### Production Build (Frontend)
```bash
cd client
npm run build
```

The `dist/` folder can be served by any static hosting (Nginx, Vercel, Netlify).

### Production (Backend)
Set environment variables and use a process manager:
```bash
cd server
NODE_ENV=production pm2 start server.js
```

### MongoDB Atlas
For cloud deployment, update `MONGO_URI` in `.env` with your Atlas connection string.

---

## 📝 License

MIT © SPHN Team
