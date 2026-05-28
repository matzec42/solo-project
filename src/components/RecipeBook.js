import React from 'react';
import RecipeCardDisplay from './RecipeCardDisplay';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const RecipeBook = () => {

    const [activeTab, setActiveTab] = useState('user');
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [userRecipes, setUserRecipes] = useState([]);

    const [savedPage, setSavedPage] = useState(1);
    const SAVED_PER_PAGE = 8;
    const totalSavedPages = Math.ceil(savedRecipes.length / SAVED_PER_PAGE);
    const savedStartIndex = (savedPage - 1) * SAVED_PER_PAGE;
    const paginatedSaved = savedRecipes.slice(savedStartIndex, savedStartIndex + SAVED_PER_PAGE);

    const handleGetUserRecipes = async () => {
        try {
            const response = await fetch("http://localhost:3000/v2/user-recipes", {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to retrieve recipes');

            const data = await response.json();
            if (data) setUserRecipes(data);

        } catch (err) {
            console.error('Error fetching user recipes');
        }
    }

    const handleGetSavedRecipes = async () => {
        try {
            const response = await fetch("http://localhost:3000/v2/saved-recipes", {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to retrieve recipes');

            const data = await response.json();
            if (data) setSavedRecipes(data);

        } catch (err) {
            console.error('Error fetching saved recipes');
        }
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (tab === 'saved') handleGetSavedRecipes();
        if (tab === 'user') handleGetUserRecipes();
    }

    return (
        <div id='recipeBook'>
            <h2>My Recipe Book</h2>

            <div id='recipeBookTabs'>
                <button
                    className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
                    onClick={() => handleTabClick('user')}
                >
                    My Recipes
                </button>
                <button
                    className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => handleTabClick('saved')}
                >
                    Saved Recipes
                </button>
            </div>

            <div id='recipeBookContent'>
                {activeTab === 'user' && <RecipeCardDisplay userRecipes={userRecipes} />}

                {activeTab === 'saved' && (
                    <div>
                        <div className='searchResultsThumbnails'>
                            {paginatedSaved.map(recipe => (
                                <Link key={recipe.id} to={`/saved-recipes/${recipe.id}`} className='recipeSearchResult'>
                                    <div className='resultItem'>
                                        {recipe.image && <img src={recipe.image} alt={recipe.title} />}
                                        <h3>{recipe.title}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {savedRecipes.length > 0 && (
                            <div id='pagination'>
                                <button onClick={() => setSavedPage(prev => prev - 1)} disabled={savedPage === 1}>
                                    Previous
                                </button>
                                <span>{savedPage} of {totalSavedPages}</span>
                                <button onClick={() => setSavedPage(prev => prev + 1)} disabled={savedPage === totalSavedPages}>
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default RecipeBook