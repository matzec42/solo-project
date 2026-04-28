import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RecipeDetail = () => {
    // hook to grab recipe ID (params in the URL)
    const { id } = useParams();
    // hook for navigating back to results
    const navigate = useNavigate();

    // state hooks for recipe details, loading and error
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // renders data in the RecipeDetail component (a Link that is a child of SearchResults.js component, a single page view of a recipe
    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
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

                if (!response.ok) {
                    throw new Error('A network error occurred.')
                }

                const data = await response.json();
                console.log(`Recipe data received:`, data);
                setDetails(data);

            } catch (error) {
                console.error('Error in response from server:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        // invoke useEffect (fetching recipe details) when id exists 
        if (id) fetchRecipeDetails();

    }, [id])

    // 
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!details) return null;

    return (
        <div id="recipeDetailPage">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back to results
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
                        <button>Save Recipe</button>
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