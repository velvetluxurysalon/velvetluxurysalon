import { useState, useEffect } from 'react';
import { Trash2, Plus, Search, RotateCcw } from 'lucide-react';
import { getServices, getRecentServices, addService, deleteService, restoreService } from '../utils/firebaseUtils';

const Services = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newService, setNewService] = useState({ name: '', price: '', category: 'General', gender: 'any' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [recentServices, setRecentServices] = useState({ added: [], deleted: [] });

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredServices(services);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = services.filter(service =>
                service.name.toLowerCase().includes(lowerQuery) ||
                service.category.toLowerCase().includes(lowerQuery)
            );
            setFilteredServices(filtered);
        }
    }, [searchQuery, services]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const [allServices, recent] = await Promise.all([
                getServices(false),
                getRecentServices(7)
            ]);

            setServices(allServices);
            setFilteredServices(allServices);
            setRecentServices({ added: recent, deleted: [] });
            setError('');
        } catch (error) {
            console.error('Error fetching services:', error);
            setError('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        if (!newService.name || !newService.price) return;

        try {
            setLoading(true);
            await addService({
                name: newService.name,
                category: newService.category,
                price: parseFloat(newService.price),
                duration: 30,
                gender: newService.gender
            });
            setNewService({ name: '', price: '', category: 'General', gender: 'any' });
            await fetchServices();
            setError('');
        } catch (error) {
            console.error('Error adding service:', error);
            setError('Failed to add service');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        try {
            setLoading(true);
            await deleteService(id);
            await fetchServices();
            setError('');
        } catch (error) {
            console.error('Error deleting service:', error);
            setError('Failed to delete service');
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreService = async (id) => {
        try {
            setLoading(true);
            await restoreService(id);
            await fetchServices();
            setError('');
        } catch (error) {
            console.error('Error restoring service:', error);
            setError('Failed to restore service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Services</h1>
                <div style={{ position: 'relative', width: '300px' }}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Search services..."
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '0.75rem', color: 'var(--muted-foreground)' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Service List</h2>
                    </div>
                    <div className="card-content" style={{ maxHeight: '600px', overflowY: 'auto', padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                            <thead>
                                <tr>
                                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem' }}>Name</th>
                                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem' }}>Gender</th>
                                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem' }}>Category</th>
                                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem', textAlign: 'right' }}>Price</th>
                                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem', width: '50px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.map(service => (
                                    <tr key={service.id}>
                                        <td style={{ fontWeight: '500' }}>{service.name}</td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                backgroundColor: service.gender === 'Male' ? 'rgba(59, 130, 246, 0.1)' : service.gender === 'Female' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                                color: service.gender === 'Male' ? '#3b82f6' : service.gender === 'Female' ? '#ec4899' : '#9ca3af',
                                                border: '1px solid var(--glass-border)'
                                            }}>
                                                {service.gender}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                color: 'var(--muted-foreground)',
                                                border: '1px solid var(--glass-border)'
                                            }}>
                                                {service.category}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--primary)' }}>₹{service.price.toFixed(2)}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteService(service.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', opacity: 0.7 }}
                                                className="hover:opacity-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredServices.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
                                            No services found matching "{searchQuery}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ height: 'fit-content' }}>
                        <div className="card-header">
                            <h2 className="card-title">Add New Service</h2>
                        </div>
                        <div className="card-content">
                            <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted-foreground)' }}>Service Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                        placeholder="e.g. Gold Facial"
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted-foreground)' }}>Category</label>
                                    <select
                                        className="input"
                                        value={newService.category}
                                        onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                                    >
                                        <option value="General">General</option>
                                        <option value="Skin Care">Skin Care</option>
                                        <option value="Hair">Hair</option>
                                        <option value="Waxing">Waxing</option>
                                        <option value="Manicure/Pedicure">Manicure/Pedicure</option>
                                        <option value="Makeup">Makeup</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted-foreground)' }}>Gender</label>
                                    <select
                                        className="input"
                                        value={newService.gender}
                                        onChange={(e) => setNewService({ ...newService, gender: e.target.value })}
                                    >
                                        <option value="Unisex">Unisex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted-foreground)' }}>Price (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    <Plus size={18} style={{ marginRight: '0.5rem' }} />
                                    Add Service
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Recent Activity</h2>
                        </div>
                        <div className="card-content">
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Last Added</h3>
                                {recentServices.added.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {recentServices.added.map(s => (
                                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                <span>{s.name}</span>
                                                <span style={{ color: 'var(--success)' }}>+ ₹{s.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontStyle: 'italic' }}>No recent additions</div>
                                )}
                            </div>

                            <div>
                                <h3 style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Last Deleted</h3>
                                {recentServices.deleted.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {recentServices.deleted.map(s => (
                                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', opacity: 0.7 }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ textDecoration: 'line-through' }}>{s.name}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>Deleted</span>
                                                </div>
                                                <button
                                                    onClick={() => handleRestoreService(s.id)}
                                                    style={{
                                                        background: 'none',
                                                        border: '1px solid var(--glass-border)',
                                                        borderRadius: '4px',
                                                        padding: '0.25rem 0.5rem',
                                                        cursor: 'pointer',
                                                        color: 'var(--primary)',
                                                        fontSize: '0.75rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem'
                                                    }}
                                                    className="hover:bg-white/5"
                                                >
                                                    <RotateCcw size={12} />
                                                    Undo
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontStyle: 'italic' }}>No recent deletions</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
