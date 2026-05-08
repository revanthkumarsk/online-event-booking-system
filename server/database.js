const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeSchemas();
    }
});

function initializeSchemas() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT CHECK(role IN ('admin', 'organizer', 'user')) DEFAULT 'user'
        )`);

        // Events Table
        db.run(`CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            date TEXT NOT NULL,
            location TEXT NOT NULL,
            total_seats INTEGER NOT NULL,
            available_seats INTEGER NOT NULL,
            price REAL DEFAULT 0,
            organizer_id INTEGER,
            category TEXT DEFAULT 'General',
            image_url TEXT,
            status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
            FOREIGN KEY(organizer_id) REFERENCES users(id)
        )`);

        // Bookings Table
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            event_id INTEGER,
            ticket_id TEXT UNIQUE NOT NULL,
            booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(event_id) REFERENCES events(id)
        )`, () => {
            // Safe fallback schema migration for existing databases
            db.run(`ALTER TABLE bookings ADD COLUMN status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending'`, (err) => {});
        });

        // Create Admin if not exists
        db.get(`SELECT * FROM users WHERE email = 'admin@evently.com'`, (err, row) => {
            if (!row) {
                // Password 'admin123' (will be hashed in login/signup logic, let's just use plain for now or hash it)
                // Using bcrypt manually for initial admin setup
                const bcrypt = require('bcryptjs');
                const hashed = bcrypt.hashSync('admin123', 10);
                db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, 
                    ['System Admin', 'admin@evently.com', hashed, 'admin']);
            }
        });
    });
}

module.exports = db;
