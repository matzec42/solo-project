import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RecipeResult = ({ titleResult, imgResult, recipeId }) => {
    
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const renderRecipeResults = async () => {
            try {
                // check if data and image URLs exist
                if (imgResult !== null) {
                    // update state with the images
                    setImageData(imgResult);
                } else {
                    throw new Error('No image provided.');
                }
            } catch (error) {
                setError(`Error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        renderRecipeResults();
    }, [titleResult, imgResult]);

    if (loading) {
        return <div>...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // clickable Link component, goes to new page for that recipe
    return (
        <div className='resultItem'>
            {imageData ? (
                <div>
                    <Link className='recipeSearchResult' to={`/recipes/${recipeId}`}>
                        <h3>{titleResult}</h3>
                        <img src={imageData} alt='Recipe' />
                    </Link>
                </div>
            ) : (
                'No image available'
            )}
        </div>
    );
};

export default RecipeResult;
