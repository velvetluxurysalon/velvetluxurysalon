import { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, Star } from 'lucide-react';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, uploadImage } from '../services/contentService';

const TestimonialsContent = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    image: '',
    rating: 5
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
      setError('');
    } catch (err) {
      setError('Failed to load testimonials');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = await uploadImage(file, 'testimonials');
      setFormData(prev => ({ ...prev, image: url }));
      setSuccess('Image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload image');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.content || !formData.image) {
        setError('Please fill required fields (Name, Content, Image)');
        return;
      }

      if (editingId) {
        await updateTestimonial(editingId, { ...formData, rating: parseInt(formData.rating) });
        setSuccess('Testimonial updated successfully');
      } else {
        await addTestimonial({ ...formData, rating: parseInt(formData.rating) });
        setSuccess('Testimonial added successfully');
      }

      setTimeout(() => setSuccess(''), 3000);
      setFormData({ name: '', role: '', content: '', image: '', rating: 5 });
      setIsAddingNew(false);
      setEditingId(null);
      await loadTestimonials();
    } catch (err) {
      setError('Failed to save testimonial');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await deleteTestimonial(id);
      setSuccess('Testimonial deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadTestimonials();
    } catch (err) {
      setError('Failed to delete testimonial');
      console.error(err);
    }
  };

  const handleEdit = (testimonial) => {
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      image: testimonial.image,
      rating: testimonial.rating
    });
    setEditingId(testimonial.id);
    setIsAddingNew(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Testimonials</h1>
        <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Manage customer testimonials and reviews
        </p>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid #dc2626',
          borderRadius: 'var(--admin-radius-sm)',
          color: '#dc2626'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          border: '1px solid #059669',
          borderRadius: 'var(--admin-radius-sm)',
          color: '#059669'
        }}>
          {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Testimonials List</h2>
          </div>
          <div className="card-content">
            {isLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
              </div>
            ) : testimonials.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-muted-foreground)' }}>
                No testimonials yet. Add one to get started!
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {testimonials.map(testimonial => (
                  <div key={testimonial.id} style={{ padding: '1rem', backgroundColor: 'var(--admin-secondary)', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border)' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                      {testimonial.image && <img src={testimonial.image} alt={testimonial.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />}
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: 'var(--admin-foreground)' }}>{testimonial.name}</p>
                        {testimonial.role && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--admin-muted-foreground)' }}>{testimonial.role}</p>}
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} size={14} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p style={{ margin: '0.75rem 0 0.75rem 0', fontSize: '0.875rem', color: 'var(--admin-foreground)' }}>{testimonial.content}</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(testimonial)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-primary)', flex: 1 }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(testimonial.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', flex: 1 }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header">
            <h2 className="card-title">{editingId ? 'Edit' : 'Add'} Testimonial</h2>
          </div>
          <div className="card-content">
            {!isAddingNew ? (
              <button onClick={() => setIsAddingNew(true)} className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={18} /> Add Testimonial
              </button>
            ) : (
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Name *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Customer name"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Role</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Regular Customer"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Rating</label>
                  <select
                    className="input"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Testimonial *</label>
                  <textarea
                    className="input"
                    style={{ minHeight: '100px', resize: 'vertical' }}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Customer feedback"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="input"
                    style={{ cursor: 'pointer' }}
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" style={{ marginTop: '1rem', maxWidth: '100%', maxHeight: '150px', borderRadius: '50%', objectFit: 'cover' }} />
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={handleSubmit} className="btn btn-primary" style={{ flex: 1 }}>
                    {editingId ? 'Update' : 'Add'}
                  </button>
                  <button type="button" onClick={() => { setIsAddingNew(false); setEditingId(null); setFormData({ name: '', role: '', content: '', image: '', rating: 5 }); }} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsContent;
