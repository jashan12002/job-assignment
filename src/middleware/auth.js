const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.redirect('/login?error=Please login to continue');
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('jwt');
        return res.redirect('/login?error=Session expired. Please login again');
    }
};

module.exports = { authenticateToken }; 