import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db, storage } from "../../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  collectionGroup,
  query,
  where,
  updateDoc,
  deleteDoc,
  addDoc,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface Appointment {
  id?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  staffId?: string | null;
  staffName?: string;
  stylistId?: string | null;
  stylistName?: string;
  appointmentDate: any;
  appointmentTime: string;
  duration: number;
  status: string;
  notes?: string;
  dateFolder?: string;
  createdAt?: any;
}

export interface Membership {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  benefits: string[];
  price?: number;
  popular?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactNo?: string;
  dateOfBirth?: any;
  gender: string;
  membershipType?: string;
  loyaltyPoints: number;
  totalVisits: number;
  totalSpent: number;
  isVerified?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Invoice {
  id: string;
  invoiceId: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: any[];
  totalAmount: number;
  paidAmount: number;
  discountAmount: number;
  taxAmount: number;
  subtotal: number;
  finalAmount: number;
  paymentMode: string;
  status: string;
  createdAt?: any;
}

export interface Visit {
  id?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  staffId?: string;
  date: any;
  status: string;
  items: any[];
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  feedback?: string | null;
  invoiceId?: string | null;
  createdAt?: any;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description?: string;
  image?: string;
  gender?: string;
  createdAt?: any;
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  specialties: string[];
  experience: string;
  bio: string;
  image: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  active: boolean;
  createdAt?: any;
}

export interface Review {
  id?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  serviceName?: string;
  rating: number;
  reviewText: string;
  customerAvatar?: string;
  createdAt?: any;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const convertTimestampToDate = (timestamp: any) => {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  if (timestamp.toDate && typeof timestamp.toDate === "function")
    return timestamp.toDate();
  if (typeof timestamp === "object" && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date(timestamp);
};

const normalizePhone = (phone: string): string => {
  if (!phone) return "";
  let normalized = phone.replace(/[\s\-()]/g, "").trim();
  if (normalized && !normalized.startsWith("+")) {
    if (normalized.startsWith("91")) {
      normalized = "+" + normalized;
    } else {
      normalized = "+91" + normalized;
    }
  }
  return normalized;
};

// ============================================
// AUTHENTICATION & ADMIN MANAGEMENT
// ============================================

export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role = "staff",
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: userCredential.user.email,
      displayName: displayName || "",
      createdAt: serverTimestamp(),
      role: role,
    });

    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (!userDoc.exists()) {
      throw new Error("User profile not found");
    }

    return { ...userCredential.user, ...userDoc.data() };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

export const getCurrentUserRole = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    throw error;
  }
};

export const onAuthChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

// ============================================
// GENERIC FIRESTORE OPERATIONS
// ============================================

export const addDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

export const getDocument = async (
  collectionName: string,
  docId: string,
): Promise<any | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

export const getDocuments = async (
  collectionName: string,
  conditions: any[] = [],
): Promise<any[]> => {
  try {
    let q: any = collection(db, collectionName);

    if (conditions.length > 0) {
      const whereConditions = conditions
        .filter((c) => c.type === "where")
        .map((c) => where(c.field, c.operator, c.value));
      const orderByConditions = conditions
        .filter((c) => c.type === "orderBy")
        .map((c) => orderBy(c.field, c.direction || "asc"));
      const limitCondition = conditions.find((c) => c.type === "limit");

      const allConditions: any[] = [...whereConditions, ...orderByConditions];
      if (limitCondition) allConditions.push(limit(limitCondition.value));

      q = query(q, ...allConditions);
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as any),
    }));
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
};

