import { useState, useEffect } from 'react';
import { User, Phone, Calendar, DollarSign, Search, Printer, Trash } from 'lucide-react';
import { getCustomers, deleteCustomer, searchCustomers, getVisitsByCustomer } from '../utils/firebaseUtils';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCustomers(customers);
        } else {
            performSearch();
        }
    }, [searchQuery, customers]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await getCustomers(false);
            
            // Fetch visits for each customer
            const customersWithVisits = await Promise.all(
                data.map(async (customer) => {
                    try {
                        const visits = await getVisitsByCustomer(customer.id);
                        return { ...customer, visits: visits || [] };
                    } catch (err) {
                        console.error(`Error fetching visits for customer ${customer.id}:`, err);
                        return { ...customer, visits: [] };
                    }
                })
            );
            
            setCustomers(customersWithVisits);
            setFilteredCustomers(customersWithVisits);
            setError('');
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const performSearch = async () => {
        try {
            if (searchQuery.trim()) {
                const results = await searchCustomers(searchQuery);
                setFilteredCustomers(results);
            } else {
                setFilteredCustomers(customers);
            }
        } catch (error) {
            console.error('Error searching customers:', error);
        }
    };

    const handleDeleteCustomer = async (e, customerId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
            try {
                setLoading(true);
                await deleteCustomer(customerId);
                setCustomers(customers.filter(c => c.id !== customerId));
                setFilteredCustomers(filteredCustomers.filter(c => c.id !== customerId));
                if (selectedCustomer?.id === customerId) setSelectedCustomer(null);
                setError('');
            } catch (error) {
                console.error('Error deleting customer:', error);
                setError('Failed to delete customer');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDownloadReceipt = (visit) => {
        const receiptWindow = window.open('', '_blank');
        const itemsHtml = visit.items.map(item => `
            <tr>
                <td style="padding: 5px; border-bottom: 1px solid #eee;">${item.service?.name || item.product?.name}</td>
                <td style="padding: 5px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
            </tr>
        `).join('');

        const total = visit.invoice?.total || 0;
        const subtotal = visit.invoice?.subtotal || 0;
        const tax = visit.invoice?.tax || 0;
        const discount = visit.invoice?.discount || 0;

        receiptWindow.document.write(`
            <html>
            <head>
                <title>Receipt #${visit.id}</title>
                <style>
                    body { font-family: 'Courier New', monospace; padding: 20px; max-width: 400px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .title { font-size: 24px; font-weight: bold; }
                    .info { margin-bottom: 20px; font-size: 14px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .totals { text-align: right; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">VELVET LUXURY SALON</div>
                    <div>Kalingarayanpalayam, Bhavani, Erode District, Tamil Nadu - 638301</div>
                    <div>Contact: 9667722611</div>
                </div>
                <div class="info">
                    <div><strong>Date:</strong> ${new Date(visit.date).toLocaleString()}</div>
                    <div><strong>Visit ID:</strong> #${visit.id}</div>
                    <div><strong>Customer:</strong> ${selectedCustomer.name}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="text-align: left; border-bottom: 2px solid #000;">Item</th>
                            <th style="text-align: right; border-bottom: 2px solid #000;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                <div class="totals">
                    <div>Subtotal: ₹${subtotal.toFixed(2)}</div>
                    ${discount > 0 ? `<div>Discount: -₹${discount.toFixed(2)}</div>` : ''}
                    <div>Tax: ₹${tax.toFixed(2)}</div>
                    <div style="font-weight: bold; font-size: 18px; margin-top: 10px;">Total: ₹${total.toFixed(2)}</div>
                </div>
                <div class="footer">
                    <p>Thank you for visiting!</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        receiptWindow.document.close();
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Customers</h1>
                <div style={{ position: 'relative', width: '300px' }}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Search customers..."
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '0.75rem', color: 'var(--muted-foreground)' }} />
                </div>
            </div>

            <div className="card">
                <div className="card-content">
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Type</th>
                                <th>Visits</th>
                                <th style={{ textAlign: 'right' }}>Total Spent</th>
                                <th>Last Visit</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} onClick={() => setSelectedCustomer(customer)} style={{ cursor: 'pointer' }}>
                                    <td style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #d4af37 0%, #b45309 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                        }}>
                                            <User size={20} />
                                        </div>
                                        <span style={{ fontWeight: '600' }}>{customer.name}</span>
                                    </td>
                                    <td style={{ color: 'var(--muted-foreground)' }}>{customer.contactNo || customer.phone || 'N/A'}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            backgroundColor: customer.type === 'Old' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                            color: customer.type === 'Old' ? '#10b981' : '#60a5fa',
                                            border: `1px solid ${customer.type === 'Old' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`
                                        }}>
                                            {customer.type}
                                        </span>
                                    </td>
                                    <td>{customer.visits.length}</td>
                                    <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--primary)' }}>
                                        {/* Calculate total spent from visits with paid invoices */}
                                        ₹{customer.visits.reduce((sum, v) => sum + (v.invoice?.status === 'PAID' ? v.invoice.total : 0), 0).toFixed(2)}
                                    </td>
                                    <td style={{ color: 'var(--muted-foreground)' }}>
                                        {customer.visits.length > 0
                                            ? new Date(customer.visits[0].date).toLocaleDateString()
                                            : 'N/A'}
                                    </td>
                                    {/* No delete button for customers */}
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                                        No customers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedCustomer && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 className="card-title">{selectedCustomer.name}</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{selectedCustomer.contactNo}</p>
                            </div>
                            <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="card-content">
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--primary)' }}>Visit History</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {selectedCustomer.visits.map(visit => (
                                    <div key={visit.id} style={{ padding: '1rem', background: 'var(--secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: '500' }}>{new Date(visit.date).toLocaleString()}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{
                                                    fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px',
                                                    background: visit.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: visit.status === 'COMPLETED' ? '#10b981' : '#f59e0b'
                                                }}>
                                                    {visit.status.replace('_', ' ')}
                                                </span>
                                                {visit.invoice && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDownloadReceipt(visit); }}
                                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.2rem' }}
                                                        title="Download Receipt"
                                                    >
                                                        <Printer size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                                            {visit.items.map(i => i.service?.name || i.product?.name).join(', ')}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                            <span>Total: <span style={{ color: 'var(--foreground)' }}>₹{visit.invoice?.total.toFixed(2) || '0.00'}</span></span>
                                            {visit.feedback && (
                                                <span style={{ color: 'var(--primary)' }}>★ {visit.feedback.rating}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {selectedCustomer.visits.length === 0 && (
                                    <p style={{ textAlign: 'center', color: 'var(--muted-foreground)' }}>No visits yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
