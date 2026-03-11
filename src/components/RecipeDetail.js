import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
    // hook to grab recipe ID (params in the URL)
    const { id } = useParams();
    // state hooks for recipe details, loading and error
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* renders data in the RecipeDetail component (a Link that is a child of SearchResults.js component, a single page view of a recipe */
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
        <div>
            <h2>{details.title}</h2>
        </div>
    )
}

export default RecipeDetail