export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: any,
) => {
  try {
    const cleanData = Object.entries(data).reduce((acc: any, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    await updateDoc(doc(db, collectionName, docId), {
      ...cleanData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

export const softDeleteDocument = async (
  collectionName: string,
  docId: string,
) => {
  try {
    await updateDoc(doc(db, collectionName, docId), {
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error soft deleting document:", error);
    throw error;
  }
};

export const restoreDocument = async (
  collectionName: string,
  docId: string,
) => {
  try {
    await updateDoc(doc(db, collectionName, docId), {
      deletedAt: null,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error restoring document:", error);
    throw error;
  }
};

// ============================================
// CUSTOMER MANAGEMENT
// ============================================

export const addCustomer = async (customerData: any): Promise<Customer> => {
  try {
    const phone = normalizePhone(
      customerData.contactNo || customerData.phone || "",
    );

    if (!phone) {
      throw new Error("Phone number is required");
    }

    const existingDoc = await getDoc(doc(db, "customers", phone));
    if (existingDoc.exists()) {
      return {
        id: phone,
        ...existingDoc.data(),
      } as Customer;
    }

    const customerDoc = {
      name: customerData.name || "",
      phone: phone,
      email: customerData.email || "",
      dateOfBirth: customerData.dateOfBirth || null,
      gender: customerData.gender || "",
      isVerified: false,
      loyaltyPoints: 0,
      totalVisits: 0,
      totalSpent: 0,
      membershipType: customerData.membershipType || "regular",
      deletedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "customers", phone), customerDoc);

    await addDoc(collection(db, `customers/${phone}/pointsHistory`), {
      type: "initial",
      points: 0,
      amount: 0,
      description: "Account created",
      invoiceId: null,
      billDetails: null,
      transactionDate: serverTimestamp(),
    });

    return {
      id: phone,
      ...customerDoc,
    } as any;
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

export const getCustomerByPhone = async (
  phone: string,
): Promise<Customer | null> => {
  try {
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) return null;

    const docRef = doc(db, "customers", normalizedPhone);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Customer;
    }
    return null;
  } catch (error) {
    console.error("Error getting customer by phone:", error);
    return null;
  }
};

export const registerCustomer = async (
  email: string,
  password: string,
  name: string,
  phone: string,
) => {
  try {
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) {
      throw new Error("Phone number is required");
    }

    const existingCustomer = await getCustomerByPhone(normalizedPhone);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    if (existingCustomer) {
      await updateDoc(doc(db, "customers", normalizedPhone), {
        authUid: user.uid,
        email: email,
        isVerified: true,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(doc(db, "customers", normalizedPhone), {
        authUid: user.uid,
        email,
        name,
        phone: normalizedPhone,
        gender: "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        loyaltyPoints: 0,
        totalVisits: 0,
        totalSpent: 0,
        isVerified: true,
        deletedAt: null,
      });

      await addDoc(
        collection(db, `customers/${normalizedPhone}/pointsHistory`),
        {
          type: "initial",
          points: 0,
          amount: 0,
          description: "Account created",
          invoiceId: null,
          billDetails: null,
          transactionDate: Timestamp.now(),
        },
      );
    }

    return user;
  } catch (error: any) {
    throw new Error(error?.message || "Registration failed");
  }
};

export const loginCustomer = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error?.message || "Login failed");
  }
};

export const loginWithPhone = async (phone: string, password: string) => {
  try {
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) {
      throw new Error("Phone number is required");
    }

    const customer = await getCustomerByPhone(normalizedPhone);

    if (!customer) {
      throw new Error(
        "No account found with this phone number. Please sign up first.",
      );
    }

    const customerData = customer as any;

    if (!customerData.email) {
      throw new Error(
        "This account was created without an email. Please contact support.",
      );
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      customerData.email,
      password,
    );

    // Link the authUid to the customer document after successful login
    await updateDoc(doc(db, "customers", normalizedPhone), {
      authUid: userCredential.user.uid,
      updatedAt: serverTimestamp(),
    });

    return userCredential.user;
  } catch (error: any) {
    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      throw new Error("Incorrect password. Please try again.");
    }
    throw new Error(error?.message || "Login failed");
  }
};

export const loginWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if customer document exists
    const customersRef = collection(db, "customers");

    // Try to find existing customer by authUid
    let existingCustomer = null;
    const q = query(customersRef, where("authUid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const customerDoc = querySnapshot.docs[0];
      existingCustomer = { id: customerDoc.id, ...customerDoc.data() };
    }

    // If no customer found, return user info for profile completion
    if (!existingCustomer) {
      return {
        user,
        isNewUser: true,
        email: user.email,
        displayName: user.displayName,
        needsProfileCompletion: true,
      };
    }

    return {
      user,
      isNewUser: false,
      needsProfileCompletion: false,
    };
  } catch (error: any) {
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in was cancelled");
    }
    throw new Error(error?.message || "Google sign-in failed");
  }
};

export const completeGoogleProfile = async (
  uid: string,
  phone: string,
  dob: string,
) => {
  try {
    const normalizedPhone = normalizePhone(phone);
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user found. Please sign in again.");
    }

    // Create or update customer document using phone as document ID
    const customerRef = doc(db, "customers", normalizedPhone);
    const customerSnap = await getDoc(customerRef);

    if (customerSnap.exists()) {
      // Update existing customer
      await updateDoc(customerRef, {
        authUid: uid,
        phone: normalizedPhone,
        dateOfBirth: dob,
        isVerified: true,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create new customer
      await setDoc(customerRef, {
        authUid: uid,
        email: user.email,
        name: user.displayName || "User",
        phone: normalizedPhone,
        dateOfBirth: dob,
        gender: "",
        loyaltyPoints: 0,
        totalVisits: 0,
        totalSpent: 0,
        isVerified: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return { id: normalizedPhone, phone: normalizedPhone };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to complete profile");
  }
};

export const logoutCustomer = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error?.message || "Logout failed");
  }
};

export const getCurrentCustomer = async (uid: string) => {
  try {
    const customersRef = collection(db, "customers");
    const q = query(customersRef, where("authUid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    const docRef = doc(db, "customers", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }

    return null;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to get customer");
  }
};

export const linkCustomerToAuth = async (phone: string, authUid: string) => {
  try {
    const normalizedPhone = normalizePhone(phone);
    await updateDoc(doc(db, "customers", normalizedPhone), {
      authUid: authUid,
      isVerified: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error linking customer to auth:", error);
    throw error;
  }
};

export const updateCustomer = async (phone: string, customerData: any) => {
  try {
    const normalizedPhone = normalizePhone(phone);

    const newPhone = customerData.phone
      ? normalizePhone(customerData.phone)
      : normalizedPhone;

    const updateData = {
      name: customerData.name || "",
      email: customerData.email || "",
      phone: newPhone,
      dateOfBirth: customerData.dateOfBirth || null,
      gender: customerData.gender || "",
      membershipType: customerData.membershipType || "regular",
      updatedAt: serverTimestamp(),
    };

    if (newPhone !== normalizedPhone) {
      await setDoc(doc(db, "customers", newPhone), updateData);
      const pointsSnapshot = await getDocs(
        collection(db, `customers/${normalizedPhone}/pointsHistory`),
      );
      for (const pointsDoc of pointsSnapshot.docs) {
        await setDoc(
          doc(db, `customers/${newPhone}/pointsHistory/${pointsDoc.id}`),
          pointsDoc.data(),
        );
      }
      await deleteDoc(doc(db, "customers", normalizedPhone));
    } else {
      await updateDoc(doc(db, "customers", normalizedPhone), updateData);
    }
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const getCustomers = async (
  includeDeleted = false,
): Promise<Customer[]> => {
  try {
    let customers = await getDocuments("customers", [
      { type: "orderBy", field: "createdAt", direction: "desc" },
    ]);
    if (!includeDeleted) {
      customers = customers.filter(
        (c) => c.deletedAt === undefined || c.deletedAt === null,
      );
    }
    return customers as Customer[];
  } catch (error) {
    console.error("Error getting customers:", error);
    throw error;
  }
};

export const searchCustomers = async (searchTerm: string) => {
  try {
    const allCustomers = await getCustomers(false);
    return allCustomers.filter((customer: any) => {
      const phone = customer.phone || customer.contactNo || "";
      const name = customer.name || "";
      const email = customer.email || "";

      return (
        phone.includes(searchTerm) ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
};

export const deleteCustomer = async (customerId: string) => {
  try {
    await softDeleteDocument("customers", customerId);
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

export const updateCustomerStats = async (
  customerId: string,
  amount: number,
) => {
  try {
    const customer = await getDocument("customers", customerId);
    if (customer) {
      await updateDocument("customers", customerId, {
        totalVisits: (customer.totalVisits || 0) + 1,
        totalSpent: (customer.totalSpent || 0) + amount,
      });
    }
  } catch (error) {
    console.error("Error updating customer stats:", error);
    throw error;
  }
};

// ============================================
// LOYALTY POINTS MANAGEMENT
// ============================================

export const addLoyaltyPoints = async (
  customerId: string,
  points: number,
  amount: number,
  invoiceId: string | null,
  billDetails: any = null,
  description = "Points earned from purchase",
) => {
  try {
    if (!customerId) {
      throw new Error("Customer ID is required");
    }

    const customer = await getDocument("customers", customerId);
    if (customer) {
      const newTotalPoints = (customer.loyaltyPoints || 0) + points;
      await updateDocument("customers", customerId, {
        loyaltyPoints: newTotalPoints,
      });
    }

    const pointsHistoryRef = collection(
      db,
      `customers/${customerId}/pointsHistory`,
    );
    const historyDocId = await addDoc(pointsHistoryRef, {
      type: "earned",
      points: points,
      amount: amount,
      invoiceId: invoiceId || null,
      billDetails: billDetails || {
        items: [],
        subtotal: amount,
        discount: 0,
        tax: 0,
        total: amount,
        paidAmount: amount,
      },
      description: description,
      transactionDate: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    return historyDocId.id;
  } catch (error) {
    console.error("Error adding loyalty points:", error);
    throw error;
  }
};

export const getCustomerLoyaltyPoints = async (
  customerId: string,
): Promise<number> => {
  try {
    const customer = await getDocument("customers", customerId);
    return customer?.loyaltyPoints || 0;
  } catch (error) {
    console.error("Error getting customer loyalty points:", error);
    throw error;
  }
};

export const getLoyaltyPoints = async (customerId: string) => {
  try {
    const customer: any = await getCurrentCustomer(customerId);
    return customer?.loyaltyPoints || 0;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to get loyalty points");
  }
};

export const getCustomerPointsHistory = async (customerId: string) => {
  try {
    const pointsHistoryRef = collection(
      db,
      `customers/${customerId}/pointsHistory`,
    );
    const q = query(pointsHistoryRef, orderBy("transactionDate", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      transactionDate:
        doc.data().transactionDate?.toDate?.() || doc.data().transactionDate,
    }));
  } catch (error) {
    console.error("Error getting customer points history:", error);
    throw error;
  }
};

export const redeemLoyaltyPoints = async (
  customerId: string,
  pointsToRedeem: number,
  discountAmount: number,
  invoiceId: string | null,
  description = "Points redeemed for discount",
) => {
  try {
    if (!customerId) {
      throw new Error("Customer ID is required");
    }

    const customer = await getDocument("customers", customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    const currentPoints = customer.loyaltyPoints || 0;
    if (currentPoints < pointsToRedeem) {
      throw new Error("Insufficient loyalty points");
    }

    const newTotalPoints = currentPoints - pointsToRedeem;
    await updateDocument("customers", customerId, {
      loyaltyPoints: newTotalPoints,
    });

    const pointsHistoryRef = collection(
      db,
      `customers/${customerId}/pointsHistory`,
    );
    const historyDocId = await addDoc(pointsHistoryRef, {
      type: "redeemed",
      points: -pointsToRedeem,
      amount: discountAmount,
      invoiceId: invoiceId || null,
      description: description,
      transactionDate: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    return historyDocId.id;
  } catch (error) {
    console.error("Error redeeming loyalty points:", error);
    throw error;
  }
};

// ============================================
// STAFF MANAGEMENT
// ============================================

export const addStaff = async (staffData: any): Promise<Staff> => {
  try {
    const staffId = await addDocument("staff", {
      name: staffData.name,
      phone: staffData.phone || "",
      email: staffData.email || "",
      role: staffData.role,
      specialties: Array.isArray(staffData.specialties)
        ? staffData.specialties
        : [],
      experience: staffData.experience || "",
      bio: staffData.bio || "",
      image: staffData.image || "",
      socials: {
        facebook: staffData.socials?.facebook || "",
        instagram: staffData.socials?.instagram || "",
        twitter: staffData.socials?.twitter || "",
      },
      active: true,
      totalVisits: 0,
      createdAt: serverTimestamp(),
    });
    return { id: staffId, ...staffData } as Staff;
  } catch (error) {
    console.error("Error adding staff:", error);
    throw error;
  }
};

export const getStaff = async (): Promise<Staff[]> => {
  try {
    const q = query(
      collection(db, "staff"),
      where("active", "==", true),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    const staff: any[] = [];
    querySnapshot.forEach((doc) => {
      staff.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return staff as Staff[];
  } catch (error) {
    console.error("Error getting staff:", error);
    throw error;
  }
};

export const updateStaff = async (staffId: string, staffData: any) => {
  try {
    await updateDocument("staff", staffId, staffData);
  } catch (error) {
    console.error("Error updating staff:", error);
    throw error;
  }
};

export const deleteStaff = async (staffId: string) => {
  try {
    await updateDocument("staff", staffId, { active: false });
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
};

// ============================================
// SERVICE CATEGORIES
// ============================================

export const getServiceCategories = async () => {
  try {
    const categories = await getDocuments("serviceCategories", [
      { type: "orderBy", field: "order", direction: "asc" },
    ]);
    return categories;
  } catch (error) {
    console.error("Error getting service categories:", error);
    throw error;
  }
};

export const addServiceCategory = async (categoryData: any) => {
  try {
    const categories = await getServiceCategories();
    const maxOrder =
      categories.length > 0
        ? Math.max(...categories.map((c: any) => c.order || 0))
        : 0;

    const categoryId = await addDocument("serviceCategories", {
      name: categoryData.name,
      order: maxOrder + 1,
      isActive: true,
      createdAt: serverTimestamp(),
    });
    return categoryId;
  } catch (error) {
    console.error("Error adding service category:", error);
    throw error;
  }
};

// ============================================
// SERVICE MANAGEMENT
// ============================================

export const addService = async (serviceData: any): Promise<string> => {
  try {
    const serviceId = await addDocument("services", {
      name: serviceData.name,
      category: serviceData.category || "",
      price: parseFloat(serviceData.price),
      duration: parseInt(serviceData.duration) || 30,
      gender: serviceData.gender || "any",
      description: serviceData.description || "",
      image: serviceData.image || "",
      deletedAt: null,
      createdAt: serverTimestamp(),
    });
    return serviceId;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error;
  }
};

export const getServices = async (): Promise<Service[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "services"));
    const services: any[] = [];
    querySnapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return services;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to load services");
  }
};

export const getFeaturedServices = async (): Promise<Service[]> => {
  try {
    const services = await getServices();
    return services.slice(0, 6);
  } catch (error) {
    console.error("Error getting featured services:", error);
    throw error;
  }
};

export const getServiceById = async (serviceId: string) => {
  try {
    const docRef = doc(db, "services", serviceId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to get service");
  }
};

export const updateService = async (serviceId: string, serviceData: any) => {
  try {
    await updateDocument("services", serviceId, {
      ...serviceData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

export const deleteService = async (serviceId: string) => {
  try {
    await softDeleteDocument("services", serviceId);
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};

// ============================================
// PRODUCT MANAGEMENT
// ============================================

export const getProducts = async (): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products: any[] = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return products;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to load products");
  }
};

// ============================================
// VISIT MANAGEMENT
// ============================================

export const createVisit = async (visitData: any): Promise<string> => {
  try {
    let customerInfo = {
      name: "",
      phone: "",
      email: "",
    };

    if (visitData.customer) {
      customerInfo = {
        name: visitData.customer.name || "",
        phone: visitData.customer.phone || visitData.customer.contactNo || "",
        email: visitData.customer.email || "",
      };
    } else {
      customerInfo = {
        name: visitData.customerName || "",
        phone: visitData.customerPhone || "",
        email: visitData.customerEmail || "",
      };
    }

    const visitId = await addDocument("visits", {
      customerId: visitData.customerId,
      customer: customerInfo,
      staffId: visitData.staffId || "",
      date: Timestamp.now(),
      status: visitData.status || "CHECKED_IN",
      items: visitData.items || [],
      totalAmount: 0,
      paidAmount: 0,
      notes: visitData.notes || "",
      feedback: null,
      invoiceId: null,
      deletedAt: null,
      createdAt: serverTimestamp(),
    });
    return visitId;
  } catch (error) {
    console.error("Error creating visit:", error);
    throw error;
  }
};

export const getVisits = async (includeDeleted = false) => {
  try {
    const conditions: any[] = includeDeleted
      ? []
      : [{ type: "where", field: "deletedAt", operator: "==", value: null }];
    conditions.push({ type: "orderBy", field: "date", direction: "desc" });
    return await getDocuments("visits", conditions);
  } catch (error) {
    console.error("Error getting visits:", error);
    throw error;
  }
};

export const getActiveVisits = async () => {
  try {
    const allVisits = await getDocuments("visits", [
      { type: "where", field: "deletedAt", operator: "==", value: null },
      { type: "orderBy", field: "date", direction: "desc" },
    ]);

    return allVisits.filter(
      (visit: any) =>
        visit.status &&
        ["CHECKED_IN", "IN_SERVICE", "READY_FOR_BILLING", "COMPLETED"].includes(
          visit.status,
        ),
    );
  } catch (error) {
    console.error("Error getting active visits:", error);
    throw error;
  }
};

export const getVisitsByCustomer = async (customerId: string) => {
  try {
    return await getDocuments("visits", [
      { type: "where", field: "customerId", operator: "==", value: customerId },
      { type: "where", field: "deletedAt", operator: "==", value: null },
      { type: "orderBy", field: "date", direction: "desc" },
    ]);
  } catch (error) {
    console.error("Error getting customer visits:", error);
    throw error;
  }
};

export const addVisitItem = async (visitId: string, item: any) => {
  try {
    const visit = await getDocument("visits", visitId);
    if (visit) {
      const items = visit.items || [];
      const newItem: any = {
        id: Date.now().toString(),
        type: item.type || "service",
        name: item.name || "",
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
      };

      if (item.serviceId) newItem.serviceId = item.serviceId;
      if (item.productId) newItem.productId = item.productId;
      if (item.staff !== null && item.staff !== undefined)
        newItem.staff = item.staff;
      if (item.duration) newItem.duration = item.duration;

      items.push(newItem);

      const totalAmount = items.reduce(
        (sum: number, i: any) => sum + (i.price || 0) * (i.quantity || 1),
        0,
      );

      await updateDocument("visits", visitId, {
        items: items,
        totalAmount: totalAmount,
      });

      return newItem.id;
    }
  } catch (error) {
    console.error("Error adding visit item:", error);
    throw error;
  }
};

export const updateVisitStatus = async (visitId: string, status: string) => {
  try {
    await updateDocument("visits", visitId, { status: status });
  } catch (error) {
    console.error("Error updating visit status:", error);
    throw error;
  }
};

export const deleteVisit = async (visitId: string) => {
  try {
    await softDeleteDocument("visits", visitId);
  } catch (error) {
    console.error("Error deleting visit:", error);
    throw error;
  }
};

// ============================================
// INVOICE & BILLING
// ============================================

export const generateInvoiceId = async (): Promise<string> => {
  try {
    const counterRef = doc(db, "counters", "invoiceCounter");

    const newId = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      let nextNumber = 1;
      if (counterDoc.exists()) {
        nextNumber = (counterDoc.data().count || 0) + 1;
      }

      transaction.set(counterRef, { count: nextNumber }, { merge: true });

      return `VELVET${String(nextNumber).padStart(5, "0")}`;
    });

    return newId;
  } catch (error) {
    console.error("Error generating invoice ID:", error);
    throw error;
  }
};

export const createInvoice = async (invoiceData: any): Promise<string> => {
  try {
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      items,
      totalAmount,
      paidAmount,
      discountPercent = 0,
      discountAmount = 0,
      taxPercent = 18,
      paymentMode,
      status,
      notes,
      staffId,
      invoiceDate,
      visitId,
      subtotal = 0,
    } = invoiceData;

    const invoiceId = await generateInvoiceId();

    const calculatedDiscount =
      discountAmount || (totalAmount * discountPercent) / 100;
    const calculatedSubtotal = subtotal || totalAmount - calculatedDiscount;
    const taxAmount = (calculatedSubtotal * taxPercent) / 100;
    const finalAmount = calculatedSubtotal + taxAmount;

    const invoiceObj: any = {
      invoiceId: invoiceId,
      visitId: visitId || null,
      customerId: customerId || null,
      staffId: staffId || null,
      customerName: customerName || "Unknown",
      customerEmail: customerEmail || "",
      customerPhone: customerPhone || "",
      items: items || [],
      totalAmount: totalAmount || 0,
      discountAmount: calculatedDiscount || 0,
      taxAmount: taxAmount || 0,
      subtotal: calculatedSubtotal || 0,
      finalAmount: finalAmount || 0,
      paidAmount: parseFloat(paidAmount) || 0,
      paymentMode: paymentMode || "cash",
      status: status || "unpaid",
      invoiceDate: invoiceDate || serverTimestamp(),
      notes: notes || "",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: serverTimestamp(),
    };

    const invoiceRef = doc(db, "invoices", invoiceId);
    await setDoc(invoiceRef, invoiceObj);

    if (visitId) {
      await updateDocument("visits", visitId, { invoiceId: invoiceId });
    }

    return invoiceId;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const result = await getDocuments("invoices", [
      { type: "orderBy", field: "invoiceDate", direction: "desc" },
    ]);
    return result as Invoice[];
  } catch (error) {
    console.error("Error getting invoices:", error);
    throw error;
  }
};

export const getInvoice = async (
  invoiceId: string,
): Promise<Invoice | null> => {
  try {
    return (await getDocument("invoices", invoiceId)) as Invoice | null;
  } catch (error) {
    console.error("Error getting invoice:", error);
    throw error;
  }
};

export const payInvoice = async (invoiceId: string, amount: number) => {
  try {
    const invoice = await getDocument("invoices", invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    const amountNumber =
      typeof amount === "string" ? parseFloat(amount) : amount;
    const newPaidAmount = (invoice.paidAmount || 0) + amountNumber;
    const status = newPaidAmount >= invoice.totalAmount ? "paid" : "partial";

    await updateDocument("invoices", invoiceId, {
      paidAmount: newPaidAmount,
      status: status,
    });

    const paymentId = await addDocument("payments", {
      invoiceId: invoiceId,
      amount: amountNumber,
      paymentDate: serverTimestamp(),
      paymentMethod: "cash",
      notes: "",
    });

    if (invoice.customerId) {
      await updateCustomerStats(invoice.customerId, amountNumber);
    }

    return paymentId;
  } catch (error) {
    console.error("Error paying invoice:", error);
    throw error;
  }
};

// ============================================
// MEMBERSHIP MANAGEMENT
// ============================================

export const initializeMemberships = async () => {
  try {
    const defaultMemberships = {
      regular: {
        id: "regular",
        name: "Regular",
        description: "Standard membership",
        discountPercentage: 0,
        benefits: ["Basic customer service", "Standard pricing"],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      membership: {
        id: "membership",
        name: "Premium Membership",
        description: "Premium member benefits",
        discountPercentage: 10,
        benefits: [
          "10% discount on all services",
          "Priority booking",
          "Birthday discount",
          "Loyalty points 1.5x",
        ],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      elite: {
        id: "elite",
        name: "Elite Membership",
        description: "VIP exclusive benefits",
        discountPercentage: 20,
        benefits: [
          "20% discount on all services",
          "VIP priority booking",
          "Exclusive events",
          "Free consultations",
          "Loyalty points 2x",
          "Dedicated concierge",
        ],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
    };

    for (const [key, membership] of Object.entries(defaultMemberships)) {
      const docRef = doc(db, "memberships", key);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, membership);
      }
    }

    return true;
  } catch (error) {
    console.error("Error initializing memberships:", error);
    throw error;
  }
};

export const getMemberships = async (): Promise<Membership[]> => {
  try {
    const membershipsRef = collection(db, "memberships");
    const snapshot = await getDocs(membershipsRef);
    const memberships: Membership[] = [];

    snapshot.forEach((doc) => {
      memberships.push({
        id: doc.id,
        ...doc.data(),
      } as Membership);
    });

    return memberships;
  } catch (error) {
    console.error("Error getting memberships:", error);
    throw error;
  }
};

export const getMembership = async (
  membershipId: string,
): Promise<Membership | null> => {
  try {
    const docRef = doc(db, "memberships", membershipId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Membership;
    }
    return null;
  } catch (error) {
    console.error("Error getting membership:", error);
    throw error;
  }
};

export const updateMembership = async (
  membershipId: string,
  membershipData: any,
) => {
  try {
    const docRef = doc(db, "memberships", membershipId);
    await updateDoc(docRef, {
      ...membershipData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating membership:", error);
    throw error;
  }
};

export const assignMembershipToCustomer = async (
  customerId: string,
  membershipType: string,
) => {
  try {
    const customerRef = doc(db, "customers", customerId);
    await updateDoc(customerRef, {
      membershipType: membershipType,
      membershipAssignedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error assigning membership:", error);
    throw error;
  }
};

export const getMembershipDiscount = async (
  membershipType: string,
): Promise<number> => {
  try {
    const membership = await getMembership(membershipType);
    return membership ? membership.discountPercentage : 0;
  } catch (error) {
    console.error("Error getting membership discount:", error);
    return 0;
  }
};

// ============================================
// APPOINTMENT SCHEDULING
// ============================================

export const createAppointment = async (
  appointmentData: any,
): Promise<string> => {
  try {
    const appointmentId = await addDocument("appointments", {
      customerId: appointmentData.customerId,
      customerName: appointmentData.customerName,
      customerPhone: appointmentData.customerPhone,
      customerEmail: appointmentData.customerEmail,
      serviceId: appointmentData.serviceId,
      serviceName: appointmentData.serviceName,
      staffId: appointmentData.staffId || null,
      appointmentDate: Timestamp.fromDate(
        new Date(appointmentData.appointmentDate),
      ),
      appointmentTime: appointmentData.appointmentTime,
      duration: appointmentData.duration || 30,
      status: "scheduled",
      notes: appointmentData.notes || "",
      reminderSent: false,
      createdDate: serverTimestamp(),
    });

    // Also save to customers/{customerId}/appointments subcollection
    const customerAppointmentRef = collection(
      db,
      `customers/${appointmentData.customerId}/appointments`,
    );
    await addDoc(customerAppointmentRef, {
      id: appointmentId,
      customerId: appointmentData.customerId,
      customerName: appointmentData.customerName,
      customerPhone: appointmentData.customerPhone,
      customerEmail: appointmentData.customerEmail,
      serviceId: appointmentData.serviceId,
      serviceName: appointmentData.serviceName,
      staffId: appointmentData.staffId || null,
      appointmentDate: Timestamp.fromDate(
        new Date(appointmentData.appointmentDate),
      ),
      appointmentTime: appointmentData.appointmentTime,
      duration: appointmentData.duration || 30,
      status: "scheduled",
      notes: appointmentData.notes || "",
      createdAt: serverTimestamp(),
    });

    return appointmentId;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const getAppointments = async (
  staffId: string | null = null,
): Promise<Appointment[]> => {
  try {
    let conditions: any[] = [
      { type: "where", field: "status", operator: "!=", value: "cancelled" },
      { type: "orderBy", field: "appointmentDate", direction: "asc" },
    ];

    if (staffId) {
      conditions = [
        { type: "where", field: "staffId", operator: "==", value: staffId },
        { type: "where", field: "status", operator: "!=", value: "cancelled" },
        { type: "orderBy", field: "appointmentDate", direction: "asc" },
      ];
    }

    const result = await getDocuments("appointments", conditions);
    return result as Appointment[];
  } catch (error) {
    console.error("Error getting appointments:", error);
    throw error;
  }
};

export const getFrontendBookings = async (
  includeAll = false,
): Promise<Appointment[]> => {
  try {
    const bookings: Appointment[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let q: any;
    if (includeAll) {
      q = query(collectionGroup(db, "bookings"));
    } else {
      q = query(
        collectionGroup(db, "bookings"),
        where("appointmentDate", ">=", Timestamp.fromDate(today)),
      );
    }

    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as any;
      const aptDate =
        data.appointmentDate?.toDate?.() || new Date(data.appointmentDate);
      const booking = {
        id: docSnap.id,
        dateFolder: docSnap.ref.parent.parent
          ? docSnap.ref.parent.parent.id
          : null,
        ...(data || {}),
        source: "frontend",
        appointmentDate: aptDate,
      };
      bookings.push(booking);
    });

    return bookings.sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime(),
    );
  } catch (error) {
    console.error("Error getting frontend bookings:", error);
    return [];
  }
};

export const bookAppointmentPublic = async (bookingData: any) => {
  try {
    const existingCustomers = await searchCustomers(bookingData.customerPhone);
    let customerId = null;

    if (existingCustomers.length > 0) {
      customerId = existingCustomers[0].id;
    } else {
      customerId = await addCustomer({
        name: bookingData.customerName,
        contactNo: bookingData.customerPhone,
        email: bookingData.customerEmail,
        gender: bookingData.gender || "",
      });
    }

    const appointmentId = await createAppointment({
      customerId: customerId,
      customerName: bookingData.customerName,
      customerPhone: bookingData.customerPhone,
      customerEmail: bookingData.customerEmail,
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName,
      appointmentDate: bookingData.appointmentDate,
      appointmentTime: bookingData.appointmentTime,
      duration: bookingData.duration || 30,
      notes: bookingData.notes || "",
    });

    return {
      appointmentId: appointmentId,
      customerId: customerId,
      message:
        "Appointment booked successfully! You will receive confirmation via SMS/Email.",
    };
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
};

export const bookAppointment = async (appointmentData: any) => {
  try {
    const dateObj =
      appointmentData.appointmentDate instanceof Date
        ? appointmentData.appointmentDate
        : new Date(appointmentData.appointmentDate);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    // 1. Save to appointments/{dateString}/bookings (for admin panel)
    const appointmentRef = collection(
      db,
      `appointments/${dateString}/bookings`,
    );
    const docRef = await addDoc(appointmentRef, {
      ...appointmentData,
      appointmentDate: Timestamp.fromDate(dateObj),
      createdAt: Timestamp.now(),
      status: "pending",
    });

    // 2. Save to customers/{customerId}/appointments subcollection (for frontend)
    const customerAppointmentRef = collection(
      db,
      `customers/${appointmentData.customerId}/appointments`,
    );
    await addDoc(customerAppointmentRef, {
      id: docRef.id,
      customerId: appointmentData.customerId,
      customerName: appointmentData.customerName,
      customerEmail: appointmentData.customerEmail,
      customerPhone: appointmentData.customerPhone,
      serviceId: appointmentData.serviceId,
      serviceName: appointmentData.serviceName,
      stylistId: appointmentData.stylistId,
      stylistName: appointmentData.stylistName,
      appointmentDate: Timestamp.fromDate(dateObj),
      appointmentTime: appointmentData.appointmentTime,
      duration: appointmentData.duration || 0,
      notes: appointmentData.notes || "",
      status: "pending",
      dateFolder: dateString,
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error: any) {
    console.error("Error booking appointment:", error);
    throw new Error(error?.message || "Failed to book appointment");
  }
};

export const checkStylistAvailability = async (
  stylistId: string,
  appointmentDate: string,
  appointmentTime: string,
): Promise<boolean> => {
  try {
    const dateString = appointmentDate;

    const q = query(
      collection(db, `appointments/${dateString}/bookings`),
      where("stylistId", "==", stylistId),
      where("appointmentTime", "==", appointmentTime),
    );
    const querySnapshot = await getDocs(q);

    const bookedAppointments = querySnapshot.docs.filter(
      (doc) => doc.data().status !== "cancelled",
    );
    return bookedAppointments.length === 0;
  } catch (error) {
    console.error("Error checking availability:", error);
    return true;
  }
};

export const getBookedSlotsForStylist = async (
  stylistId: string,
  appointmentDate: string,
): Promise<string[]> => {
  try {
    const dateString = appointmentDate;

    const q = query(
      collection(db, `appointments/${dateString}/bookings`),
      where("stylistId", "==", stylistId),
    );
    const querySnapshot = await getDocs(q);

    const bookedTimes: string[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().status !== "cancelled") {
        const appointmentTime = doc.data().appointmentTime;
        if (appointmentTime && !bookedTimes.includes(appointmentTime)) {
          bookedTimes.push(appointmentTime);
        }
      }
    });
    return bookedTimes;
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    return [];
  }
};

// ============================================
// REVIEWS & FEEDBACK
// ============================================

export const getReviews = async (
  limitCount: number = 10,
): Promise<Review[]> => {
  try {
    const reviewsCollection = collection(db, "reviews");
    const q = query(
      reviewsCollection,
      orderBy("createdAt", "desc"),
      limit(limitCount),
    );

    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];

    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
      } as Review);
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const submitReview = async (
  customerId: string,
  customerName: string,
  customerEmail: string,
  serviceName: string,
  rating: number,
  reviewText: string,
): Promise<string> => {
  try {
    const reviewsCollection = collection(db, "reviews");
    const newReview = {
      customerId,
      customerName,
      customerEmail,
      serviceName: serviceName || "General Service",
      rating,
      reviewText,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(reviewsCollection, newReview);
    return docRef.id;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

export const submitFeedback = async (visitId: string, feedbackData: any) => {
  try {
    const feedbackId = await addDocument("feedback", {
      visitId: visitId,
      customerId: feedbackData.customerId,
      rating: parseInt(feedbackData.rating),
      comment: feedbackData.comment || "",
      feedbackDate: serverTimestamp(),
    });

    await updateDocument("visits", visitId, { feedback: feedbackId });

    return feedbackId;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

// ============================================
// IMAGE UPLOAD
// ============================================

export const uploadProductImage = async (file: File) => {
  try {
    if (!file) throw new Error("No file provided");

    const fileName = `admin/products/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, fileName);

    await uploadBytes(fileRef, file);

    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const uploadServiceImage = async (file: File) => {
  try {
    if (!file) throw new Error("No file provided");

    const fileName = `admin/services/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, fileName);

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading service image:", error);
    throw error;
  }
};

// ============================================
// REFERRAL SYSTEM MANAGEMENT
// ============================================

export interface ReferralCode {
  id?: string;
  code: string;
  createdByPhone: string;
  createdByName: string;
  discountPercentage: number;
  maxUses: number;
  currentUses: number;
  status: "active" | "inactive" | "expired";
  expiryDate: any;
  bonusPointsForReferrer: number;
  bonusPointsForNewCustomer: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Referral {
  id?: string;
  referralCode: string;
  referrerPhone: string;
  referrerName: string;
  newCustomerPhone: string;
  newCustomerName: string;
  status: "pending" | "completed" | "failed";
  referrerRewardPoints: number;
  newCustomerRewardPoints: number;
  newCustomerDiscountAmount: number;
  invoiceId?: string;
  createdAt?: any;
  completedAt?: any;
}

export const generateReferralCode = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, "").slice(-8);
  const timestamp = Date.now().toString().slice(-6);
  const code = `REF${cleanPhone}${timestamp}`.toUpperCase();
  return code;
};

export const createReferralCode = async (
  customerPhone: string,
  customerName: string,
  discountPercentage: number = 10,
  maxUses: number = 5,
  bonusPointsForReferrer: number = 500,
  bonusPointsForNewCustomer: number = 300,
): Promise<ReferralCode> => {
  try {
    const normalizedPhone = normalizePhone(customerPhone);
    if (!normalizedPhone) {
      throw new Error("Phone number is required");
    }

    const code = generateReferralCode(normalizedPhone);

    const referralCodeDoc: ReferralCode = {
      code,
      createdByPhone: normalizedPhone,
      createdByName: customerName,
      discountPercentage,
      maxUses,
      currentUses: 0,
      status: "active",
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      bonusPointsForReferrer,
      bonusPointsForNewCustomer,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "referralCodes", code), referralCodeDoc);

    // Add to customer's referralCodes subcollection
    await addDoc(collection(db, `customers/${normalizedPhone}/referralCodes`), {
      code,
      createdAt: serverTimestamp(),
    });

    return referralCodeDoc;
  } catch (error) {
    console.error("Error creating referral code:", error);
    throw error;
  }
};

export const getReferralCode = async (
  code: string,
): Promise<ReferralCode | null> => {
  try {
    const docRef = doc(db, "referralCodes", code);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ReferralCode;
    }
    return null;
  } catch (error) {
    console.error("Error getting referral code:", error);
    throw error;
  }
};

export const validateAndApplyReferralCode = async (
  referralCode: string,
  newCustomerPhone: string,
  newCustomerName: string,
  invoiceId?: string,
): Promise<{
  success: boolean;
  discount: number;
  points: number;
  message: string;
}> => {
  try {
    const normalizedPhone = normalizePhone(newCustomerPhone);
    if (!normalizedPhone) {
      throw new Error("Phone number is required");
    }

    const referralData = await getReferralCode(referralCode);

    if (!referralData) {
      return {
        success: false,
        discount: 0,
        points: 0,
        message: "Invalid referral code",
      };
    }

    if (referralData.status !== "active") {
      return {
        success: false,
        discount: 0,
        points: 0,
        message: "Referral code is no longer active",
      };
    }

    if (referralData.currentUses >= referralData.maxUses) {
      return {
        success: false,
        discount: 0,
        points: 0,
        message: "Referral code has reached maximum uses",
      };
    }

    const expiryDate = convertTimestampToDate(referralData.expiryDate);
    if (expiryDate && new Date() > expiryDate) {
      return {
        success: false,
        discount: 0,
        points: 0,
        message: "Referral code has expired",
      };
    }

    // Check if new customer already used a referral
    const existingReferral = await getDocs(
      query(
        collection(db, "referrals"),
        where("newCustomerPhone", "==", normalizedPhone),
        where("status", "==", "completed"),
      ),
    );

    if (existingReferral.size > 0) {
      return {
        success: false,
        discount: 0,
        points: 0,
        message: "This customer has already used a referral code",
      };
    }

    // Create referral record
    const referralRecord: Referral = {
      referralCode,
      referrerPhone: referralData.createdByPhone,
      referrerName: referralData.createdByName,
      newCustomerPhone: normalizedPhone,
      newCustomerName: newCustomerName,
      status: "completed",
      referrerRewardPoints: referralData.bonusPointsForReferrer,
      newCustomerRewardPoints: referralData.bonusPointsForNewCustomer,
      newCustomerDiscountAmount: referralData.discountPercentage,
      invoiceId: invoiceId,
      createdAt: serverTimestamp(),
      completedAt: serverTimestamp(),
    };

    const referralDoc = await addDoc(
      collection(db, "referrals"),
      referralRecord,
    );

    // Update referral code usage count
    await updateDoc(doc(db, "referralCodes", referralCode), {
      currentUses: referralData.currentUses + 1,
      updatedAt: serverTimestamp(),
    });

    // Award points to referrer - update directly without complex migrations
    const referrerCustomer = await getCustomerByPhone(
      referralData.createdByPhone,
    );
    if (referrerCustomer) {
      const newPoints =
        (referrerCustomer.loyaltyPoints || 0) +
        referralData.bonusPointsForReferrer;

      // Update loyalty points directly using updateDoc
      await updateDoc(doc(db, "customers", referralData.createdByPhone), {
        loyaltyPoints: newPoints,
        updatedAt: serverTimestamp(),
      });

      // Log points history for referrer
      await addDoc(
        collection(
          db,
          `customers/${referralData.createdByPhone}/pointsHistory`,
        ),
        {
          type: "referral_reward",
          points: referralData.bonusPointsForReferrer,
          amount: 0,
          description: `Referral reward for ${newCustomerName}`,
          referralCode: referralCode,
          customerId: referralDoc.id,
          transactionDate: serverTimestamp(),
        },
      );
      console.log(
        `✅ Awarded ${referralData.bonusPointsForReferrer} points to referrer`,
      );
    }

    // Award points to new customer - update directly
    const newCustomer = await getCustomerByPhone(normalizedPhone);
    if (newCustomer) {
      const newPoints =
        (newCustomer.loyaltyPoints || 0) +
        referralData.bonusPointsForNewCustomer;

      // Update loyalty points directly using updateDoc
      await updateDoc(doc(db, "customers", normalizedPhone), {
        loyaltyPoints: newPoints,
        updatedAt: serverTimestamp(),
      });

      // Log points history for new customer
      await addDoc(
        collection(db, `customers/${normalizedPhone}/pointsHistory`),
        {
          type: "referral_signup_bonus",
          points: referralData.bonusPointsForNewCustomer,
          amount: 0,
          description: `Sign-up bonus from referral code ${referralCode}`,
          referralCode: referralCode,
          customerId: referralDoc.id,
          transactionDate: serverTimestamp(),
        },
      );
      console.log(
        `✅ Awarded ${referralData.bonusPointsForNewCustomer} points to new customer`,
      );
    }

    console.log(
      "✅ Referral code applied successfully:",
      referralCode,
      "for customer:",
      newCustomerName,
    );
    return {
      success: true,
      discount: referralData.discountPercentage,
      points: referralData.bonusPointsForNewCustomer,
      message: "Referral code applied successfully",
    };
  } catch (error: any) {
    console.error("Error validating referral code:", error);
    return {
      success: false,
      discount: 0,
      points: 0,
      message: error.message || "Error validating referral code",
    };
  }
};

export const getReferrerReferrals = async (
  referrerPhone: string,
): Promise<Referral[]> => {
  try {
    const normalizedPhone = normalizePhone(referrerPhone);
    if (!normalizedPhone) return [];

    const q = query(
      collection(db, "referrals"),
      where("referrerPhone", "==", normalizedPhone),
    );

    const querySnapshot = await getDocs(q);
    const referrals = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Referral,
    );

    // Sort by createdAt in descending order (most recent first)
    return referrals.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error("Error getting referrer referrals:", error);
    return [];
  }
};

export const getCustomerReferralCodes = async (
  customerPhone: string,
): Promise<ReferralCode[]> => {
  try {
    const normalizedPhone = normalizePhone(customerPhone);
    if (!normalizedPhone) return [];

    const q = query(
      collection(db, "referralCodes"),
      where("createdByPhone", "==", normalizedPhone),
    );

    const querySnapshot = await getDocs(q);
    const codes = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as ReferralCode,
    );

    // Sort by createdAt in descending order (most recent first)
    return codes.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error("Error getting customer referral codes:", error);
    return [];
  }
};

export const getReferralStats = async (
  customerPhone: string,
): Promise<{
  totalReferrals: number;
  successfulReferrals: number;
  totalRewardsEarned: number;
  activeReferralCodes: number;
}> => {
  try {
    const normalizedPhone = normalizePhone(customerPhone);
    if (!normalizedPhone) {
      return {
        totalReferrals: 0,
        successfulReferrals: 0,
        totalRewardsEarned: 0,
        activeReferralCodes: 0,
      };
    }

    const referralCodes = await getCustomerReferralCodes(normalizedPhone);
    const referrals = await getReferrerReferrals(normalizedPhone);

    const successfulReferrals = referrals.filter(
      (r) => r.status === "completed",
    ).length;
    const totalRewardsEarned = referrals.reduce((sum, r) => {
      if (r.status === "completed") {
        return sum + (r.referrerRewardPoints || 0);
      }
      return sum;
    }, 0);

    const activeReferralCodes = referralCodes.filter(
      (c) => c.status === "active",
    ).length;

    return {
      totalReferrals: referrals.length,
      successfulReferrals,
      totalRewardsEarned,
      activeReferralCodes,
    };
  } catch (error) {
    console.error("Error getting referral stats:", error);
    return {
      totalReferrals: 0,
      successfulReferrals: 0,
      totalRewardsEarned: 0,
      activeReferralCodes: 0,
    };
  }
};

// ============================================
// SPIN WHEEL FUNCTIONS
// ============================================

export const recordDailySpins = async (
  customerId: string,
  customerName: string,
  pointsWon: number,
  isJackpot: boolean,
) => {
  try {
    // Get current date for daily tracking
    const today = new Date().toDateString();

    // Use transaction for consistency
    const result = await runTransaction(db, async (transaction) => {
      // Get/Create spell record for today
      const spinDocRef = doc(db, `customers/${customerId}/spins/${today}`);
      const spinDoc = await transaction.get(spinDocRef);

      if (spinDoc.exists()) {
        // Already spun today - don't allow another spin
        throw new Error("You have already spun today. Come back tomorrow!");
      }

      // Get global stats
      const statsRef = doc(db, "spinWheelStats/stats");
      const statsDoc = await transaction.get(statsRef);

      // Get customer document for loyalty points update (must read before any writes)
      const customerRef = doc(db, `customers/${customerId}`);
      const customerDoc = await transaction.get(customerRef);

      let totalSpins = 1;
      let jackpotWinner = null;
      let isJackpotWinner = false;

      if (statsDoc.exists()) {
        totalSpins = (statsDoc.data().totalSpins || 0) + 1;
        jackpotWinner = statsDoc.data().jackpotWinner;

        // Check if this spin hits 10000
        if (totalSpins % 10000 === 0 && !jackpotWinner) {
          isJackpotWinner = true;
          jackpotWinner = customerName;
          pointsWon = 5000; // Award jackpot amount
        }
      }

      // Record the spin
      transaction.set(spinDocRef, {
        timestamp: serverTimestamp(),
        pointsWon,
        isJackpot: isJackpot && !isJackpotWinner,
        date: today,
      });

      // Update customer loyalty points
      const currentPoints = customerDoc.exists()
        ? customerDoc.data().loyaltyPoints || 0
        : 0;

      transaction.update(customerRef, {
        loyaltyPoints: currentPoints + pointsWon,
      });

      // Update global stats
      transaction.set(
        statsRef,
        {
          totalSpins,
          jackpotWinner: isJackpotWinner ? customerName : jackpotWinner,
          lastUpdated: serverTimestamp(),
        },
        { merge: true },
      );

      return {
        pointsAwarded: pointsWon,
        totalSpins,
        isJackpotWinner,
      };
    });

    return result;
  } catch (error: any) {
    console.error("Error recording spin:", error);
    throw error;
  }
};

export const getSpinWheelStats = async (customerId: string) => {
  try {
    const today = new Date().toDateString();

    // Check if user has spun today
    const spinDocRef = doc(db, `customers/${customerId}/spins/${today}`);
    const spinDoc = await getDoc(spinDocRef);
    const hasSpunToday = spinDoc.exists();

    // Get user's total spins
    const userSpinsRef = collection(db, `customers/${customerId}/spins`);
    const userSpinsDocs = await getDocs(userSpinsRef);
    const userTotalSpins = userSpinsDocs.size;

    // Get user's points won today
    let dailyPointsWon = 0;
    if (hasSpunToday) {
      dailyPointsWon = spinDoc.data().pointsWon || 0;
    }

    // Get global stats
    const statsRef = doc(db, "spinWheelStats/stats");
    const statsDoc = await getDoc(statsRef);

    const totalSpins = statsDoc.exists() ? statsDoc.data().totalSpins || 0 : 0;
    const jackpotWinner = statsDoc.exists()
      ? statsDoc.data().jackpotWinner
      : null;

    return {
      hasSpunToday,
      userTotalSpins,
      dailyPointsWon,
      totalSpins,
      jackpotWinner,
    };
  } catch (error) {
    console.error("Error getting spin wheel stats:", error);
    return {
      hasSpunToday: false,
      userTotalSpins: 0,
      dailyPointsWon: 0,
      totalSpins: 0,
      jackpotWinner: null,
    };
  }
};

export const getCustomerSpinHistory = async (
  customerId: string,
  limitCount = 10,
) => {
  try {
    const userSpinsRef = collection(db, `customers/${customerId}/spins`);
    const q = query(
      userSpinsRef,
      orderBy("timestamp", "desc"),
      limit(limitCount),
    );
    const userSpinsDocs = await getDocs(q);

    return userSpinsDocs.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp:
          doc.data().timestamp?.toDate?.() || new Date(doc.data().date),
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error getting customer spin history:", error);
    return [];
  }
};

export const awardCustomerSpin = async (
  customerId: string,
  customerName: string,
  pointsWon: number,
  awardedBy?: string,
) => {
  try {
    const timestamp = new Date();
    const dateKey = timestamp.toDateString();

    const result = await runTransaction(db, async (transaction) => {
      // Get customer document
      const customerRef = doc(db, `customers/${customerId}`);
      const customerDoc = await transaction.get(customerRef);

      if (!customerDoc.exists()) {
        throw new Error("Customer not found");
      }

      // Create/update spin record with a timestamp key for flexibility
      const spinTimeKey = `${dateKey}-${Date.now()}`;
      const spinDocRef = doc(
        db,
        `customers/${customerId}/spins/${spinTimeKey}`,
      );

      // Record the awarded spin
      transaction.set(spinDocRef, {
        timestamp: serverTimestamp(),
        pointsWon,
        isJackpot: false,
        date: dateKey,
        awardedBy: awardedBy || "admin",
        awardedManually: true,
      });

      // Update customer loyalty points
      const currentPoints = customerDoc.data().loyaltyPoints || 0;
      transaction.update(customerRef, {
        loyaltyPoints: currentPoints + pointsWon,
      });

      return {
        pointsAwarded: pointsWon,
        success: true,
        message: `${pointsWon} points awarded to ${customerName}`,
      };
    });

    return result;
  } catch (error: any) {
    console.error("Error awarding spin:", error);
    throw error;
  }
};

export const claimSpinReward = async (customerId: string) => {
  try {
    const today = new Date().toDateString();

    const spinDocRef = doc(db, `customers/${customerId}/spins/${today}`);
    const spinDoc = await getDoc(spinDocRef);

    if (!spinDoc.exists()) {
      throw new Error("No spin found for today");
    }

    return spinDoc.data();
  } catch (error) {
    console.error("Error claiming spin reward:", error);
    throw error;
  }
};

// ============================================
// COUPON MANAGEMENT
// ============================================

export interface Coupon {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  maxUsageCount?: number;
  currentUsageCount?: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  validFrom: any;
  validUntil: any;
  isActive: boolean;
  description: string;
  createdAt?: any;
  updatedAt?: any;
}

export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const couponsRef = collection(db, "coupons");
    const q = query(
      couponsRef,
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      code: doc.id,
      ...doc.data(),
    })) as Coupon[];
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

export const getCoupon = async (couponCode: string): Promise<Coupon | null> => {
  try {
    const docRef = doc(db, "coupons", couponCode.toUpperCase().trim());
    const docSnap = await getDoc(docRef);
    return docSnap.exists()
      ? ({ code: docSnap.id, ...docSnap.data() } as Coupon)
      : null;
  } catch (error) {
    console.error("Error fetching coupon:", error);
    throw error;
  }
};

export const validateCoupon = async (
  couponCode: string,
  orderAmount: number,
) => {
  try {
    const coupon = await getCoupon(couponCode);

    if (!coupon) {
      return {
        valid: false,
        error: "Coupon code not found",
      };
    }

    if (!coupon.isActive) {
      return {
        valid: false,
        error: "This coupon is inactive",
      };
    }

    // Check expiry
    const now = new Date();
    if (coupon.validUntil) {
      const expiryDate =
        coupon.validUntil?.toDate?.() || new Date(coupon.validUntil);
      if (now > expiryDate) {
        return {
          valid: false,
          error: "Coupon has expired",
        };
      }
    }

    if (coupon.validFrom) {
      const startDate =
        coupon.validFrom?.toDate?.() || new Date(coupon.validFrom);
      if (now < startDate) {
        return {
          valid: false,
          error: "Coupon is not yet valid",
        };
      }
    }

    // Check usage limit
    if (
      coupon.maxUsageCount &&
      (coupon.currentUsageCount || 0) >= coupon.maxUsageCount
    ) {
      return {
        valid: false,
        error: "Coupon usage limit exceeded",
      };
    }

    // Check minimum order amount
    if (orderAmount < (coupon.minOrderAmount || 0)) {
      return {
        valid: false,
        error: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
      };
    }

    // Calculate discount
    let discountAmount = 0;
    let isCapped = false;
    let originalDiscountAmount = 0;

    if (coupon.discountType === "percentage") {
      originalDiscountAmount = (orderAmount * coupon.discountValue) / 100;
      discountAmount = originalDiscountAmount;

      // Apply max discount cap if set
      if (
        coupon.maxDiscountAmount &&
        discountAmount > coupon.maxDiscountAmount
      ) {
        discountAmount = coupon.maxDiscountAmount;
        isCapped = true;
      }
    } else {
      // flat discount
      originalDiscountAmount = coupon.discountValue;
      discountAmount = coupon.discountValue;

      // Don't allow discount more than order amount
      if (discountAmount > orderAmount) {
        discountAmount = orderAmount;
        isCapped = true;
      }
    }

    return {
      valid: true,
      coupon: coupon,
      discountAmount: discountAmount,
      originalDiscountAmount: originalDiscountAmount,
      isCapped: isCapped,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return {
      valid: false,
      error: (error as Error).message || "Error validating coupon",
    };
  }
};
// Get appointments for a specific customer
export const getCustomerAppointments = async (
  customerId: string,
): Promise<Appointment[]> => {
  try {
    const q = query(
      collection(db, `customers/${customerId}/appointments`),
      orderBy("appointmentDate", "desc"),
    );
    const querySnapshot = await getDocs(q);
    const appointments: Appointment[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      appointments.push({
        id: doc.id,
        ...data,
        appointmentDate:
          data.appointmentDate?.toDate?.() || new Date(data.appointmentDate),
      } as Appointment);
    });

    return appointments;
  } catch (error) {
    console.error("Error getting customer appointments:", error);
    return [];
  }
};

// Cancel an appointment
export const cancelAppointment = async (
  appointmentId: string,
): Promise<boolean> => {
  try {
    let customerId: string | null = null;

    // 1. Update in appointments/{dateString}/bookings and get customerId
    const appointmentsQuery = query(collectionGroup(db, "bookings"));
    const appointmentsSnapshot = await getDocs(appointmentsQuery);

    appointmentsSnapshot.forEach(async (doc) => {
      if (doc.id === appointmentId) {
        const bookingData = doc.data();
        customerId = bookingData.customerId;
        await updateDoc(doc.ref, {
          status: "cancelled",
          cancelledAt: serverTimestamp(),
        });
      }
    });

    // 2. Update in customers/{customerId}/appointments subcollection
    if (customerId) {
      const customerAppointmentsQuery = query(
        collection(db, `customers/${customerId}/appointments`),
        where("id", "==", appointmentId),
      );
      const customerAppointmentsSnapshot = await getDocs(
        customerAppointmentsQuery,
      );

      if (!customerAppointmentsSnapshot.empty) {
        const customerAptDoc = customerAppointmentsSnapshot.docs[0];
        await updateDoc(customerAptDoc.ref, {
          status: "cancelled",
          cancelledAt: serverTimestamp(),
        });
      }
    }

    return true;
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    throw error;
  }
};

// Confirm an appointment
export const confirmAppointment = async (
  appointmentId: string,
  customerId: string,
): Promise<boolean> => {
  try {
    // 1. Update in appointments/{dateString}/bookings
    const appointmentsQuery = query(collectionGroup(db, "bookings"));
    const appointmentsSnapshot = await getDocs(appointmentsQuery);

    appointmentsSnapshot.forEach(async (doc) => {
      if (doc.id === appointmentId) {
        await updateDoc(doc.ref, {
          status: "confirmed",
          confirmedAt: serverTimestamp(),
        });
      }
    });

    // 2. Update in customers/{customerId}/appointments subcollection
    const customerAppointmentsQuery = query(
      collection(db, `customers/${customerId}/appointments`),
      where("id", "==", appointmentId),
    );
    const customerAppointmentsSnapshot = await getDocs(
      customerAppointmentsQuery,
    );

    if (!customerAppointmentsSnapshot.empty) {
      const customerAptDoc = customerAppointmentsSnapshot.docs[0];
      await updateDoc(customerAptDoc.ref, {
        status: "confirmed",
        confirmedAt: serverTimestamp(),
      });
    }

    return true;
  } catch (error) {
    console.error("Error confirming appointment:", error);
    throw error;
  }
};

// ============================================
// APPOINTMENT CONFIRMATION EMAIL
// ============================================

export const sendAppointmentConfirmationEmail = async (
  appointmentData: any,
) => {
  try {
    // Prepare the data to send to the email API
    const emailPayload = {
      customerName: appointmentData.customerName,
      customerEmail: appointmentData.customerEmail,
      customerPhone: appointmentData.customerPhone,
      serviceName: appointmentData.serviceName,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      stylistName: appointmentData.stylistName || null,
      duration: appointmentData.duration || null,
      notes: appointmentData.notes || null,
    };

    // Call the Vercel serverless function to send confirmation email
    const response = await fetch("/api/send-appointment-confirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send confirmation email");
    }

    const result = await response.json();
    console.log("✅ Confirmation email sent successfully:", result);
    return result;
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    // Don't throw - email sending failure shouldn't block appointment confirmation
    // Log the error but allow the appointment to be confirmed
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================
// APPLY REFERRAL CODE ON SIGNUP
// ============================================

/**
 * Apply referral code when new customer signs up
 * This should be called after customer account is created
 */
export const applyReferralCodeDuringSignup = async (
  referralCode: string | null,
  customerPhone: string,
  customerName: string,
): Promise<{
  success: boolean;
  message: string;
  discount?: number;
  bonusPoints?: number;
}> => {
  // If no referral code provided, just return success
  if (!referralCode || referralCode.trim() === "") {
    console.log("📝 No referral code provided");
    return {
      success: true,
      message: "No referral code provided",
    };
  }

  try {
    console.log(
      '🎯 Applying referral code during signup:",',
      referralCode,
      "for",
      customerName,
    );

    const result = await validateAndApplyReferralCode(
      referralCode,
      customerPhone,
      customerName,
    );

    return {
      success: result.success,
      message: result.message,
      discount: result.discount,
      bonusPoints: result.points,
    };
  } catch (error: any) {
    console.error("❌ Error applying referral code during signup:", error);
    return {
      success: false,
      message:
        "Failed to apply referral code, but account was created successfully",
    };
  }
};
