import React, { useState } from 'react';
import { DollarSign, Tag, CreditCard, Smartphone, Wallet, X, Printer, Download, MessageCircle, Mail } from 'lucide-react';
import { generateProfessionalBillPDF, downloadPDF } from '../utils/pdfGenerator';

const CheckoutModal = ({
  visit,
  calculateTotals,
  onClose,
  onPaymentComplete
}) => {
  const [discountType, setDiscountType] = useState('none'); // 'none', 'percentage', 'flat'
  const [discountValue, setDiscountValue] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [notes, setNotes] = useState('');

  const baseTotals = calculateTotals(visit);
  
  // Calculate discount
  let finalDiscount = 0;
  if (discountType === 'percentage') {
    const percentValue = parseFloat(discountValue) || 0;
    finalDiscount = (baseTotals.subtotal * percentValue) / 100;
  } else if (discountType === 'flat') {
    finalDiscount = parseFloat(discountValue) || 0;
  }

  // Calculate final totals
  const taxAmount = (baseTotals.subtotal - finalDiscount) * 0.18;
  const totalAmount = (baseTotals.subtotal - finalDiscount) + taxAmount;
  const amountPaidValue = parseFloat(amountPaid) || 0;
  const balance = totalAmount - amountPaidValue;

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: DollarSign, color: '#10b981' },
    { id: 'card', label: 'Card', icon: CreditCard, color: '#3b82f6' },
    { id: 'upi', label: 'UPI', icon: Smartphone, color: '#8b5cf6' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, color: '#f59e0b' }
  ];

  const [invoiceData, setInvoiceData] = React.useState(null);

  const handleCompletePayment = async () => {
    const newInvoiceData = {
      visitId: visit.id,
      customerId: visit.customerId,
      customerName: visit.customer?.name,
      customerPhone: visit.customer?.contactNo || visit.customer?.phone,
      customerEmail: visit.customer?.email || '',
      items: visit.items,
      totalAmount: totalAmount,
      paidAmount: amountPaid,
      discountPercent: discountType === 'percentage' ? discountValue : 0,
      discountAmount: finalDiscount,
      taxPercent: 18,
      paymentMode: paymentMethod,
      status: amountPaid >= totalAmount ? 'paid' : 'partial',
      notes: notes
    };

    setInvoiceData(newInvoiceData);
    setPaymentCompleted(true);
  };

  const handleDoneClick = () => {
    if (invoiceData) {
      onPaymentComplete(invoiceData);
    } else {
      onClose();
    }
  };

  const generateBillTextForShare = () => {
    const balance = Math.max(0, totalAmount - (parseFloat(amountPaid) || 0));
    let text = `*VELVET LUXURY SALON - INVOICE*\n\n`;
    text += `👤 Customer: ${visit.customer?.name}\n`;
    text += `📱 Phone: ${visit.customer?.contactNo || visit.customer?.phone}\n`;
    text += `📧 Email: ${visit.customer?.email || 'N/A'}\n`;
    text += `📅 Date: ${new Date().toLocaleDateString('en-IN')}\n\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*SERVICES & PRODUCTS*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    visit.items?.forEach(item => {
      text += `• ${item.name} x${item.quantity}\n  ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    text += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 Subtotal: ₹${baseTotals.subtotal.toFixed(2)}\n`;
    if (finalDiscount > 0) {
      text += `✂️ Discount: -₹${finalDiscount.toFixed(2)}\n`;
    }
    text += `🧾 GST (18%): ₹${taxAmount.toFixed(2)}\n`;
    text += `\n*TOTAL: ₹${totalAmount.toFixed(2)}*\n`;
    text += `✅ Amount Paid: ₹${(parseFloat(amountPaid) || 0).toFixed(2)}\n`;
    if (balance > 0) {
      text += `⏳ Balance Due: ₹${balance.toFixed(2)}\n`;
    } else {
      text += `✓ Status: PAID IN FULL\n`;
    }
    text += `💳 Payment: ${paymentMethod.toUpperCase()}\n`;
    text += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `✨ Thank you for choosing Velvet Luxury Salon!\n`;
    text += `📞 For queries: +91-XXXXXXXXXX\n`;
    text += `✉️ info@velvetluxury.com`;
    
    return text;
  };

  const handlePrintBill = async () => {
    try {
      const invoiceData = {
        visitId: visit.id,
        customerId: visit.customerId,
        customerName: visit.customer?.name,
        customerPhone: visit.customer?.contactNo || visit.customer?.phone,
        customerEmail: visit.customer?.email || '',
        items: visit.items,
        totalAmount: baseTotals.subtotal,
        discountAmount: finalDiscount,
        taxAmount: taxAmount,
        paidAmount: parseFloat(amountPaid) || 0,
        paymentMode: paymentMethod,
        status: amountPaid >= totalAmount ? 'paid' : 'partial'
      };

      const pdf = await generateProfessionalBillPDF(invoiceData, visit);
      pdf.autoPrint();
      window.open(pdf.output('bloburi'), '_blank');
    } catch (error) {
      console.error('Error printing PDF:', error);
      alert('Error generating print preview. Please try again.');
    }
  };

  const handleDownloadBill = async () => {
    try {
      const invoiceData = {
        visitId: visit.id,
        customerId: visit.customerId,
        customerName: visit.customer?.name,
        customerPhone: visit.customer?.contactNo || visit.customer?.phone,
        customerEmail: visit.customer?.email || '',
        items: visit.items,
        totalAmount: baseTotals.subtotal,
        discountAmount: finalDiscount,
        taxAmount: taxAmount,
        paidAmount: parseFloat(amountPaid) || 0,
        paymentMode: paymentMethod,
        status: amountPaid >= totalAmount ? 'paid' : 'partial'
      };

      const pdf = await generateProfessionalBillPDF(invoiceData, visit);
      downloadPDF(pdf, `Velvet_Luxury_Salon_Invoice_${visit.customer?.name || 'Guest'}_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(generateBillTextForShare());
    const phone = (visit.customer?.contactNo || visit.customer?.phone || '').replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Invoice from Velvet Luxury Salon - ${new Date().toLocaleDateString()}`);
    const body = encodeURIComponent(generateBillTextForShare());
    const email = visit.customer?.email || '';
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  if (paymentCompleted) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
          textAlign: 'center',
          animation: 'slideInScale 0.4s ease-out'
        }}>
          <style>{`
            @keyframes slideInScale {
              from {
                opacity: 0;
                transform: scale(0.95) translateY(-20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.8; }
            }
            .success-checkmark {
              animation: pulse 2s ease-in-out infinite;
            }
          `}</style>
          <div style={{ fontSize: '3.5rem', color: '#10b981', marginBottom: '1rem' }} className="success-checkmark">✓</div>
          <h2 style={{ color: '#1f2937', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Payment Completed!</h2>
          <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
            Invoice created successfully for {visit.customer?.name}
          </p>
          <p style={{ color: '#9ca3af', marginBottom: '2rem', fontSize: '0.85rem' }}>
            You can print, download, or share the invoice below
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={handlePrintBill}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#2563eb'}
              onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
            >
              <Printer size={18} /> Print Bill
            </button>
            <button
              onClick={handleDownloadBill}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#7c3aed'}
              onMouseLeave={(e) => e.target.style.background = '#8b5cf6'}
            >
              <Download size={18} /> Download Bill
            </button>
            <button
              onClick={handleShareWhatsApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#25d366',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#20ba58'}
              onMouseLeave={(e) => e.target.style.background = '#25d366'}
            >
              <MessageCircle size={18} /> Share WhatsApp
            </button>
            <button
              onClick={handleShareEmail}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#d97706'}
              onMouseLeave={(e) => e.target.style.background = '#f59e0b'}
            >
              <Mail size={18} /> Share Email
            </button>
          </div>

          <button
            onClick={handleDoneClick}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginTop: '0.5rem'
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'}
            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

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
      zIndex: 1000
    }}>
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)'
      }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#1f2937' }}>Complete Payment</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: '#9ca3af'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* CUSTOMER INFO */}
        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
          <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>{visit.customer?.name}</p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
            {visit.customer?.contactNo || visit.customer?.phone}
          </p>
        </div>

        {/* ITEMS SUMMARY */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
            Items Summary
          </h3>
          <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
            {visit.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: idx < visit.items.length - 1 ? '0.5rem' : 0 }}>
                <span>{item.name} x{item.quantity}</span>
                <span style={{ fontWeight: '600' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DISCOUNT SECTION */}
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '0.75rem', border: '1px solid #bfdbfe' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
            Apply Discount (Optional)
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button
              onClick={() => setDiscountType('none')}
              style={{
                padding: '0.5rem',
                background: discountType === 'none' ? '#3b82f6' : '#e0e7ff',
                color: discountType === 'none' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              No Discount
            </button>
            <button
              onClick={() => setDiscountType('percentage')}
              style={{
                padding: '0.5rem',
                background: discountType === 'percentage' ? '#3b82f6' : '#e0e7ff',
                color: discountType === 'percentage' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              % Discount
            </button>
            <button
              onClick={() => setDiscountType('flat')}
              style={{
                padding: '0.5rem',
                background: discountType === 'flat' ? '#3b82f6' : '#e0e7ff',
                color: discountType === 'flat' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Flat Discount
            </button>
          </div>

          {discountType !== 'none' && (
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              onWheel={(e) => e.preventDefault()}
              placeholder={discountType === 'percentage' ? 'Enter %' : 'Enter amount'}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #bfdbfe',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
          )}
        </div>

        {/* PAYMENT BREAKDOWN */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '1px solid #fbbf24',
          padding: '1rem',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
            <span>Subtotal:</span>
            <span style={{ fontWeight: '600' }}>₹{baseTotals.subtotal.toFixed(2)}</span>
          </div>
          {finalDiscount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#b45309' }}>
              <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Flat'}):</span>
              <span style={{ fontWeight: '600' }}>-₹{finalDiscount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
            <span>GST (18%):</span>
            <span style={{ fontWeight: '600' }}>₹{taxAmount.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: '700', color: '#92400e' }}>
            <span>Total Amount:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* AMOUNT PAID */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
            Amount Paid
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              onWheel={(e) => e.preventDefault()}
              style={{
                width: '100%',
                padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            />
            <button
              onClick={() => setAmountPaid(totalAmount.toString())}
              style={{
                position: 'absolute',
                right: '0.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 1px 3px rgba(102, 126, 234, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 1px 3px rgba(102, 126, 234, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }}
              title={`Set to ₹${totalAmount.toFixed(2)}`}
            >
              Total
            </button>
          </div>
          {amountPaid !== '' && balance !== 0 && (
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.813rem', color: balance > 0 ? '#dc2626' : '#10b981' }}>
              {balance > 0 ? `Balance Due: ₹${balance.toFixed(2)}` : `Overpaid: ₹${Math.abs(balance).toFixed(2)}`}
            </p>
          )}
        </div>

        {/* PAYMENT METHOD */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="wallet">Wallet</option>
          </select>
        </div>

        {/* NOTES */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              minHeight: '80px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#e5e7eb',
              color: '#1f2937',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCompletePayment}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
