# Frontend & Admin Integration Guide

## Overview
Your Salon Landing Page now has unified routing that allows both the frontend landing page and the admin dashboard to work together in a single application.

## Route Structure

### Frontend Routes
- `/` - Home page (landing page)
- `/#home` - Hero section
- `/#services` - Services section
- `/#team` - Team section
- `/#gallery` - Gallery section
- `/#offers` - Special offers section
- `/#contact` - Contact section

### Admin Routes
- `/admin` - Admin reception/home
- `/admin/login` - Admin login
- `/admin/book` - Public booking page
- `/admin/dashboard` - Dashboard
- `/admin/services` - Services management
- `/admin/products` - Inventory/Products
- `/admin/staff` - Staff management
- `/admin/customers` - Customers
- `/admin/billing` - Billing
- `/admin/appointments` - Appointments
- `/admin/loyalty` - Loyalty program
- `/admin/attendance` - Attendance

## How It Works

### Main Entry Point (`src/main.tsx`)
The main entry point now uses React Router to:
1. Wrap the entire app with `<BrowserRouter>`
2. Route `/admin/*` requests to the `AdminApp` component
3. Route all other requests to the frontend `App` component

### Routing Priority
Routes are checked in this order:
1. `/admin/*` - Goes to admin system
2. `/*` - Goes to frontend landing page

### Component Updates

#### Frontend App (`src/app/App.tsx`)
- Added `useLocation` hook to detect current route
- Prevents rendering on `/admin` routes (returns `null`)
- Allows admin to handle its own routes

#### Admin App (`src/admin/src/App.jsx`)
- Removed `<BrowserRouter>` wrapper (handled by main app)
- Updated all route paths to include `/admin` prefix
- Redirect to `/admin/login` instead of `/login`
- Removed `Router` component - now uses `Routes` and `Route` directly

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

This installs `react-router-dom` which was added to `package.json`.

### 2. Run Development Server
```bash
npm run dev
```

### 3. Access the Application
- **Frontend**: `http://localhost:5173`
- **Admin**: `http://localhost:5173/admin`
- **Admin Login**: `http://localhost:5173/admin/login`

## Important Notes

### Firebase Configuration
Both frontend and admin share the same Firebase configuration (`src/admin/src/firebaseConfig.js`). Make sure Firebase is properly configured for:
- Authentication
- Firestore Database
- Any other services you're using

### Session Management
- Users logging into the admin system are authenticated via Firebase
- Authentication is managed in `AuthContext.jsx` in the admin panel
- Consider sharing authentication state between frontend and admin if needed

### Styling & CSS
Both applications share:
- Tailwind CSS configuration
- Global CSS from `src/styles/`
- The admin app has its own CSS files in `src/admin/src/`

## Troubleshooting

### Issue: Blank page or 404 on `/admin` route
**Solution**: Ensure the development server is running and dependencies are installed:
```bash
npm install
npm run dev
```

### Issue: Admin routes not working
**Solution**: Check that all routes in admin nav items have `/admin` prefix in `src/admin/src/App.jsx`

### Issue: Frontend page showing on admin routes
**Solution**: Frontend App now checks `useLocation()` and returns `null` on `/admin` routes. Make sure this is not being overridden.

### Issue: Styling/CSS not loading in admin
**Solution**: Admin CSS is imported in `src/admin/src/index.css`. Make sure this file is being loaded.

## Next Steps

### Optional: Share Authentication State
You might want to create a shared authentication context that both frontend and admin can access.

### Optional: Create a Navigation Link to Admin
Add a link in the frontend Navigation component to point to `/admin` for admin users.

### Optional: Move firebaseConfig.js
Consider moving `firebaseConfig.js` to the root `src/` folder to share between frontend and admin.

## File Changes Summary

1. **package.json** - Added `react-router-dom` dependency
2. **src/main.tsx** - Added routing wrapper with Router and Routes
3. **src/app/App.tsx** - Added useLocation check to prevent rendering on `/admin`
4. **src/admin/src/App.jsx** - Removed Router wrapper, updated all routes to include `/admin` prefix
