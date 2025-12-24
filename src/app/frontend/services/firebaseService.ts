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
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';

// ============================================
// CUSTOMER AUTHENTICATION
// ============================================

export const registerCustomer = async (email: string, password: string, name: string, phone: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store customer profile in Firestore
    await setDoc(doc(db, 'customers', user.uid), {
      uid: user.uid,
      email,
      name,
      phone,
      createdAt: Timestamp.now(),
      loyaltyPoints: 0,
      isVerified: false
    });

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

export const logoutCustomer = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error?.message || 'Logout failed');
  }
};

export const getCurrentCustomer = async (uid: string) => {
  try {
    const docRef = doc(db, 'customers', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
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
    const customer = await getCurrentCustomer(customerId);
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
