import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/Context';
import { 
    Ticket, Plus, CheckCircle, XCircle, Clock, Calendar, 
    Users, DollarSign, Activity, FileText, Image as ImageIcon,
    Tag, MapPin, ChevronRight, BarChart3
} from 'lucide-react';

const Dashboard = () => {
    const { user, token, fetchEvents } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [allAdminBookings, setAllAdminBookings] = useState([]);
    const [myProposals, setMyProposals] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [newEvent, setNewEvent] = useState({ 
        title: '', description: '', date: '', location: '', 
        total_seats: 100, price: 0, category: 'Tech', image_url: '' 
    });

    const categories = ['Tech', 'Music', 'Business', 'Workshop', 'Social'];

    const defaultImages = {
        'Tech': 'file:///C:/Users/Revanth_Kumar_S_K/.gemini/antigravity/brain/0b8dc5a9-5146-4da9-8bb6-ae6439f2d985/tech_conference_img_1775884364573.png',
        'Music': 'file:///C:/Users/Revanth_Kumar_S_K/.gemini/antigravity/brain/0b8dc5a9-5146-4da9-8bb6-ae6439f2d985/music_festival_img_1775884390317.png',
        'Business': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
        'Workshop': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
        'Social': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop'
    };

    useEffect(() => {
        if (!token) return;
        if (user?.role === 'user') {
            fetchMyBookings();
            fetchMyProposals();
        }
        if (user?.role === 'admin' || user?.role === 'organizer') fetchAllEvents();
        if (user?.role === 'admin') fetchAllAdminBookings();
    }, [user, token]);

    const fetchMyBookings = async () => {
        try {
            const resp = await fetch('http://localhost:5000/api/my-bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resp.ok) {
                const data = await resp.json();
                setBookings(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
        }
    };

    const fetchAllEvents = async () => {
        const resp = await fetch('http://localhost:5000/api/events?all=true', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await resp.json();
        setAllEvents(data || []);
    };

    const fetchMyProposals = async () => {
        const resp = await fetch('http://localhost:5000/api/my-proposals', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resp.ok) {
            const data = await resp.json();
            setMyProposals(data || []);
        }
    };

    const fetchAllAdminBookings = async () => {
        const resp = await fetch('http://localhost:5000/api/all-bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resp.ok) {
            const data = await resp.json();
            setAllAdminBookings(data || []);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        const payload = {
            ...newEvent,
            image_url: newEvent.image_url || defaultImages[newEvent.category]
        };
        try {
            const resp = await fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (resp.ok) {
                setShowCreate(false);
                setNewEvent({ title: '', description: '', date: '', location: '', total_seats: 100, price: 0, category: 'Tech', image_url: '' });
                if (user?.role === 'user') {
                    fetchMyProposals();
                } else {
                    fetchAllEvents();
                }
                fetchEvents();
                alert('Event created and pending approval!');
            } else {
                const errData = await resp.json();
                alert('Error: ' + (errData.message || 'Failed to create event'));
            }
        } catch (err) {
            alert('Network error. Please try again.');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        const resp = await fetch(`http://localhost:5000/api/events/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        if (resp.ok) fetchAllEvents();
    };

    const handleBookingStatusUpdate = async (id, status) => {
        const resp = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        if (resp.ok) fetchAllAdminBookings();
    };

    const stats = {
        total: allEvents.length,
        pending: allEvents.filter(e => e.status === 'pending').length,
        approved: allEvents.filter(e => e.status === 'approved').length,
        revenue: allEvents.reduce((acc, e) => acc + ((e.total_seats - e.available_seats) * e.price), 0)
    };

    // Inline styles for inputs mapped from CSS logic
    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--glass-border)',
        borderRadius: '10px',
        color: 'white',
        marginTop: '8px',
        fontSize: '0.95rem'
    };

    return (
        <div className="animate-fade-up">
            <header style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', letterSpacing: '1px' }}>
                        <Activity size={16} /> PLATFORM MANAGEMENT
                    </div>
                    <h1 className="font-heading" style={{ fontSize: '3rem', margin: 0 }}>Control Center</h1>
                </div>
                {(user?.role === 'organizer' || user?.role === 'user') && (
                    <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)} style={{ padding: '14px 28px' }}>
                        {showCreate ? <XCircle size={18} /> : <Plus size={18} />} 
                        {showCreate ? 'Discard Draft' : (user?.role === 'user' ? 'Propose Event' : 'Launch New Event')}
                    </button>
                )}
            </header>

            {/* Statistics Cards */}
            {(user?.role === 'admin' || user?.role === 'organizer') && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px', marginBottom: '50px' }}>
                    <div className="glass" style={{ padding: '30px' }}>
                        <div style={{ color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <FileText size={24} color="var(--primary)" /> <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>TOTAL EVENTS</span>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{stats.total}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>Total platform events</div>
                    </div>
                    <div className="glass" style={{ padding: '30px' }}>
                        <div style={{ color: '#f59e0b', display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <Clock size={24} /> <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>PENDING REVIEW</span>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b' }}>{stats.pending}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>Requires your attention</div>
                    </div>
                    <div className="glass" style={{ padding: '30px' }}>
                        <div style={{ color: 'var(--success)', display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <BarChart3 size={24} /> <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>EST. REVENUE</span>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--success)' }}>${stats.revenue.toLocaleString()}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>Estimated earnings</div>
                    </div>
                </div>
            )}

            {showCreate && (
                <div className="glass animate-fade-up" style={{ padding: '40px', marginBottom: '60px', position: 'relative', border: '1px solid var(--primary)' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>{user?.role === 'user' ? 'Propose Custom Event' : 'Draft Event Details'}</h3>
                    <form onSubmit={handleCreateEvent} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '25px' }}>
                        <div style={{ gridColumn: 'span 3' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}><FileText size={16} /> Event Title</label>
                            <input type="text" style={inputStyle} required placeholder="Ex: AI Innovation Summit 2024" onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                        </div>
                        <div style={{ gridColumn: 'span 3' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}><Tag size={16} /> Category</label>
                            <select style={inputStyle} value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})}>
                                {categories.map(c => <option key={c} value={c} style={{ background: '#050510' }}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 6' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>Description</label>
                            <textarea style={{...inputStyle, resize: 'vertical'}} rows="3" required placeholder="Tell us about your event..." onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}><Calendar size={16} /> Date</label>
                            <input type="date" style={inputStyle} required onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}><MapPin size={16} /> Location</label>
                            <input type="text" style={inputStyle} required placeholder="Venue or Virtual link" onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                        </div>
                        <div style={{ gridColumn: 'span 1' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>Seats</label>
                            <input type="number" style={inputStyle} required onChange={e => setNewEvent({...newEvent, total_seats: e.target.value})} />
                        </div>
                        <div style={{ gridColumn: 'span 1' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>Price ($)</label>
                            <input type="number" style={inputStyle} required onChange={e => setNewEvent({...newEvent, price: e.target.value})} />
                        </div>
                        <div style={{ gridColumn: 'span 6' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}><ImageIcon size={16} /> Custom Image URL (Optional)</label>
                            <input type="text" style={inputStyle} placeholder="https://..." onChange={e => setNewEvent({...newEvent, image_url: e.target.value})} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 6', height: '60px', marginTop: '10px', fontSize: '1.1rem' }}>
                            {user?.role === 'user' ? 'Submit Proposal to Organizers' : 'Submit Proposal for Admin Review'}
                        </button>
                    </form>
                </div>
            )}

            {/* Management Cards Grid */}
            {(user?.role === 'admin' || user?.role === 'organizer') && (
                <div style={{ display: 'grid', gap: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 className="font-heading" style={{ fontSize: '2rem' }}>Event Catalog</h3>
                    </div>
                    
                    {allEvents.length === 0 ? (
                        <div className="glass" style={{ padding: '80px', textAlign: 'center', borderRadius: '30px' }}>
                            <FileText size={64} style={{ opacity: 0.1, marginBottom: '20px', color: 'var(--primary)' }} />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Your event catalog is currently empty.</p>
                        </div>
                    ) : (
                        allEvents.map(e => (
                            <div key={e.id} className="glass" style={{ 
                                padding: '30px', 
                                display: 'grid', 
                                gridTemplateColumns: 'minmax(120px, 150px) 2fr 1.5fr 1fr 1.5fr', 
                                gap: '30px', 
                                alignItems: 'center'
                            }}>
                                <div style={{ 
                                    width: '100%', 
                                    paddingTop: '66%', 
                                    borderRadius: '15px', 
                                    background: `url('${e.image_url || defaultImages[e.category]}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    position: 'relative'
                                }}></div>
                                
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px' }}>{e.category.toUpperCase()}</div>
                                    <h4 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{e.title}</h4>
                                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14}/> {e.date}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14}/> {e.location}</span>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', letterSpacing: '1px' }}>OCCUPANCY</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ height: '8px', flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', background: 'var(--primary)', width: `${((e.total_seats - e.available_seats) / e.total_seats) * 100}%` }}></div>
                                        </div>
                                        <span style={{ fontSize: '1rem', fontWeight: 700 }}>{e.total_seats - e.available_seats}/{e.total_seats}</span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', letterSpacing: '1px' }}>STATUS</div>
                                    <span className={`badge badge-${e.status}`}>{e.status}</span>
                                </div>

                                <div style={{ textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    {(user?.role === 'admin' || user?.role === 'organizer') && e.status === 'pending' ? (
                                        <>
                                            <button onClick={() => handleUpdateStatus(e.id, 'approved')} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem', borderRadius: '50px' }}>APPLY APPROVAL</button>
                                            <button onClick={() => handleUpdateStatus(e.id, 'rejected')} className="btn btn-outline" style={{ padding: '10px', color: 'var(--danger)', borderRadius: '50%' }}><XCircle size={18}/></button>
                                        </>
                                    ) : (
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '50px' }}>
                                            Manage <ChevronRight size={16} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Admin View: Booking Approvals */}
            {user?.role === 'admin' && (
                <div style={{ display: 'grid', gap: '30px', marginTop: '50px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 className="font-heading" style={{ fontSize: '2rem' }}>Ticket Approvals</h3>
                    </div>
                    
                    {allAdminBookings.length === 0 ? (
                        <div className="glass" style={{ padding: '80px', textAlign: 'center', borderRadius: '30px' }}>
                            <Ticket size={64} style={{ opacity: 0.1, marginBottom: '20px', color: 'var(--primary)' }} />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>No pending ticket approvals.</p>
                        </div>
                    ) : (
                        allAdminBookings.map(b => (
                            <div key={b.id} className="glass" style={{ 
                                padding: '30px', 
                                display: 'grid', 
                                gridTemplateColumns: 'minmax(120px, auto) 2fr 1fr 1fr', 
                                gap: '30px', 
                                alignItems: 'center'
                            }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '20px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Ticket size={30} color="white" />
                                </div>
                                
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px' }}>{b.ticket_id}</div>
                                    <h4 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{b.title}</h4>
                                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14}/> {b.user_name}</span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', letterSpacing: '1px' }}>STATUS</div>
                                    <span className={`badge badge-${b.status || 'pending'}`}>{b.status || 'pending'}</span>
                                </div>

                                <div style={{ textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    {b.status === 'pending' || !b.status ? (
                                        <>
                                            <button onClick={() => handleBookingStatusUpdate(b.id, 'approved')} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem', borderRadius: '50px' }}>APPROVE TICKET</button>
                                            <button onClick={() => handleBookingStatusUpdate(b.id, 'rejected')} className="btn btn-outline" style={{ padding: '10px', color: 'var(--danger)', borderRadius: '50%' }}><XCircle size={18}/></button>
                                        </>
                                    ) : (
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '50px' }}>
                                            Resolved
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* User View: My Proposals */}
            {user?.role === 'user' && myProposals.length > 0 && (
                <div style={{ display: 'grid', gap: '30px', marginBottom: '50px' }}>
                    <h3 className="font-heading" style={{ fontSize: '2rem', borderLeft: '4px solid #f59e0b', paddingLeft: '20px' }}>My Event Proposals</h3>
                    {myProposals.map(e => (
                        <div key={e.id} className="glass" style={{ padding: '30px', display: 'flex', gap: '30px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ 
                                width: '120px', height: '120px', borderRadius: '20px', 
                                background: e.image_url ? `url('${e.image_url}')` : 'var(--gradient)',
                                backgroundSize: 'cover', backgroundPosition: 'center',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {!e.image_url && <FileText size={40} color="white" />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '1px' }}>PROPOSAL</div>
                                <h4 style={{ fontSize: '1.5rem', margin: '8px 0' }}>{e.title}</h4>
                                <div style={{ display: 'flex', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14}/> {e.date}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14}/> {e.location}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Tag size={14}/> {e.category}</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', minWidth: '150px' }}>
                                <span className={`badge badge-${e.status}`}>
                                    {e.status === 'pending' ? '⏳ Pending Review' : e.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* User View: My Bookings */}
            {user?.role === 'user' && (
                <div style={{ display: 'grid', gap: '30px' }}>
                    <h3 className="font-heading" style={{ fontSize: '2rem', borderLeft: '4px solid var(--primary)', paddingLeft: '20px' }}>My Active Passports</h3>
                    {bookings.length === 0 ? (
                        <div className="glass" style={{ padding: '100px', textAlign: 'center', borderRadius: '30px' }}>
                            <Ticket size={64} style={{ opacity: 0.1, marginBottom: '20px', color: 'var(--primary)' }} />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>You haven't reserved any spots yet. Ready to explore?</p>
                        </div>
                    ) : bookings.map(b => (
                        <div key={b.id} className="glass" style={{ padding: '30px', display: 'flex', gap: '30px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ width: '120px', height: '120px', borderRadius: '20px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px var(--primary-glow)' }}>
                                <Ticket size={40} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '1px' }}>EVENT RESERVATION</div>
                                <h4 style={{ fontSize: '1.8rem', margin: '8px 0' }}>{b.title}</h4>
                                <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '10px', alignItems: 'center' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16}/> {b.date}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16}/> {b.location}</span>
                                    <span className={`badge badge-${b.status || 'pending'}`} style={{ marginLeft: '10px' }}>
                                        {b.status === 'approved' ? 'Approved Successfully' : (b.status || 'Pending')}
                                    </span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', minWidth: '220px', borderLeft: '2px dashed rgba(255,255,255,0.1)', paddingLeft: '40px' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px', letterSpacing: '2px' }}>TICKET ID</div>
                                <div className="text-gradient" style={{ 
                                    background: 'rgba(255,255,255,0.03)', 
                                    padding: '16px 24px', 
                                    borderRadius: '16px', 
                                    fontFamily: 'monospace', 
                                    fontSize: '1.4rem', 
                                    fontWeight: 800,
                                    border: '1px solid var(--glass-border)' 
                                }}>{b.ticket_id}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
