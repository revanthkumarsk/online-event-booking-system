const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');
const crypto = require('crypto');

process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception:', err);
});

const app = express();
const PORT = 5000;
const SECRET_KEY = 'evently_secret_key_2024';

app.use(cors());
app.use(express.json());

// --- Authentication Middlewares ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ message: 'Session Expired' });
        req.user = user;
        next();
    });
};

// --- Auth Routes ---
app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, 
        [name, email, hashedPassword, role || 'user'],
        function(err) {
            if (err) return res.status(400).json({ message: 'Email already exists' });
            res.json({ id: this.lastID, message: 'User registered successfully' });
        }
    );
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user) return res.status(400).json({ message: 'User not found' });
        
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    });
});

// --- Event Routes ---
app.get('/api/events', (req, res) => {
    const query = req.query.all === 'true' ? `SELECT * FROM events` : `SELECT * FROM events WHERE status = 'approved'`;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

app.post('/api/events', authenticateToken, (req, res) => {
    const { title, description, date, location, total_seats, price, category, image_url } = req.body;
    db.run(`INSERT INTO events (title, description, date, location, total_seats, available_seats, price, organizer_id, category, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, date, location, total_seats, total_seats, price, req.user.id, category || 'General', image_url || null],
        function(err) {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ id: this.lastID, message: 'Event created and pending approval' });
        }
    );
});

app.patch('/api/events/:id/status', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'organizer') return res.status(403).json({ message: 'Forbidden' });
    const { status } = req.body;
    db.run(`UPDATE events SET status = ? WHERE id = ?`, [status, req.params.id], function(err) {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: `Event ${status}` });
    });
});

// --- User Proposals Route ---
app.get('/api/my-proposals', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM events WHERE organizer_id = ? ORDER BY id DESC`, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows || []);
    });
});

// --- Booking Routes ---
app.post('/api/bookings', authenticateToken, (req, res) => {
    const { event_id } = req.body;
    const user_id = req.user.id;
    
    db.get(`SELECT available_seats, title FROM events WHERE id = ?`, [event_id], (err, event) => {
        if (!event || event.available_seats <= 0) {
            return res.status(400).json({ message: 'No seats available' });
        }
        
        const ticket_id = 'TKT-' + crypto.randomBytes(4).toString('hex').toUpperCase();
        
        db.serialize(() => {
            db.run(`BEGIN TRANSACTION`);
            db.run(`INSERT INTO bookings (user_id, event_id, ticket_id) VALUES (?, ?, ?)`, [user_id, event_id, ticket_id]);
            db.run(`UPDATE events SET available_seats = available_seats - 1 WHERE id = ?`, [event_id]);
            db.run(`COMMIT`, (err) => {
                if (err) return res.status(500).json({ message: 'Booking failed' });
                res.json({ ticket_id, message: 'Booking successful!' });
            });
        });
    });
});

app.get('/api/my-bookings', authenticateToken, (req, res) => {
    db.all(`SELECT b.*, e.title, e.date, e.location 
            FROM bookings b 
            JOIN events e ON b.event_id = e.id 
            WHERE b.user_id = ?`, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

app.get('/api/all-bookings', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    db.all(`SELECT b.*, e.title, e.date, e.location, u.name as user_name 
            FROM bookings b 
            JOIN events e ON b.event_id = e.id 
            JOIN users u ON b.user_id = u.id`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

app.patch('/api/bookings/:id/status', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { status } = req.body;
    db.run(`UPDATE bookings SET status = ? WHERE id = ?`, [status, req.params.id], function(err) {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: `Booking ${status}` });
    });
});

const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
    console.error('Server Error:', err);
});
