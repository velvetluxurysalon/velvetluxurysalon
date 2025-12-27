# Testing Checklist - Frontend Booking to Reception

## 🧪 Complete Testing Guide

Test this using a real browser, not just code review. Follow all steps to ensure everything works correctly.

---

## ✅ PRE-TESTING SETUP

- [ ] Make sure you have access to Firebase admin console
- [ ] Have at least 1 service created in admin
- [ ] Have at least 1 staff member active in admin
- [ ] Have a test user account created for frontend
- [ ] Open admin in one browser tab
- [ ] Open website in another browser tab
- [ ] Clear browser cache (Ctrl+Shift+Delete)

---

## 🔴 BOOKING FORM TESTS

### Load & Display
- [ ] Go to website homepage
- [ ] Find and click "Book Now" or "Book Appointment" button
- [ ] Booking modal appears
- [ ] Modal has title "Book an Appointment"
- [ ] All form fields visible

### User Must Be Logged In
- [ ] If not logged in, prompt appears to sign in
- [ ] Can click "Continue to Sign In" button
- [ ] Can click "Not Now" to close
- [ ] Must be logged in to see form

### Form Fields Load
- [ ] Name field shows pre-filled from account (if available)
- [ ] Email field shows pre-filled from account
- [ ] Phone field is empty and ready for input
- [ ] Service dropdown shows all services with prices
- [ ] Stylist dropdown shows available stylists
- [ ] Date picker shows today's date as minimum

### Customer Details Input
- [ ] Can type name
- [ ] Can type email
- [ ] Can type phone number
- [ ] All fields accept input without errors

### Service & Stylist Selection
- [ ] Select a service - dropdown works
- [ ] Price shows next to service name
- [ ] Select stylist - dropdown filters by category
- [ ] Stylists show name and role
- [ ] Can change service and stylists re-filter

### Date & Time Selection
- [ ] Click date picker
- [ ] Cannot select past dates (disabled)
- [ ] Can select today or future dates
- [ ] Select a valid date
- [ ] Time slots appear below date
- [ ] Time slots show in 1-hour intervals
- [ ] Booked times show as "Booked" with grayed out appearance
- [ ] Can click available time
- [ ] Selected time shows with purple highlight

### Real-time Availability Checking
- [ ] Select stylist and date
- [ ] Time slots update to show available times
- [ ] Unavailable slots are grayed out
- [ ] If time becomes booked, shows warning message
- [ ] Message says something about stylist being booked

### Notes Section
- [ ] Can add optional notes
- [ ] Text appears as typed
- [ ] Can leave blank if not needed

### Form Submission
- [ ] Fill ALL required fields correctly
- [ ] Click "Book Appointment" button
- [ ] Loading indicator appears ("Booking...")
- [ ] Success message appears (green)
- [ ] Message says "Appointment booked successfully!"
- [ ] Form auto-closes after 2 seconds
- [ ] Success message disappears

### Error Handling
- [ ] Try submitting empty form - error message appears
- [ ] Try submitting with missing fields - specific error shown
- [ ] Try invalid email - error message appears
- [ ] Try selecting already-booked time - warning shown
- [ ] Error messages are clear and helpful

---

## 👨‍💼 ADMIN APPOINTMENTS PAGE TESTS

### Initial Load
- [ ] Go to admin panel
- [ ] Navigate to "Appointments" section
- [ ] Page loads without errors
- [ ] List appears if any appointments exist

### Appointment Display
- [ ] See any existing appointments
- [ ] Each appointment shows: service name, date, time, customer name, phone
- [ ] Status badge shows with color indicator
- [ ] Can scroll through appointments

### Filter System
- [ ] Filter dropdown visible with 3 options
- [ ] Default filter is "All Appointments"
- [ ] Click "Frontend Bookings" - shows only web bookings
- [ ] Count shows next to "Frontend Bookings" (if any)
- [ ] Click "Admin Created" - shows only admin appointments
- [ ] Click "All Appointments" - back to all

### Web Booking Badge
- [ ] Web bookings show "Web Booking" badge
- [ ] Badge is blue colored
- [ ] Badge text is uppercase
- [ ] Admin-created appointments don't have badge

### Auto-Refresh
- [ ] Watch appointment list
- [ ] Wait 30 seconds
- [ ] If new booking made, it appears after 30 seconds
- [ ] No need to manually refresh

### View Details
- [ ] Click "Details" button on any appointment
- [ ] Modal opens showing full details
- [ ] All information displayed correctly
- [ ] Modal has "Web Booking" label if from frontend
- [ ] Can close modal by clicking X or close button

