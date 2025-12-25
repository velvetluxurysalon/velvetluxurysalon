import { useState, useEffect } from 'react';
import { IndianRupee, Users, ShoppingBag, TrendingUp, Printer, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getDashboardStats } from '../utils/firebaseUtils';

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        dailySales: 0,
        monthlySales: 0,
        todayVisits: 0,
        totalInvoices: 0,
        topServices: [],
        topProducts: [],
        monthlyTrend: [],
        recentTransactions: []
    });

    useEffect(() => {
        fetchStats();
    }, [selectedDate]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data);
            setError('');
        } catch (error) {
            console.error('Error fetching stats:', error);
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        const reportData = {
            date: selectedDate.toLocaleDateString(),
            dailySales: stats.dailySales,
            monthlyRevenue: stats.monthlySales,
            dailyOrders: stats.dailyOrders,
            monthlyOrders: stats.monthlyOrders,
            topProducts: stats.topProducts.map(p => `${p.name} (${p.value})`).join('; '),
            recentTransactions: stats.recentTransactions.map(b => `ID: ${b.id}, Amount: ${b.amount}`).join('; ')
        };

        const csvContent = "data:text/csv;charset=utf-8,"
            + Object.keys(reportData).join(",") + "\n"
            + Object.values(reportData).join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        // Fix: Use local date for filename too
        const offset = selectedDate.getTimezoneOffset();
        const localDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
        const dateStr = localDate.toISOString().split('T')[0];
        link.setAttribute("download", `salon_report_${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const StatCard = ({ title, value, icon: Icon, trend }) => (
        <div className="card">
            <div className="card-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</p>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--foreground)' }}>{value}</h3>
                    {/* Trend label removed as requested */}
                </div>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                }}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );

    const COLORS = ['#d4af37', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

    const [selectedBill, setSelectedBill] = useState(null);

    const handleBillClick = async (visitId) => {
        try {
            const res = await fetch(`/api/visits/${visitId}`);
            const data = await res.json();
            setSelectedBill(data);
        } catch (error) {
            console.error('Error fetching bill details:', error);
        }
    };

    const handleDownloadReceipt = (visit) => {
        const receiptWindow = window.open('', '', 'width=800,height=600');
        receiptWindow.document.write(`
            <html>
            <head>
                <title>Receipt - Velvet Luxury Salon</title>
                <style>
                    body { font-family: 'Courier New', monospace; padding: 20px; max-width: 400px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                    .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                    .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>VELVET LUXURY SALON</h2>
                    <p>Kalingarayanpalayam, Bhavani, Erode District, Tamil Nadu - 638301</p>
                    <p>Contact: 9667722611</p>
                    <p>Date: ${new Date(visit.date).toLocaleString()}</p>
                    <p>Visit #${visit.id}</p>
                </div>
                <div class="content">
                    ${visit.items.map(item => `
                        <div class="item">
                            <span>${item.service?.name || item.product?.name}</span>
                            <span>₹${item.price.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="total">
                    <div class="item">
                        <span>Subtotal</span>
                        <span>₹${visit.invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="item">
                        <span>Tax</span>
                        <span>₹${visit.invoice.tax.toFixed(2)}</span>
                    </div>
                    <div class="item">
                        <span>Discount</span>
                        <span>-₹${visit.invoice.discount.toFixed(2)}</span>
                    </div>
                    <div class="item" style="font-size: 1.2em; margin-top: 10px;">
                        <span>TOTAL</span>
                        <span>₹${visit.invoice.total.toFixed(2)}</span>
                    </div>
                </div>
                <div class="footer">
                    <p>Thank you for visiting!</p>
                    <p>Please come again.</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        receiptWindow.document.close();
    };

    const handleEmailReceipt = async (visit) => {
        if (!visit.customer.email) {
            alert('Customer does not have an email address linked.');
            return;
        }
        try {
            const res = await fetch(`/api/invoices/${visit.invoice.id}/send-email`, {
                method: 'POST'
            });
            const data = await res.json();
            if (data.success) {
                alert('Email sent successfully!');
            } else {
                alert('Failed to send email. Check server logs.');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Error sending email.');
        }
    };

    // Calendar Component
    const Calendar = () => {
        const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty - ${i} `} />);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();

            days.push(
                <div
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    style={{
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--primary)' : isToday ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                        color: isSelected ? 'black' : 'var(--foreground)',
                        fontWeight: isSelected || isToday ? 'bold' : 'normal',
                        border: isToday && !isSelected ? '1px solid var(--primary)' : 'none'
                    }}
                >
                    {i}
                </div>
            );
        }

        const nextMonth = () => {
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        };

        const prevMonth = () => {
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        };

        return (
            <div className="card" style={{ height: 'fit-content' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem' }}>
                    <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
                    <span style={{ fontWeight: '600' }}>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}><ChevronRight size={20} /></button>
                </div>
                <div className="card-content">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                        {days}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* Welcome Header */}
            <div style={{
                marginBottom: '2.5rem',
                padding: '2rem',
                borderRadius: 'var(--radius)',
                background: 'linear-gradient(135deg, #d4af37 0%, #b45309 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 10px 30px rgba(212, 175, 55, 0.2)'
            }}>
                <div>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Here's what's happening in your salon today.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '700', lineHeight: 1 }}>{selectedDate.getDate()}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                    <div style={{ fontSize: '1rem', opacity: 0.8 }}>
                        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignContent: 'start' }}>
                <StatCard title="Daily Sales" value={`₹${stats.dailySales.toFixed(2)} `} icon={IndianRupee} />
                <StatCard title="Monthly Revenue" value={`₹${stats.monthlySales.toFixed(2)} `} icon={ShoppingBag} />
                <StatCard title="Daily Orders" value={stats.dailyOrders} icon={Users} />
                <StatCard title="Monthly Orders" value={stats.monthlyOrders} icon={CalendarIcon} />
            </div>

            {/* Calendar */}
            <Calendar />

            {/* Charts Section */}
            <div className="grid-responsive" style={{ marginBottom: '2.5rem' }}>
                {/* Monthly Revenue Trend */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Monthly Revenue Trend</h2>
                    </div>
                    <div className="card-content" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--muted-foreground)" tick={{ fill: 'var(--muted-foreground)' }} />
                                <YAxis stroke="var(--muted-foreground)" tick={{ fill: 'var(--muted-foreground)' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', color: 'var(--foreground)' }}
                                    itemStyle={{ color: 'var(--primary)' }}
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                />
                                <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top 5 Products */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Top 5 Products</h2>
                    </div>
                    <div className="card-content" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.topProducts}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.topProducts.map((entry, index) => (
                                        <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', color: 'var(--foreground)' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Transactions ({selectedDate.toLocaleDateString()})</h2>
                </div>
                <div className="card-content" style={{ maxHeight: '400px', overflowY: 'auto', padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem' }}>Bill ID</th>
                                <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem' }}>Customer</th>
                                <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem' }}>Date</th>
                                <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem' }}>Amount</th>
                                <th style={{ position: 'sticky', top: 0, background: 'var(--option-bg)', zIndex: 20, padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentTransactions.length > 0 ? (
                                stats.recentTransactions.map(bill => (
                                    <tr key={bill.id} style={{ cursor: 'pointer', transition: 'background 0.2s' }} className="hover:bg-secondary">
                                        <td style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>#{bill.id}</td>
                                        <td>
                                            <div style={{ fontWeight: '500' }}>{bill.customer || 'Walk-in'}</div>
                                        </td>
                                        <td>{bill.date instanceof Date ? bill.date.toLocaleDateString() : new Date(bill.date).toLocaleDateString()}</td>
                                        <td style={{ fontWeight: '600' }}>₹{(bill.amount || 0).toFixed(2)}</td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                backgroundColor: bill.status === 'paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                                color: bill.status === 'paid' ? '#10b981' : '#ffc107',
                                                border: `1px solid rgba(${bill.status === 'paid' ? '16, 185, 129' : '255, 193, 7'}, 0.2)`
                                            }}>
                                                {bill.status === 'paid' ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
                                        No transactions found for this date.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bill Details Modal */}
            {selectedBill && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '500px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title">Bill Details #{selectedBill.invoice?.id}</h3>
                            <button onClick={() => setSelectedBill(null)} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}>
                                X
                            </button>
                        </div>
                        <div className="card-content" style={{ overflowY: 'auto' }}>
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--muted-foreground)' }}>Customer</span>
                                    <span style={{ fontWeight: '600' }}>{selectedBill.customer.name}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--muted-foreground)' }}>Date</span>
                                    <span>{new Date(selectedBill.date).toLocaleString()}</span>
                                </div>
                            </div>

                            <table style={{ width: '100%', marginBottom: '1.5rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ textAlign: 'left', paddingBottom: '0.5rem' }}>Item</th>
                                        <th style={{ textAlign: 'right', paddingBottom: '0.5rem' }}>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBill.items.map(item => (
                                        <tr key={item.id}>
                                            <td style={{ padding: '0.5rem 0' }}>{item.service?.name || item.product?.name}</td>
                                            <td style={{ textAlign: 'right', padding: '0.5rem 0' }}>₹{item.price.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--muted-foreground)' }}>Subtotal</span>
                                    <span>₹{selectedBill.invoice?.subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--muted-foreground)' }}>Tax</span>
                                    <span>₹{selectedBill.invoice?.tax.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--muted-foreground)' }}>Discount</span>
                                    <span>-₹{selectedBill.invoice?.discount.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', marginTop: '1rem' }}>
                                    <span>Total</span>
                                    <span>₹{selectedBill.invoice?.total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '1.5rem' }}
                                onClick={() => handleDownloadReceipt(selectedBill)}
                            >
                                <Printer size={18} style={{ marginRight: '0.5rem' }} />
                                Download Receipt
                            </button>
                            <button
                                className="btn btn-secondary"
                                style={{ width: '100%', marginTop: '0.5rem' }}
                                onClick={() => handleEmailReceipt(selectedBill)}
                            >
                                <Mail size={18} style={{ marginRight: '0.5rem' }} />
                                Email Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
