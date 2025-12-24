import React from 'react';
import { Plus, Scissors, ShoppingCart, X, Check } from 'lucide-react';

const AddItemsModal = ({
  selectedVisit,
  services,
  products,
  selectedServices,
  setSelectedServices,
  selectedProducts,
  setSelectedProducts,
  selectedCategory,
  setSelectedCategory,
  onClose,
  onAdd
}) => {
  const items = selectedCategory === 'services' ? services : products;
  const selectedItems = selectedCategory === 'services' ? selectedServices : selectedProducts;
  
  const isSelected = (item) => {
    if (selectedCategory === 'services') {
      return selectedServices.some(s => s.id === item.id);
    } else {
      return selectedProducts.some(p => p.id === item.id);
    }
  };

  const toggleItem = (item) => {
    if (selectedCategory === 'services') {
      setSelectedServices(prev =>
        prev.some(s => s.id === item.id)
          ? prev.filter(s => s.id !== item.id)
          : [...prev, item]
      );
    } else {
      setSelectedProducts(prev =>
        prev.some(p => p.id === item.id)
          ? prev.filter(p => p.id !== item.id)
          : [...prev, item]
      );
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
      <div className="glass-card" style={{ width: '800px', maxHeight: '90vh', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
              Add Services & Products
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              For: {selectedVisit.customer?.name}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {/* TABS */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
            {['services', 'products'].map(type => {
              const isActive = selectedCategory === type;
              const Icon = type === 'services' ? Scissors : ShoppingCart;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedCategory(type)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                    color: isActive ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Icon size={18} />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              );
            })}
          </div>

          {/* ITEMS GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem',
            paddingRight: '0.5rem'
          }}>
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItem(item)}
                style={{
                  padding: '1rem',
                  background: isSelected(item) ? 'rgba(102, 126, 234, 0.1)' : 'white',
                  border: `2px solid ${isSelected(item) ? '#667eea' : '#e5e7eb'}`,
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>{item.name}</div>
                  {isSelected(item) && <Check size={16} color="#667eea" />}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  {item.category || 'General'}
                </div>
                <div style={{ fontWeight: '700', color: '#10b981' }}>₹{item.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: '1rem', padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
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
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            disabled={selectedServices.length === 0 && selectedProducts.length === 0}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: selectedServices.length === 0 && selectedProducts.length === 0 ? '#d1d5db' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '600',
              cursor: selectedServices.length === 0 && selectedProducts.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Add Selected ({selectedServices.length + selectedProducts.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemsModal;
