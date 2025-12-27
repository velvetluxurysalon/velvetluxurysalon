import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc,
  query, 
  where,
  orderBy,
  Timestamp,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';

// ============================================
// HELPER FUNCTIONS
// ============================================

// Normalize phone number (remove spaces, dashes, etc., and add +91 country code)
const normalizePhone = (phone: string): string => {
  if (!phone) return '';
  let normalized = phone.replace(/[\s\-()]/g, '').trim();
  // Add +91 if not already present
  if (normalized && !normalized.startsWith('+')) {
    // If it starts with 91, just prepend +
    if (normalized.startsWith('91')) {
      normalized = '+' + normalized;
    } else {
      // Otherwise prepend +91
      normalized = '+91' + normalized;
    }
  }
  return normalized;
};

// ============================================
// CUSTOMER AUTHENTICATION
// ============================================

// Check if customer exists by phone number
export const getCustomerByPhone = async (phone: string) => {
  try {
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) return null;
    
    const docRef = doc(db, 'customers', normalizedPhone);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error: any) {
    console.error('Error getting customer by phone:', error);
    return null;
  }
};

export const registerCustomer = async (email: string, password: string, name: string, phone: string) => {
  try {
    const normalizedPhone = normalizePhone(phone);
    
    if (!normalizedPhone) {
      throw new Error('Phone number is required');
    }
    
    // Check if customer already exists with this phone number (created from admin)
    const existingCustomer = await getCustomerByPhone(normalizedPhone);
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (existingCustomer) {
      // Customer was created from admin panel - link to auth and update
      await updateDoc(doc(db, 'customers', normalizedPhone), {
        authUid: user.uid,
        email: email, // Update email if provided
        isVerified: true,
        updatedAt: serverTimestamp()
      });
    } else {
      // New customer - create with phone as document ID
      await setDoc(doc(db, 'customers', normalizedPhone), {
        authUid: user.uid,
        email,
        name,
        phone: normalizedPhone,
        gender: '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        loyaltyPoints: 0,
        coins: 0,
        totalVisits: 0,
        totalSpent: 0,
        isVerified: true,
        deletedAt: null
      });
      
      // Create initial points history
      await addDoc(collection(db, `customers/${normalizedPhone}/pointsHistory`), {
        type: 'initial',
        points: 0,
        amount: 0,
        description: 'Account created',
        invoiceId: null,
        billDetails: null,
        transactionDate: Timestamp.now()
      });
    }

    return user;
  } catch (error: any) {
    throw new Error(error?.message || 'Registration failed');
  }
};

export const loginCustomer = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error?.message || 'Login failed');
  }
};

// Login with phone number - looks up customer email by phone, then logs in
export const loginWithPhone = async (phone: string, password: string) => {
  try {
    const normalizedPhone = normalizePhone(phone);
    
    if (!normalizedPhone) {
      throw new Error('Phone number is required');
    }
    
    // Get customer by phone to find their email
    const customer = await getCustomerByPhone(normalizedPhone);
    
    if (!customer) {
      throw new Error('No account found with this phone number. Please sign up first.');
    }
    
    const customerData = customer as any;
    
    if (!customerData.email) {
      throw new Error('This account was created without an email. Please contact support.');
    }
    
    // Login with the email associated with this phone
    const userCredential = await signInWithEmailAndPassword(auth, customerData.email, password);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Incorrect password. Please try again.');
    }
    throw new Error(error?.message || 'Login failed');
  }
};

export const logoutCustomer = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error?.message || 'Logout failed');
  }
};

export const getCurrentCustomer = async (uid: string) => {
  try {
    // First, try to find customer by authUid field (new system with phone as doc ID)
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('authUid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    
    // Fallback: try to get by UID as document ID (old system)
    const docRef = doc(db, 'customers', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    
    return null;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to get customer');
  }
};

export const onAuthChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

// ============================================
// SERVICES
// ============================================

export const getServices = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'services'));
    const services: any[] = [];
    querySnapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return services;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to load services');
  }
};

