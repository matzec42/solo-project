const { response } = require('express');
const pool = require('../models/ingredibleModel');
const { verifyJwtToken } = require('../services/jwtService');

const recipeController = {};

recipeController.saveSpoonacularRecipe = async (req, res, next) => {
    const recipe = req.body;
    console.log('req.body in saveSpoonacularRecipe controller:', req.body);

    try {
        const token = req.cookies.token;

        // grab token to include in query string (associate user with recipe they make)
        if (!token) throw new Error('No token provided');
        const decoded = verifyJwtToken(token);
        const userId = decoded.id;

        // error handling
        if (!recipe.id || !userId) {
            return next({
                log: 'In recipeController.saveSpoonacularRecipe, missing a field',
                status: 401,
                message: {
                    err: 'All fields required to save recipe'
                }
            });
        }

        const queryString = `
            INSERT INTO recipes (title, instructions, extended_ingredients, image, user_id, source, spoonacular_id, ready_in_minutes, servings, preparation_minutes, cooking_minutes, dish_types, diets)
            VALUES ($1, $2, $3, $4, $5, 'spoonacular', $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `;
        const values = [
            recipe.title, recipe.instructions, JSON.stringify(recipe.extendedIngredients),
            recipe.image || null, userId, recipe.id,
            recipe.readyInMinutes || null, recipe.servings || null,
            recipe.preparationMinutes || null, recipe.cookingMinutes || null,
            recipe.dishTypes || [], recipe.diets || []
        ];

        const checkDuplicate = await pool.query(
            `SELECT id FROM recipes WHERE spoonacular_id = $1 AND user_id = $2`,
            [recipe.id, userId]
        );

        if (checkDuplicate.rows.length > 0) {
            return next({
                log: 'Duplicate recipe',
                status: 409,
                message: { err: 'Recipe already saved' }
            });
        }

        const saveRecipeResult = await pool.query(queryString, values);
        // console.log('Saved recipe in the DB:', saveRecipeResult.rows[0]);

        res.locals.savedRecipe = saveRecipeResult.rows[0];
        return next();

    } catch (err) {
        console.error('Save Spoonacular recipe error:', err)
        return next({
            log: 'Error in recipeController.saveSpoonacularRecipe',
            status: 500,
            message: { err: 'An error occurred' }
        });
    }
}


recipeController.addNewUserRecipe = async (req, res, next) => {
    const { recipeName, ingredients, directions, imageUrl, servings, readyInMinutes, dishTypes, diets } = req.body;

    try {
        const token = req.cookies.token;

        // grab token to include in query string (associate user with recipe they create)
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

        const queryString = `
            INSERT INTO recipes (title, instructions, extended_ingredients, image, user_id, source, servings, ready_in_minutes, dish_types, diets)
            VALUES ($1, $2, $3, $4, $5, 'user', $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [recipeName, directions, JSON.stringify(ingredients), imageUrl || null, userId, servings || null, readyInMinutes || null, dishTypes || [], diets || []];

        const addNewRecipeResult = await pool.query(queryString, values);
        // console.log('New recipe in the DB:', addNewRecipeResult.rows[0]);

        if (addNewRecipeResult.rows.length === 0) {
            return next({
                log: 'In recipeController.addNewUserRecipe, unable to add recipe',
                status: 401,
                message: { err: 'Invalid submission' }
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


recipeController.getRecipeById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const token = req.cookies.token;

        // grab token to include in query string (associate user with recipe they choose)
        if (!token) throw new Error('No token provided');
        const decoded = verifyJwtToken(token);
        const userId = decoded.id;

        // error handling for missing id
        if (!id) {
            return next({
                log: 'In recipeController.addNewUserRecipe, missing a field',
                status: 401,
                message: {
                    err: 'All fields required to add recipe'
                }
            });
        }

        const queryString = `SELECT * FROM recipes WHERE id = $1 AND user_id = $2`;
        const values = [id, userId];

        const recipeDetails = await pool.query(queryString, values);

        const row = recipeDetails.rows[0];
        if (!row) return next({
            log: 'recipeController.getRecipeById, recipe not found',
            status: 404,
            message: { err: 'Recipe not found' }
        });

        // normalizing response object (corresponding with table names)
        res.locals.recipe = {
            id: row.id,
            title: row.title,
            image: row.image,
            instructions: row.instructions,
            servings: row.servings,
            readyInMinutes: row.ready_in_minutes,
            preparationMinutes: row.preparation_minutes,
            cookingMinutes: row.cooking_minutes,
            dishTypes: row.dish_types,
            diets: row.diets,
            extendedIngredients: typeof row.extended_ingredients === 'string' ? JSON.parse(row.extended_ingredients) : row.extended_ingredients,
            source: row.source,
            spoonacularId: row.spoonacular_id,
        };

        return next();

    } catch (err) {
        console.error('Error in getRecipeById:', err);
        return next({
            log: 'recipeController.getRecipeById error',
            status: 500,
            message: { err: 'Failed to retrieve recipe' },
        });
    }
}


recipeController.getAllUserRecipes = async (req, res, next) => {
    try {
        // get token from req body
        const token = req.cookies.token;

        // grab token to include in query string (associate user with recipes they saved)
        if (!token) throw new Error('No token provided');
        const decoded = verifyJwtToken(token);
        const userId = decoded.id;

        // form query string to query database --- select all recipes with user's id, source is 'user'
        const queryString = `SELECT * FROM recipes WHERE user_id = $1 AND source = 'user'`;
        const values = [userId];

        const userRecipesResult = await pool.query(queryString, values);

        // response is an array of recipe objects (name of recipe, ingredients, directions, etc.)
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

recipeController.getSavedSpoonacularRecipes = async (req, res, next) => {

    try {
        // get token from req body
        const token = req.cookies.token;

        // grab token to include in query string (associate user with recipes they saved)
        if (!token) throw new Error('No token provided');
        const decoded = verifyJwtToken(token);
        const userId = decoded.id;

        // form query string to query database --- select all recipes with user's id and Spoonacular as source
        const queryString = `SELECT * FROM recipes WHERE user_id = $1 AND source = 'spoonacular'`;
        const values = [userId];

        const savedSpoonacularRecipesResult = await pool.query(queryString, values);

        // response should be an array of recipe objects (name of recipe, ingredients, directions)
        res.locals.savedSpoonacularRecipes = savedSpoonacularRecipesResult.rows;
        return next();

    } catch (err) {
        console.error('Error in getSavedSpoonacularRecipes:', err);
        return next({
            log: 'recipeController.getSavedSpoonacularRecipes error',
            status: 500,
            message: { err: 'Failed to retrieve saved recipes' },
        });
    }
}

module.exports = recipeController;