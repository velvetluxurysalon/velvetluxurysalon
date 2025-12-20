import { useState, useEffect } from 'react';
import { Plus, Clock, Scissors, CreditCard, CheckCircle, User, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CheckInModal from '../components/CheckInModal';
import { getActiveVisits, updateVisitStatus, deleteVisit as deleteVisitUtil } from '../utils/firebaseUtils';

const Reception = () => {
    const [visits, setVisits] = useState([]);
    const [showCheckIn, setShowCheckIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchVisits();
        const interval = setInterval(fetchVisits, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchVisits = async () => {
        try {
            setLoading(true);
            const data = await getActiveVisits();
            setVisits(data);
            setError('');
        } catch (error) {
            console.error('Error fetching visits:', error);
            setError('Failed to load visits');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            setLoading(true);
            await updateVisitStatus(id, status);
            await fetchVisits();
            setError('');
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const deleteVisit = async (id) => {
        if (!window.confirm('Are you sure you want to remove this customer from the queue?')) return;

        try {
            setLoading(true);
            await deleteVisitUtil(id);
            await fetchVisits();
            setError('');
        } catch (error) {
            console.error('Error deleting visit:', error);
            setError('Failed to delete visit');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { id: 'CHECKED_IN', title: 'Waiting', icon: Clock, color: '#f59e0b' },
        { id: 'IN_SERVICE', title: 'In Service', icon: Scissors, color: '#3b82f6' },
        { id: 'WAITING_PAYMENT', title: 'Billing', icon: CreditCard, color: '#10b981' },
    ];

    const VisitCard = ({ visit }) => (
        <div
            className="card"
            style={{ marginBottom: '1rem', cursor: 'pointer', borderLeft: `4px solid ${columns.find(c => c.id === visit.status)?.color}` }}
            onClick={() => navigate(`/visits/${visit.id}`)}
        >
            <div className="card-content" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600' }}>{visit.customer.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                            {new Date(visit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteVisit(visit.id);
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--muted-foreground)',
                                padding: '0.25rem',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.background = 'none'; }}
                            title="Remove from queue"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={14} />
                    {visit.staff ? visit.staff.name : 'Unassigned'}
                </div>

                {visit.items && visit.items.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
                        {visit.items.slice(0, 2).map((item, i) => (
                            <span key={i} style={{
                                fontSize: '0.7rem',
                                padding: '0.1rem 0.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '4px',
                                border: '1px solid var(--glass-border)'
                            }}>
                                {item.service?.name || item.product?.name}
                            </span>
                        ))}
                        {visit.items.length > 2 && <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>+{visit.items.length - 2} more</span>}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    {visit.status === 'CHECKED_IN' && (
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(visit.id, 'IN_SERVICE');
                            }}
                        >
                            Start Service
                        </button>
                    )}
                    {visit.status === 'IN_SERVICE' && (
                        <button
                            className="btn btn-secondary"
                            style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/visits/${visit.id}`);
                            }}
                        >
                            Checkout
                        </button>
                    )}
                    {visit.status === 'WAITING_PAYMENT' && (
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem', backgroundColor: '#10b981', borderColor: '#10b981' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/visits/${visit.id}`);
                            }}
                        >
                            Collect Payment
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reception</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Manage active visits and shop floor</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCheckIn(true)}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    New Check-in
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', flex: 1, overflow: 'hidden' }}>
                {columns.map(col => (
                    <div key={col.id} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            marginBottom: '1rem', padding: '0.75rem',
                            background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius)',
                            borderBottom: `2px solid ${col.color}`,
                            flexShrink: 0
                        }}>
                            <col.icon size={18} color={col.color} />
                            <span style={{ fontWeight: '600' }}>{col.title}</span>
                            <span style={{
                                marginLeft: 'auto',
                                background: 'rgba(255,255,255,0.1)',
                                padding: '0.1rem 0.5rem',
                                borderRadius: '999px',
                                fontSize: '0.75rem'
                            }}>
                                {visits.filter(v => v.status === col.id).length}
                            </span>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', minHeight: 0 }}>
                            {visits.filter(v => v.status === col.id).map(visit => (
                                <VisitCard key={visit.id} visit={visit} />
                            ))}
                            {visits.filter(v => v.status === col.id).length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                                    No customers
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showCheckIn && (
                <CheckInModal
                    onClose={() => setShowCheckIn(false)}
                    onCheckIn={fetchVisits}
                />
            )}
        </div>
    );
};

export default Reception;
