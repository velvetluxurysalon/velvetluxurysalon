# Frontend & Admin Panel Integration Guide

## Overview
Complete integration between the Salon Landing Page Frontend and Admin Dashboard using Firebase.

---

## 1. AUTHENTICATION SYSTEM

### Admin Panel Authentication (✅ Already Configured)
- **Location**: `/admin/login`
- **System**: Firebase Authentication
- **Features**: Admin login for staff management

### Frontend User Authentication (⚠️ NEEDS SETUP)
- **Location**: Frontend needs signup/login for customers
- **Database**: Firebase Firestore - Collection: `customers`
- **Fields**: email, password, name, phone, createdAt

**Action Items**:
- [ ] Create customer signup modal on frontend
- [ ] Create customer login modal on frontend
- [ ] Store customer profiles in Firebase Firestore
- [ ] Add authentication context for frontend users

---

## 2. SERVICES MANAGEMENT

### Admin Services Panel (✅ Already Configured)
- **Location**: `/admin/services`
- **Database**: Firebase Firestore - Collection: `services`
- **Fields**: serviceName, description, price, duration, category

### Frontend Services Display (✅ Already Configured)
- **Location**: `src/app/components/ServicesGrid.tsx`
- **Shows**: Featured services with ratings

**Integration Needed**:
- [ ] Fetch real services from Firebase instead of hardcoded data
- [ ] Display live pricing from admin panel
- [ ] Show availability status

---

## 3. BOOKING SYSTEM

### Admin Public Booking Page (✅ Already Configured)
- **Location**: `/admin/book`
- **Database**: Firebase Firestore - Collection: `appointments`
- **Features**: 
  - Service selection
  - Date & time booking
  - Customer details capture
  - Auto-generates appointment ID

### Frontend Booking Integration (⚠️ NEEDS SETUP)
- **Current**: "Book an Appointment" button on hero
- **Target**: Redirect to `/admin/book` or embedded booking modal

**Action Items**:
- [ ] Create "Book Appointment" button on frontend
- [ ] Link to `/admin/book` public booking page
- [ ] Create booking modal on frontend (optional)
- [ ] Add customer name pre-fill if logged in

---

## 4. PRODUCTS/INVENTORY SYSTEM

### Admin Products Panel (✅ Already Configured)
- **Location**: `/admin/products`
- **Database**: Firebase Firestore - Collection: `products`
- **Fields**: productName, description, price, stock, category

### Frontend Products Display (⚠️ NEEDS SETUP)
- **Target**: Create products/shop page
- **Location**: `src/app/components/ProductsPage.tsx`

**Action Items**:
- [ ] Create Products page component
- [ ] Fetch products from Firebase
- [ ] Display product cards with images
- [ ] Add to cart functionality
- [ ] Checkout integration

---

## 5. CUSTOMERS MANAGEMENT

### Admin Customers Panel (✅ Already Configured)
- **Location**: `/admin/customers`
- **Database**: Firebase Firestore - Collection: `customers`
- **Features**: View all customers, contact info, visit history

### Frontend Customer Profile (⚠️ NEEDS SETUP)
- **Location**: `src/app/components/CustomerProfile.tsx`
- **Features**: View own bookings, loyalty points, saved preferences

**Action Items**:
- [ ] Create customer dashboard
- [ ] Show booking history
- [ ] Show loyalty points
- [ ] Allow profile editing

---

## 6. REVIEWS/TESTIMONIALS

### Admin Reviews Management (⚠️ TO CHECK)
- **Database**: Firebase Firestore - Collection: `reviews`
- **Fields**: rating (1-5), review text, customerName, date, verified

### Frontend Reviews Display (✅ Already Configured)
- **Location**: `src/app/components/TestimonialsSection.tsx`
- **Shows**: Hardcoded testimonials

**Action Items**:
- [ ] Fetch reviews from Firebase
- [ ] Allow logged-in customers to submit reviews
- [ ] Display verified badge
- [ ] Show average rating

---

## 7. STAFF MANAGEMENT

### Admin Staff Panel (✅ Already Configured)
- **Location**: `/admin/staff`
- **Database**: Firebase Firestore - Collection: `staff`
- **Fields**: name, email, phone, specialization, availability

### Frontend Staff Display (⚠️ NEEDS SETUP)
- **Location**: Already shows in `TeamSection.tsx`

**Action Items**:
- [ ] Fetch staff from Firebase
- [ ] Display staff with their services
- [ ] Show staff availability for booking

---

## 8. ATTENDANCE & APPOINTMENTS

### Admin Appointments Panel (✅ Already Configured)
- **Location**: `/admin/appointments`
- **Database**: Firebase Firestore - Collection: `appointments`

### Frontend Booking Status (⚠️ NEEDS SETUP)
- **Features**: Show booking confirmation, status updates

**Action Items**:
- [ ] Show appointment confirmation to customers
- [ ] Add booking status notifications
- [ ] Add appointment reminders

---

