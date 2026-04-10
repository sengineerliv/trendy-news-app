## Trendy News App Auth (bcryptjs)

A full-stack TypeScript application that delivers personalized news using modern web technologies.

## 🚀 Features

- 🔐 Authentication (JWT)
- 🧠 Personalized news feed
- ⭐ Bookmark articles
- 🔍 Search & filtering
- ⚡ Real-time updates 

## 🛠️ Tech Stack

### Frontend
- Next.js (TypeScript)
- React
- Custom hooks

### Backend
- Node.js + Express (TypeScript)
- MongoDB + Mongoose
- REST API 

This app includes password authentication with:
- `bcryptjs` password hashing
- Signup and login API routes
- Signed `httpOnly` session cookies
- Protected dashboard route

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add an auth secret in `.env.local`:
```bash
AUTH_SECRET=replace-with-a-long-random-secret
```

3. Start the app:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Auth Endpoints

- `POST /api/auth/signup` `{ email, password }`
- `POST /api/auth/login` `{ email, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Notes

- Users are saved in `data/users.json` for local development.
