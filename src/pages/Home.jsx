import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/Context';
import { MapPin, Calendar as CalIcon, Users, Ticket, CheckCircle, Sparkles, Zap, Rocket, Star, Info } from 'lucide-react';

const Home = () => {
    const { events, fetchEvents, token } = useAppContext();
    const [bookingMsg, setBookingMsg] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [hoveredEvent, setHoveredEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const categories = ['All', 'Tech', 'Music', 'Business', 'Workshop', 'Social'];

    const filteredEvents = selectedCategory === 'All' 
        ? events 
        : events.filter(e => e.category === selectedCategory);

    const handleBook = async (eventId) => {
        if (!token) {
            alert('Please login to book tickets');
            return;
        }
        try {
            const resp = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ event_id: eventId })
            });
            const data = await resp.json();
            if (resp.ok) {
                setBookingMsg({ type: 'success', text: `Success! Ticket ID: ${data.ticket_id}` });
                fetchEvents();
            } else {
                setBookingMsg({ type: 'error', text: data.message });
            }
        } catch (err) {
            setBookingMsg({ type: 'error', text: 'Booking failed.' });
        }
    };

    return (
        <div className="animate-fade-up">
            {/* Interactive Hero Section */}
            <section style={{ 
                minHeight: '80vh', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                textAlign: 'center',
                borderRadius: '40px',
                marginTop: '20px',
                marginBottom: '80px',
                position: 'relative',
                zIndex: 1
            }}>
                <div className="glass animate-float" style={{ 
                    padding: '8px 24px', 
                    borderRadius: '50px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    fontSize: '0.85rem',
                    marginBottom: '30px',
                    border: '1px solid var(--primary)',
                    boxShadow: '0 0 20px rgba(0, 242, 254, 0.2)'
                }}>
                    <Star size={16} fill="var(--primary)" color="var(--primary)" className="animate-pulse" /> 
                    <span style={{ fontWeight: 600, letterSpacing: '1px' }}>DISCOVER THE EXTRAORDINARY</span>
                </div>

                <h1 className="font-heading" style={{ 
                    fontSize: 'clamp(3rem, 8vw, 6rem)', 
                    lineHeight: 1.05, 
                    marginBottom: '30px', 
                    maxWidth: '1000px',
                    textShadow: '0 10px 40px rgba(0,0,0,0.8)'
                }}>
                    Experience <br/>
                    <span className="text-gradient">Moments That Matter</span>
                </h1>
                
                <p style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
                    maxWidth: '650px', 
                    marginBottom: '50px',
                    lineHeight: 1.8
                }}>
                    Elevate your journey with exclusive access to premium conferences, mind-blowing festivals, and electrifying networks. Designed for visionaries.
                </p>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <a href="#events" className="btn btn-primary" style={{ padding: '18px 45px', fontSize: '1.1rem', borderRadius: '50px' }}>
                        Explore Events <Rocket size={20} />
                    </a>
                    <button className="btn btn-outline" style={{ padding: '18px 45px', fontSize: '1.1rem', borderRadius: '50px' }}>
                        How it works <Info size={20} />
                    </button>
                </div>
            </section>

            {/* Category Filter */}
            <div id="events" style={{ scrollMarginTop: '100px' }}>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '60px', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={selectedCategory === cat ? 'btn btn-primary' : 'btn btn-outline'}
                            style={{ 
                                padding: '12px 30px', 
                                borderRadius: '50px', 
                                fontSize: '0.9rem',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: selectedCategory === cat ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {bookingMsg && (
                <div className="glass" style={{ 
                    padding: '24px 30px', marginBottom: '50px', 
                    borderLeft: `6px solid ${bookingMsg.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
                    display: 'flex', alignItems: 'center', gap: '20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    animation: 'fadeInUp 0.5s ease',
                    maxWidth: '600px', margin: '0 auto 50px auto'
                }}>
                    <div style={{ background: bookingMsg.type === 'success' ? 'var(--success)' : 'var(--danger)', borderRadius: '50%', padding: '8px', boxShadow: '0 0 15px rgba(0,0,0,0.3)' }}>
                        <CheckCircle size={24} color="white" />
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{bookingMsg.type === 'success' ? 'Booking Confirmed' : 'Action Failed'}</h4>
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{bookingMsg.text}</span>
                    </div>
                    <button onClick={() => setBookingMsg(null)} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}>✕</button>
                </div>
            )}

            {/* Event Grid Section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '15px', margin: 0 }}>
                    Trending Now
                </h2>
                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--glass-border-light), transparent)', marginLeft: '30px' }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '40px' }}>
                {filteredEvents.length === 0 ? (
                    <div className="glass" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', borderRadius: '30px' }}>
                        <CalIcon size={80} style={{ opacity: 0.2, marginBottom: '20px', color: 'var(--primary)' }} />
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>No Events Found</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Check back later or try a different category.</p>
                    </div>
                ) : (
                    filteredEvents.map(event => (
                        <div 
                            key={event.id} 
                            className="glass" 
                            style={{ 
                                padding: '0', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                height: '100%'
                            }}
                            onMouseEnter={() => setHoveredEvent(event.id)}
                            onMouseLeave={() => setHoveredEvent(null)}
                        >
                            <div style={{ 
                                height: '260px', 
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: '100%', height: '100%',
                                    background: `url('${event.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop'}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    transform: hoveredEvent === event.id ? 'scale(1.1)' : 'scale(1.0)'
                                }}></div>
                                <div style={{ 
                                    position: 'absolute', 
                                    inset: 0, 
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 40%, rgba(5,5,16,1) 100%)' 
                                }}></div>
                                <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
                                    <span className="badge badge-primary">{event.category}</span>
                                </div>
                                <div style={{ position: 'absolute', bottom: '20px', left: '25px', right: '25px' }}>
                                    <h3 style={{ fontSize: '1.6rem', textShadow: '0 4px 15px rgba(0,0,0,0.8)', marginBottom: '5px' }}>{event.title}</h3>
                                </div>
                            </div>
                            
                            <div style={{ padding: '30px 25px', flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(5,5,16,0.3)' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '30px', minHeight: '3rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {event.description}
                                </p>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '35px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                            <CalIcon size={18} color="var(--primary)" />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>DATE</span>
                                            <span style={{ fontWeight: 600 }}>{event.date}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                            <MapPin size={18} color="var(--secondary)" />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>LOCATION</span>
                                            <span style={{ fontWeight: 600 }}>{event.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>PRICE</div>
                                        <div className="text-gradient" style={{ fontSize: '1.6rem', fontWeight: 900 }}>${event.price}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>AVAILABLE</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: event.available_seats < 10 ? 'var(--warning)' : 'white' }}>
                                            {event.available_seats} <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>seats</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleBook(event.id)}
                                    className="btn btn-primary" 
                                    style={{ 
                                        width: '100%', 
                                        marginTop: '25px', 
                                        padding: '16px', 
                                        fontSize: '1rem',
                                        opacity: event.available_seats <= 0 ? 0.5 : 1
                                    }}
                                    disabled={event.available_seats <= 0}
                                >
                                    <Ticket size={20} /> {event.available_seats <= 0 ? 'Waitlist Only' : 'Reserve My Spot'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