### Check-In Button
- [ ] Click "Check In" button on a pending appointment
- [ ] Confirmation dialog appears
- [ ] Button shows "Are you sure you want to check in?"
- [ ] Can click "OK" to confirm or "Cancel" to abort
- [ ] After clicking OK...
  - [ ] Green success message appears
  - [ ] Success message includes "Visit ID: xxx"
  - [ ] Appointment disappears from list (checked-in status)
  - [ ] Receipt confirmation visible

### After Check-In
- [ ] Go to Reception page
- [ ] Checked-in customer appears in visits
- [ ] Customer details match booking
- [ ] Service information is preserved
- [ ] Stylist is assigned correctly

### Other Action Buttons
- [ ] **Confirm** button (if status is pending, admin-created only)
  - [ ] Click it
  - [ ] Status changes to "confirmed"
  - [ ] Button disappears, different button shows
- [ ] **Complete** button (if status is confirmed)
  - [ ] Click it
  - [ ] Status changes to "completed"
  - [ ] Appointment is completed
- [ ] **Cancel** button (all appointments)
  - [ ] Click it
  - [ ] Confirmation appears
  - [ ] After confirm, appointment is cancelled
  - [ ] Appointment disappears from list (if filtered to non-cancelled)

---

## 🏥 RECEPTION INTEGRATION TESTS

### Check-In Appears
- [ ] Go to Reception page
- [ ] Checked-in customer appears in list
- [ ] Shows "CHECKED_IN" status
- [ ] Customer details visible
- [ ] Service information shown

### Customer Information
- [ ] Customer name matches booking
- [ ] Customer phone matches
- [ ] Customer email correct (if provided)
- [ ] Service name correct
- [ ] Stylist assigned correctly

### Service Details
- [ ] Service price visible
- [ ] Service category shown
- [ ] Stylist information correct
- [ ] Can add more services if needed

### Add Items
- [ ] Can add products to visit
- [ ] Can add additional services
- [ ] Items appear in visit details
- [ ] Prices calculate correctly
- [ ] Subtotal updates

### Payment Processing
- [ ] Can process payment
- [ ] Can apply discount
- [ ] Total calculates correctly
- [ ] Can collect payment
- [ ] Receipt shows all items

### Checkout
- [ ] Can complete checkout
- [ ] Visit status changes to completed
- [ ] Customer checkout successful
- [ ] Visit archive/history updated

---

## 🌐 CROSS-BROWSER TESTS

Test on different browsers:

### Chrome
- [ ] All features work
- [ ] Styling correct
- [ ] Responsive on mobile

### Firefox
- [ ] All features work
- [ ] Styling correct
- [ ] Responsive on mobile

### Safari
- [ ] All features work
- [ ] Styling correct
- [ ] Date picker works (known Safari issue)

### Edge
- [ ] All features work
- [ ] Styling correct
- [ ] Responsive on mobile

### Mobile Browser (Safari/Chrome)
- [ ] Modal appears properly
- [ ] Can scroll form
- [ ] Touch interactions work
- [ ] Buttons clickable
- [ ] Time slots responsive grid

---

## 📱 MOBILE-SPECIFIC TESTS

### Booking Form on Mobile
- [ ] Can see full form
- [ ] Can scroll to see all fields
- [ ] Date picker opens properly
- [ ] Time slots display in grid
- [ ] Can select time on small screen
- [ ] Submit button reachable
- [ ] Buttons are touch-friendly (not too small)

### Admin on Mobile
- [ ] Appointments list readable
- [ ] Can scroll horizontally if needed
- [ ] Details modal opens properly
- [ ] Check-In button reachable
- [ ] Filter dropdown works
- [ ] No horizontal scroll issues

---

## ⚡ PERFORMANCE TESTS

- [ ] Booking form loads in < 2 seconds
- [ ] Appointments page loads in < 3 seconds
- [ ] Check-in completes in < 3 seconds
- [ ] Auto-refresh doesn't cause lag
- [ ] UI remains responsive while loading

---

## 🔒 SECURITY TESTS

- [ ] Cannot book without login
- [ ] Cannot access appointments without admin role
- [ ] Cannot manually edit URL to bypass auth
- [ ] Passwords never shown
- [ ] Sensitive info not in error messages
- [ ] Session expires properly

---

## 📊 DATA VALIDATION TESTS

### Firebase Storage
- [ ] Navigate to Firebase console
- [ ] Find `appointments/` collection
- [ ] Find date folder (e.g., `2025-12-27`)
- [ ] Find `bookings` subcollection
- [ ] Check booking data is saved correctly
- [ ] All fields present (name, email, phone, etc.)
- [ ] Status is "pending" for new bookings
- [ ] createdAt timestamp exists