## 9. LOYALTY PROGRAM

### Admin Loyalty Panel (✅ Already Configured)
- **Location**: `/admin/loyalty`
- **Database**: Firebase Firestore - Collection: `loyaltyPoints`

### Frontend Loyalty Display (⚠️ NEEDS SETUP)
- **Location**: Customer profile page

**Action Items**:
- [ ] Display customer loyalty points
- [ ] Show redeemable rewards
- [ ] Track points history

---

## 10. BILLING & PAYMENTS

### Admin Billing Panel (✅ Already Configured)
- **Location**: `/admin/billing`
- **Database**: Firebase Firestore - Collection: `payments`

### Frontend Payment Integration (⚠️ NEEDS SETUP)
- **Payment Gateway**: Configure Stripe/Razorpay
- **Features**: Online payment for bookings

**Action Items**:
- [ ] Integrate payment gateway
- [ ] Add payment processing
- [ ] Send payment confirmations

---

## PRIORITY IMPLEMENTATION ORDER

### Phase 1: Critical (Do First)
1. ✅ Admin/Staff Login (DONE)
2. ⚠️ Customer Signup/Login on frontend
3. ⚠️ Real services from Firebase on frontend
4. ⚠️ Booking integration with public booking page

### Phase 2: Important (Do Next)
5. ⚠️ Customer profile/dashboard
6. ⚠️ Reviews submission & display
7. ⚠️ Loyalty points display

### Phase 3: Enhancement (Later)
8. ⚠️ Products/Shop page
9. ⚠️ Payment integration
10. ⚠️ Email notifications

---

## FIREBASE COLLECTIONS STRUCTURE

```
velvet-luxurysalon (Project)
├── customers/
│   ├── {uid}/
│   │   ├── email
│   │   ├── name
│   │   ├── phone
│   │   ├── createdAt
│   │   └── loyaltyPoints
├── services/
│   ├── {serviceId}/
│   │   ├── serviceName
│   │   ├── description
│   │   ├── price
│   │   ├── duration
│   │   └── category
├── appointments/
│   ├── {appointmentId}/
│   │   ├── customerId
│   │   ├── serviceId
│   │   ├── date
│   │   ├── time
│   │   ├── status
│   │   └── notes
├── staff/
│   ├── {staffId}/
│   │   ├── name
│   │   ├── email
│   │   ├── specialization
│   │   └── availability
├── products/
│   ├── {productId}/
│   │   ├── productName
│   │   ├── price
│   │   ├── stock
│   │   └── category
├── reviews/
│   ├── {reviewId}/
│   │   ├── customerId
│   │   ├── rating
│   │   ├── reviewText
│   │   └── createdAt
└── payments/
    ├── {paymentId}/
    │   ├── appointmentId
    │   ├── amount
    │   ├── status
    │   └── date
```

---

## ENVIRONMENT VARIABLES

```
VITE_FIREBASE_API_KEY=AIzaSyA83Ew3SM0qo9IYD5NJNViQD4oek976CMc
VITE_FIREBASE_AUTH_DOMAIN=velvet-luxurysalon.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=velvet-luxurysalon
VITE_FIREBASE_STORAGE_BUCKET=velvet-luxurysalon.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=803278084836
VITE_FIREBASE_APP_ID=1:803278084836:web:959a3b92442a8667332af1
VITE_FIREBASE_MEASUREMENT_ID=G-HE0J07SVWW
```

---

## NEXT STEPS

1. **Review this document** - Understand the structure
2. **Implement Phase 1** - Start with customer auth
3. **Connect frontend to Firebase** - Replace hardcoded data
4. **Add booking integration** - Link frontend booking to admin system
5. **Test thoroughly** - Ensure data flows correctly

---

## FILES TO CREATE/MODIFY

### New Files Needed:
- `src/app/services/firebaseService.ts` - Firebase utilities for frontend
- `src/app/context/AuthContext.tsx` - Customer authentication context
- `src/app/components/CustomerProfile.tsx` - Customer dashboard
- `src/app/components/BookingModal.tsx` - Booking modal
- `src/app/components/LoginModal.tsx` - Customer login
- `src/app/components/SignupModal.tsx` - Customer signup

### Files to Modify:
- `src/app/components/Navigation.tsx` - Add login/signup buttons
- `src/app/components/ServicesGrid.tsx` - Fetch from Firebase
- `src/app/components/HeroSection.tsx` - Link booking button
- `src/app/components/TestimonialsSection.tsx` - Fetch reviews from Firebase

---

## TESTING CHECKLIST

- [ ] Admin login works
- [ ] Customer signup works
- [ ] Customer login works
- [ ] Services display from Firebase
- [ ] Booking flow works end-to-end
- [ ] Bookings appear in admin panel
- [ ] Reviews show on frontend
- [ ] Loyalty points calculate correctly
- [ ] Payments process (if integrated)

---

**Last Updated**: December 20, 2025
**Status**: Integration Planning Phase
