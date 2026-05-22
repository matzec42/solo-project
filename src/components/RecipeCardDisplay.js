import React from 'react';
import RecipeCardMaker from './RecipeCardForm';
import { useState } from 'react';

const RecipeCardDisplay = () => {

    // FUTURE WORK --- working with this component and RecipeCardForm, display user generated recipes
    
    const [isClicked, setIsClicked] = useState(false);
    const [recipeCards, setRecipeCards] = useState([]);

    const handleGetUserRecipes = async (e) => {

        // GET request for user recipes --- include credentials
        try {
            const getAllUserRecipesResponse = await fetch("http://localhost:3000/v2/user-recipes", {
                method: 'GET',
                credentials: 'include',
            });

            if (!getAllUserRecipesResponse.ok) {
                throw new Error('Failed to retrieve recipes')
            };

            const data = await getAllUserRecipesResponse.json();
            if (data) setRecipeCards(data);
            console.log('User-made recipes:', data);

        } catch (err) {
            console.error('Error fetching recipes');
        }

        
    }
    
    // FUTURE WORK: make & render user-made recipes as components
    
    return (
        <div id='recipeCardDisplay'>            
            <RecipeCardMaker />
            <button id='getUserRecipesButton' onClick={handleGetUserRecipes}>Get My Recipes</button>

            {recipeCards.length > 0 && (
                <div id='userRecipesGrid'>
                    {recipeCards.map((recipe, index) => (
                        <div key={index} className='userRecipeCard'>
                            <h4>{recipe.title}</h4>
                            <p>{recipe.ingredients}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RecipeCardDisplay