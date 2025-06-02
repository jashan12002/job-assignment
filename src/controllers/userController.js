const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const axios = require('axios');

const register = async (req, res) => {
    console.log('Registration attempt with data:', { 
        username: req.body.username,
        email: req.body.email,
        hasPassword: !!req.body.password 
    });

    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            console.log('Missing required fields:', { username: !!username, email: !!email, password: !!password });
            return res.render('register', { error: 'All fields are required' });
        }

        if (password.length < 8) {
            console.log('Password too short');
            return res.render('register', { error: 'Password must be at least 8 characters long' });
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        const query = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, email
        `;

        console.log('Attempting to insert user into database...');
        const result = await pool.query(query, [username, email, hashedPassword]);
        console.log('User registered successfully:', result.rows[0]);

        res.render('login', { message: 'Registration successful! Please login.' });
    } catch (error) {
        console.error('Registration error details:', {
            error: error.message,
            stack: error.stack,
            constraint: error.constraint,
            code: error.code
        });

        if (error.constraint === 'users_username_key') {
            res.render('register', { error: 'Username already exists' });
        } else if (error.constraint === 'users_email_key') {
            res.render('register', { error: 'Email already exists' });
        } else {
            res.render('register', { 
                error: 'Registration failed. Please try again.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const recaptchaResponse = req.body['g-recaptcha-response'];

    try {
        
        if (!recaptchaResponse) {
            return res.render('login', { error: 'Please complete the reCAPTCHA verification' });
        }

        const recaptchaVerification = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET_KEY,
                    response: recaptchaResponse
                }
            }
        );

        if (!recaptchaVerification.data.success) {
            console.error('reCAPTCHA verification failed:', recaptchaVerification.data);
            return res.render('login', { error: 'Invalid reCAPTCHA. Please try again.' });
        }

    
        const query = `
            SELECT * FROM users 
            WHERE username = $1 OR email = $1
        `;
        const result = await pool.query(query, [username]);
        const user = result.rows[0];

        if (!user) {
            return res.render('login', { error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.render('login', { error: 'Invalid credentials' });
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
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { error: 'Login failed. Please try again.' });
    }
};

const getProfile = async (req, res) => {
    try {
        const query = `
            SELECT id, username, email, created_at
            FROM users
            WHERE id = $1
        `;
        const result = await pool.query(query, [req.user.id]);
        const user = result.rows[0];

        res.render('profile', { user });
    } catch (error) {
        console.error('Profile error:', error);
        res.redirect('/login?error=Error loading profile');
    }
};

const logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
};

module.exports = {
    register,
    login,
    getProfile,
    logout
}; 