### After Check-In
- [ ] Navigate to Firebase console
- [ ] Find `visits/` collection
- [ ] Find new visit from check-in
- [ ] Verify appointment link exists
- [ ] Verify customer data copied correctly
- [ ] Status is "CHECKED_IN"

---

## 🆘 ERROR SCENARIO TESTS

### What If Stylist Gets Booked While Customer Booking?
- [ ] Open booking form on device 1
- [ ] Select same time on device 2 and book it
- [ ] Go back to device 1
- [ ] Try to book same time
- [ ] Error message appears: "Time slot no longer available"
- [ ] Can select different time

### What If Firebase Doesn't Respond?
- [ ] Unplug internet/disable WiFi during booking
- [ ] Try to submit
- [ ] Error message appears: "Failed to book appointment"
- [ ] Can reconnect and try again

### What If Service Disappears?
- [ ] Select service A
- [ ] Service A deleted in admin (on another tab)
- [ ] Go back to booking form
- [ ] Service A no longer in list
- [ ] Form prevents booking without valid service

### What If Stylist Becomes Inactive?
- [ ] Select stylist X
- [ ] Stylist X set to inactive in admin
- [ ] Go back to booking
- [ ] Stylist X no longer available
- [ ] Must select different stylist

---

## 🎨 UI/UX TESTS

### Visual Design
- [ ] Colors are consistent with site theme
- [ ] Fonts are readable
- [ ] Buttons have proper spacing
- [ ] Icons are clear and meaningful
- [ ] Status badges are distinct

### User Experience
- [ ] Instructions are clear
- [ ] Form flows logically
- [ ] Can understand what to do without help
- [ ] Error messages are helpful
- [ ] Success messages are clear

### Accessibility
- [ ] Can tab through form (keyboard navigation)
- [ ] Labels properly associated with inputs
- [ ] Color not only indicator of status
- [ ] Sufficient contrast for readability
- [ ] Modal can be closed with Escape key

---

## 📋 EDGE CASES

- [ ] Book at exactly midnight (date boundary)
- [ ] Book 1 second before salon closes (19:00)
- [ ] Book exactly 1 year in advance
- [ ] Book for tomorrow at 8:00 AM (opening time)
- [ ] Multiple bookings for same stylist same time (race condition)
- [ ] Very long customer name (100+ characters)
- [ ] Special characters in notes
- [ ] Very large phone number
- [ ] Multiple check-ins for same booking (should prevent)

---

## 🔄 WORKFLOW TEST - FULL SCENARIO

**Complete end-to-end test:**

1. [ ] Customer creates account on website
2. [ ] Customer logs in
3. [ ] Customer books appointment:
   - [ ] Selects service: "Haircut"
   - [ ] Selects stylist: "Sarah"
   - [ ] Selects date: Tomorrow
   - [ ] Selects time: 14:00
   - [ ] Adds note: "Include beard trim"
   - [ ] Clicks "Book Appointment"
   - [ ] Success message appears
4. [ ] Admin checks appointments:
   - [ ] Filters to "Frontend Bookings"
   - [ ] Sees new booking with "Web Booking" badge
   - [ ] Booking shows customer name, service, time
5. [ ] Admin checks-in booking:
   - [ ] Clicks "Check In" button
   - [ ] Confirms action
   - [ ] Success message with visit ID appears
6. [ ] Reception processes visit:
   - [ ] Visit appears in reception
   - [ ] All details correct
   - [ ] Can add items
   - [ ] Can process payment
   - [ ] Can checkout

---

## ✅ FINAL VERIFICATION

After completing all tests:

- [ ] All checkboxes above are checked
- [ ] No errors in browser console
- [ ] No errors in Firebase logs
- [ ] No unexpected behavior
- [ ] User experience is smooth
- [ ] System is ready for production

---

## 📝 TEST RESULTS SUMMARY

**Date Tested**: _______________
**Tester Name**: _______________
**Browser/Device**: _______________

### Issues Found:
1. _______________
2. _______________
3. _______________

### Overall Status:
- [ ] ✅ All tests passed - Ready for deployment
- [ ] ⚠️ Minor issues found - Review needed
- [ ] ❌ Critical issues found - Fix before deployment

### Notes:
_______________________________
_______________________________
_______________________________

---

## 🚀 Deployment Readiness

If all tests pass:
1. ✅ Backup current database
2. ✅ Deploy code changes
3. ✅ Clear browser caches
4. ✅ Announce new feature to team
5. ✅ Monitor for errors
6. ✅ Gather user feedback

---

**Testing Version**: 1.0
**Last Updated**: December 27, 2025
**Status**: Ready to Test
