const { response } = require('express');
const pool = require('../models/ingredibleModel');
const { verifyJwtToken } = require('../services/jwtService');

const recipeController = {};

recipeController.addNewUserRecipe = async (req, res, next) => {
    const { recipeName, ingredients, directions } = req.body;
    
    try {
        const token = req.cookies.token;

        // grab token to include in query string (associate user with recipe they make)
        if (!token) throw new Error('No token provided');
        const decoded = verifyJwtToken(token);
        const userId = decoded.id;

        // error handling for missing field
        if (!recipeName || !ingredients || !directions || !userId) {
            return next({
                log: 'In recipeController.addNewUserRecipe, missing a field',
                status: 401,
                message: {
                    err: 'All fields required to add recipe'
                }
            });
        }

        const queryString = `INSERT INTO recipes (recipe_name, ingredients, directions, user_id) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [recipeName, ingredients, directions, userId];

        const addNewRecipeResult = await pool.query(queryString, values);
        console.log('New recipe in the DB:', addNewRecipeResult.rows[0]);

        if(addNewRecipeResult.rows.length === 0) {
            return next({
                log: 'In recipeController.addNewUserRecipe, unable to add recipe',
                status: 401,
                message: { err: 'Invalid submission'}
            });
        }

        const newRecipe = addNewRecipeResult.rows[0];
        res.locals.newRecipe = newRecipe
        return next();

    } catch (err) {
        console.error('Add new recipe error:', err)
        return next({
            log: 'Error in recipeController.addNewUserRecipe',
            status: 500,
            message: { err: 'An error occurred' }
        });
    }
}


recipeController.getAllUserRecipes = async (req, res, next) => {

    try {
        // get token from req body
        const token = req.cookies.token;

        // grab token to include in query string (associate user with recipe they make)
        if (!token) throw new Error('No token provided');
        const decoded = verifyJwtToken(token);
        const userId = decoded.id;

        // form query string to query database --- select all recipes with user's id, grabbed from token
        const queryString = `SELECT * FROM recipes WHERE user_id = $1`;
        const values = [userId];

        const userRecipesResult = await pool.query(queryString, values);

        if(userRecipesResult.rows.length === 0) {
            return next({
                log: 'In recipeController.getAllUserRecipes, unable to fetch recipes',
                status: 401,
                message: { err: 'An error occurred'}
            });
        }

        // response should be an array of recipe objects (name of recipe, ingredients, directions)
        res.locals.userSavedRecipes = userRecipesResult.rows;
        return next();

    } catch (err) {
        console.error('Error in getAllUserRecipes:', err);
        return next({
            log: 'recipeController.getAllUserRecipes error',
            status: 500,
            message: { err: 'Failed to retrieve user recipes' },
        });
    }
}

module.exports = recipeController;