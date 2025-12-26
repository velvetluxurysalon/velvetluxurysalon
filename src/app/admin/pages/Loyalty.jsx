import { useState, useEffect } from 'react';
import { Gift, TrendingUp, History, Award, Calendar, Scissors, Barcode } from 'lucide-react';
import { getCustomers, getCustomerLoyaltyPoints, getCustomerPointsHistory, getVisitsByCustomer } from '../utils/firebaseUtils';

const Loyalty = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [pointsHistory, setPointsHistory] = useState([]);
    const [customerVisits, setCustomerVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await getCustomers(false);
            setCustomers(data);
            setError('');
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCustomer = async (customer) => {
        try {
            setSelectedCustomer(customer);
            const customerPoints = await getCustomerLoyaltyPoints(customer.id);
            setLoyaltyPoints(customerPoints);
            const customerHistory = await getCustomerPointsHistory(customer.id);
            setPointsHistory(customerHistory);
            const visits = await getVisitsByCustomer(customer.id);
            setCustomerVisits(visits);
            
            // Calculate total spend from visits
            const totalSpend = visits.reduce((sum, visit) => sum + (visit.totalAmount || 0), 0);
            setSelectedCustomer(prev => ({
                ...prev,
                calculatedTotalSpent: totalSpend
            }));
            
            setError('');
        } catch (err) {
            console.error('Error fetching loyalty info:', err);
            setError('Failed to load loyalty info');
        }
    };

    return (
        <div>
            {error && <div style={{ background: 'var(--error-bg)', color: 'var(--error)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>{error}</div>}
            {success && <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>{success}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Customer Selection */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <Award size={20} />
                            Select Customer
                        </h2>
                    </div>
                    <div className="card-content">
                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {customers.map(customer => (
                                <button
                                    key={customer.id}
                                    onClick={() => handleSelectCustomer(customer)}
                                    className="btn btn-ghost"
                                    style={{
                                        width: '100%',
                                        justifyContent: 'flex-start',
                                        padding: '0.75rem',
                                        marginBottom: '0.5rem',
                                        background: selectedCustomer?.id === customer.id ? 'var(--secondary)' : 'transparent',
                                        borderRadius: 'var(--radius-sm)'
                                    }}
                                >
                                    <div style={{ textAlign: 'left', flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{customer.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{customer.phone || customer.contactNo}</div>
                                    </div>
                                    <div style={{ background: 'var(--primary-gradient)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {customer.loyaltyPoints || 0} pts
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Customer Loyalty Details */}
                {selectedCustomer && (
                    <div style={{ gridColumn: 'span 1' }}>
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <Gift size={20} />
                                    {selectedCustomer.name} - Loyalty
                                </h2>
                            </div>
                            <div className="card-content">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    {/* Total Points */}
                                    <div style={{
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, rgba(232, 197, 71, 0.1) 0%, rgba(201, 162, 39, 0.05) 100%)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid rgba(201, 162, 39, 0.2)'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Available Points</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#a855f7' }}>{loyaltyPoints}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>₹{loyaltyPoints} value</div>
                                    </div>

                                    {/* Total Spent */}
                                    <div style={{
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid rgba(5, 150, 105, 0.2)'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Total Spent</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>₹{(selectedCustomer.calculatedTotalSpent || 0).toFixed(2)}</div>
                                    </div>

                                    {/* Total Visits */}
                                    <div style={{
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid rgba(59, 130, 246, 0.2)'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Total Visits</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--info)' }}>{customerVisits.length}</div>
                                    </div>

                                    {/* Average Spend Per Visit */}
                                    <div style={{
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(109, 40, 217, 0.05) 100%)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid rgba(109, 40, 217, 0.2)'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Avg Spend/Visit</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#8b5cf6' }}>₹{customerVisits.length > 0 ? ((selectedCustomer.calculatedTotalSpent || 0) / customerVisits.length).toFixed(2) : '0'}</div>
                                    </div>
                                </div>

                                {/* Points History */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
                                        <History size={16} />
                                        Points History
                                    </div>
                                    {pointsHistory.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {pointsHistory.slice(0, 10).map((tx) => (
                                                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--secondary)', borderRadius: 'var(--radius-sm)' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{tx.description || `${tx.type === 'earned' ? '+' : '-'}${Math.abs(tx.points)} points`}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                                            {new Date(tx.transactionDate).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div style={{ 
                                                        fontSize: '0.875rem', 
                                                        fontWeight: 600,
                                                        color: tx.type === 'earned' ? '#10b981' : '#ef4444'
                                                    }}>
                                                        {tx.type === 'earned' ? '+' : '-'}{Math.abs(tx.points)} pts
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: '2rem' }}>
                                            No transaction history
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Visit Details Section */}
                {selectedCustomer && customerVisits.length > 0 && (
                    <div style={{ gridColumn: 'span 1' }}>
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <Calendar size={20} />
                                    Visit History ({customerVisits.length})
                                </h2>
                            </div>
                            <div className="card-content">
                                <div style={{ maxHeight: '600px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {customerVisits.map((visit, idx) => (
                                        <div key={visit.id} style={{
                                            padding: '1rem',
                                            background: 'var(--secondary)',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid rgba(100, 116, 139, 0.2)',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.5)'}
                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.2)'}
                                        >
                                            {/* Visit Header */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                                                        Visit #{idx + 1}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                                        <Calendar size={12} />
                                                        {new Date(visit.date?.toDate?.() || visit.date).toLocaleDateString('en-IN', { 
                                                            day: 'numeric', 
                                                            month: 'short', 
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                                <div style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '999px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    background: visit.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                                    color: visit.status === 'COMPLETED' ? '#10b981' : '#3b82f6'
                                                }}>
                                                    {visit.status || 'UNKNOWN'}
                                                </div>
                                            </div>

                                            {/* Services & Products */}
                                            {visit.items && visit.items.length > 0 && (
                                                <div style={{ marginBottom: '0.75rem' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                        <Scissors size={12} />
                                                        Services & Products ({visit.items.length})
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                        {visit.items.slice(0, 3).map((item, i) => (
                                                            <div key={i} style={{ fontSize: '0.75rem', color: 'var(--foreground)', paddingLeft: '1.25rem' }}>
                                                                <span style={{ color: 'var(--muted-foreground)' }}>•</span> {item.name} <span style={{ color: 'var(--muted-foreground)' }}>x{item.quantity} @ ₹{item.price}</span>
                                                            </div>
                                                        ))}
                                                        {visit.items.length > 3 && (
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', paddingLeft: '1.25rem' }}>
                                                                +{visit.items.length - 3} more items
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Amount Details */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(100, 116, 139, 0.2)' }}>
                                                <div>
                                                    <div style={{ color: 'var(--muted-foreground)', marginBottom: '0.15rem' }}>Total Amount</div>
                                                    <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>₹{(visit.totalAmount || 0).toFixed(2)}</div>
                                                </div>
                                                <div>
                                                    <div style={{ color: 'var(--muted-foreground)', marginBottom: '0.15rem' }}>Amount Paid</div>
                                                    <div style={{ fontWeight: 600, color: visit.paidAmount >= visit.totalAmount ? '#10b981' : '#ef4444' }}>₹{(visit.paidAmount || 0).toFixed(2)}</div>
                                                </div>
                                            </div>

                                            {/* Payment & Invoice Info */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
                                                {visit.paymentMode && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--muted-foreground)' }}>
                                                        <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'currentColor' }} />
                                                        Payment: {visit.paymentMode}
                                                    </div>
                                                )}
                                                {visit.invoiceId && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--muted-foreground)' }}>
                                                        <Barcode size={12} />
                                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            Inv: {visit.invoiceId.substring(0, 8)}...
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Loyalty;
