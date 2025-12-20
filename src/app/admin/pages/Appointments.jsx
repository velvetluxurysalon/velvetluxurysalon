import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, MapPin, Edit, Trash2, CheckCircle, XCircle, Eye, X, Mail } from 'lucide-react';
import { getAppointments, getServices, getStaff, createAppointment, updateAppointmentStatus, cancelAppointment, getAvailableTimeSlots } from '../utils/firebaseUtils';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        serviceId: '',
        staffId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [appts, servs, stf] = await Promise.all([
                getAppointments(),
                getServices(false),
                getStaff(false)
            ]);

            // Enrich appointments with service and staff details
            const enrichedAppts = appts.map(apt => ({
                ...apt,
                service: servs.find(s => s.id === apt.serviceId),
                staff: stf.find(s => s.id === (apt.stylistId || apt.staffId))
            }));

            setAppointments(enrichedAppts);
            setServices(servs);
            setStaff(stf);
            setError('');
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = async (e) => {
        const date = e.target.value;
        setFormData({ ...formData, appointmentDate: date, appointmentTime: '' });

        if (date && formData.staffId) {
            try {
                const slots = await getAvailableTimeSlots(formData.staffId, date);
                setAvailableSlots(slots);
            } catch (err) {
                console.error('Error fetching available slots:', err);
                setAvailableSlots([]);
            }
        }
    };

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        const selectedService = services.find(s => s.id === serviceId);
        
        // Filter staff by service category
        const filteredStaff = selectedService 
            ? staff.filter(s => s.role === selectedService.category)
            : staff;
        
        setFormData({ 
            ...formData, 
            serviceId, 
            staffId: '', 
            appointmentTime: '',
            availableStaff: filteredStaff 
        });
        setAvailableSlots([]);
    };

    const handleStaffChange = async (e) => {
        const staffId = e.target.value;
        setFormData({ ...formData, staffId, appointmentTime: '' });

        if (staffId && formData.appointmentDate) {
            try {
                const slots = await getAvailableTimeSlots(staffId, formData.appointmentDate);
                setAvailableSlots(slots);
            } catch (err) {
                console.error('Error fetching available slots:', err);
                setAvailableSlots([]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createAppointment({
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                serviceId: formData.serviceId,
                staffId: formData.staffId,
                appointmentDate: new Date(formData.appointmentDate),
                appointmentTime: formData.appointmentTime,
                notes: formData.notes
            });

            setFormData({
                customerName: '',
                customerPhone: '',
                serviceId: '',
                staffId: '',
                appointmentDate: '',
                appointmentTime: '',
                notes: ''
            });
            setShowForm(false);
            await fetchData();
        } catch (err) {
            console.error('Error creating appointment:', err);
            setError(err.message || 'Failed to create appointment');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            setLoading(true);
            await updateAppointmentStatus(appointmentId, newStatus);
            await fetchData();
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Failed to update appointment');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            setLoading(true);
            await cancelAppointment(appointmentId);
            await fetchData();
        } catch (err) {
            console.error('Error cancelling appointment:', err);
            setError('Failed to cancel appointment');
        } finally {
            setLoading(false);
        }
    };

    const getServiceName = (serviceId) => {
        return services.find(s => s.id === serviceId)?.name || 'Unknown Service';
    };

    const getStaffName = (staffId) => {
        return staff.find(s => s.id === staffId)?.name || 'Unassigned';
    };

    const upcomingAppointments = appointments.filter(apt => {
        const date = apt.appointmentDate?.toDate ? apt.appointmentDate.toDate() : new Date(apt.appointmentDate);
        return date >= new Date() && apt.status !== 'cancelled';
    }).sort((a, b) => {
        const dateA = a.appointmentDate?.toDate ? a.appointmentDate.toDate() : new Date(a.appointmentDate);
        const dateB = b.appointmentDate?.toDate ? b.appointmentDate.toDate() : new Date(b.appointmentDate);
        return dateA - dateB;
    });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Appointments</h1>
                    <p className="page-subtitle">Manage salon appointments</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    <Calendar size={16} />
                    New Appointment
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div className="card-header">
                        <h2 className="card-title">Create Appointment</h2>
                    </div>
                    <div className="card-content">
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input
                                type="text"
                                className="input"
                                placeholder="Customer Name"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                required
                            />
                            <input
                                type="tel"
                                className="input"
                                placeholder="Customer Phone"
                                value={formData.customerPhone}
                                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                required
                            />
                            <select
                                className="input"
                                value={formData.serviceId}
                                onChange={handleServiceChange}
                                required
                            >
                                <option value="">Select Service</option>
                                {services.map(service => (
                                    <option key={service.id} value={service.id}>{service.name} - ₹{service.price}</option>
                                ))}
                            </select>
                            <select
                                className="input"
                                value={formData.staffId}
                                onChange={handleStaffChange}
                                required
                            >
                                <option value="">Select Staff Member</option>
                                {formData.serviceId 
                                    ? staff.filter(s => s.role === services.find(sv => sv.id === formData.serviceId)?.category).map(member => (
                                        <option key={member.id} value={member.id}>{member.name} ({member.role})</option>
                                    ))
                                    : staff.map(member => (
                                        <option key={member.id} value={member.id}>{member.name} ({member.role})</option>
                                    ))
                                }
                            </select>
                            <input
                                type="date"
                                className="input"
                                value={formData.appointmentDate}
                                onChange={handleDateChange}
                                required
                            />
                            <select
                                className="input"
                                value={formData.appointmentTime}
                                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                                disabled={!availableSlots.length}
                                required
                            >
                                <option value="">Select Time Slot</option>
                                {availableSlots.map(slot => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                            <textarea
                                className="input"
                                placeholder="Notes (optional)"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                style={{ gridColumn: '1 / -1' }}
                            />
                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    Create Appointment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Appointments List */}
            <div className="grid-cols-1">
                {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map(apt => (
                        <div key={apt.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                                        {getServiceName(apt.serviceId)}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)' }}>
                                            <User size={16} />
                                            <span>{apt.customerName}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)' }}>
                                            <Phone size={16} />
                                            <span>{apt.customerPhone}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)' }}>
                                            <Clock size={16} />
                                            <span>
                                                {apt.appointmentDate?.toDate ? apt.appointmentDate.toDate().toLocaleDateString() : new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)' }}>
                                            <User size={16} />
                                            <span>{getStaffName(apt.staffId || apt.stylistId)}</span>
                                        </div>
                                    </div>

                                    {apt.notes && (
                                        <div style={{ padding: '0.75rem', background: 'var(--secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Notes</div>
                                            <div style={{ fontSize: '0.875rem' }}>{apt.notes}</div>
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: apt.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : apt.status === 'completed' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(244, 114, 97, 0.1)',
                                            color: apt.status === 'confirmed' ? 'var(--success)' : apt.status === 'completed' ? 'var(--info)' : 'var(--danger)'
                                        }}>
                                            {apt.status?.charAt(0).toUpperCase() + apt.status?.slice(1) || 'Pending'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                                    <button
                                        onClick={() => setSelectedAppointment(apt)}
                                        className="btn btn-ghost"
                                        style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                                    >
                                        <Eye size={14} />
                                        View Details
                                    </button>
                                    {apt.status === 'pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                                            className="btn btn-success"
                                            style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                                            disabled={loading}
                                        >
                                            <CheckCircle size={14} />
                                            Confirm
                                        </button>
                                    )}
                                    {apt.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleStatusUpdate(apt.id, 'completed')}
                                            className="btn btn-primary"
                                            style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                                            disabled={loading}
                                        >
                                            <CheckCircle size={14} />
                                            Complete
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleCancel(apt.id)}
                                        className="btn btn-danger"
                                        style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                                        disabled={loading}
                                    >
                                        <XCircle size={14} />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <Calendar size={48} style={{ margin: '0 auto 1rem', color: 'var(--muted-foreground)' }} />
                        <p style={{ color: 'var(--muted-foreground)' }}>No upcoming appointments</p>
                    </div>
                )}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Detail Modal */}
            {selectedAppointment && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--background)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Appointment Details</h2>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {/* Customer Information */}
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Customer Name</div>
                                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{selectedAppointment.customerName}</div>

                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Phone</div>
                                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{selectedAppointment.customerPhone}</div>

                                {selectedAppointment.customerEmail && (
                                    <>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Email</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{selectedAppointment.customerEmail}</div>
                                    </>
                                )}
                            </div>

                            {/* Service Information */}
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Service</div>
                                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                    {selectedAppointment.service?.name || 'Unknown Service'}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                                    {selectedAppointment.service?.category && `Category: ${selectedAppointment.service.category}`}
                                </div>

                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Price</div>
                                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>₹{selectedAppointment.service?.price || 'N/A'}</div>
                            </div>

                            {/* Staff Information */}
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Staff Member</div>
                                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                    {selectedAppointment.staff?.name || 'Unassigned'}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                                    {selectedAppointment.staff?.role && `Role: ${selectedAppointment.staff.role}`}
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Date</div>
                                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    {selectedAppointment.appointmentDate?.toDate 
                                        ? selectedAppointment.appointmentDate.toDate().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                                        : new Date(selectedAppointment.appointmentDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                                    }
                                </div>

                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Time</div>
                                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{selectedAppointment.appointmentTime}</div>

                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Status</div>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: selectedAppointment.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : selectedAppointment.status === 'completed' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(244, 114, 97, 0.1)',
                                    color: selectedAppointment.status === 'confirmed' ? 'var(--success)' : selectedAppointment.status === 'completed' ? 'var(--info)' : 'var(--danger)',
                                    display: 'inline-block'
                                }}>
                                    {selectedAppointment.status?.charAt(0).toUpperCase() + selectedAppointment.status?.slice(1) || 'Pending'}
                                </span>
                            </div>
                        </div>

                        {/* Notes */}
                        {selectedAppointment.notes && (
                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--secondary)', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem', fontWeight: 600 }}>Notes</div>
                                <div style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{selectedAppointment.notes}</div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Created</div>
                                <div style={{ fontSize: '0.875rem' }}>
                                    {selectedAppointment.createdAt?.toDate
                                        ? selectedAppointment.createdAt.toDate().toLocaleString()
                                        : 'N/A'
                                    }
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Last Updated</div>
                                <div style={{ fontSize: '0.875rem' }}>
                                    {selectedAppointment.updatedAt?.toDate
                                        ? selectedAppointment.updatedAt.toDate().toLocaleString()
                                        : 'N/A'
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="btn btn-ghost"
                                style={{ flex: 1 }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments;
