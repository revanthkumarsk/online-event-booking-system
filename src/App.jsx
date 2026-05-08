import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from './context/Context';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { LogOut, Calendar, Compass, User, Zap } from 'lucide-react';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

const Navbar = () => {
    const { user, logout } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-nav" style={{ padding: '15px 0', width: '100%' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: 900, 
                    textDecoration: 'none', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    fontFamily: 'Outfit, sans-serif'
                }}>
                    <div style={{ 
                        padding: '10px', 
                        background: 'var(--gradient)', 
                        borderRadius: '12px',
                        boxShadow: '0 0 20px var(--primary-glow)' 
                    }}>
                        <Zap size={22} color="white" />
                    </div>
                    NexEvent
                </Link>
                
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <Link to="/" className="btn-outline btn" style={{ padding: '8px 16px', borderRadius: '10px' }}>
                        <Compass size={16} /> Discover
                    </Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="btn-outline btn" style={{ padding: '8px 16px', borderRadius: '10px' }}>
                                <Calendar size={16} /> Dashboard
                            </Link>
                            <div style={{ height: '30px', width: '2px', background: 'var(--glass-border-light)' }}></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Welcome back</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>{user.name}</span>
                                </div>
                                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '10px', borderRadius: '12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link to="/login" className="btn btn-outline" style={{ padding: '10px 24px', borderRadius: '12px' }}>Log In</Link>
                            <Link to="/signup" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '12px' }}>Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

const App = () => {
    return (
        <Router>
            <ScrollToTop />
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            
            <Navbar />
            <main className="container" style={{ paddingBottom: '100px', paddingTop: '40px', position: 'relative', zIndex: 10 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;
