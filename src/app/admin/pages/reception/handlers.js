import {
  updateVisitStatus,
  assignStaffToService,
  addVisitItem,
  removeVisitItem,
  updateVisit,
  createInvoice,
  checkInAppointment
} from '../../utils/firebaseUtils';
import { calculateTotals } from './utils';

export const handleCheckInSuccess = (fetchAllData, setShowCheckIn, setActiveSection) => {
  fetchAllData();
  setShowCheckIn(false);
  setActiveSection('checkin');
};

export const handleStartService = async (visit, setSuccess, setError, fetchAllData) => {
  try {
    await updateVisitStatus(visit.id, 'IN_SERVICE');
    setSuccess(`Service started for ${visit.customer?.name}`);
    setTimeout(() => setSuccess(''), 3000);
    fetchAllData();
  } catch (err) {
    setError('Failed to start service');
  }
};

export const handleAddItemsClick = (visit, setSelectedVisit, setSelectedServices, setSelectedProducts, setShowAddItems) => {
  setSelectedVisit(visit);
  setSelectedServices([]);
  setSelectedProducts([]);
  setShowAddItems(true);
};

export const handleAssignStaff = async (visitId, serviceIndex, staffId, fetchAllData, setSuccess, setError) => {
  try {
    await assignStaffToService(visitId, serviceIndex, staffId);
    setSuccess('Staff assigned successfully');
    setTimeout(() => setSuccess(''), 2000);
    fetchAllData();
  } catch (err) {
    setError('Failed to assign staff');
  }
};

export const handleAddSelectedItems = async (
  selectedVisit,
  selectedServices,
  selectedProducts,
  fetchAllData,
  setSuccess,
  setShowAddItems,
  setSelectedServices,
  setSelectedProducts,
  setError
) => {
  if (!selectedVisit) return;

  try {
    for (const service of selectedServices) {
      await addVisitItem(selectedVisit.id, {
        type: 'service',
        serviceId: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration || 30,
        staff: null,
        status: 'pending'
      });
    }

    for (const product of selectedProducts) {
      await addVisitItem(selectedVisit.id, {
        type: 'product',
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        status: 'added'
      });
    }

    setSuccess('Items added successfully');
    setShowAddItems(false);
    setSelectedServices([]);
    setSelectedProducts([]);
    setTimeout(() => setSuccess(''), 3000);
    fetchAllData();
  } catch (err) {
    setError('Failed to add items');
  }
};

export const handleServiceComplete = async (visitId, serviceIndex, visits, fetchAllData, setSuccess, setError) => {
  try {
    const visit = visits.find(v => v.id === visitId);
    if (!visit || !visit.items || !visit.items[serviceIndex]) return;

    const updatedItems = [...visit.items];
    updatedItems[serviceIndex].status = 'completed';

    await updateVisit(visitId, { items: updatedItems });
    setSuccess('Service marked as complete');
    setTimeout(() => setSuccess(''), 2000);
    fetchAllData();
  } catch (err) {
    setError('Failed to update service status');
  }
};

export const handleReadyForCheckout = async (
  visit,
  fetchAllData,
  setSuccess,
  setError,
  setActiveSection
) => {
  try {
    await updateVisitStatus(visit.id, 'READY_FOR_BILLING');
    setSuccess(`${visit.customer?.name} is ready for billing`);
    setTimeout(() => setSuccess(''), 3000);
    await fetchAllData();
    setActiveSection('checkout');
  } catch (err) {
    console.error('Error in handleReadyForCheckout:', err);
    setError('Failed to move to billing: ' + err.message);
  }
};

export const handleCheckoutClick = (
  visit,
  setShowCheckoutModal,
  setSelectedVisitForCheckout
) => {
  setSelectedVisitForCheckout(visit);
  setShowCheckoutModal(true);
};

export const handleCompletePayment = async (
  invoiceData,
  fetchAllData,
  setSuccess,
  setError,
  setActiveSection,
  setShowCheckoutModal
) => {
  try {
    await createInvoice(invoiceData);
    await updateVisitStatus(invoiceData.visitId, 'COMPLETED');
    
    setSuccess(`Payment completed for ${invoiceData.customerName}!`);
    setTimeout(() => setSuccess(''), 3000);
    await fetchAllData();
    setActiveSection('completed');
    setShowCheckoutModal(false);
  } catch (err) {
    console.error('Payment error:', err);
    setError('Payment failed: ' + err.message);
  }
};

export const handleRemoveItem = async (visitId, itemIndex, visits, fetchAllData, setError) => {
  try {
    const visit = visits.find(v => v.id === visitId);
    if (!visit || !visit.items) return;

    const updatedItems = visit.items.filter((_, index) => index !== itemIndex);
    await updateVisit(visitId, { items: updatedItems });
    fetchAllData();
  } catch (err) {
    setError('Failed to remove item');
  }
};

export const handleCheckInAppointment = async (appointment, setSuccess, setError, fetchAllData) => {
  try {
    await checkInAppointment(appointment);
    setSuccess(`${appointment.customerName} checked in successfully!`);
    setTimeout(() => setSuccess(''), 3000);
    fetchAllData();
  } catch (err) {
    console.error('Check-in error:', err);
    setError('Failed to check in appointment: ' + err.message);
  }
};
