import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  addDoc,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const convertTimestampToDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') return timestamp.toDate();
  if (typeof timestamp === 'object' && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date(timestamp);
};

// ============================================
// AUTHENTICATION & ADMIN MANAGEMENT
// ============================================

export const registerUser = async (email, password, displayName, role = 'staff') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      displayName: displayName || '',
      createdAt: serverTimestamp(),
      role: role
    });

    return userCredential.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Verify user role
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    return { ...userCredential.user, ...userDoc.data() };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

export const getCurrentUserRole = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    throw error;
  }
};

// ============================================
// GENERIC FIRESTORE OPERATIONS
// ============================================

export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

export const getDocuments = async (collectionName, conditions = []) => {
  try {
    let q = collection(db, collectionName);
    
    if (conditions.length > 0) {
      const whereConditions = conditions.filter(c => c.type === 'where').map(c => where(c.field, c.operator, c.value));
      const orderByConditions = conditions.filter(c => c.type === 'orderBy').map(c => orderBy(c.field, c.direction || 'asc'));
      const limitCondition = conditions.find(c => c.type === 'limit');

      const allConditions = [...whereConditions, ...orderByConditions];
      if (limitCondition) allConditions.push(limit(limitCondition.value));

      q = query(q, ...allConditions);
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
};

export const updateDocument = async (collectionName, docId, data) => {
  try {
    await updateDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const softDeleteDocument = async (collectionName, docId) => {
  try {
    await updateDoc(doc(db, collectionName, docId), {
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error soft deleting document:', error);
    throw error;
  }
};

export const restoreDocument = async (collectionName, docId) => {
  try {
    await updateDoc(doc(db, collectionName, docId), {
      deletedAt: null,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error restoring document:', error);
    throw error;
  }
};

// ============================================
// CUSTOMER MANAGEMENT
// ============================================

export const addCustomer = async (customerData) => {
  try {
    const customerId = await addDocument('customers', {
      name: customerData.name,
      contactNo: customerData.contactNo,
      email: customerData.email || '',
      gender: customerData.gender || '',
      totalVisits: 0,
      totalSpent: 0,
      deletedAt: null
    });
    return { id: customerId };
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const getCustomers = async (includeDeleted = false) => {
  try {
    const conditions = includeDeleted ? [] : [
      { type: 'where', field: 'deletedAt', operator: '==', value: null }
    ];
    conditions.push({ type: 'orderBy', field: 'createdAt', direction: 'desc' });
    return await getDocuments('customers', conditions);
  } catch (error) {
    console.error('Error getting customers:', error);
    throw error;
  }
};

export const searchCustomers = async (searchTerm) => {
  try {
    const allCustomers = await getCustomers(false);
    return allCustomers.filter(customer => 
      customer.contactNo.includes(searchTerm) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching customers:', error);
    throw error;
  }
};

export const updateCustomer = async (customerId, customerData) => {
  try {
    await updateDocument('customers', customerId, customerData);
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    await softDeleteDocument('customers', customerId);
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

export const updateCustomerStats = async (customerId, amount) => {
  try {
    const customer = await getDocument('customers', customerId);
    if (customer) {
      await updateDocument('customers', customerId, {
        totalVisits: (customer.totalVisits || 0) + 1,
        totalSpent: (customer.totalSpent || 0) + amount
      });
    }
  } catch (error) {
    console.error('Error updating customer stats:', error);
    throw error;
  }
};

// ============================================
// STAFF MANAGEMENT
// ============================================

export const addStaff = async (staffData) => {
  try {
    const staffId = await addDocument('staff', {
      name: staffData.name,
      phone: staffData.phone,
      email: staffData.email,
      role: staffData.role,
      active: true,
      totalVisits: 0,
      createdAt: serverTimestamp()
    });
    return staffId;
  } catch (error) {
    console.error('Error adding staff:', error);
    throw error;
  }
};

export const getStaff = async () => {
  try {
    const conditions = [
      { type: 'where', field: 'active', operator: '==', value: true }
    ];
    return await getDocuments('staff', conditions);
  } catch (error) {
    console.error('Error getting staff:', error);
    throw error;
  }
};

export const updateStaff = async (staffId, staffData) => {
  try {
    await updateDocument('staff', staffId, staffData);
  } catch (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
};

export const deleteStaff = async (staffId) => {
  try {
    await updateDocument('staff', staffId, { active: false });
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
};

export const updateStaffStats = async (staffId) => {
  try {
    const staff = await getDocument('staff', staffId);
    if (staff) {
      await updateDocument('staff', staffId, {
        totalVisits: (staff.totalVisits || 0) + 1
      });
    }
  } catch (error) {
    console.error('Error updating staff stats:', error);
    throw error;
  }
};

// ============================================
// SERVICE MANAGEMENT
// ============================================

export const addService = async (serviceData) => {
  try {
    const serviceId = await addDocument('services', {
      name: serviceData.name,
      category: serviceData.category || '',
      price: parseFloat(serviceData.price),
      duration: parseInt(serviceData.duration) || 30,
      gender: serviceData.gender || 'any',
      deletedAt: null
    });
    return serviceId;
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
};

export const getServices = async (includeDeleted = false) => {
  try {
    const conditions = includeDeleted ? [] : [
      { type: 'where', field: 'deletedAt', operator: '==', value: null }
    ];
    conditions.push({ type: 'orderBy', field: 'createdAt', direction: 'desc' });
    return await getDocuments('services', conditions);
  } catch (error) {
    console.error('Error getting services:', error);
    throw error;
  }
};

export const getRecentServices = async (days = 7) => {
  try {
    const allServices = await getServices(true);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days);
    
    return allServices.filter(service => {
      const createdAt = service.createdAt?.toDate?.() || service.createdAt;
      return createdAt > pastDate;
    });
  } catch (error) {
    console.error('Error getting recent services:', error);
    throw error;
  }
};

export const updateService = async (serviceId, serviceData) => {
  try {
    await updateDocument('services', serviceId, serviceData);
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (serviceId) => {
  try {
    await softDeleteDocument('services', serviceId);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

export const restoreService = async (serviceId) => {
  try {
    await restoreDocument('services', serviceId);
  } catch (error) {
    console.error('Error restoring service:', error);
    throw error;
  }
};

// ============================================
// PRODUCT MANAGEMENT
// ============================================

export const addProduct = async (productData) => {
  try {
    const productId = await addDocument('products', {
      name: productData.name,
      category: productData.category || '',
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock) || 0,
      description: productData.description || ''
    });
    return productId;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    return await getDocuments('products', [
      { type: 'orderBy', field: 'createdAt', direction: 'desc' }
    ]);
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    await updateDocument('products', productId, productData);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await deleteDocument('products', productId);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const updateProductStock = async (productId, quantity) => {
  try {
    const product = await getDocument('products', productId);
    if (product) {
      await updateDocument('products', productId, {
        stock: (product.stock || 0) - quantity
      });
    }
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

// ============================================
// VISIT MANAGEMENT
// ============================================

export const createVisit = async (visitData) => {
  try {
    const visitId = await addDocument('visits', {
      customerId: visitData.customerId,
      staffId: visitData.staffId || '',
      date: Timestamp.now(),
      status: 'active',
      items: [],
      totalAmount: 0,
      notes: visitData.notes || '',
      feedback: null,
      invoiceId: null,
      deletedAt: null
    });
    return visitId;
  } catch (error) {
    console.error('Error creating visit:', error);
    throw error;
  }
};

export const getVisits = async (includeDeleted = false) => {
  try {
    const conditions = includeDeleted ? [] : [
      { type: 'where', field: 'deletedAt', operator: '==', value: null }
    ];
    conditions.push({ type: 'orderBy', field: 'date', direction: 'desc' });
    return await getDocuments('visits', conditions);
  } catch (error) {
    console.error('Error getting visits:', error);
    throw error;
  }
};

export const getActiveVisits = async () => {
  try {
    const allVisits = await getDocuments('visits', [
      { type: 'where', field: 'deletedAt', operator: '==', value: null },
      { type: 'orderBy', field: 'date', direction: 'desc' }
    ]);
    
    // Filter out completed visits (status COMPLETED or not in active statuses)
    return allVisits.filter(visit => 
      visit.status && 
      ['CHECKED_IN', 'IN_SERVICE', 'WAITING_PAYMENT'].includes(visit.status)
    );
  } catch (error) {
    console.error('Error getting active visits:', error);
    throw error;
  }
};

export const getVisitsByCustomer = async (customerId) => {
  try {
    return await getDocuments('visits', [
      { type: 'where', field: 'customerId', operator: '==', value: customerId },
      { type: 'where', field: 'deletedAt', operator: '==', value: null },
      { type: 'orderBy', field: 'date', direction: 'desc' }
    ]);
  } catch (error) {
    console.error('Error getting customer visits:', error);
    throw error;
  }
};

export const addVisitItem = async (visitId, item) => {
  try {
    const visit = await getDocument('visits', visitId);
    if (visit) {
      const items = visit.items || [];
      const newItem = {
        id: Date.now().toString(),
        type: item.type, // 'service' or 'product'
        itemId: item.itemId,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity) || 1
      };
      items.push(newItem);

      const totalAmount = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

      await updateDocument('visits', visitId, {
        items: items,
        totalAmount: totalAmount
      });

      return newItem.id;
    }
  } catch (error) {
    console.error('Error adding visit item:', error);
    throw error;
  }
};

export const removeVisitItem = async (visitId, itemId) => {
  try {
    const visit = await getDocument('visits', visitId);
    if (visit && visit.items) {
      const items = visit.items.filter(i => i.id !== itemId);
      const totalAmount = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

      await updateDocument('visits', visitId, {
        items: items,
        totalAmount: totalAmount
      });
    }
  } catch (error) {
    console.error('Error removing visit item:', error);
    throw error;
  }
};

export const updateVisitStatus = async (visitId, status) => {
  try {
    await updateDocument('visits', visitId, { status: status });
  } catch (error) {
    console.error('Error updating visit status:', error);
    throw error;
  }
};

export const deleteVisit = async (visitId) => {
  try {
    await softDeleteDocument('visits', visitId);
  } catch (error) {
    console.error('Error deleting visit:', error);
    throw error;
  }
};

// ============================================
// INVOICE & BILLING
// ============================================

export const createInvoice = async (visitId) => {
  try {
    const visit = await getDocument('visits', visitId);
    if (!visit) throw new Error('Visit not found');

    const customer = await getDocument('customers', visit.customerId);
    if (!customer) throw new Error('Customer not found');

    const invoiceId = await addDocument('invoices', {
      visitId: visitId,
      customerId: visit.customerId,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.contactNo,
      items: visit.items,
      totalAmount: visit.totalAmount,
      paidAmount: 0,
      status: 'unpaid',
      invoiceDate: serverTimestamp(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    // Link invoice to visit
    await updateDocument('visits', visitId, { invoiceId: invoiceId });

    return invoiceId;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

export const getInvoices = async () => {
  try {
    return await getDocuments('invoices', [
      { type: 'orderBy', field: 'invoiceDate', direction: 'desc' }
    ]);
  } catch (error) {
    console.error('Error getting invoices:', error);
    throw error;
  }
};

export const getInvoice = async (invoiceId) => {
  try {
    return await getDocument('invoices', invoiceId);
  } catch (error) {
    console.error('Error getting invoice:', error);
    throw error;
  }
};

export const payInvoice = async (invoiceId, amount) => {
  try {
    const invoice = await getDocument('invoices', invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const newPaidAmount = (invoice.paidAmount || 0) + parseFloat(amount);
    const status = newPaidAmount >= invoice.totalAmount ? 'paid' : 'partial';

    await updateDocument('invoices', invoiceId, {
      paidAmount: newPaidAmount,
      status: status
    });

    // Record payment
    const paymentId = await addDocument('payments', {
      invoiceId: invoiceId,
      amount: parseFloat(amount),
      paymentDate: serverTimestamp(),
      paymentMethod: 'cash',
      notes: ''
    });

    // Update customer stats
    if (invoice.customerId) {
      await updateCustomerStats(invoice.customerId, parseFloat(amount));
    }

    return paymentId;
  } catch (error) {
    console.error('Error paying invoice:', error);
    throw error;
  }
};

// ============================================
// FEEDBACK
// ============================================

export const submitFeedback = async (visitId, feedbackData) => {
  try {
    const feedbackId = await addDocument('feedback', {
      visitId: visitId,
      customerId: feedbackData.customerId,
      rating: parseInt(feedbackData.rating),
      comment: feedbackData.comment || '',
      feedbackDate: serverTimestamp()
    });

    // Update visit with feedback reference
    await updateDocument('visits', visitId, { feedback: feedbackId });

    return feedbackId;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// ============================================
// DASHBOARD & STATISTICS
// ============================================

export const getDashboardStats = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);

    // Get all invoices
    const invoices = await getDocuments('invoices', []);
    
    // Get visits from today
    const allVisits = await getVisits(false);
    const todayVisits = allVisits.filter(v => {
      const visitDate = v.date?.toDate?.() || v.date;
      return visitDate >= today;
    });

    // Calculate daily sales
    const dailySales = invoices
      .filter(inv => {
        const invDate = inv.invoiceDate?.toDate?.() || inv.invoiceDate;
        return invDate >= today;
      })
      .reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);

    // Calculate monthly sales
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const monthlySales = invoices
      .filter(inv => {
        const invDate = inv.invoiceDate?.toDate?.() || inv.invoiceDate;
        return invDate >= thisMonth;
      })
      .reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);

    // Get top services
    const allServiceData = {};
    invoices.forEach(inv => {
      inv.items?.forEach(item => {
        if (item.type === 'service') {
          if (!allServiceData[item.name]) {
            allServiceData[item.name] = { name: item.name, count: 0, revenue: 0 };
          }
          allServiceData[item.name].count += item.quantity;
          allServiceData[item.name].revenue += item.price * item.quantity;
        }
      });
    });

    const topServices = Object.values(allServiceData)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get top products
    const allProductData = {};
    invoices.forEach(inv => {
      inv.items?.forEach(item => {
        if (item.type === 'product') {
          if (!allProductData[item.name]) {
            allProductData[item.name] = { name: item.name, count: 0, revenue: 0 };
          }
          allProductData[item.name].count += item.quantity;
          allProductData[item.name].revenue += item.price * item.quantity;
        }
      });
    });

    const topProducts = Object.values(allProductData)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get monthly trend (last 12 months)
    const monthlyTrend = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const monthSales = invoices
        .filter(inv => {
          const invDate = inv.invoiceDate?.toDate?.() || inv.invoiceDate;
          return invDate >= monthStart && invDate < monthEnd;
        })
        .reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);

      monthlyTrend.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        sales: monthSales
      });
    }

    // Get recent transactions
    const recentTransactions = invoices
      .sort((a, b) => (b.invoiceDate?.toDate?.() || b.invoiceDate) - (a.invoiceDate?.toDate?.() || a.invoiceDate))
      .slice(0, 10)
      .map(inv => ({
        id: inv.id,
        customer: inv.customerName,
        amount: inv.totalAmount,
        paid: inv.paidAmount,
        status: inv.status,
        date: inv.invoiceDate
      }));

    return {
      dailySales,
      monthlySales,
      todayVisits: todayVisits.length,
      totalInvoices: invoices.length,
      topServices,
      topProducts,
      monthlyTrend,
      recentTransactions
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

export const getSalesStats = async () => {
  try {
    const invoices = await getDocuments('invoices', []);
    
    const totalSales = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const totalOrders = invoices.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const pendingAmount = invoices.reduce((sum, inv) => sum + ((inv.totalAmount || 0) - (inv.paidAmount || 0)), 0);

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      paidInvoices,
      pendingAmount
    };
  } catch (error) {
    console.error('Error getting sales stats:', error);
    throw error;
  }
};

export const uploadProductImage = async (file) => {
  try {
    if (!file) throw new Error('No file provided');
    
    const storage = getStorage();
    const fileName = `products/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, fileName);
    
    // Upload file
    await uploadBytes(fileRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// ============================================
// LOYALTY & POINTS SYSTEM
// ============================================

export const addCustomerPoints = async (customerId, points, reason = '') => {
  try {
    // Create points transaction
    const transactionId = await addDocument('pointsTransactions', {
      customerId: customerId,
      points: points,
      reason: reason,
      transactionDate: serverTimestamp(),
      type: points > 0 ? 'earned' : 'redeemed'
    });

    // Update customer total points
    const customer = await getDocument('customers', customerId);
    const currentPoints = customer.loyaltyPoints || 0;
    await updateDocument('customers', customerId, {
      loyaltyPoints: Math.max(0, currentPoints + points)
    });

    return transactionId;
  } catch (error) {
    console.error('Error adding customer points:', error);
    throw error;
  }
};

export const redeemCustomerPoints = async (customerId, pointsToRedeem) => {
  try {
    const customer = await getDocument('customers', customerId);
    const availablePoints = customer.loyaltyPoints || 0;

    if (availablePoints < pointsToRedeem) {
      throw new Error('Insufficient points');
    }

    await addCustomerPoints(customerId, -pointsToRedeem, 'Redeemed for discount');
    return true;
  } catch (error) {
    console.error('Error redeeming points:', error);
    throw error;
  }
};

export const getCustomerLoyaltyInfo = async (customerId) => {
  try {
    const customer = await getDocument('customers', customerId);
    const transactions = await getDocuments('pointsTransactions', [
      { type: 'where', field: 'customerId', operator: '==', value: customerId },
      { type: 'orderBy', field: 'transactionDate', direction: 'desc' }
    ]);

    return {
      customerId: customerId,
      totalPoints: customer.loyaltyPoints || 0,
      totalVisits: customer.totalVisits || 0,
      totalSpent: customer.totalSpent || 0,
      transactions: transactions.slice(0, 20)
    };
  } catch (error) {
    console.error('Error getting customer loyalty info:', error);
    throw error;
  }
};

// ============================================
// STAFF ATTENDANCE & COMMISSION
// ============================================

export const getTodayPunchStatus = async (staffId, staffName) => {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const staffData = await getDocument('staffAttendance', staffName);
    if (!staffData) {
      return { hasPunchedIn: false, hasPunchedOut: false, record: null };
    }
    
    const todayRecord = staffData[dateStr];
    if (!todayRecord) {
      return { hasPunchedIn: false, hasPunchedOut: false, record: null };
    }

    return {
      hasPunchedIn: !!todayRecord.punchInTime,
      hasPunchedOut: !!todayRecord.punchOutTime,
      record: { ...todayRecord, dateStr, staffName, staffId },
      dateStr
    };
  } catch (error) {
    console.error('Error getting punch status:', error);
    throw error;
  }
};

export const punchInStaff = async (staffId, staffName) => {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get existing staff document or create structure
    let staffData = await getDocument('staffAttendance', staffName);
    if (!staffData) {
      staffData = { staffId };
    }

    // Check if already punched in today
    if (staffData[dateStr] && staffData[dateStr].punchInTime) {
      console.warn('Staff already punched in today');
      throw new Error('You have already punched in today. Use punch out or edit the record if needed.');
    }

    // Create punch-in record for today
    const now = Timestamp.now();
    staffData[dateStr] = {
      staffId: staffId,
      punchInTime: now,
      punchOutTime: null,
      workHours: 0,
      status: 'present'
    };

    // Save/update the staff document
    await updateDocument('staffAttendance', staffName, staffData);

    console.log('Punch in successful for', staffName, 'on', dateStr);
    return dateStr;
  } catch (error) {
    console.error('Error punching in:', error);
    throw error;
  }
};

export const punchOutStaff = async (staffId, staffName) => {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const staffData = await getDocument('staffAttendance', staffName);
    if (!staffData || !staffData[dateStr] || !staffData[dateStr].punchInTime) {
      throw new Error('No punch-in record found for today');
    }

    const todayRecord = staffData[dateStr];
    const punchInTime = todayRecord.punchInTime?.toDate?.() || new Date(todayRecord.punchInTime);
    const punchOutTime = new Date();
    const workHours = (punchOutTime - punchInTime) / (1000 * 60 * 60);

    // Update the punch-out time and work hours
    staffData[dateStr] = {
      ...staffData[dateStr],
      punchOutTime: Timestamp.now(),
      workHours: parseFloat(workHours.toFixed(2)),
      status: 'present'
    };

    await updateDocument('staffAttendance', staffName, staffData);

    console.log('Punch out successful for', staffName, 'on', dateStr);
    return dateStr;
  } catch (error) {
    console.error('Error punching out:', error);
    throw error;
  }
};

export const getStaffAttendance = async (staffName, month = new Date(), staffId = null) => {
  try {
    // Parse month - can be Date object or string (YYYY-MM)
    let year, monthNum;
    
    if (typeof month === 'string') {
      const parts = month.split('-');
      year = parseInt(parts[0], 10);
      monthNum = parseInt(parts[1], 10) - 1; // 0-indexed
    } else {
      year = month.getFullYear();
      monthNum = month.getMonth();
    }
    
    const monthStart = new Date(year, monthNum, 1);
    const monthEnd = new Date(year, monthNum + 1, 0);
    const monthPrefix = `${year}-${String(monthNum + 1).padStart(2, '0')}`;

    const staffData = await getDocument('staffAttendance', staffName);
    if (!staffData) return [];

    // Filter records by month and convert to array format
    const records = [];
    for (const [dateStr, record] of Object.entries(staffData)) {
      if (dateStr.startsWith(monthPrefix) && dateStr !== 'staffId') {
        records.push({
          id: dateStr, // Use dateStr as ID for consistency
          ...record,
          dateStr,
          staffName,
          date: new Date(dateStr), // For sorting
          formattedDate: new Date(dateStr).toLocaleDateString()
        });
      }
    }
    
    // Sort by date (newest first)
    return records.sort((a, b) => new Date(b.dateStr) - new Date(a.dateStr));
  } catch (error) {
    console.error('Error getting staff attendance:', error);
    throw error;
  }
};

export const calculateStaffCommission = async (staffId, month = new Date()) => {
  try {
    // Parse month - can be Date object or string (YYYY-MM)
    let year, monthNum;
    
    if (typeof month === 'string') {
      const parts = month.split('-');
      year = parseInt(parts[0], 10);
      monthNum = parseInt(parts[1], 10) - 1; // 0-indexed
    } else {
      year = month.getFullYear();
      monthNum = month.getMonth();
    }
    
    const monthStart = new Date(year, monthNum, 1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date(year, monthNum + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    const staff = await getDocument('staff', staffId);
    if (!staff) throw new Error('Staff not found');

    // Get all invoices where this staff member provided service
    const allInvoices = await getDocuments('invoices', []);
    
    // Filter invoices for this staff and month
    // This would need to track which staff member served in each visit
    const filteredInvoices = [];
    
    for (const invoice of allInvoices) {
      const invDate = invoice.invoiceDate?.toDate?.() || invoice.invoiceDate;
      if (invDate >= monthStart && invDate <= monthEnd) {
        // Get the visit to check if this staff member was involved
        const visit = await getDocument('visits', invoice.visitId);
        if (visit && visit.staffId === staffId) {
          filteredInvoices.push(invoice);
        }
      }
    }

    const totalServices = filteredInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const commissionPercent = 0.1; // 10% commission
    const commission = totalServices * commissionPercent;

    return {
      staffId: staffId,
      staffName: staff.name,
      month: monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      totalServices: totalServices,
      commissionPercent: (commissionPercent * 100),
      commission: parseFloat(commission.toFixed(2)),
      invoiceCount: filteredInvoices.length
    };
  } catch (error) {
    console.error('Error calculating commission:', error);
    throw error;
  }
};

export const deleteAttendanceRecord = async (staffName, dateStr) => {
  try {
    const staffData = await getDocument('staffAttendance', staffName);
    if (staffData && staffData[dateStr]) {
      delete staffData[dateStr];
      await updateDocument('staffAttendance', staffName, staffData);
      console.log('Attendance record deleted for', staffName, 'on', dateStr);
    }
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    throw error;
  }
};

export const updateAttendanceRecord = async (staffName, dateStr, updates) => {
  try {
    const staffData = await getDocument('staffAttendance', staffName);
    if (staffData && staffData[dateStr]) {
      staffData[dateStr] = { ...staffData[dateStr], ...updates };
      await updateDocument('staffAttendance', staffName, staffData);
      console.log('Attendance record updated for', staffName, 'on', dateStr);
    }
  } catch (error) {
    console.error('Error updating attendance record:', error);
    throw error;
  }
};

export const recordStaffCommission = async (staffId, amount, month) => {
  try {
    const commissionId = await addDocument('staffCommissions', {
      staffId: staffId,
      amount: parseFloat(amount),
      month: month,
      paymentDate: null,
      status: 'pending',
      recordedDate: serverTimestamp()
    });

    return commissionId;
  } catch (error) {
    console.error('Error recording commission:', error);
    throw error;
  }
};

// ============================================
// APPOINTMENT SCHEDULING
// ============================================

export const createAppointment = async (appointmentData) => {
  try {
    const appointmentId = await addDocument('appointments', {
      customerId: appointmentData.customerId,
      customerName: appointmentData.customerName,
      customerPhone: appointmentData.customerPhone,
      customerEmail: appointmentData.customerEmail,
      serviceId: appointmentData.serviceId,
      serviceName: appointmentData.serviceName,
      staffId: appointmentData.staffId || null,
      appointmentDate: Timestamp.fromDate(new Date(appointmentData.appointmentDate)),
      appointmentTime: appointmentData.appointmentTime,
      duration: appointmentData.duration || 30,
      status: 'scheduled',
      notes: appointmentData.notes || '',
      reminderSent: false,
      createdDate: serverTimestamp()
    });

    return appointmentId;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const getAppointments = async (staffId = null) => {
  try {
    let conditions = [
      { type: 'where', field: 'status', operator: '!=', value: 'cancelled' },
      { type: 'orderBy', field: 'appointmentDate', direction: 'asc' }
    ];

    if (staffId) {
      conditions = [
        { type: 'where', field: 'staffId', operator: '==', value: staffId },
        { type: 'where', field: 'status', operator: '!=', value: 'cancelled' },
        { type: 'orderBy', field: 'appointmentDate', direction: 'asc' }
      ];
    }

    return await getDocuments('appointments', conditions);
  } catch (error) {
    console.error('Error getting appointments:', error);
    throw error;
  }
};

export const getUpcomingAppointments = async (days = 7) => {
  try {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const allAppointments = await getAppointments();
    return allAppointments.filter(apt => {
      const aptDate = apt.appointmentDate?.toDate?.() || apt.appointmentDate;
      return aptDate >= now && aptDate <= futureDate && apt.status !== 'completed';
    });
  } catch (error) {
    console.error('Error getting upcoming appointments:', error);
    throw error;
  }
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    await updateDocument('appointments', appointmentId, { status: status });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

export const cancelAppointment = async (appointmentId) => {
  try {
    await updateDocument('appointments', appointmentId, { 
      status: 'cancelled',
      cancelledDate: serverTimestamp()
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

export const getAvailableTimeSlots = async (serviceId, appointmentDate, staffId = null) => {
  try {
    const service = await getDocument('services', serviceId);
    if (!service) throw new Error('Service not found');

    const serviceDuration = service.duration || 30;
    const workStart = 10; // 10 AM
    const workEnd = 19; // 7 PM
    const timeSlots = [];

    const appointments = await getAppointments(staffId);
    const dayAppointments = appointments.filter(apt => {
      const aptDate = apt.appointmentDate?.toDate?.() || apt.appointmentDate;
      const compareDate = new Date(appointmentDate);
      return aptDate.toDateString() === compareDate.toDateString();
    });

    for (let hour = workStart; hour < workEnd; hour++) {
      const time = `${String(hour).padStart(2, '0')}:00`;
      const isBooked = dayAppointments.some(apt => apt.appointmentTime === time);
      
      if (!isBooked) {
        timeSlots.push({
          time: time,
          available: true
        });
      }
    }

    return timeSlots;
  } catch (error) {
    console.error('Error getting available time slots:', error);
    throw error;
  }
};

// ============================================
// ONLINE BOOKING PORTAL
// ============================================

export const getPublicServices = async () => {
  try {
    return await getServices(false);
  } catch (error) {
    console.error('Error getting public services:', error);
    throw error;
  }
};

export const bookAppointmentPublic = async (bookingData) => {
  try {
    // Check if customer exists
    const existingCustomers = await searchCustomers(bookingData.customerPhone);
    let customerId = null;

    if (existingCustomers.length > 0) {
      customerId = existingCustomers[0].id;
    } else {
      // Create new customer
      customerId = await addCustomer({
        name: bookingData.customerName,
        contactNo: bookingData.customerPhone,
        email: bookingData.customerEmail,
        gender: bookingData.gender || ''
      });
    }

    // Create appointment
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
      notes: bookingData.notes || ''
    });

    return {
      appointmentId: appointmentId,
      customerId: customerId,
      message: 'Appointment booked successfully! You will receive confirmation via SMS/Email.'
    };
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
};
