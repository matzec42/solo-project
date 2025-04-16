import React, { useState, useEffect } from 'react';

const RecipeImage = ({ imgResult }) => {
    // console.log('Logging props in RecipeImage.js:', props);

    
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const renderRecipeCards = async () => {
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
        renderRecipeCards();
    }, [imgResult]);

    if (loading) {
        return <div>...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div id='recipeImage'>
            {imageData ? (
                <img src={imageData} alt='Recipe' />
            ) : (
                'No image available'
            )}
        </div>
    );
};

export default RecipeImage;
