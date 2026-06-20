# MediTrack - Full-Stack Patient Management System

A complete MERN stack application (MongoDB, Express, React, Node.js) for managing patient records.

## Project Structure
- `/backend`: Node.js + Express API server, Mongoose models, and MongoDB connection.
- `/frontend`: React application built with Vite, featuring a premium modern UI.

## Setup & Running Instructions

### 1. Backend Setup
Open a terminal and navigate to the `backend` directory:
```bash
cd backend
```

*(Note: Dependencies are already installed via `npm install`.)*

Start the backend development server:
```bash
npm run dev
```
*The API server will run on `http://localhost:5000` and connect to the configured MongoDB cluster.*

### 2. Frontend Setup
Open a **new separate terminal** and navigate to the `frontend` directory:
```bash
cd frontend
```

*(Note: Dependencies are already installed via `npm install`.)*

Start the Vite React development server:
```bash
npm run dev
```
*The frontend application will be available at `http://localhost:5173`. Open this URL in your browser.*

## Features
- **Create**: Register new patients with their details, diagnosis, and medical status.
- **Read**: View all registered patients in a clean, tabular glassmorphism interface.
- **Update**: Edit and update existing patient records.
- **Delete**: Remove patient records safely.
- **Modern UI**: Designed with beautiful aesthetics, smooth hover animations, and intuitive forms using vanilla CSS.
