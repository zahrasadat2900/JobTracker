# MERN Job Application Tracker

A full-stack MERN (MongoDB, Express, React, Node.js) application built for tracking job applications, interviewing status, and analytics. Designed for high readability, clean architecture, and technical interview demonstrations.

## Features
- **User Authentication**: Secure JWT-based registration and login.
- **CRUD Operations**: Add, view, edit status, and delete job applications.
- **Filtering & Sorting**: Filter jobs by status (`Applied`, `Interviewing`, `Offered`, `Rejected`) or sort chronologically.
- **Real-Time Analytics**: Dashboard calculating total applications, active interviews, offers, and response rates.

---

## Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (v16+)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or local MongoDB instance

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobtracker?retryWrites=true&w=majority
JWT_SECRET=supersecretkey123
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

Open `http://localhost:3000` in your browser.
