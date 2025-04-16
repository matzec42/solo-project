const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

// function to create secrete key for JWTs
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// env secret or generate a fallback key
const secretKey = process.env.JWT_SECRET_KEY || generateSecretKey();

// function to generate JWt token
const generateJwtToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
    };

    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secretKey, options);
};

// function to decode & verify JWT token
const verifyJwtToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
};

module.exports = {
    generateJwtToken,
    verifyJwtToken,
};