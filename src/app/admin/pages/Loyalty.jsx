import { useState, useEffect } from 'react';
import { Gift, TrendingUp, History, Award } from 'lucide-react';
import { getCustomers, getCustomerLoyaltyInfo, redeemCustomerPoints } from '../utils/firebaseUtils';

const Loyalty = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loyaltyInfo, setLoyaltyInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [redeemAmount, setRedeemAmount] = useState('');

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
            const info = await getCustomerLoyaltyInfo(customer.id);
            setLoyaltyInfo(info);
        } catch (err) {
            console.error('Error fetching loyalty info:', err);
            setError('Failed to load loyalty info');
        }
    };

    const handleRedeemPoints = async () => {
        if (!redeemAmount || !selectedCustomer) return;

        try {
            setLoading(true);
            const points = parseInt(redeemAmount);
            await redeemCustomerPoints(selectedCustomer.id, points);
            
            const info = await getCustomerLoyaltyInfo(selectedCustomer.id);
            setLoyaltyInfo(info);
            setRedeemAmount('');
            setError('');
        } catch (err) {
            console.error('Error redeeming points:', err);
            setError(err.message || 'Failed to redeem points');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>


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
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{customer.contactNo}</div>
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
                {loyaltyInfo && (
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                <Gift size={20} />
                                {loyaltyInfo.customerId === selectedCustomer?.id ? selectedCustomer.name : 'Details'}
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
                                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Total Points</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{loyaltyInfo.totalPoints}</div>
                                </div>

                                {/* Total Visits */}
                                <div style={{
                                    padding: '1rem',
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)'
                                }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Total Visits</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--info)' }}>{loyaltyInfo.totalVisits}</div>
                                </div>

                                {/* Total Spent */}
                                <div style={{
                                    padding: '1rem',
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid rgba(5, 150, 105, 0.2)',
                                    gridColumn: '1 / -1'
                                }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Total Amount Spent</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>₹{loyaltyInfo.totalSpent.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Redeem Points */}
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>
                                <label className="label">Redeem Points</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
                                    <input
                                        type="number"
                                        className="input"
                                        value={redeemAmount}
                                        onChange={(e) => setRedeemAmount(e.target.value)}
                                        placeholder="Enter points to redeem"
                                        max={loyaltyInfo.totalPoints}
                                    />
                                    <button
                                        onClick={handleRedeemPoints}
                                        className="btn btn-primary"
                                        disabled={loading || !redeemAmount}
                                    >
                                        Redeem
                                    </button>
                                </div>
                            </div>

                            {/* Recent Transactions */}
                            <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Transactions</div>
                                {loyaltyInfo.transactions.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {loyaltyInfo.transactions.slice(0, 5).map((tx) => (
                                            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--secondary)', borderRadius: 'var(--radius-sm)' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{tx.reason}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                                        {tx.transactionDate?.toDate?.().toLocaleDateString() || new Date(tx.transactionDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: 600, color: tx.points > 0 ? 'var(--success)' : 'var(--danger)' }}>
                                                    {tx.points > 0 ? '+' : ''}{tx.points}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--muted-foreground)', textAlign: 'center' }}>No transactions yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default Loyalty;
