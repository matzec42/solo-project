import React from 'react';
import RecipeImage from './RecipeImage';

const searchResults = ({ results }) => {
    // console.log('In the searchResults component:', props.results);
    const displayResults = results;

    // div component to render search results
    return (
        <div id='searchResults'>
            <ul>
                {Array.isArray(displayResults) ? (
                    displayResults.map((recipe, index) => (
                        <> 
                            <li className= 'imgLink' >{<RecipeImage key={`image-${index}`} imgResult={recipe.image}/>}</li>
                        </>
                    ))
                ) : (
                    <li>No results found.</li>
                )}
            </ul>
        </div>
    );
};

export default searchResults