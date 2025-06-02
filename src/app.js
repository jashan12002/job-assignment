const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/login', limiter);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        error: 'Something broke!',
        message: err.message || 'An unexpected error occurred'
    });
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 