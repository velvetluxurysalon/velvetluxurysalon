import React from 'react';
import {
  Users, UserPlus, Scissors, CreditCard, CheckCircle, AlertCircle,
  Plus, ShoppingCart, DollarSign, ChevronDown, Phone, Eye, Trash2,
  Tag, CreditCard as CardIcon, Smartphone, Wallet, Send, FileText,
  Download, Printer, Mail, MessageCircle, X, Check, Crown
} from 'lucide-react';

export const ReceptionHeader = ({ onNewCheckIn, error, success, activeSection, setActiveSection, visits, filteredVisits, searchTerm, setSearchTerm }) => {
  return (
    <div className="glass-card" style={{ borderRadius: '0.75rem', padding: '0', marginBottom: '0', background: '#fff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0' }}>
        <div style={{ padding: '0', margin: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0', padding: '0' }}>
            <Crown size={32} color="#1f2937" />
            <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#1f2937', margin: '0', padding: '0' }}>
              Reception Manager
            </h1>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0', padding: '0' }}>
            Manage customer journey from check-in to checkout
          </p>
        </div>

        <button
          onClick={onNewCheckIn}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            fontWeight: '600',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <UserPlus size={20} /> New Check-in
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', marginBottom: '0', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideIn 0.3s', marginTop: '1rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#059669', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', marginBottom: '0', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideIn 0.3s', marginTop: '1rem' }}>
          <CheckCircle size={18} /> {success}
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0', overflowX: 'auto', paddingBottom: '0', marginTop: '1rem' }}>
        {[
          { id: 'all', label: 'All Visits', icon: Users, color: '#6b7280' },
          { id: 'checkin', label: 'Checked In', icon: UserPlus, color: '#f59e0b' },
          { id: 'inservice', label: 'In Service', icon: Scissors, color: '#3b82f6' },
          { id: 'checkout', label: 'Ready for Billing', icon: CardIcon, color: '#8b5cf6' },
          { id: 'completed', label: 'Completed', icon: CheckCircle, color: '#10b981' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                background: isActive ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                color: isActive ? tab.color : '#6b7280',
                border: `2px solid ${isActive ? tab.color : 'transparent'}`,
                padding: '0.75rem 1.25rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                minWidth: 'max-content'
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon size={18} /> {tab.label}
              <span style={{
                background: tab.color,
                color: 'white',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                marginLeft: '0.25rem'
              }}>
                {visits.filter(v => {
                  if (tab.id === 'all') return true;
                  if (tab.id === 'checkin') return v.status === 'CHECKED_IN';
                  if (tab.id === 'inservice') return v.status === 'IN_SERVICE';
                  if (tab.id === 'checkout') return v.status === 'READY_FOR_BILLING';
                  if (tab.id === 'completed') return v.status === 'COMPLETED';
                  return false;
                }).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* SEARCH BAR */}
      <div style={{ position: 'relative', marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Search customers by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.875rem 1rem 0.875rem 3rem',
            background: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '0.75rem',
            fontSize: '0.95rem',
            color: '#1f2937',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={e => e.currentTarget.style.borderColor = '#8b5cf6'}
          onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
        />
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
          🔍
        </span>
      </div>
    </div>
  );
};

export const LoadingState = () => (
  <div style={{ padding: '4rem', textAlign: 'center' }}>
    <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>
      ✨
    </div>
    <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading reception dashboard...</p>
  </div>
);

export const EmptyState = ({ activeSection }) => (
  <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#6b7280' }}>
    <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
      No {activeSection === 'all' ? '' : activeSection} visits found
    </h3>
    <p>Start by checking in a customer or try another tab</p>
  </div>
);
