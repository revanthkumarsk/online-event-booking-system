import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, Zap } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (resp.ok) {
                navigate('/login');
            } else {
                const data = await resp.json();
                setError(data.message);
            }
        } catch (err) {
            setError('Registration failed.');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--glass-border-light)',
        borderRadius: '12px',
        color: 'white',
        marginTop: '10px',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.3s'
    };

    return (
        <div className="animate-fade-up" style={{ maxWidth: '500px', margin: '60px auto', position: 'relative', zIndex: 10 }}>
            <div className="glass" style={{ padding: '50px 40px', border: '1px solid var(--primary)', boxShadow: '0 0 30px rgba(0, 242, 254, 0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div className="animate-pulse" style={{ width: '70px', height: '70px', background: 'var(--gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 20px var(--primary-glow)' }}>
                        <Zap size={35} color="white" />
                    </div>
                    <h2 className="font-heading" style={{ fontSize: '2.2rem', marginBottom: '5px' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Join our community of visionaries</p>
                </div>

                {error && <div style={{ background: 'rgba(255, 77, 77, 0.1)', border: '1px solid var(--danger)', padding: '12px', borderRadius: '10px', color: 'var(--danger)', marginBottom: '20px', textAlign: 'center', fontSize: '0.95rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={16} /> Full Name
                        </label>
                        <input type="text" style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" required onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--glass-border-light)'} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Mail size={16} /> Email Address
                        </label>
                        <input type="email" style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" required onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--glass-border-light)'} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Lock size={16} /> Password
                        </label>
                        <input type="password" style={inputStyle} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" required onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--glass-border-light)'} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Briefcase size={16} /> Platform Role
                        </label>
                        <select style={{...inputStyle, padding: '15px'}} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--glass-border-light)'}>
                            <option value="user" style={{ background: '#050510' }}>Attendee (Book Events)</option>
                            <option value="organizer" style={{ background: '#050510' }}>Organizer (Create Events)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '15px', padding: '16px', fontSize: '1.1rem', borderRadius: '12px' }}>
                        Create Account
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign in directly</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
