import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/Context';
import { Mail, Lock, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAppContext();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await resp.json();
            if (resp.ok) {
                login(data.user, data.token);
                navigate('/');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
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
        <div className="animate-fade-up" style={{ maxWidth: '450px', margin: '80px auto', position: 'relative', zIndex: 10 }}>
            <div className="glass" style={{ padding: '50px 40px', border: '1px solid var(--primary)', boxShadow: '0 0 30px rgba(0, 242, 254, 0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div className="animate-pulse" style={{ width: '70px', height: '70px', background: 'var(--gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 20px var(--primary-glow)' }}>
                        <ShieldCheck size={35} color="white" />
                    </div>
                    <h2 className="font-heading" style={{ fontSize: '2.2rem', marginBottom: '5px' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Secure access to your passport</p>
                </div>

                {error && <div style={{ background: 'rgba(255, 77, 77, 0.1)', border: '1px solid var(--danger)', padding: '12px', borderRadius: '10px', color: 'var(--danger)', marginBottom: '20px', textAlign: 'center', fontSize: '0.95rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Mail size={16} /> Email Address
                        </label>
                        <input type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" required onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--glass-border-light)'}/>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Lock size={16} /> Password
                        </label>
                        <input type="password" style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--glass-border-light)'} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '15px', padding: '16px', fontSize: '1.1rem', borderRadius: '12px' }}>
                        Sign In Safely
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
