# 📝 Notely — Real-Time Collaborative Notes App

A full-stack real-time collaborative notes application built with React, Node.js, PostgreSQL, and Socket.io.

---

## 🏗️ Architecture

```
Frontend  →  React (Vite) + Socket.io-client  →  Vercel / Netlify
Backend   →  Express.js  + Socket.io           →  Railway / Render
Database  →  PostgreSQL                         →  Railway / Supabase
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

---

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd collab-notes-app
```

---

### 2. Database Setup

**Create the database:**
```bash
createdb collab_notes
```

**Run the schema:**
```bash
psql collab_notes -f backend/src/db/schema.sql
```

---

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

**Edit `.env`:**
```
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/collab_notes
JWT_SECRET=your_super_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Start backend:**
```bash
npm run dev
```

---

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

**Edit `.env`:**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Start frontend:**
```bash
npm run dev
```

App runs at: http://localhost:5173

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/users/me | ✅ | Get current user |
| PATCH | /api/users/me | ✅ | Update profile |
| GET | /api/users | ✅ | List all users |

### Notes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/notes | ✅ | Get all accessible notes |
| GET | /api/notes/:id | ✅ | Get single note |
| POST | /api/notes | ✅ | Create note |
| PATCH | /api/notes/:id | ✅ | Update note (owner/editor) |
| DELETE | /api/notes/:id | ✅ | Delete note (owner only) |

### Collaborators
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/notes/:noteId/collaborators | ✅ | List collaborators |
| POST | /api/notes/:noteId/collaborators | ✅ | Add collaborator by email |
| DELETE | /api/notes/:noteId/collaborators/:userId | ✅ | Remove collaborator |

### Activity
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/notes/:noteId/activity | ✅ | Get note activity log |

### Search
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/search?q=keyword | ✅ | Search notes by title/content |

### Share
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/notes/:noteId/share | ✅ | Get public share token |
| POST | /api/notes/:noteId/share/regenerate | ✅ | Regenerate share token |
| GET | /api/shared/:token | ❌ | Public read-only view |

---

## 🗄️ Database Schema

```sql
users               -- id, name, email, password, role, created_at
notes               -- id, title, content, owner_id, share_token, created_at, updated_at
note_collaborators  -- note_id, user_id, permission (Editor|Viewer)
activity_logs       -- id, note_id, user_id, action, meta, created_at
```

---

## 🔌 WebSocket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `join-note` | Client → Server | noteId |
| `leave-note` | Client → Server | noteId |
| `note:edit` | Client → Server | { noteId, title, content } |
| `note:update` | Server → Client | { noteId, title, content, userName } |
| `note:typing` | Client → Server | { noteId } |
| `note:typing` | Server → Client | { userName } |
| `user-joined` | Server → Client | { userId, userName } |
| `user-left` | Server → Client | { userId, userName } |

---

## 🚀 Deployment

### Backend (Railway)
1. Connect your GitHub repo
2. Set environment variables (DATABASE_URL, JWT_SECRET, FRONTEND_URL, NODE_ENV=production)
3. Set start command: `node server.js`

### Frontend (Vercel)
1. Import frontend folder
2. Set VITE_API_URL and VITE_SOCKET_URL to your backend Railway URL
3. Deploy

---

## 👥 Roles

| Role | Create Notes | Edit Own Notes | Edit Shared Notes | Delete Notes | Manage Collaborators |
|------|-------------|----------------|-------------------|--------------|---------------------|
| Admin | ✅ | ✅ | ✅ (if Editor) | ✅ own only | ✅ own only |
| Editor | ✅ | ✅ | ✅ (if Editor) | ✅ own only | ✅ own only |
| Viewer | ✅ | ✅ | ❌ | ✅ own only | ✅ own only |
