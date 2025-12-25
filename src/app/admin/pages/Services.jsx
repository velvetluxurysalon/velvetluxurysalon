import { useState, useEffect } from 'react';
import { Trash2, Plus, Search, RotateCcw, Edit2, X, Star } from 'lucide-react';
import { getServices, getRecentServices, addService, updateService, deleteService, restoreService, uploadServiceImage } from '../utils/firebaseUtils';

const CATEGORY_OPTIONS = [
    'Hair Services',
    'Barbering',
    'Spa & Massage',
    'Nail Services',
    'Facial & Skincare',
    'Makeup',
    'Waxing & Threading',
    'Eyelash Services',
    'Body Treatments',
    'Grooming',
    'Wellness',
    'Other'
];

const Services = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newService, setNewService] = useState({ name: '', price: '', category: 'General', gender: 'Unisex', description: '', image: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [recentServices, setRecentServices] = useState({ added: [], deleted: [] });
    const [editingService, setEditingService] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

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
            const serviceData = {
                name: newService.name,
                category: newService.category || 'General',
                price: typeof newService.price === 'number' ? newService.price : parseFloat(newService.price),
                duration: 30,
                gender: newService.gender || 'Unisex',
                description: newService.description || '',
                image: newService.image || ''
            };

            if (editingService) {
                // Update existing service
                await updateService(editingService.id, serviceData);
                setEditingService(null);
            } else {
                // Add new service
                await addService(serviceData);
            }
            setNewService({ name: '', price: '', category: 'General', gender: 'Unisex', description: '', image: '' });
            setImagePreview('');
            await fetchServices();
            setError('');
        } catch (error) {
            console.error('Error saving service:', error);
            setError('Failed to save service');
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

    const handleEditService = (service) => {
        setEditingService(service);
        setNewService({
            name: service.name,
            price: service.price,
            category: service.category || 'General',
            gender: service.gender || 'Unisex',
            description: service.description || '',
            image: service.image || ''
        });
        setImagePreview(service.image || '');
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            const url = await uploadServiceImage(file);
            setNewService({ ...newService, image: url });
            setImagePreview(url);
            setError('');
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setEditingService(null);
        setNewService({ name: '', price: '', category: 'General', gender: 'any', description: '', image: '' });
        setImagePreview('');
    };

    return (
        <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
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
                                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem', width: '60px' }}>Image</th>
                                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem' }}>Name</th>
                                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem' }}>Category</th>
                                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem', textAlign: 'right' }}>Price</th>
                                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem', width: '100px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.map(service => (
                                    <tr key={service.id}>
                                        <td style={{ padding: '0.5rem' }}>
                                            <img 
                                                src={service.image || 'https://via.placeholder.com/50?text=No+Image'} 
                                                alt={service.name}
                                                style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }}
                                                onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/50?text=No+Image'}
                                            />
                                        </td>
                                        <td style={{ fontWeight: '500' }}>{service.name}</td>
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
                                        <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--primary)' }}>₹{typeof service.price === 'number' ? service.price.toFixed(2) : service.price}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleEditService(service)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', opacity: 0.7 }}
                                                    className="hover:opacity-100"
                                                    title="Edit service"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteService(service.id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', opacity: 0.7 }}
                                                    className="hover:opacity-100"
                                                    title="Delete service"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredServices.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 className="card-title">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                                {editingService && (
                                    <button
                                        onClick={cancelEdit}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="card-content">
                            <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Image Upload */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted-foreground)' }}>Service Image</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                                id="image-upload"
                                                disabled={loading}
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '0.75rem 1.5rem',
                                                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                                    color: 'var(--primary)',
                                                    border: '1px solid var(--primary)',
                                                    borderRadius: '0.375rem',
                                                    cursor: loading ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    opacity: loading ? 0.5 : 1
                                                }}
                                            >
                                                Choose Image
                                            </label>
                                        </div>
                                        {imagePreview && (
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview"
                                                style={{ width: '100px', height: '100px', borderRadius: '0.375rem', objectFit: 'cover', border: '1px solid var(--glass-border)' }}
                                            />
                                        )}
                                    </div>
                                </div>

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
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted-foreground)' }}>Description</label>
                                    <textarea
                                        className="input"
                                        value={newService.description}
                                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                        placeholder="Service description..."
                                        rows="3"
                                        style={{ fontFamily: 'inherit', resize: 'vertical' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted-foreground)' }}>Category</label>
                                    <select
                                        className="input"
                                        value={newService.category}
                                        onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                                        required
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <option value="">Select a category...</option>
                                        {CATEGORY_OPTIONS.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
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

                                <div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                            <Plus size={18} style={{ marginRight: '0.5rem' }} />
                                            {editingService ? 'Update Service' : 'Add Service'}
                                        </button>
                                        {editingService && (
                                            <button 
                                                type="button" 
                                                onClick={cancelEdit}
                                                style={{
                                                    padding: '0.625rem 1.5rem',
                                                    backgroundColor: 'transparent',
                                                    border: '1px solid var(--glass-border)',
                                                    color: 'var(--muted-foreground)',
                                                    borderRadius: '0.375rem',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
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
