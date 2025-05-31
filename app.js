const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const path = require('path');

require('dotenv').config();

const app = express();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5
});

const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect('/login');
        }
        req.user = user;
        next();
    });
};

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, email, created_at FROM users WHERE id = $1',
            [req.user.id]
        );
        res.render('profile', { user: result.rows[0] });
    } catch (err) {
        res.status(500).render('error', { message: 'Internal server error' });
    }
});

const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
];

app.post('/register', registerValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', {
            errors: errors.array(),
            input: req.body
        });
    }

    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );

        res.render('login', {
            message: 'Registration successful! Please login.'
        });
    } catch (err) {
        if (err.code === '23505') {
            res.render('register', {
                errors: [{ msg: 'Username or email already exists' }],
                input: req.body
            });
        } else {
            res.status(500).render('error', {
                message: 'Internal server error'
            });
        }
    }
});

app.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password, 'g-recaptcha-response': recaptchaToken } = req.body;

        const recaptchaVerification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
        }).then(res => res.json());

        if (!recaptchaVerification.success) {
            return res.render('login', { 
                error: 'Invalid reCAPTCHA. Please try again.' 
            });
        }

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.render('login', {
                error: 'Invalid credentials'
            });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.render('login', {
                error: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000 
        });

        res.redirect('/profile');
    } catch (err) {
        res.status(500).render('error', {
            message: 'Internal server error'
        });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
