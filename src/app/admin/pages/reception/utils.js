export const calculateTotals = (visit, discountAmount, discountPercent, amountPaid) => {
  const items = visit?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const discount = discountAmount > 0 ? discountAmount : (subtotal * discountPercent) / 100;
  const taxAmount = (subtotal - discount) * 0.18;
  const total = (subtotal - discount) + taxAmount;
  const balance = total - amountPaid;

  return { subtotal, discount, taxAmount, total, balance };
};

export const filterVisitsByStatus = (visits, activeSection, searchTerm) => {
  return visits.filter(v => {
    if (activeSection === 'checkin' && v.status !== 'CHECKED_IN') return false;
    if (activeSection === 'inservice' && v.status !== 'IN_SERVICE') return false;
    if (activeSection === 'checkout' && v.status !== 'READY_FOR_BILLING') return false;
    if (activeSection === 'completed' && v.status !== 'COMPLETED') return false;

    return v.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           v.customer?.contactNo?.includes(searchTerm) ||
           v.customer?.phone?.includes(searchTerm);
  });
};

export const getStatusBadge = (status) => {
  const badges = {
    'CHECKED_IN': { color: '#f59e0b', bg: '#fef3c7', icon: '🟡', text: 'Waiting' },
    'IN_SERVICE': { color: '#3b82f6', bg: '#dbeafe', icon: '🔵', text: 'In Service' },
    'READY_FOR_BILLING': { color: '#8b5cf6', bg: '#ede9fe', icon: '🟣', text: 'Ready for Billing' },
    'COMPLETED': { color: '#10b981', bg: '#d1fae5', icon: '✅', text: 'Completed' }
  };
  return badges[status] || { color: '#6b7280', bg: '#f3f4f6', icon: '⚪', text: status };
};
