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
  limit,
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
    const q = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc'),
      limit(limit_count)
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
    return reviews;
  } catch (error: any) {
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
    const appointmentRef = collection(db, 'appointments');
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
    const q = query(
      collection(db, 'appointments'),
      where('stylistId', '==', stylistId),
      where('appointmentDate', '==', appointmentDate),
      where('appointmentTime', '==', appointmentTime),
      where('status', '!=', 'cancelled')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty; // true if available, false if booked
  } catch (error: any) {
    console.error('Error checking availability:', error);
    return true; // Assume available on error
  }
};
