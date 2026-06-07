import React from 'react';
import RecipeCardForm from './RecipeCardForm';
import { useState } from 'react';
import { Link } from 'react-router-dom';


const RecipeCardDisplay = ({ userRecipes }) => {

    const [currentPage, setCurrentPage] = useState(1);

    const RECIPES_PER_PAGE = 8;
    const totalPages = Math.ceil(userRecipes.length / RECIPES_PER_PAGE);
    const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
    const paginatedRecipes = userRecipes.slice(startIndex, startIndex + RECIPES_PER_PAGE);

    return (
        <div id='recipeCardDisplay'>
            <div className='searchResultsThumbnails'>
                {paginatedRecipes.map((recipe) => (
                    <Link key={recipe.id} to={`/my-recipes/${recipe.id}`} className='recipeSearchResult'>
                        <div className='resultItem'>
                            <span className='source-badge user-badge'>My Recipe</span>
                            {recipe.image && <img src={recipe.image} alt={recipe.title} />}
                            <h3>{recipe.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>
            {userRecipes.length > 0 && (
                <div id='pagination'>
                    <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>{currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}

            <RecipeCardForm />
        </div>
    )
}

export default RecipeCardDisplay