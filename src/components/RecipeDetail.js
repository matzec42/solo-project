import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

/* RecipeDetail --- reusable component for rendering Spoonacular-searched Recipes or user-made recipes on a single page */

const RecipeDetail = () => {
    // state hooks for recipe details, loading and error
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // hook to determine URL path for fetch logic (and backend routing)
    const location = useLocation();
    const isUserRecipe = location.pathname.startsWith('/my-recipes');
    const isSavedRecipe = location.pathname.startsWith('/saved-recipes');

    // hook to grab recipe ID (params in the URL)
    const { id } = useParams();
    // hook for navigating back to results
    const navigate = useNavigate();


    const handleSaveRecipe = async () => {
        // console.log('Recipe details being sent', details);

        try {
            const saveRecipeResponse = await fetch("http://localhost:3000/v2/save-recipe", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(details)
            });

            if (!saveRecipeResponse.ok) {
                throw new Error('Failed to save recipe.');
            }
            const data = await saveRecipeResponse.json();
            // console.log('Recipe saved successfullly:', data);
            alert('Recipe successfully saved to your recipe book!');

        } catch (err) {
            console.error('Error saving recipe:', err);
        }
    }


    // renders data in this RecipeDetail component (a Link that is a child of SearchResults.js component or a saved recipe -> a single page view of a recipe)
    useEffect(() => {
        // function to fetch recipe details (saved recipes --- either user-made OR Spoonacular)
        const fetchRecipeDetails = async () => {
            try {
                let data;
                // fetch for a saved recipe, including user recipe ID or Spoonacular ID in URL params
                if (isUserRecipe || isSavedRecipe) {
                    const response = await fetch(`http://localhost:3000/v2/recipe-by-id/${id}`, {
                        method: 'GET',
                        credentials: 'include',
                    })

                    if (!response.ok) throw new Error('A network error occurred.');
                    data = await response.json();

                } else {
                    // fetch for Spoonacular recipe based on a user search --- i.e., a result of a search (see SearchContainer, SearchResults components)
                    const response = await fetch("http://localhost:3000/v2/recipe-details", {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        // mode: 'no-cors',
                        body: JSON.stringify({
                            data: id
                        }),
                    });

                    if (!response.ok) throw new Error('A network error occurred.');
                    data = await response.json();
                }

                // update recipe details for rendering
                setDetails(data);

            } catch (error) {
                console.error('Error in response from server:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        // invoke useEffect (fetching user or saved recipe details) when id exists
        if (id) fetchRecipeDetails();

    }, [id, isUserRecipe, isSavedRecipe])


    // conditional components while data is fetched/rendered
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!details) return null;


    return (
        <div id="recipeDetailPage">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            {/* Recipe image */}
            <div className="recipe-hero">
                <img src={details.image} alt={details.title} />
                <div className="recipe-hero-overlay" />
                <div className="recipe-hero-title">
                    <h2>{details.title}</h2>
                    <div className="recipe-pills">
                        {details.dishTypes && details.dishTypes.map((type, i) => (
                            <span key={i} className="pill">{type}</span>
                        ))}
                        {details.diets && details.diets.map((diet, i) => (
                            <span key={i} className="pill diet">{diet}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Body: Instructions + Sidebar (i.e., stats & ingredients */}
            <div className="recipe-body">

                {/* Instructions */}
                <div className="recipe-card">
                    <p className="card-label">Instructions</p>
                    <p className="instructions-text">{details.instructions ?? 'Assemble the ingredients and enjoy!'}</p>
                    {/* User interactions --- save recipe, e.g. */}
                    <div id="recipe-card-user-interactions" className="recipe-card">
                        <p className="card-label">Add to My Recipe Book</p>
                        <button onClick={handleSaveRecipe}>Save Recipe</button>
                    </div>
                </div>

                {/* Sidebar --- recipe stats and ingredient list */}
                <div>
                    {/* Stats (total mins, servings, prep mins and cook mins) */}
                    <div className="recipe-card" style={{ marginBottom: '1.5em' }}>
                        <p className="card-label">At a glance</p>
                        <div className="stat-grid">
                            <div className="stat-cell">
                                <span className="stat-value">{details.readyInMinutes}</span>
                                <span className="stat-label">Total mins</span>
                            </div>
                            <div className="stat-cell">
                                <span className="stat-value">{details.servings}</span>
                                <span className="stat-label">Servings</span>
                            </div>
                            <div className="stat-cell">
                                <span className="stat-value">{details.preparationMinutes ?? '—'}</span>
                                <span className="stat-label">Prep mins</span>
                            </div>
                            <div className="stat-cell">
                                <span className="stat-value">{details.cookingMinutes ?? '—'}</span>
                                <span className="stat-label">Cook mins</span>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="recipe-card">
                        <p className="card-label">Ingredients</p>
                        <ul className="ingredients-list">
                            {details.extendedIngredients && details.extendedIngredients.map((ingredient, i) => (
                                <li key={i} className="ingredient-item">
                                    {ingredient.image
                                        ? <img
                                            className="ingredient-img"
                                            src={`https://img.spoonacular.com/ingredients_100x100/${ingredient.image}`}
                                            alt={ingredient.name}
                                        />
                                        : <div className="ingredient-img-placeholder" />
                                    }
                                    <span className="ingredient-name">{ingredient.name}</span>
                                    <span className="ingredient-amount">
                                        {ingredient.amount} {ingredient.unit}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetail