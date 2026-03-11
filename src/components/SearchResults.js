import React from 'react';
import RecipeResult from './RecipeResult';

const searchResults = ({ results }) => {

    const displayResults = results;

    // renders search results (clickable names with pictures)
    // anticipate future work --- navigating into RecipeResult --> RecipeDetail, then navigating back (keeping search results/maintaining state)
    // consider useContext hook, as its a simple use case
    return (
        <div id='searchResults'>
            <ul className='searchResultsThumbnails'>
                {Array.isArray(displayResults) && displayResults.length ? (
                    displayResults.map((recipe, index) => (
                        <li key={recipe.id} className='imgLink'>{
                            <RecipeResult
                                titleResult={recipe.title}
                                imgResult={recipe.image}
                                recipeId={recipe.id} />
                        }
                        </li>
                    ))
                ) : (
                    <li>New recipes await you...</li>
                )}
            </ul>
        </div>
    );
};

export default searchResults