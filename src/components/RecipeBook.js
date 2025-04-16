import React from 'react';
import RecipeCardDisplay from './RecipeCardDisplay';

const RecipeBook = () => {
    return(
        <div id='recipeBook'>
            <h2>My Own Recipe Book</h2>
            <h4>Write and save your own recipes below!</h4>
            <RecipeCardDisplay />
        </div>
    )
}

export default RecipeBook