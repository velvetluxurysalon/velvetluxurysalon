import { useState, useEffect } from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import { getStaff, addStaff, deleteStaff } from '../utils/firebaseUtils';

const Staff = () => {
    const [staffList, setStaffList] = useState([]);
    const [newStaff, setNewStaff] = useState({ name: '', role: 'stylist', phone: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const data = await getStaff();
            setStaffList(data);
            setError('');
        } catch (error) {
            console.error('Error fetching staff:', error);
            setError('Failed to load staff');
        } finally {
            setLoading(false);
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        if (!newStaff.name) return;

        try {
            setLoading(true);
            await addStaff({
                name: newStaff.name,
                role: newStaff.role,
                phone: newStaff.phone || '',
                email: newStaff.email || ''
            });
            setNewStaff({ name: '', role: 'stylist', phone: '', email: '' });
            await fetchStaff();
            setError('');
        } catch (error) {
            console.error('Error adding staff:', error);
            setError('Failed to add staff');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStaff = async (id) => {
        if (!confirm('Are you sure you want to delete this staff member?')) return;

        try {
            setLoading(true);
            await deleteStaff(id);
            await fetchStaff();
            setError('');
        } catch (error) {
            console.error('Error deleting staff:', error);
            setError('Failed to delete staff');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Staff Management</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Staff List</h2>
                    </div>
                    <div className="card-content">
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.map(staff => (
                                    <tr key={staff.id}>
                                        <td style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={16} />
                                            </div>
                                            <span style={{ fontWeight: '500' }}>{staff.name}</span>
                                        </td>
                                        <td>{staff.role}</td>
                                        <td>
                                            <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.75rem' }}>
                                                Active
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteStaff(staff.id)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                                title="Delete Staff"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card" style={{ height: 'fit-content' }}>
                    <div className="card-header">
                        <h2 className="card-title">Add New Staff</h2>
                    </div>
                    <div className="card-content">
                        <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={newStaff.name}
                                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Role</label>
                                <select
                                    className="input"
                                    value={newStaff.role}
                                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                                >
                                    <option value="Stylist">Stylist</option>
                                    <option value="Receptionist">Receptionist</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                <Plus size={18} style={{ marginRight: '0.5rem' }} />
                                Add Staff
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Staff;
