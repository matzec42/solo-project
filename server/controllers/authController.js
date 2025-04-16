const { generateJwtToken, verifyJwtToken } = require('../services/jwtService');
const pool = require('../models/ingredibleModel');

const authController = {};

authController.verify = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next({
            log: 'In authController.verify, missing token',
                status: 401,
                message: {
                    err: 'Token not found'
            }
        })
    }

    try {
        const decoded = verifyJwtToken(token);
        res.locals.verifiedUser = decoded;
        return next();
    } catch {
        return next({
            log: 'In authController.verify, invalid token',
            status: 401,
            message: { error: 'Authentication required.'}
        });
    }
}


authController.login = async (req, res, next) => {
    // console.log(req.body);
    const { username, password } = req.body;

    try {
        // error handling for missing username or password
        if (!username || !password) {
            return next({
                log: 'In authController.login, missing username or password',
                status: 400,
                message: {
                    err: 'Failed to log in.'
                }
            });
        }

        // query string for checking DB for username and PW
        const queryString = `SELECT * FROM users WHERE username = $1 AND password = $2`;
        const values = [username, password];

        const loginResult = await pool.query(queryString, values);
        console.log('Login result from DB:', loginResult.rows[0]);

        
        if(loginResult.rows.length === 0) {
            return next({
                log: 'In authController.login, invalid login credentials',
                status: 401,
                message: { err: 'Invalid username or password.'}
            });
        }

        const user = loginResult.rows[0];
        const token = generateJwtToken({ id: user.id, username: user.username })
        
        res.locals.authenticatedUser = { id: user.id, username: user.username }
        res.cookie('token', token, { maxAge: 300000, httpOnly: true, secure: false, sameSite: 'Lax' })
        
        return next();

    } catch (err) {
        return next({
            log: 'Error in authController.login',
            status: 500,
            message: { err: 'An error occurred' }
        });
    }
}


authController.signUp = async (req, res, next) => {
    const { newUsername, newPassword } = req.body;
    console.log('Sign up request body:', newUsername, newPassword);

    try {
        // error handling for missing username or password
        if (!newUsername || !newPassword) {
            return next({
                log: 'In authController.signup, missing username or password',
                status: 400,
                message: {
                    err: 'Failed to sign up.'
                }
            });
        }

        // query string for checking/inserting DB for username and PW
        const queryString = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`;
        const values = [newUsername, newPassword];

        const signUpResult = await pool.query(queryString, values);
        console.log('New user in the DB:', signUpResult.rows[0]);

        if(signUpResult.rows.length === 0) {
            return next({
                log: 'In authController.signup, invalid login credentials',
                status: 401,
                message: { err: 'Invalid username or password.'}
            });
        }

        const newUser = signUpResult.rows[0];
        res.locals.newUser = { id: newUser.id, username: newUser.username};

        return next();

    } catch (err) {
        console.error('Signup error:', err)
        return next({
            log: 'Error in authController.signup:',
            status: 500,
            message: { err: 'An error occurred' }
        });
    }
}


authController.logout = async (req, res, next) => {
    res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Lax' });
    return next();
}

module.exports = authController;