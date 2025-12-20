import { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { getBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost, uploadImage } from '../services/contentService';

const BlogContent = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    image: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      const data = await getBlogPosts();
      setBlogs(data);
      setError('');
    } catch (err) {
      setError('Failed to load blogs');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = await uploadImage(file, 'blogs');
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
      if (!formData.title || !formData.content || !formData.author || !formData.image) {
        setError('Please fill all required fields');
        return;
      }

      if (editingId) {
        await updateBlogPost(editingId, formData);
        setSuccess('Blog updated successfully');
      } else {
        await addBlogPost(formData);
        setSuccess('Blog added successfully');
      }

      setTimeout(() => setSuccess(''), 3000);
      setFormData({ title: '', content: '', author: '', image: '', date: new Date().toISOString().split('T')[0] });
      setIsAddingNew(false);
      setEditingId(null);
      await loadBlogs();
    } catch (err) {
      setError('Failed to save blog');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await deleteBlogPost(id);
      setSuccess('Blog deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadBlogs();
    } catch (err) {
      setError('Failed to delete blog');
      console.error(err);
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      image: blog.image,
      date: blog.date
    });
    setEditingId(blog.id);
    setIsAddingNew(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Blog Posts</h1>
        <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Manage salon blog posts and articles
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
            <h2 className="card-title">Blog Posts</h2>
          </div>
          <div className="card-content">
            {isLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
              </div>
            ) : blogs.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-muted-foreground)' }}>
                No blog posts yet. Add one to get started!
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {blogs.map(blog => (
                  <div key={blog.id} style={{ padding: '1rem', backgroundColor: 'var(--admin-secondary)', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border)' }}>
                    {blog.image && (
                      <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--admin-radius-sm)', marginBottom: '0.75rem' }} />
                    )}
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: 'var(--admin-foreground)', fontSize: '1rem' }}>{blog.title}</p>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--admin-muted-foreground)' }}>
                      By {blog.author} • {new Date(blog.date).toLocaleDateString()}
                    </p>
                    <p style={{ margin: '0.5rem 0 0.75rem 0', fontSize: '0.875rem', color: 'var(--admin-foreground)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {blog.content}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(blog)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-primary)', flex: 1 }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(blog.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', flex: 1 }}>
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
            <h2 className="card-title">{editingId ? 'Edit' : 'Add'} Blog</h2>
          </div>
          <div className="card-content">
            {!isAddingNew ? (
              <button onClick={() => setIsAddingNew(true)} className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={18} /> Add Blog Post
              </button>
            ) : (
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Title *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Blog post title"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Author *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Date</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-muted-foreground)' }}>Content *</label>
                  <textarea
                    className="input"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Blog post content"
                    style={{ minHeight: '120px', resize: 'vertical' }}
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
                    <img src={formData.image} alt="Preview" style={{ marginTop: '1rem', maxWidth: '100%', maxHeight: '150px', borderRadius: 'var(--admin-radius-sm)', objectFit: 'cover' }} />
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={handleSubmit} className="btn btn-primary" style={{ flex: 1 }}>
                    {editingId ? 'Update' : 'Add'}
                  </button>
                  <button type="button" onClick={() => { setIsAddingNew(false); setEditingId(null); setFormData({ title: '', content: '', author: '', image: '', date: new Date().toISOString().split('T')[0] }); }} className="btn btn-secondary" style={{ flex: 1 }}>
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

export default BlogContent;
