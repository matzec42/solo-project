import React, { useState } from 'react';

const RecipeCardForm = () => {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState([ { name: '', amount: '', unit: '' } ]);
    const [directions, setDirections] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    }

    const handleAddRecipe = async (e) => {
        e.preventDefault();
        try {
            // handle the recipe submission (e.g., request to server, then store in database)
            if (recipeName && ingredients && directions) {
                const addNewRecipeResponse = await fetch("http://localhost:3000/v2/new-user-recipe", {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ recipeName, ingredients, directions, imageUrl })
                });

                if (!addNewRecipeResponse.ok) {
                    throw new Error('A network error occurred.');
                }

                const data = await addNewRecipeResponse.json();
                console.log('Response from server for new user recipe:', data);

                setRecipeName('');
                setIngredients([ { name: '', amount: '', unit: '' } ]);
                setDirections('');
                setImageUrl('');

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
                    {ingredients.map((ingredient, index) => (
                        <div key={index}>
                            <input
                                type='text'
                                placeholder='Ingredient name'
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                            />
                            <input
                                type='text'
                                placeholder='Amount'
                                value={ingredient.amount}
                                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                            />
                            <input
                                type='text'
                                placeholder='Unit'
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                            />
                            <button type='button' onClick={handleAddIngredient}>Add Ingredient</button>
                            <button type='button' onClick={() => handleRemoveIngredient(index)}>Remove Ingredient</button>
                        </div>
                    ))}
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
                <div className='recipeCardMakerFieldDivs'>
                    <label htmlFor='imageUrl'>Image URL: </label>
                    <input 
                        type='text' 
                        id='imageUrl' 
                        value={imageUrl} 
                        onChange={(e) => setImageUrl(e.target.value)} 
                    />
                </div>
                <button id='addRecipeBtn' type='submit'>Add a New Recipe</button>
                <button id='deleteRecipeBtn' type='button' /*onClick={handleDeleteRecipe}*/ >Delete a Recipe</button>
            </form>
        </div>
    );
};

export default RecipeCardForm;