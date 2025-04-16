import React from 'react';
import RecipeCardMaker from './RecipeCardMaker';
import { useState } from 'react';

const RecipeCardDisplay = () => {

    // FUTURE WORK --- working with this component and RecipeCardMaker, display user generated recipes
    
    const [isClicked, setIsClicked] = useState(false);
    const [recipeCards, setRecipeCards] = useState([]);

    const handleGetUserRecipes = async (e) => {
        console.log('Get User Recipes button test');

        // GET request for user recipes --- include credentials
        try {
            const getAllUserRecipesResponse = await fetch("http://localhost:3000/getmyrecipes", {
                method: 'GET',
                credentials: 'include',
            });

            if (!getAllUserRecipesResponse.ok) {
                throw new Error('Failed to retrieve recipes')
            };

            const data = await getAllUserRecipesResponse.json();
            console.log('User-made recipes:', data);

        } catch (err) {
            console.error('Error fetching recipes');
        }

        // FUTURE WORK: make & render user-made recipes as components

    }

    return (
        <div id='cardDisplay'>            
            <RecipeCardMaker />
            <button id='getUserRecipesButton' onClick={handleGetUserRecipes}>Get My Recipes</button>
        </div>
    )
}

export default RecipeCardDisplay