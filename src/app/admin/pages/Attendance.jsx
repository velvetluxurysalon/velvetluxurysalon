import { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle,
  LogIn,
  LogOut,
  Calendar,
  Trash2,
  Edit2,
  Download,
  Users,
  TrendingUp,
  AlertCircle,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Eye,
  Save
} from 'lucide-react';
import {
  getStaff,
  punchInStaff,
  punchOutStaff,
  getStaffAttendance,
  calculateStaffCommission,
  convertTimestampToDate,
  getTodayPunchStatus,
  deleteAttendanceRecord,
  updateAttendanceRecord,
  getAttendanceStats,
  getAllStaffAttendanceStats,
  markAttendanceManual,
  bulkMarkAttendance,
  getMonthlyAttendanceReport
} from '../utils/firebaseUtils';

const Attendance = () => {
  // ============== STATE MANAGEMENT ==============
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [allStaffStats, setAllStaffStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [monthYear, setMonthYear] = useState(new Date().toISOString().slice(0, 7));
  const [commission, setCommission] = useState(null);
  const [todayPunchStatus, setTodayPunchStatus] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [viewMode, setViewMode] = useState('individual'); // 'individual', 'overview', 'calendar', 'report'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'present', 'absent'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showManualMarkModal, setShowManualMarkModal] = useState(false);
  const [manualMarkData, setManualMarkData] = useState({
    punchInTime: '09:00',
    punchOutTime: '17:00',
    status: 'present'
  });
  const [editingRecord, setEditingRecord] = useState(null);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedStaffForBulk, setSelectedStaffForBulk] = useState([]);

  // ============== EFFECTS ==============
  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (selectedStaff) {
      handleSelectStaff(selectedStaff);
    }
  }, [monthYear]);

  // ============== FETCH FUNCTIONS ==============
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await getStaff(false);
      setStaff(data);
      if (data.length > 0) {
        setSelectedStaff(data[0]);
        await loadStaffData(data[0]);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const loadStaffData = async (staffMember) => {
    try {
      setLoading(true);
      const records = await getStaffAttendance(staffMember.name, monthYear);
      setAttendanceRecords(records);

      const status = await getTodayPunchStatus(staffMember.id, staffMember.name);
      setTodayPunchStatus(status);

      const comm = await calculateStaffCommission(staffMember.id, monthYear);
      setCommission(comm);

      const stats = await getAttendanceStats(staffMember.name, monthYear);
      setAttendanceStats(stats);

      setError('');
    } catch (err) {
      console.error('Error loading staff data:', err);
      setError('Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStaff = async (staffMember) => {
    setSelectedStaff(staffMember);
    await loadStaffData(staffMember);
  };

  const loadOverviewStats = async () => {
    try {
      setLoading(true);
      const stats = await getAllStaffAttendanceStats(staff, monthYear);
      setAllStaffStats(stats);
      setError('');
    } catch (err) {
      console.error('Error loading overview:', err);
      setError('Failed to load overview data');
    } finally {
      setLoading(false);
    }
  };

  // ============== PUNCH ACTIONS ==============
  const handlePunchIn = async () => {
    if (!selectedStaff) return;
    try {
      setLoading(true);
      await punchInStaff(selectedStaff.id, selectedStaff.name);
      await new Promise(resolve => setTimeout(resolve, 500));

      const today = new Date();
      const monthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      const records = await getStaffAttendance(selectedStaff.name, monthString);
      setAttendanceRecords(records);

      const status = await getTodayPunchStatus(selectedStaff.id, selectedStaff.name);
      setTodayPunchStatus(status);

      setSuccess('✓ Punched in successfully!');
      setTimeout(() => setSuccess(''), 3000);
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
      await new Promise(resolve => setTimeout(resolve, 500));

      const today = new Date();
      const monthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      const records = await getStaffAttendance(selectedStaff.name, monthString);
      setAttendanceRecords(records);

      const status = await getTodayPunchStatus(selectedStaff.id, selectedStaff.name);
      setTodayPunchStatus(status);

      setSuccess('✓ Punched out successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error punching out:', err);
      setError(err.message || 'Failed to punch out');
    } finally {
      setLoading(false);
    }
  };

  // ============== MANUAL ATTENDANCE ==============
  const handleMarkManual = async () => {
    if (!selectedStaff) return;
    try {
      setLoading(true);
      const today = new Date(selectedDate);
      const punchInTime = new Date(selectedDate + 'T' + manualMarkData.punchInTime);
      const punchOutTime = new Date(selectedDate + 'T' + manualMarkData.punchOutTime);

      await markAttendanceManual(
        selectedStaff.id,
        selectedStaff.name,
        today,
        punchInTime,
        punchOutTime,
        manualMarkData.status
      );

      await new Promise(resolve => setTimeout(resolve, 500));
      const records = await getStaffAttendance(selectedStaff.name, monthYear);
      setAttendanceRecords(records);

      const stats = await getAttendanceStats(selectedStaff.name, monthYear);
      setAttendanceStats(stats);

      setShowManualMarkModal(false);
      setSuccess('✓ Attendance marked manually!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error marking attendance:', err);
      setError('Failed to mark attendance: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkMark = async () => {
    if (selectedStaffForBulk.length === 0) {
      setError('Please select staff members');
      return;
    }
    try {
      setLoading(true);
      const staffToMark = staff.filter(s => selectedStaffForBulk.includes(s.id));
      await bulkMarkAttendance(staffToMark, selectedDate, 'present');

      setSuccess(`✓ Marked ${staffToMark.length} staff members as present!`);
      setTimeout(() => setSuccess(''), 3000);
      setSelectedStaffForBulk([]);
      setBulkSelectMode(false);

      if (selectedStaff) {
        const records = await getStaffAttendance(selectedStaff.name, monthYear);
        setAttendanceRecords(records);
      }
    } catch (err) {
      console.error('Error in bulk marking:', err);
      setError('Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  // ============== RECORD MANAGEMENT ==============
  const handleDeleteRecord = async (recordId, record) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) return;
    try {
      setLoading(true);
      const dateStr = record.dateStr || recordId;
      await deleteAttendanceRecord(selectedStaff.name, dateStr);
      await new Promise(resolve => setTimeout(resolve, 500));

      if (selectedStaff) {
        const today = new Date();
        const monthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        const refreshedRecords = await getStaffAttendance(selectedStaff.name, monthString);
        setAttendanceRecords(refreshedRecords);

        const updatedStatus = await getTodayPunchStatus(selectedStaff.id, selectedStaff.name);
        setTodayPunchStatus(updatedStatus);
      }

      setSuccess('✓ Record deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting record:', err);
      setError('Failed to delete record: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecord = async (record, field, newValue) => {
    try {
      setLoading(true);
      const dateStr = record.dateStr || record.id;
      await updateAttendanceRecord(selectedStaff.name, dateStr, { [field]: newValue });

      const updated = attendanceRecords.map(r =>
        r.id === record.id ? { ...r, [field]: newValue } : r
      );
      setAttendanceRecords(updated);
      setEditingRecord(null);
      setSuccess('✓ Record updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating record:', err);
      setError('Failed to update record');
    } finally {
      setLoading(false);
    }
  };

  // ============== EXPORT FUNCTIONS ==============
  const exportToCSV = async () => {
    try {
      const report = await getMonthlyAttendanceReport(selectedStaff.name, monthYear);
      const csvContent = [
        ['Date', 'Day', 'Punch In', 'Punch Out', 'Work Hours', 'Status'],
        ...report.map(r => [r.date, r.dayName, r.punchInTime, r.punchOutTime, r.workHours, r.status])
      ]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedStaff.name}_attendance_${monthYear}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess('✓ Report exported!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error exporting:', err);
      setError('Failed to export report');
    }
  };

  // ============== FILTERING ==============
  const filteredRecords = attendanceRecords.filter(record => {
    if (filterStatus !== 'all' && record.status !== filterStatus) return false;
    return true;
  });

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============== CALENDAR FUNCTIONS ==============
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const [year, month] = monthYear.split('-').map(Number);
    const daysInMonth = getDaysInMonth(year, month - 1);
    const firstDay = getFirstDayOfMonth(year, month - 1);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  };

  const getDateStatus = (day) => {
    if (!day) return null;
    const dateStr = `${monthYear}-${String(day).padStart(2, '0')}`;
    const record = attendanceRecords.find(r => r.dateStr === dateStr);
    return record;
  };

  // ============== RENDER COMPONENTS ==============

  const renderStaffList = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Users size={20} />
          Staff Members
        </h2>
      </div>
      <div className="card-content">
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search staff..."
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredStaff.map(member => (
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
                borderRadius: 'var(--radius-sm)',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{member.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                  {member.position}
                </div>
              </div>
              {member.isActive && (
                <div style={{
                  fontSize: '0.75rem',
                  background: 'var(--success)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px'
                }}>
                  Active
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPunchCard = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Clock size={20} />
          Punch Controls
        </h2>
      </div>
      <div className="card-content">
        {todayPunchStatus && (
          <div style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: todayPunchStatus.hasPunchedIn
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${todayPunchStatus.hasPunchedIn
              ? 'rgba(16, 185, 129, 0.2)'
              : 'rgba(239, 68, 68, 0.2)'}`,
            borderRadius: 'var(--radius)',
            color: todayPunchStatus.hasPunchedIn ? '#10b981' : '#ef4444'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
              {todayPunchStatus.hasPunchedIn ? '✓ Punched In' : '✗ Not Punched In'}
            </div>
            {todayPunchStatus.hasPunchedOut && (
              <div style={{ fontSize: '0.875rem' }}>Status: Punched Out at {
                attendanceRecords[0]?.punchOutTime
                  ? convertTimestampToDate(attendanceRecords[0].punchOutTime)?.toLocaleTimeString()
                  : 'N/A'
              }</div>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <button
            onClick={handlePunchIn}
            className="btn btn-success"
            disabled={loading || (todayPunchStatus?.hasPunchedIn && !todayPunchStatus?.hasPunchedOut)}
            style={{ opacity: loading || (todayPunchStatus?.hasPunchedIn && !todayPunchStatus?.hasPunchedOut) ? 0.5 : 1 }}
          >
            <LogIn size={16} />
            Punch In
          </button>
          <button
            onClick={handlePunchOut}
            className="btn btn-danger"
            disabled={loading || !todayPunchStatus?.hasPunchedIn || todayPunchStatus?.hasPunchedOut}
            style={{ opacity: loading || !todayPunchStatus?.hasPunchedIn || todayPunchStatus?.hasPunchedOut ? 0.5 : 1 }}
          >
            <LogOut size={16} />
            Punch Out
          </button>
        </div>

        <button
          onClick={() => setShowManualMarkModal(true)}
          className="btn btn-secondary"
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          <Edit2 size={16} />
          Mark Manually
        </button>

        <button
          onClick={() => setBulkSelectMode(!bulkSelectMode)}
          className="btn btn-ghost"
          style={{ width: '100%' }}
        >
          <Users size={16} />
          Bulk Mark Attendance
        </button>
      </div>
    </div>
  );

  const renderStatsCard = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <BarChart3 size={20} />
          Statistics
        </h2>
      </div>
      <div className="card-content">
        {attendanceStats ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              background: 'var(--secondary)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                Attendance %
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                {attendanceStats.attendancePercentage}%
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'var(--secondary)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                Present Days
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                {attendanceStats.totalPresent}/{attendanceStats.totalDaysInMonth}
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'var(--secondary)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                Total Work Hours
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                {attendanceStats.totalWorkHours}h
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'var(--secondary)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                Avg per Day
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                {attendanceStats.averageWorkHoursPerDay}h
              </div>
            </div>

            {attendanceStats.lateArrivals > 0 && (
              <div style={{
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-sm)',
                color: '#ef4444'
              }}>
                <AlertCircle size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                Late Arrivals: {attendanceStats.lateArrivals}
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: 'var(--muted-foreground)' }}>No data available</p>
        )}
      </div>
    </div>
  );

  const renderCommissionCard = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <TrendingUp size={20} />
          Commission
        </h2>
      </div>
      <div className="card-content">
        <div style={{ marginBottom: '1rem' }}>
          <label className="label">Select Month</label>
          <input
            type="month"
            className="input"
            value={monthYear}
            onChange={(e) => setMonthYear(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {commission && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(232, 197, 71, 0.1) 0%, rgba(201, 162, 39, 0.05) 100%)',
              border: '1px solid rgba(201, 162, 39, 0.2)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                Monthly Commission (10%)
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                ₹{commission.totalCommission?.toFixed(2) || '0.00'}
              </div>
            </div>

            <div style={{
              padding: '0.75rem',
              background: 'var(--secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem'
            }}>
              <div>Total Service Amount: ₹{commission.totalServiceAmount?.toFixed(2) || '0.00'}</div>
              <div style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
                {commission.invoiceCount} invoices
              </div>
              <div style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                Paid Amount: ₹{commission.paidAmount?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAttendanceRecords = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Calendar size={20} />
          Attendance Records
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            className="input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ fontSize: '0.875rem', padding: '0.5rem' }}
          >
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
          <button onClick={exportToCSV} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
      <div className="card-content">
        {filteredRecords.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Punch In</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Punch Out</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Hours</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} style={{
                    borderBottom: '1px solid var(--border)',
                    background: record.status === 'absent' ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                  }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                      {new Date(record.dateStr).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {record.punchInTime
                        ? convertTimestampToDate(record.punchInTime)?.toLocaleTimeString()
                        : '-'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {record.punchOutTime
                        ? convertTimestampToDate(record.punchOutTime)?.toLocaleTimeString()
                        : '-'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {editingRecord?.id === record.id ? (
                        <input
                          type="number"
                          value={editingRecord.value}
                          onChange={(e) => setEditingRecord({
                            ...editingRecord,
                            value: parseFloat(e.target.value)
                          })}
                          style={{ width: '60px', padding: '0.25rem' }}
                          step="0.1"
                        />
                      ) : (
                        record.workHours
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        background: record.status === 'present' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: record.status === 'present' ? '#10b981' : '#ef4444',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {record.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                        {editingRecord?.id === record.id ? (
                          <>
                            <button
                              onClick={() => handleUpdateRecord(record, 'workHours', editingRecord.value)}
                              className="btn btn-ghost"
                              disabled={loading}
                              style={{ padding: '0.25rem 0.5rem' }}
                            >
                              <Save size={14} />
                            </button>
                            <button
                              onClick={() => setEditingRecord(null)}
                              className="btn btn-ghost"
                              style={{ padding: '0.25rem 0.5rem' }}
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingRecord({ id: record.id, value: record.workHours })}
                              className="btn btn-ghost"
                              disabled={loading}
                              style={{ padding: '0.25rem 0.5rem' }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(record.id, record)}
                              className="btn btn-ghost"
                              disabled={loading}
                              style={{ padding: '0.25rem 0.5rem' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', padding: '2rem' }}>
            No attendance records found
          </p>
        )}
      </div>
    </div>
  );

  const renderCalendarView = () => {
    const weeks = renderCalendar();
    const [year, month] = monthYear.split('-').map(Number);

    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Calendar size={20} />
            Attendance Calendar
          </h2>
        </div>
        <div className="card-content">
          <div style={{ marginBottom: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '1.125rem' }}>
            {new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{
                padding: '0.5rem',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.875rem',
                background: 'var(--secondary)',
                borderRadius: 'var(--radius-sm)'
              }}>
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
            {weeks.map((week, weekIdx) =>
              week.map((day, dayIdx) => {
                const record = day ? getDateStatus(day) : null;
                return (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      background: record
                        ? record.status === 'present'
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(239, 68, 68, 0.2)'
                        : day ? 'var(--secondary)' : 'transparent',
                      border: record
                        ? record.status === 'present'
                          ? '2px solid #10b981'
                          : '2px solid #ef4444'
                        : '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      minHeight: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title={record ? `${record.status} - ${record.workHours}h` : ''}
                  >
                    {day && (
                      <div>
                        <div>{day}</div>
                        {record && <div style={{ fontSize: '0.75rem' }}>{record.workHours}h</div>}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewTable = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Users size={20} />
          All Staff Attendance Overview
        </h2>
        <button onClick={loadOverviewStats} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          Refresh
        </button>
      </div>
      <div className="card-content">
        {allStaffStats.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Present</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Attendance %</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Total Hours</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Avg/Day</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Late</th>
                </tr>
              </thead>
              <tbody>
                {allStaffStats.map((stat) => (
                  <tr key={stat.staffName} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{stat.staffName}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      {stat.totalPresent}/{stat.totalDaysInMonth}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span style={{
                        background: 'var(--secondary)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px'
                      }}>
                        {stat.attendancePercentage}%
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      {stat.totalWorkHours}h
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      {stat.averageWorkHoursPerDay}h
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span style={{
                        color: stat.lateArrivals > 0 ? '#ef4444' : '#10b981',
                        fontWeight: 600
                      }}>
                        {stat.lateArrivals}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted-foreground)', textAlign: 'center' }}>
            No data available. Click Refresh to load data.
          </p>
        )}
      </div>
    </div>
  );

  const renderBulkMarkModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: bulkSelectMode ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--background)',
        borderRadius: 'var(--radius)',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Bulk Mark Attendance</div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="label">Date</label>
          <input
            type="date"
            className="input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="label">Select Staff</label>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.5rem' }}>
            {staff.map(member => (
              <label key={member.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={selectedStaffForBulk.includes(member.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStaffForBulk([...selectedStaffForBulk, member.id]);
                    } else {
                      setSelectedStaffForBulk(selectedStaffForBulk.filter(id => id !== member.id));
                    }
                  }}
                  style={{ marginRight: '0.5rem', cursor: 'pointer' }}
                />
                <span>{member.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            onClick={handleBulkMark}
            className="btn btn-success"
            disabled={loading || selectedStaffForBulk.length === 0}
          >
            Mark Present
          </button>
          <button
            onClick={() => setBulkSelectMode(false)}
            className="btn btn-ghost"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderManualMarkModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: showManualMarkModal ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--background)',
        borderRadius: 'var(--radius)',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%'
      }}>
        <div style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Mark Attendance Manually</div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="label">Date</label>
          <input
            type="date"
            className="input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="label">Punch In Time</label>
          <input
            type="time"
            className="input"
            value={manualMarkData.punchInTime}
            onChange={(e) => setManualMarkData({
              ...manualMarkData,
              punchInTime: e.target.value
            })}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="label">Punch Out Time</label>
          <input
            type="time"
            className="input"
            value={manualMarkData.punchOutTime}
            onChange={(e) => setManualMarkData({
              ...manualMarkData,
              punchOutTime: e.target.value
            })}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label className="label">Status</label>
          <select
            className="input"
            value={manualMarkData.status}
            onChange={(e) => setManualMarkData({
              ...manualMarkData,
              status: e.target.value
            })}
            style={{ width: '100%' }}
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            onClick={handleMarkManual}
            className="btn btn-success"
            disabled={loading}
          >
            Mark
          </button>
          <button
            onClick={() => setShowManualMarkModal(false)}
            className="btn btn-ghost"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // ============== MAIN RENDER ==============
  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('individual')}
            className="btn"
            style={{
              background: viewMode === 'individual' ? 'var(--primary)' : 'var(--secondary)',
              color: viewMode === 'individual' ? 'white' : 'inherit'
            }}
          >
            Individual
          </button>
          <button
            onClick={() => { setViewMode('overview'); loadOverviewStats(); }}
            className="btn"
            style={{
              background: viewMode === 'overview' ? 'var(--primary)' : 'var(--secondary)',
              color: viewMode === 'overview' ? 'white' : 'inherit'
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className="btn"
            style={{
              background: viewMode === 'calendar' ? 'var(--primary)' : 'var(--secondary)',
              color: viewMode === 'calendar' ? 'white' : 'inherit'
            }}
          >
            Calendar
          </button>
      </div>

      {viewMode === 'individual' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
          {renderStaffList()}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {selectedStaff && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {renderPunchCard()}
                  {renderStatsCard()}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {renderCommissionCard()}
                </div>
                {renderAttendanceRecords()}
              </>
            )}
          </div>
        </div>
      )}

      {viewMode === 'overview' && renderOverviewTable()}

      {viewMode === 'calendar' && (
        selectedStaff && renderCalendarView()
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
          <AlertCircle size={18} style={{ marginRight: '0.5rem', display: 'inline' }} />
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ marginTop: '1rem' }}>
          {success}
        </div>
      )}

      {renderManualMarkModal()}
      {renderBulkMarkModal()}

      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            background: 'var(--background)',
            padding: '2rem',
            borderRadius: 'var(--radius)',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '1rem' }}>Loading...</div>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--secondary)',
              borderTop: '3px solid var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Attendance;