export const getServiceById = async (serviceId: string) => {
  try {
    const docRef = doc(db, 'services', serviceId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to get service');
  }
};

// ============================================
// REVIEWS
// ============================================

export const getReviews = async (limit_count: number = 10) => {
  try {
    // Query all verified reviews (orderBy on different field requires composite index)
    // So we fetch verified reviews and sort client-side
    const q = query(
      collection(db, 'reviews'),
      where('verified', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const reviews: any[] = [];
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      });
    });
    
    // Sort by createdAt descending on client-side and limit
    reviews.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    return reviews.slice(0, limit_count);
  } catch (error: any) {
    console.error('Error loading reviews:', error);
    throw new Error(error?.message || 'Failed to load reviews');
  }
};

export const submitReview = async (customerId: string, customerName: string, customerEmail: string, serviceId: string, rating: number, reviewText: string) => {
  try {
    const reviewRef = collection(db, 'reviews');
    await addDoc(reviewRef, {
      customerId,
      customerName,
      customerEmail,
      serviceId,
      rating,
      reviewText,
      createdAt: Timestamp.now(),
      verified: false
    });
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to submit review');
  }
};

// ============================================
// APPOINTMENTS/BOOKINGS
// ============================================

export const bookAppointment = async (appointmentData: any) => {
  try {
    // Format date as YYYY-MM-DD for subfolder structure
    const dateObj = appointmentData.appointmentDate instanceof Date 
      ? appointmentData.appointmentDate 
      : new Date(appointmentData.appointmentDate);
    const dateString = dateObj.toISOString().split('T')[0];
    
    // Store in date-wise subfolder: appointments/{YYYY-MM-DD}/{booking}
    const appointmentRef = collection(db, `appointments/${dateString}/bookings`);
    const docRef = await addDoc(appointmentRef, {
      ...appointmentData,
      createdAt: Timestamp.now(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to book appointment');
  }
};

export const getCustomerAppointments = async (customerId: string) => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('customerId', '==', customerId),
      orderBy('appointmentDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const appointments: any[] = [];
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data(),
        appointmentDate: doc.data().appointmentDate?.toDate?.() || new Date()
      });
    });
    return appointments;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to get appointments');
  }
};

// ============================================
// LOYALTY POINTS
// ============================================

export const getLoyaltyPoints = async (customerId: string) => {
  try {
    const customer: any = await getCurrentCustomer(customerId);
    return customer?.loyaltyPoints || 0;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to get loyalty points');
  }
};

// ============================================
// PRODUCTS
// ============================================

export const getProducts = async (): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products: any[] = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return products;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to load products');
  }
};

// ============================================
// STAFF/STYLISTS
// ============================================

export const getStaff = async () => {
  try {
    const q = query(
      collection(db, 'staff'),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const staff: any[] = [];
    querySnapshot.forEach((doc) => {
      staff.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return staff;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to load staff');
  }
};

// ============================================
// STYLIST AVAILABILITY
// ============================================

export const checkStylistAvailability = async (stylistId: string, appointmentDate: string, appointmentTime: string) => {
  try {
    // Format date as YYYY-MM-DD for subfolder
    const dateString = appointmentDate;
    
    // Optimized: Query only by stylistId and appointmentTime first
    const q = query(
      collection(db, `appointments/${dateString}/bookings`),
      where('stylistId', '==', stylistId),
      where('appointmentTime', '==', appointmentTime)
    );
    const querySnapshot = await getDocs(q);
    
    // Then filter by status in code to avoid requiring complex composite index
    const bookedAppointments = querySnapshot.docs.filter(doc => doc.data().status !== 'cancelled');
    return bookedAppointments.length === 0; // true if available, false if booked
  } catch (error: any) {
    console.error('Error checking availability:', error);
    return true; // Assume available on error
  }
};

export const getBookedSlotsForStylist = async (stylistId: string, appointmentDate: string) => {
  try {
    const dateString = appointmentDate;
    
    // Optimized: Query only by stylistId first
    const q = query(
      collection(db, `appointments/${dateString}/bookings`),
      where('stylistId', '==', stylistId)
    );
    const querySnapshot = await getDocs(q);
    
    // Then filter by status in code to avoid requiring complex composite index
    const bookedTimes: string[] = [];
    querySnapshot.forEach((doc) => {
      // Only count non-cancelled appointments
      if (doc.data().status !== 'cancelled') {
        const appointmentTime = doc.data().appointmentTime;
        if (appointmentTime && !bookedTimes.includes(appointmentTime)) {
          bookedTimes.push(appointmentTime);
        }
      }
    });
    return bookedTimes;
  } catch (error: any) {
    console.error('Error fetching booked slots:', error);
    return [];
  }
};
