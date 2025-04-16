import React, { useState } from 'react';

const RecipeCard = () => {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [directions, setDirections] = useState('');

    const handleAddRecipe = async (e) => {
        e.preventDefault();

        try {
            // handle the recipe submission (e.g., request to server, then store in database)
            if (recipeName && ingredients && directions) {
                const addNewRecipeResponse = await fetch("http://localhost:3000/addnewrecipe", {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ recipeName, ingredients, directions })
                });

                if (!addNewRecipeResponse.ok) {
                    throw new Error('A network error occurred.');
                }

                const data = await addNewRecipeResponse.json();
                console.log('Response from server for new user recipe:', data);

                setRecipeName('');
                setIngredients('');
                setDirections('');

                // FUTURE WORK: render a new React component for the recipe in browser on client side;
                // develop a recipe feed (more CRUD) for user created recipes

            }
        } catch (err) {
            console.error('Error adding recipe:', err);
        }
    };

    return (
        <div id='recipeMakerDiv'>
            <form onSubmit={handleAddRecipe}>
                <div className='recipeCardMakerFieldDivs'>
                    <label htmlFor='recipeName'>Recipe Name: </label>
                    <input 
                        type='text' 
                        id='recipeName' 
                        value={recipeName} 
                        onChange={(e) => setRecipeName(e.target.value)} 
                        required 
                    />
                </div>
                <div className='recipeCardMakerFieldDivs'>
                    <label htmlFor='ingredients'>Ingredients: </label>
                    <textarea 
                        id='ingredients' 
                        value={ingredients} 
                        onChange={(e) => setIngredients(e.target.value)} 
                        required 
                    />
                </div>
                <div className='recipeCardMakerFieldDivs'>
                    <label htmlFor='directions'>Directions: </label>
                    <textarea 
                        id='directions' 
                        value={directions} 
                        onChange={(e) => setDirections(e.target.value)} 
                        required 
                    />
                </div>
                <button id='addRecipeBtn' type='submit'>Add a New Recipe</button>
                <button id='deleteRecipeBtn' type='button' /*onClick={handleDeleteRecipe}*/ >Delete a Recipe</button>
            </form>
        </div>
    );
};

export default RecipeCard;


