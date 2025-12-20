import { useState, useEffect } from 'react';
import { Clock, CheckCircle, LogIn, LogOut, Calendar, Trash2, Edit2 } from 'lucide-react';
import { getStaff, punchInStaff, punchOutStaff, getStaffAttendance, calculateStaffCommission, convertTimestampToDate, getTodayPunchStatus, deleteAttendanceRecord, updateAttendanceRecord } from '../utils/firebaseUtils';

const Attendance = () => {
    const [staff, setStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [monthYear, setMonthYear] = useState(new Date().toISOString().slice(0, 7));
    const [commission, setCommission] = useState(null);
    const [todayPunchStatus, setTodayPunchStatus] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [editTime, setEditTime] = useState('');

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const data = await getStaff(false);
            setStaff(data);
            setError('');
        } catch (err) {
            console.error('Error fetching staff:', err);
            setError('Failed to load staff');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectStaff = async (staffMember) => {
        try {
            setSelectedStaff(staffMember);
            setLoading(true);

            // Fetch today's attendance records
            const today = new Date();
            const monthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
            
            const records = await getStaffAttendance(staffMember.name, monthString);
            setAttendanceRecords(records);

            // Check today's punch status
            const status = await getTodayPunchStatus(staffMember.id, staffMember.name);
            setTodayPunchStatus(status);

            // Fetch commission for the selected month
            const comm = await calculateStaffCommission(staffMember.id, monthYear);
            setCommission(comm);

            setError('');
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setError('Failed to load attendance data');
        } finally {
            setLoading(false);
        }
    };

    const handlePunchIn = async () => {
        if (!selectedStaff) return;
        try {
            setLoading(true);
            const dateStr = await punchInStaff(selectedStaff.id, selectedStaff.name);
            console.log('Successfully punched in on date:', dateStr);
            
            // Wait for Firestore to sync before refreshing
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Refresh attendance records for current month
            const today = new Date();
            const monthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
            const records = await getStaffAttendance(selectedStaff.name, monthString);
            setAttendanceRecords(records);
            
            // Refresh punch status
            const status = await getTodayPunchStatus(selectedStaff.id, selectedStaff.name);
            setTodayPunchStatus(status);
            
            setError('Punched in successfully!');
        } catch (err) {
            console.error('Error punching in:', err);
            setError(err.message || 'Failed to punch in');
        } finally {
            setLoading(false);
        }
    };

    const handlePunchOut = async () => {
        if (!selectedStaff) return;
        try {
            setLoading(true);
            await punchOutStaff(selectedStaff.id, selectedStaff.name);
            
            // Refresh attendance records for current month
            const today = new Date();
            const monthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
            const records = await getStaffAttendance(selectedStaff.name, monthString);
            setAttendanceRecords(records);
            
            // Refresh punch status
            const status = await getTodayPunchStatus(selectedStaff.id, selectedStaff.name);
            setTodayPunchStatus(status);
            
            setError('Punched out successfully!');
        } catch (err) {
            console.error('Error punching out:', err);
            setError(err.message || 'Failed to punch out');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRecord = async (recordId, record) => {
        if (!window.confirm('Are you sure you want to delete this attendance record?')) return;
        try {
            setLoading(true);
            const dateStr = record.dateStr || recordId;
            await deleteAttendanceRecord(selectedStaff.name, dateStr);
            
            // Wait for Firestore to sync
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Refresh all attendance records to ensure sync with Firestore
            if (selectedStaff) {
                const today = new Date();
                const monthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
                
                // Force refresh by fetching fresh data
                const refreshedRecords = await getStaffAttendance(selectedStaff.name, monthString);
                setAttendanceRecords(refreshedRecords);
                
                // Refresh punch status to allow punch in again
                const updatedStatus = await getTodayPunchStatus(selectedStaff.id, selectedStaff.name);
                setTodayPunchStatus(updatedStatus);
                
                // Verify the deletion worked
                console.log('Record deleted successfully for', selectedStaff.name, 'on', dateStr);
            }
            
            setError('Record deleted successfully. You can now punch in again.');
        } catch (err) {
            console.error('Error deleting record:', err);
            setError('Failed to delete record: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditRecord = async (record, field, newValue) => {
        try {
            setLoading(true);
            const dateStr = record.dateStr || record.id;
            await updateAttendanceRecord(selectedStaff.name, dateStr, { [field]: newValue });
            const updated = attendanceRecords.map(r => r.id === record.id ? { ...r, [field]: newValue } : r);
            setAttendanceRecords(updated);
            setEditingRecord(null);
            setEditTime('');
            setError('');
        } catch (err) {
            console.error('Error updating record:', err);
            setError('Failed to update record');
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = async (e) => {
        const newMonth = e.target.value;
        setMonthYear(newMonth);
        if (selectedStaff) {
            try {
                setLoading(true);
                const records = await getStaffAttendance(selectedStaff.name, newMonth);
                setAttendanceRecords(records);
                
                const comm = await calculateStaffCommission(selectedStaff.id, newMonth, selectedStaff.name);
                setCommission(comm);
                setError('');
            } catch (err) {
                console.error('Error fetching month data:', err);
                setError('Failed to load data for selected month');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Staff Attendance</h1>
                    <p className="page-subtitle">Track attendance and view commissions</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Staff Selection */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <Clock size={20} />
                            Select Staff Member
                        </h2>
                    </div>
                    <div className="card-content">
                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {staff.map(member => (
                                <button
                                    key={member.id}
                                    onClick={() => handleSelectStaff(member)}
                                    className="btn btn-ghost"
                                    style={{
                                        width: '100%',
                                        justifyContent: 'flex-start',
                                        padding: '0.75rem',
                                        marginBottom: '0.5rem',
                                        background: selectedStaff?.id === member.id ? 'var(--secondary)' : 'transparent',
                                        borderRadius: 'var(--radius-sm)'
                                    }}
                                >
                                    <div style={{ textAlign: 'left', flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{member.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                            {member.position}
                                        </div>
                                    </div>
                                    {member.isActive && (
                                        <div style={{ fontSize: '0.75rem', background: 'var(--success)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                                            Active
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Attendance Details */}
                {selectedStaff && (
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                <Calendar size={20} />
                                {selectedStaff.name}
                            </h2>
                        </div>
                        <div className="card-content">
                            {/* Today's Punch Status Alert */}
                            {todayPunchStatus && (
                                <div style={{ marginBottom: '1rem', padding: '1rem', background: todayPunchStatus.hasPunchedIn ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${todayPunchStatus.hasPunchedIn ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`, borderRadius: 'var(--radius)', color: todayPunchStatus.hasPunchedIn ? '#10b981' : '#ef4444' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                                        {todayPunchStatus.hasPunchedIn ? '✓ Punched In' : '✗ Not Punched In Today'}
                                    </div>
                                    {todayPunchStatus.hasPunchedOut && (
                                        <div style={{ fontSize: '0.875rem' }}>Status: Punched Out</div>
                                    )}
                                </div>
                            )}

                            {/* Punch Buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <button
                                    onClick={handlePunchIn}
                                    className="btn btn-success"
                                    disabled={loading || (todayPunchStatus?.hasPunchedIn && !todayPunchStatus?.hasPunchedOut)}
                                >
                                    <LogIn size={16} />
                                    Punch In
                                </button>
                                <button
                                    onClick={handlePunchOut}
                                    className="btn btn-danger"
                                    disabled={loading || !todayPunchStatus?.hasPunchedIn || todayPunchStatus?.hasPunchedOut}
                                >
                                    <LogOut size={16} />
                                    Punch Out
                                </button>
                            </div>

                            {/* Commission Section */}
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'linear-gradient(135deg, rgba(232, 197, 71, 0.1) 0%, rgba(201, 162, 39, 0.05) 100%)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
                                <label className="label" style={{ marginBottom: '0.75rem' }}>Month & Commission</label>
                                <input
                                    type="month"
                                    className="input"
                                    value={monthYear}
                                    onChange={handleMonthChange}
                                    style={{ marginBottom: '0.75rem' }}
                                />
                                {commission && (
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Monthly Commission</div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>₹{commission.totalCommission?.toFixed(2) || '0.00'}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
                                            Based on {commission.totalServiceAmount?.toFixed(2) || '0.00'} in services
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Today's Status */}
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--secondary)', borderRadius: 'var(--radius-sm)' }}>
                                {attendanceRecords.length > 0 && attendanceRecords[0] ? (
                                    <div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Today's Status</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Punch In</div>
                                                <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                                                    {attendanceRecords[0].punchInTime ? 
                                                        convertTimestampToDate(attendanceRecords[0].punchInTime)?.toLocaleTimeString() 
                                                        : 'Not punched in'
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Punch Out</div>
                                                <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                                                    {attendanceRecords[0].punchOutTime ?
                                                        convertTimestampToDate(attendanceRecords[0].punchOutTime)?.toLocaleTimeString()
                                                        : 'Not punched out'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--muted-foreground)' }}>No attendance records yet</p>
                                )}
                            </div>

                            {/* Attendance History */}
                            <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Attendance</div>
                                {attendanceRecords.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {attendanceRecords.slice(0, 10).map((record) => (
                                            <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {convertTimestampToDate(record.date)?.toLocaleDateString() || 'Invalid date'}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                                        {record.workHours} hours ({record.punchInTime ? convertTimestampToDate(record.punchInTime)?.toLocaleTimeString() : '-'} - {record.punchOutTime ? convertTimestampToDate(record.punchOutTime)?.toLocaleTimeString() : '-'})
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => handleDeleteRecord(record.id, record)}
                                                        className="btn btn-ghost"
                                                        disabled={loading}
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--muted-foreground)', textAlign: 'center' }}>No attendance records</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default Attendance;
