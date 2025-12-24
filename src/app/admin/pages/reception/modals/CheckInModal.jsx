import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { getCustomers, createVisit } from '../../../utils/firebaseUtils';

const CheckInModal = ({ onClose, onCheckIn }) => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const allCustomers = await getCustomers();
        setCustomers(allCustomers || []);
      } catch (err) {
        setError('Failed to load customers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSearchTerm(customer.name || '');
    setShowDropdown(false);
  };

  const handleCheckIn = async () => {
    if (!selectedCustomer) {
      setError('Please select a customer');
      return;
    }

    try {
      setLoading(true);
      await createVisit({
        customerId: selectedCustomer.id,
        customer: {
          id: selectedCustomer.id,
          name: selectedCustomer.name || '',
          contactNo: selectedCustomer.phone || '',
          email: selectedCustomer.email || ''
        },
        notes: ''
      });

      setError('');
      onCheckIn();
      onClose();
    } catch (err) {
      setError('Failed to check in customer: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.3s'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
      `}</style>

      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '500px',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* HEADER */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0
          }}>Check In Customer</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.5rem'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div style={{ padding: '1.5rem' }}>
          {/* SEARCH CUSTOMERS */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Select Customer
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.75rem',
                background: 'white'
              }}>
                <Search size={18} color="#6b7280" />
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                    setSelectedCustomer(null);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* DROPDOWN */}
              {showDropdown && filteredCustomers.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderTop: 'none',
                  borderRadius: '0 0 0.75rem 0.75rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  {filteredCustomers.map((customer, index) => (
                    <div
                      key={customer.id || index}
                      onClick={() => handleSelectCustomer(customer)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: index < filteredCustomers.length - 1 ? '1px solid #e5e7eb' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: selectedCustomer?.id === customer.id ? '#f3f4f6' : 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = selectedCustomer?.id === customer.id ? '#f3f4f6' : 'white';
                      }}
                    >
                      <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                        {customer.name || 'Unknown'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {customer.phone || 'No phone'} {customer.email && `• ${customer.email}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showDropdown && filteredCustomers.length === 0 && searchTerm && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid #d1d5db',
                borderTop: 'none',
                borderRadius: '0 0 0.75rem 0.75rem',
                padding: '1rem',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '0.875rem',
                zIndex: 10
              }}>
                No customers found
              </div>
            )}
          </div>

          {/* SELECTED CUSTOMER INFO */}
          {selectedCustomer && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '600' }}>
                Selected: {selectedCustomer.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                {selectedCustomer.phone}
              </div>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e5e7eb',
          background: '#fafbfc'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: 'white',
              border: '1px solid #d1d5db',
              color: '#374151',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCheckIn}
            disabled={!selectedCustomer || loading}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: !selectedCustomer || loading ? '#d1d5db' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: !selectedCustomer || loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Checking In...' : 'Check In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
