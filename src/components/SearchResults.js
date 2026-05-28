import React from 'react';
import RecipeResult from './RecipeResult';

const searchResults = ({ results }) => {

    const displayResults = results;

    // renders search results (clickable names with pictures)
    return (
        <div id='searchResults'>
            <div className='searchResultsThumbnails'>
                {displayResults.map((recipe) => (
                    <div key={recipe.id} className='imgLink'>
                        <RecipeResult
                            titleResult={recipe.title}
                            imgResult={recipe.image}
                            recipeId={recipe.id}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default searchResults