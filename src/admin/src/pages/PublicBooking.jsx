import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import { getPublicServices, bookAppointmentPublic, getAvailableTimeSlots } from '../utils/firebaseUtils';

const PublicBooking = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        serviceId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await getPublicServices();
            setServices(data);
            setError('');
        } catch (err) {
            console.error('Error fetching services:', err);
            setError('Failed to load services. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = async (e) => {
        const date = e.target.value;
        setFormData({ ...formData, appointmentDate: date, appointmentTime: '' });

        if (date && formData.serviceId) {
            try {
                // Get any available staff for the service (using a default staff member)
                // In production, you might want to pass staff ID or get the first available staff
                const slots = await getAvailableTimeSlots('staff_any', date);
                setAvailableSlots(slots);
            } catch (err) {
                console.error('Error fetching slots:', err);
                setAvailableSlots([]);
            }
        }
    };

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        setFormData({ ...formData, serviceId, appointmentDate: '', appointmentTime: '' });
        setAvailableSlots([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            
            await bookAppointmentPublic({
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                serviceId: formData.serviceId,
                appointmentDate: new Date(formData.appointmentDate),
                appointmentTime: formData.appointmentTime,
                notes: formData.notes
            });

            setSuccess('Booking confirmed! We will contact you shortly at ' + formData.customerPhone);
            setSubmitted(true);
            setFormData({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                serviceId: '',
                appointmentDate: '',
                appointmentTime: '',
                notes: ''
            });

            // Reset form after 3 seconds
            setTimeout(() => {
                setSubmitted(false);
                setSuccess('');
            }, 5000);
        } catch (err) {
            console.error('Error booking appointment:', err);
            setError(err.message || 'Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(232, 197, 71, 0.1) 0%, rgba(201, 162, 39, 0.05) 100%)',
                padding: '1rem'
            }}>
                <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem' }}>
                    <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1.5rem' }} />
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Booking Confirmed!</h1>
                    <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                        Thank you for booking with us. We will contact you shortly to confirm your appointment details.
                    </p>
                    <div style={{
                        padding: '1rem',
                        background: 'var(--secondary)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1.5rem',
                        textAlign: 'left'
                    }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Contact Number</div>
                            <div style={{ fontWeight: 600 }}>{formData.customerPhone || 'Your provided number'}</div>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                        Check your email for confirmation details.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, rgba(232, 197, 71, 0.1) 0%, rgba(201, 162, 39, 0.05) 100%)',
            padding: '2rem 1rem'
        }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Book Your Appointment
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--muted-foreground)' }}>
                        Schedule your salon services online
                    </p>
                </div>

                {/* Booking Form */}
                <div className="card">
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {/* Personal Information */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>
                                Personal Information
                            </h2>
                        </div>

                        <div>
                            <label className="label">
                                <User size={16} />
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="input"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <Mail size={16} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="input"
                                value={formData.customerEmail}
                                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <Phone size={16} />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                className="input"
                                value={formData.customerPhone}
                                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                placeholder="9876543210"
                                required
                            />
                        </div>

                        {/* Service Selection */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>
                                Select Service
                            </h2>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="label">Service</label>
                            <select
                                className="input"
                                value={formData.serviceId}
                                onChange={handleServiceChange}
                                required
                            >
                                <option value="">Choose a service...</option>
                                {services.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.name} • ₹{service.price.toFixed(2)} • {service.duration} mins
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Appointment Date & Time */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>
                                Select Date & Time
                            </h2>
                        </div>

                        <div>
                            <label className="label">
                                <Calendar size={16} />
                                Appointment Date
                            </label>
                            <input
                                type="date"
                                className="input"
                                value={formData.appointmentDate}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                                disabled={!formData.serviceId}
                            />
                        </div>

                        <div>
                            <label className="label">
                                <Clock size={16} />
                                Appointment Time
                            </label>
                            <select
                                className="input"
                                value={formData.appointmentTime}
                                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                                disabled={!availableSlots.length || !formData.appointmentDate}
                                required
                            >
                                <option value="">Select time...</option>
                                {availableSlots.map(slot => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>

                        {/* Additional Notes */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>
                                Additional Information
                            </h2>
                        </div>

                        <textarea
                            className="input"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Any special requests or preferences? (Optional)"
                            style={{ gridColumn: '1 / -1', minHeight: '100px', resize: 'vertical' }}
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                gridColumn: '1 / -1',
                                padding: '1rem',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </form>
                </div>

                {/* Messages */}
                {error && (
                    <div className="alert alert-danger" style={{ marginTop: '1.5rem' }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
                        {success}
                    </div>
                )}

                {/* Info Section */}
                <div className="card" style={{ marginTop: '2rem' }}>
                    <div className="card-header">
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Booking Information</h3>
                    </div>
                    <div className="card-content">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>How it works</h4>
                                <ol style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', paddingLeft: '1.25rem', lineHeight: 1.8 }}>
                                    <li>Select your desired service</li>
                                    <li>Choose your preferred date and time</li>
                                    <li>Provide your contact details</li>
                                    <li>Confirm your booking</li>
                                </ol>
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Cancellation Policy</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.8 }}>
                                    You can cancel or reschedule your appointment up to 24 hours before your scheduled time. Please contact us at least 24 hours in advance for cancellations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicBooking;
