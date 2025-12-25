import React from 'react';
import { Sparkles } from 'lucide-react';
import CheckInModal from './modals/CheckInModal';
import CheckoutModal from './modals/CheckoutModal';
import { useReceptionData, useReceptionStates } from './hooks';
import { calculateTotals, filterVisitsByStatus, getStatusBadge } from './utils';
import {
  handleCheckInSuccess,
  handleStartService,
  handleAddItemsClick,
  handleAssignStaff,
  handleAddSelectedItems,
  handleServiceComplete,
  handleReadyForCheckout,
  handleCheckoutClick,
  handleCompletePayment,
  handleRemoveItem
} from './handlers';
import { ReceptionHeader, LoadingState, EmptyState } from './components.jsx';
import VisitsTable from './modals/VisitsTable.jsx';
import AddItemsModal from './modals/AddItemsModal.jsx';
import BillOptionsModal from './modals/BillOptionsModal.jsx';
import ReadyForBillingView from './modals/ReadyForBillingView.jsx';

const ReceptionComponent = () => {
  const dataState = useReceptionData();
  const uiState = useReceptionStates();

  const filteredVisits = filterVisitsByStatus(dataState.visits, uiState.activeSection, uiState.searchTerm);

  const calculateTotalsWrapper = (visit) => 
    calculateTotals(visit, uiState.discountAmount, uiState.discountPercent, uiState.amountPaid);

  if (dataState.loading) {
    return <LoadingState />;
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--admin-background-gradient)', padding: '0' }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
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
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .table-row {
          animation: slideIn 0.3s ease-out;
          transition: all 0.2s;
        }
        .table-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div style={{ width: '100%', animation: 'fadeIn 0.5s ease-out' }}>
        {/* HEADER */}
        <ReceptionHeader
          onNewCheckIn={() => uiState.setShowCheckIn(true)}
          error={dataState.error}
          success={dataState.success}
          activeSection={uiState.activeSection}
          setActiveSection={uiState.setActiveSection}
          visits={dataState.visits}
          filteredVisits={filteredVisits}
          searchTerm={uiState.searchTerm}
          setSearchTerm={uiState.setSearchTerm}
        />

        <div style={{ marginTop: '1.5rem' }}>
          {dataState.loading ? (
            <LoadingState />
          ) : uiState.activeSection === 'checkout' ? (
            <ReadyForBillingView
            filteredVisits={filteredVisits}
            calculateTotals={calculateTotalsWrapper}
            getStatusBadge={getStatusBadge}
            onCheckout={(visit) => {
              handleCheckoutClick(visit, uiState.setShowCheckoutModal, uiState.setSelectedVisitForCheckout);
            }}
            onBack={() => {
              uiState.setActiveSection('all');
            }}
          />
        ) : filteredVisits.length === 0 ? (
          <EmptyState activeSection={uiState.activeSection} />
        ) : (
          <VisitsTable
            visits={filteredVisits}
            calculateTotals={calculateTotalsWrapper}
            getStatusBadge={getStatusBadge}
            expandedRow={uiState.expandedRow}
            setExpandedRow={uiState.setExpandedRow}
            onStartService={(visit) => handleStartService(visit, dataState.setSuccess, dataState.setError, dataState.fetchAllData)}
            onAddItems={(visit) => handleAddItemsClick(visit, uiState.setSelectedVisit, uiState.setSelectedServices, uiState.setSelectedProducts, uiState.setShowAddItems)}
            onReadyForCheckout={(visit) => handleReadyForCheckout(visit, dataState.fetchAllData, dataState.setSuccess, dataState.setError, uiState.setActiveSection)}
            onCheckout={(visit) => handleCheckoutClick(visit, uiState.setShowCheckoutModal, uiState.setSelectedVisitForCheckout)}
            onAssignStaff={(visitId, serviceIndex, staffId) => handleAssignStaff(visitId, serviceIndex, staffId, dataState.fetchAllData, dataState.setSuccess, dataState.setError)}
            onCompleteService={(visitId, serviceIndex) => handleServiceComplete(visitId, serviceIndex, dataState.visits, dataState.fetchAllData, dataState.setSuccess, dataState.setError)}
            onRemoveItem={(visitId, itemIndex) => handleRemoveItem(visitId, itemIndex, dataState.visits, dataState.fetchAllData, dataState.setError)}
            onViewBill={(visit) => { uiState.setSelectedVisit(visit); uiState.setShowBillOptions(true); }}
            staff={dataState.staff}
            allVisits={dataState.visits}
          />
        )}
        </div>
      </div>

      {/* MODALS */}

      {/* CHECK-IN MODAL */}
      {uiState.showCheckIn && (
        <CheckInModal
          onClose={() => uiState.setShowCheckIn(false)}
          onCheckIn={() => handleCheckInSuccess(dataState.fetchAllData, uiState.setShowCheckIn, uiState.setActiveSection)}
        />
      )}

      {/* ADD ITEMS MODAL */}
      {uiState.showAddItems && uiState.selectedVisit && (
        <AddItemsModal
          selectedVisit={uiState.selectedVisit}
          services={dataState.services}
          products={dataState.products}
          selectedServices={uiState.selectedServices}
          setSelectedServices={uiState.setSelectedServices}
          selectedProducts={uiState.selectedProducts}
          setSelectedProducts={uiState.setSelectedProducts}
          selectedCategory={uiState.selectedCategory}
          setSelectedCategory={uiState.setSelectedCategory}
          onClose={() => uiState.setShowAddItems(false)}
          onAdd={() => handleAddSelectedItems(uiState.selectedVisit, uiState.selectedServices, uiState.selectedProducts, dataState.fetchAllData, dataState.setSuccess, uiState.setShowAddItems, uiState.setSelectedServices, uiState.setSelectedProducts, dataState.setError)}
        />
      )}

      {/* CHECKOUT MODAL */}
      {uiState.showCheckoutModal && uiState.selectedVisitForCheckout && (
        <CheckoutModal
          visit={uiState.selectedVisitForCheckout}
          calculateTotals={calculateTotalsWrapper}
          onClose={() => uiState.setShowCheckoutModal(false)}
          onPaymentComplete={(invoiceData) => handleCompletePayment(
            invoiceData,
            dataState.fetchAllData,
            dataState.setSuccess,
            dataState.setError,
            uiState.setActiveSection,
            uiState.setShowCheckoutModal
          )}
        />
      )}

      {/* BILL OPTIONS MODAL */}
      {uiState.showBillOptions && uiState.selectedVisit && (
        <BillOptionsModal
          selectedVisit={uiState.selectedVisit}
          onClose={() => { uiState.setShowBillOptions(false); uiState.setSelectedVisit(null); }}
        />
      )}
    </div>
  );
};

export default ReceptionComponent;
