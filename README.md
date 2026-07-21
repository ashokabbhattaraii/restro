# Sangita Restaurant Project

This repository contains both the frontend (Next.js) and backend (Node.js/Express) for the Sangita Restaurant.

## Project Structure

- `restaurant/` - Frontend (Next.js app)
- `my-backend/` - Backend (Node.js/Express API)

## Setup

1. Copy environment files:
   ```bash
   cp restaurant/.env.example restaurant/.env
   cp my-backend/.env.example my-backend/.env
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd restaurant && npm install

   # Install backend dependencies and seed database
   cd ../my-backend && pnpm run setup
   ```

3. Start development servers:
   ```bash
   # Terminal 1: Start frontend
   cd restaurant && npm run dev

   # Terminal 2: Start backend
   cd ../my-backend && pnpm run dev
   ```

4. Open your browser to http://localhost:3000 for the frontend.
   The backend API will be running at http://localhost:5000 (or as configured in .env).

## Available Scripts

### Frontend (`restaurant`)
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server

### Backend (`my-backend`)
- `pnpm run dev`: Start development server
- `pnpm run build`: Build for production
- `pnpm run start`: Start production server
- `pnpm run seed`: Seed the database
- `pnpm run setup`: Install dependencies and seed the database
- `pnpm run seed:admin`: Seed admin user only

## Environment Variables

### Frontend (`.env` in `restaurant`)
- `NEXT_PUBLIC_API_URL`: URL of the backend API (default: http://localhost:5000)
- `NEXTAUTH_URL`: URL for NextAuth (default: http://localhost:3000)
- `AUTH_URL`: Same as NEXTAUTH_URL
- `AUTH_SECRET`: Secret for NextAuth (generate a strong secret)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: Google reCAPTCHA site key (for forms)
- `ADMIN_EMAIL`: Email for admin user
- `ADMIN_PASSWORD_HASH`: Hashed password for admin (generate with: `node -e "require('bcryptjs').hash('yourpassword', 12).then(console.log)"`)

### Backend (`.env` in `my-backend`)
- `PORT`: Port for the server (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JSON Web Tokens
- `JWT_EXPIRES_IN`: Expiration time for JWT (e.g., 24h)
- `ADMIN_EMAIL`: Email for admin user
- `ADMIN_PASSWORD`: Plain text password for admin (will be hashed on seed)
- `CLIENT_URL`: URL of the frontend (default: http://localhost:3000)
- `RECAPTCHA_SECRET_KEY`: Google reCAPTCHA secret key
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret