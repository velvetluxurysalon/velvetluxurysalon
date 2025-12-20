# Integration Setup Instructions

## ✅ What's Already Connected

1. **Admin Panel**: `/admin`
   - Staff login and management
   - Services management  
   - Customers tracking
   - Appointments booking
   - Billing and payments
   - Loyalty program
   - Products/Inventory
   - Attendance

2. **Firebase**: Already configured with environment variables
   - Authentication working
   - Firestore database connected

3. **Frontend**: Professional landing page
   - Hero section
   - Services grid
   - Team section
   - Testimonials
   - Booking button
   - Newsletter signup

---

## ⚠️ What Needs Integration

### Step 1: Add AuthProvider to Main App

**File**: `src/main.tsx`

Update the main.tsx file to wrap your app with AuthProvider:

```tsx
import { AuthProvider } from "./app/context/AuthContext";

function RootWrapper() {
  return (
    <AuthProvider>
      <Router>
        <RootApp />
      </Router>
    </AuthProvider>
  );
}
```

### Step 2: Update Navigation to Add Login/Signup

**File**: `src/app/components/Navigation.tsx`

Add login and signup buttons to the navigation:

```tsx
import { useAuth } from "../context/AuthContext";

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  
  // Add buttons in navigation:
  // - If authenticated: Show "Profile" and "Logout"
  // - If not: Show "Login" and "Sign Up"
}
```

### Step 3: Create Login/Signup Modal

Create these new components:
- `src/app/components/LoginModal.tsx` - Customer login form
- `src/app/components/SignupModal.tsx` - Customer signup form

### Step 4: Update Services Grid

**File**: `src/app/components/ServicesGrid.tsx`

Replace hardcoded services with Firebase data:

```tsx
import { getServices } from "../services/firebaseService";

const [services, setServices] = useState([]);

useEffect(() => {
  const loadServices = async () => {
    const data = await getServices();
    setServices(data);
  };
  loadServices();
}, []);
```

### Step 5: Connect Booking Button

**File**: `src/app/components/HeroSection.tsx`

Link the "Book an Appointment" button to the public booking page:

```tsx
const handleBooking = () => {
  window.location.href = '/admin/book';
};
```

### Step 6: Update Testimonials

**File**: `src/app/components/TestimonialsSection.tsx`

Fetch real reviews from Firebase:

```tsx
import { getReviews } from "../services/firebaseService";

const [testimonials, setTestimonials] = useState([]);

useEffect(() => {
  const loadReviews = async () => {
    const data = await getReviews();
    setTestimonials(data);
  };
  loadReviews();
}, []);
```

---

## 🚀 Testing the Integration

### Test Customer Signup
1. Go to frontend
2. Click login/signup
3. Create a new customer account
4. Verify account created in Firebase Firestore (`customers` collection)

### Test Admin View
1. Go to `/admin`
2. Login with admin credentials
3. Check `Customers` tab
4. Verify new customer appears there

### Test Booking
1. As logged-in customer, click "Book an Appointment"
2. Select service, date, time
3. Complete booking
4. Go to admin `/admin/appointments`
5. Verify booking appears there

### Test Services
1. Verify frontend shows services from Firebase
2. Edit a service in admin panel
3. Refresh frontend - new price should show

---

## 📝 Database Queries

### Add test data to Firestore

**Sample Service** (in admin panel or manually):
```
Collection: services
serviceName: "Premium Haircut"
price: 45
duration: 30
category: "Hair"
description: "Professional haircut"
```

**Sample Review** (manually in Firestore):
```
Collection: reviews
customerId: "user_id"
serviceId: "service_id"
rating: 5
reviewText: "Amazing experience!"
createdAt: timestamp
```

---

## 🔗 Important Links

- **Frontend**: http://localhost:5173
- **Admin**: http://localhost:5173/admin
- **Admin Login**: http://localhost:5173/admin/login
- **Public Booking**: http://localhost:5173/admin/book

---

## 📋 Next Tasks

- [ ] Wrap app with AuthProvider
- [ ] Update Navigation with auth buttons
- [ ] Create Login/Signup modals
- [ ] Update ServicesGrid with Firebase data
- [ ] Connect Booking button
- [ ] Update Testimonials component
- [ ] Test signup → admin visible
- [ ] Test booking → admin visible
- [ ] Test service update flow

---

## ⚠️ Common Issues

**"Module not found" errors**: Run `npm install` again

**Firebase not connecting**: Check `.env.local` has all VITE_FIREBASE variables

**Styles not loading**: Clear browser cache and restart dev server

**Auth not working**: Verify Firebase Authentication enabled in console

---

**Status**: Ready for implementation
**Last Updated**: December 20, 2025
