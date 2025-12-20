import { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, uploadImage } from '../services/contentService';

const TeamContent = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experience: '',
    bio: '',
    image: '',
    specialties: ''
  });

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setIsLoading(true);
      const members = await getTeamMembers();
      setTeamMembers(members);
      setError('');
    } catch (err) {
      setError('Failed to load team members');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = await uploadImage(file, 'team');
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
      if (!formData.name || !formData.role || !formData.image) {
        setError('Please fill required fields (Name, Role, Image)');
        return;
      }

      if (editingId) {
        await updateTeamMember(editingId, {
          ...formData,
          specialties: formData.specialties.split(',').map(s => s.trim())
        });
        setSuccess('Team member updated successfully');
      } else {
        await addTeamMember({
          ...formData,
          specialties: formData.specialties.split(',').map(s => s.trim())
        });
        setSuccess('Team member added successfully');
      }

      setTimeout(() => setSuccess(''), 3000);
      setFormData({ name: '', role: '', experience: '', bio: '', image: '', specialties: '' });
      setIsAddingNew(false);
      setEditingId(null);
      await loadTeamMembers();
    } catch (err) {
      setError('Failed to save team member');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await deleteTeamMember(id);
      setSuccess('Team member deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadTeamMembers();
    } catch (err) {
      setError('Failed to delete team member');
      console.error(err);
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      role: member.role,
      experience: member.experience,
      bio: member.bio,
      image: member.image,
      specialties: member.specialties?.join(', ') || ''
    });
    setEditingId(member.id);
    setIsAddingNew(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Team Members</h1>
        <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Manage your salon's team members and staff
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
            <h2 className="card-title">Team Members List</h2>
          </div>
          <div className="card-content" style={{ maxHeight: '600px', overflowY: 'auto', padding: 0 }}>
            {isLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
              </div>
            ) : teamMembers.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-muted-foreground)' }}>
                No team members yet. Add one to get started!
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                <thead>
                  <tr>
                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem' }}>Name</th>
                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem' }}>Role</th>
                    <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem', width: '100px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map(member => (
                    <tr key={member.id}>
                      <td style={{ fontWeight: '500', padding: '1rem' }}>{member.name}</td>
                      <td style={{ padding: '1rem' }}>{member.role}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEdit(member)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-primary)' }}>
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(member.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header">
            <h2 className="card-title">{editingId ? 'Edit Member' : 'Add New Member'}</h2>
          </div>
          <div className="card-content">
            {!isAddingNew ? (
              <button onClick={() => setIsAddingNew(true)} className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={18} /> Add Team Member
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
                    placeholder="Enter member name"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Role *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Hair Stylist"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Experience</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 5 years"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Specialties</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    placeholder="e.g., Coloring, Cuts, Treatments"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Bio</label>
                  <textarea
                    className="input"
                    style={{ minHeight: '80px', resize: 'vertical' }}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Short bio about the member"
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
                    <img src={formData.image} alt="Preview" style={{ marginTop: '1rem', maxWidth: '100%', maxHeight: '150px', borderRadius: 'var(--admin-radius-sm)' }} />
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={handleSubmit} className="btn btn-primary" style={{ flex: 1 }}>
                    {editingId ? 'Update' : 'Add'}
                  </button>
                  <button type="button" onClick={() => { setIsAddingNew(false); setEditingId(null); setFormData({ name: '', role: '', experience: '', bio: '', image: '', specialties: '' }); }} className="btn btn-secondary" style={{ flex: 1 }}>
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

export default TeamContent;
