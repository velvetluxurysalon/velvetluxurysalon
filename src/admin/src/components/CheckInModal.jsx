import { useState, useEffect } from 'react';
import { X, Search, UserPlus, User } from 'lucide-react';
import { getStaff, searchCustomers, addCustomer, createVisit } from '../utils/firebaseUtils';

const CheckInModal = ({ onClose, onCheckIn }) => {
    const [phone, setPhone] = useState('');
    const [customer, setCustomer] = useState(null);
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', gender: '' });
    const [existingCustomerPrefilled, setExistingCustomerPrefilled] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const data = await getStaff();
            setStaffList(data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const handleSearch = async () => {
        if (phone.length !== 10) {
            setErrors(prev => ({ ...prev, phone: 'Phone number must be exactly 10 digits' }));
            return;
        }
        setErrors(prev => ({ ...prev, phone: null }));

        try {
            const data = await searchCustomers(phone);
            if (data && data.length > 0) {
                setCustomer(data[0]);
                // Prefill details for existing customer
                setNewCustomer({
                    name: data[0].name || '',
                    email: data[0].email || '',
                    gender: data[0].gender || ''
                });
                setExistingCustomerPrefilled(true);
            } else {
                setCustomer(null);
                setNewCustomer({ name: '', email: '', gender: '' });
                setExistingCustomerPrefilled(false);
            }
        } catch (error) {
            console.error('Error searching customer:', error);
            setErrors(prev => ({ ...prev, phone: 'Failed to search customer' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!phone) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone number must be exactly 10 digits';

        if (!customer && !newCustomer.name.trim()) {
            newErrors.name = 'Customer name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            let customerId = customer?.id;

            // Create customer if new
            if (!customer) {
                const newCustData = await addCustomer({
                    ...newCustomer,
                    contactNo: phone
                });
                customerId = newCustData.id;
            }

            if (!customerId) throw new Error('Invalid Customer ID');

            // Create Visit
            await createVisit({
                customerId,
                staffId: selectedStaff || null,
                notes
            });

            onCheckIn();
            onClose();
        } catch (error) {
            console.error('Check-in failed:', error);
            alert('Check-in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="card-title">New Check-in</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div className="card-content">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Customer Phone</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="input"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onBlur={handleSearch}
                                placeholder="Enter 10-digit number"
                            />
                            <Search size={18} style={{ position: 'absolute', right: '1rem', top: '0.75rem', color: 'var(--muted-foreground)' }} />
                        </div>
                        {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.phone}</span>}
                    </div>

                    {customer ? (
                        <><div style={{
                            padding: '1rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: 'var(--radius)',
                            marginBottom: '1.5rem',
                            display: 'flex', alignItems: 'center', gap: '1rem'
                        }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <User size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', color: '#10b981' }}>{customer.name}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Customer already exists. Details are prefilled below.</div>
                            </div>
                        </div><div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)', background: '#f0fdf4' }}>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Full Name"
                                        value={newCustomer.name}
                                        disabled />
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="Email (Optional)"
                                        value={newCustomer.email}
                                        disabled />
                                    <select
                                        className="input"
                                        value={newCustomer.gender || ''}
                                        disabled
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div></>
                    ) : phone.length >= 10 && (
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                                <UserPlus size={18} />
                                <span style={{ fontWeight: '600' }}>New Customer Registration</span>
                            </div>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Full Name"
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                />
                                {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '-0.5rem' }}>{errors.name}</span>}
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="Email (Optional)"
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                />
                                <select
                                    className="input"
                                    value={newCustomer.gender || ''}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, gender: e.target.value })}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Assign Staff (Optional)</label>
                        <select
                            className="input"
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                        >
                            <option value="">-- Select Stylist --</option>
                            {staffList.map(staff => (
                                <option key={staff.id} value={staff.id}>{staff.name} ({staff.role})</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Notes</label>
                        <textarea
                            className="input"
                            rows="3"
                            placeholder="Any special requests?"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Check In Customer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckInModal;
