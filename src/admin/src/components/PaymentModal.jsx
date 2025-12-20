import { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { payInvoice } from '../utils/firebaseUtils';

const PaymentModal = ({ invoice, onClose, onPaymentComplete }) => {
    const [amount, setAmount] = useState(invoice.total); // Default to full amount
    const [mode, setMode] = useState('CASH');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePayment = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await payInvoice(invoice.id, {
                amount: parseFloat(amount),
                mode
            });

            if (result.isPaid) {
                alert('Payment Completed! Visit marked as done.');
            }
            onPaymentComplete();
            onClose();
        } catch (error) {
            console.error('Payment failed:', error);
            setError('Payment failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ width: '400px' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="card-title">Process Payment</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white' }}><X size={20} /></button>
                </div>
                <div className="card-content">
                    <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Total Due</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>₹{invoice.total.toFixed(2)}</div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Payment Mode</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                            {[
                                { id: 'CASH', label: 'Cash', icon: Banknote },
                                { id: 'UPI', label: 'UPI', icon: Smartphone },
                                { id: 'CARD', label: 'Card', icon: CreditCard }
                            ].map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m.id)}
                                    className={`btn ${mode === m.id ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ flexDirection: 'column', gap: '0.25rem', padding: '0.75rem' }}
                                >
                                    <m.icon size={20} />
                                    <span style={{ fontSize: '0.75rem' }}>{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Amount Received</label>
                        <input
                            type="number"
                            className="input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Confirm Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
