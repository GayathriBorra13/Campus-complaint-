# Campus Complaint Management System

A MERN-based Campus Complaint Management System with MongoDB, Express, React and Node.js.

## Features
- Student registration and login
- Admin login
- JWT authentication
- Student and admin dashboards
- Dynamic complaint data stored in MongoDB
- Complaint categories, departments and priorities
- Up to 5 complaint attachments
- Admin status updates and remarks
- Up to 5 resolution attachments
- Student complaint history
- Professional responsive UI
- Backend has NO `src` folder

## Requirements
- Node.js 18+
- MongoDB local server OR MongoDB Atlas

## 1. Backend
Open terminal:
```bash
cd backend
npm install
```

Copy `.env.example` to `.env`.

For local MongoDB:
```env
MONGO_URI=mongodb://127.0.0.1:27017/campus_complaints
```

Then:
```bash
npm run dev
```

Backend runs at:
http://localhost:5000

Default admin:
- Email: admin@campus.com
- Password: Admin@123

Change these in `.env` before real use.

## 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend:
http://localhost:5173

## Important
Start MongoDB first. If using Atlas, replace `MONGO_URI` in `.env` with your Atlas connection string.

Do not commit `.env` or uploaded files to GitHub.
