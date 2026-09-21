const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// Admin credentials
// =========================

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error("ERROR: ADMIN_USERNAME and ADMIN_PASSWORD are not set.");
    process.exit(1);
}

// =========================
// Middleware
// =========================

app.use(express.json());
app.use(express.static("."));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "development-session-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        }
    })
);

// =========================
// Database
// =========================

const db = new Database("portfolio.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

// =========================
// Admin table
// =========================

db.prepare(`
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`).run();

// =========================
// Create / update admin
// =========================

const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);

const existingAdmin = db
    .prepare("SELECT * FROM admins WHERE username = ?")
    .get(ADMIN_USERNAME);

if (!existingAdmin) {

    db.prepare(`
        INSERT INTO admins (username, password)
        VALUES (?, ?)
    `).run(ADMIN_USERNAME, hashedPassword);

    console.log("Admin account created.");

} else {

    db.prepare(`
        UPDATE admins
        SET password = ?
        WHERE username = ?
    `).run(hashedPassword, ADMIN_USERNAME);

    console.log("Admin account updated.");
}

// =========================
// Test API
// =========================

app.get("/api", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});

// =========================
// Contact Form API
// =========================

app.post("/api/contact", (req, res) => {

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            message: "Please fill in all fields."
        });
    }

    const insert = db.prepare(`
        INSERT INTO messages (name, email, message)
        VALUES (?, ?, ?)
    `);

    insert.run(name, email, message);

    console.log("New Contact Message:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);

    res.json({
        message: `Thank you, ${name}! Your message has been received.`
    });
});

// =========================
// Admin Login
// =========================

app.post("/api/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    const admin = db
        .prepare("SELECT * FROM admins WHERE username = ?")
        .get(username);

    if (!admin) {
        return res.status(401).json({
            message: "Invalid username or password."
        });
    }

    const passwordMatch = bcrypt.compareSync(
        password,
        admin.password
    );

    if (!passwordMatch) {
        return res.status(401).json({
            message: "Invalid username or password."
        });
    }

    req.session.isAdmin = true;
    req.session.username = admin.username;

    res.json({
        message: "Login successful!"
    });
});

// =========================
// Check Authentication
// =========================

app.get("/api/check-auth", (req, res) => {

    if (req.session.isAdmin) {
        return res.json({
            loggedIn: true,
            username: req.session.username
        });
    }

    res.json({
        loggedIn: false
    });
});

// =========================
// Logout
// =========================

app.post("/api/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({
            message: "Logged out successfully."
        });

    });
});

// =========================
// Admin Authentication
// =========================

function requireAdmin(req, res, next) {

    if (!req.session.isAdmin) {

        return res.status(401).json({
            message: "Unauthorized. Please login first."
        });

    }

    next();
}

// =========================
// View Messages
// =========================

app.get("/api/messages", requireAdmin, (req, res) => {

    const messages = db.prepare(`
        SELECT id, name, email, message, created_at
        FROM messages
        ORDER BY created_at DESC
    `).all();

    res.json(messages);
});

// =========================
// Start Server
// =========================

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});