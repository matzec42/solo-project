const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = 3000;
const searchController = require('./controllers/searchController');
const recipeController = require('./controllers/recipeController');
const authController = require('./controllers/authController');


// parse JSON of the incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// CORS configuration
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));


// statically serve assets in build folder
app.use(express.static(path.resolve(__dirname, '../build/')));
// serve contents of the webpack build folder (index_bundle.js)
app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../build', 'index.html'));
});

// previously instantiated routers to direct requests to appropriate controller, did not work.
// FUTURE WORK: route handlers ---> search by ingredient; recipe card CRUD operations; auth

app.get('/verify', authController.verify, (req, res) => {
    return res.status(200).json(res.locals.verifiedUser)
});

app.post('/login', authController.login, (req, res) => {
    return res.status(200).json(res.locals.authenticatedUser);
});

app.post('/logout', authController.logout, (req, res) => {
    return res.status(200).json({ message: 'Successfully logged out.' });
});

app.post('/signup', authController.signUp, (req, res) => {
    return res.status(200).json(res.locals.newUser);
});

// route handler for "What Can I Make With ..." search bar
app.post('/search', searchController.searchByIngredient, (req, res) => {
    res.status(200).json(res.locals.searchResults);
});

app.post('/fetchRecipeCards', searchController.fetchRecipeCards, (req, res) => {
    try {
        console.log('Sending recipe card images to frontend:', res.locals.fetchedRecipeCards);
        res.status(200).json(res.locals.fetchedRecipeCards);

    } catch (err) {
        console.error('Error in /fetchRecipeCards route handler:', err)
        return next(err)
    }
})

// route for user-created new recipe
app.post('/addnewrecipe', recipeController.addNewUserRecipe, (req, res) => {
    return res.status(200).json(res.locals.newRecipe);
});

// route for fetching all user-created recipes
app.get('/getmyrecipes', recipeController.getAllUserRecipes, (req, res) => {
    return res.status(200).json(res.locals.userSavedRecipes);
});

// unknown route handler
// serve index.html for any other route (let React handle it)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

// global error handler
app.use((err, req, res, next) => {
    const defaultError = {
        log: 'Express error handler caught an error in middleware',
        status: 500,
        message: { err: 'An error occurred' }
    };
    const errorObj = { ...defaultError, ...err };
    console.error(errorObj.log);
    return res.status(errorObj.status).json(
        typeof errorObj.message === 'object'
            ? errorObj.message
            : { err: errorObj.message || 'An error occurred' }
    );
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
})

module.exports = app;