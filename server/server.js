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
    origin: ['http://localhost:8080', 'https://localhost:8080', 'http://localhost:3000', 'https://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));

// statically serve assets in build folder
app.use(express.static(path.resolve(__dirname, '../build/')));
// serve contents of the webpack build folder (index_bundle.js)
app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../build', 'index.html'));
});


// FUTURE WORK: route handlers ---> user-made recipe card CRUD operations (delete, update)


/** Authentication routes **/
app.get('/v2/verify', authController.verify, (req, res) => {
    return res.status(200).json(res.locals.verifiedUser);
});

app.post('/v2/login', authController.login, (req, res) => {
    return res.status(200).json(res.locals.authenticatedUser);
});

app.post('/v2/logout', authController.logout, (req, res) => {
    return res.status(200).json({ message: 'Successfully logged out.' });
});

app.post('/v2/signup', authController.signUp, (req, res) => {
    return res.status(200).json(res.locals.newUser);
});


/** Search-Related routes **/

// route handler for user search --- "What Can I Make With ..." search bar
app.post('/v2/search', searchController.searchByIngredient, (req, res) => {
    res.status(200).json(res.locals.searchResults);
});

// route handler for fetching specific recipe details based on a user's selection of a search result
app.post('/v2/recipe-details', searchController.fetchRecipeDetails, (req, res) => {
    try {
        console.log('Sending recipe details to frontend:', res.locals.fetchedRecipeDetails);
        res.status(200).json(res.locals.fetchedRecipeDetails);

    } catch (err) {
        console.error('Error in /v2/recipe-details route handler:', err)
        return next(err)
    }
})


/** Saving Recipes routes **/

// route for saving a Spoonacular recipe
app.post('/v2/save-recipe', recipeController.saveSpoonacularRecipe, (req, res) => {
    return res.status(200).json(res.locals.savedRecipe);
});

// route for saving user-created new recipe
app.post('/v2/new-user-recipe', recipeController.addNewUserRecipe, (req, res) => {
    return res.status(200).json(res.locals.newRecipe);
});


/** Recipe Deletion **/

app.delete('/v2/delete-recipe', recipeController.deleteRecipe, (req, res) => {
    return res.status(200).json(res.locals.deletedRecipe);
})


/** Recipe Fetching (GET Request) routes **/

// route for fetching a single recipe from DB by id
app.get('/v2/recipe-by-id/:id', recipeController.getRecipeById, (req, res) => {
    return res.status(200).json(res.locals.recipe);
});

// route for fetching all user-created recipes
app.get('/v2/user-recipes', recipeController.getAllUserRecipes, (req, res) => {
    return res.status(200).json(res.locals.userSavedRecipes);
});

// route for fetching all Spoonacular recipes saved by a user
app.get('/v2/saved-recipes', recipeController.getSavedSpoonacularRecipes, (req, res) => {
    return res.status(200).json(res.locals.savedSpoonacularRecipes);
})


app.options('*', cors());

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