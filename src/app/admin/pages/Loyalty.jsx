import { useState, useEffect } from 'react';
import { Gift, TrendingUp, History, Award } from 'lucide-react';
import { getCustomers, getCustomerLoyaltyPoints, getCustomerPointsHistory } from '../utils/firebaseUtils';

const Loyalty = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [pointsHistory, setPointsHistory] = useState([]);
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>₹{(selectedCustomer.totalSpent || 0).toFixed(2)}</div>
                                </div>

                                {/* Total Visits */}
                                <div style={{
                                    padding: '1rem',
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)'
                                }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Total Visits</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--info)' }}>{selectedCustomer.totalVisits || 0}</div>
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
                )}
            </div>
        </div>
    );
};

export default Loyalty;
