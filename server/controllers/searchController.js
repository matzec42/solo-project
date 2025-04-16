const { response } = require('express');
const { pool } = require('../models/ingredibleModel')
require('dotenv').config();

const searchController = {};

const apiKey = process.env.SPOONACULAR_API_KEY;

searchController.searchByIngredient = (req, res, next) => {
    // store searched term in a variable
    const searchTerm = req.body.data;
    
    // recall use of req.params in Unit 9, 10. Use of variable and template literal to query the Star Wars API from one of the middleware functions
    // something similar here with spoonacular API

    const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${searchTerm}&number=3`;

    // initial set up --- consider async/await and try/catch for consistency
    fetch(url)
    .then(response => {
        if(!response.ok) {
            // console.log('In the first .then, response is not OK')
            // console.log(response);
            throw new Error(`Error with API request. Status: ${response.status}`)
        }
        return response.json();
    }
    )
    .then(data => {
        console.log('DB results from a searched term in searchController:', data);
        // store retrieved recipes in res.locals, pass to next middleware
        res.locals.searchResults = data;
        
        return next();
    })
    .catch(err => {
        // console.log(`Error with web API fetch. Error: ${err}`);
        return next({
            log: `Error with web API fetch. Error: ${err}`,
            status: 500,
            error: 'Something went wrong with your search.'
        });
    })
}

searchController.fetchRecipeCards = async (req, res, next) => {
    const { recipeIds } = req.body;

    try {
        const recipeImages = await Promise.all(recipeIds.map(async (id) => {
            const response = await fetch(`https://api.spoonacular.com/recipes/${id}/card?apiKey=${apiKey}`);
            // const response = await fetch(`https://api.spoonacular.com/recipes/${id}/card`)
            // const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?image=true`)

            // parse the response as JSON
            const data = await response.json();
            return { id, image: data.url }
        }));

        console.log('Recipe card images fetched:', recipeImages);

        // store fetched cards in res.locals for response
        res.locals.fetchedRecipeCards = recipeImages;
        return next();

    } catch (err) {
        return next({
            log: 'In searchController.fetchRecipeCards, error fetching recipe images',
            status: 500,
            message: { err: 'An error occurred while fetching recipe images.' }
        });
    }

}

module.exports = searchController;