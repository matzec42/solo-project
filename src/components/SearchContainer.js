import React from 'react';
import { useState } from 'react';
import SearchResults from './SearchResults';

const SearchContainer = () => {

    // initialize state for this component
    const [searchIngredient, setSearchIngredient] = useState('');
    const [results, setResults] = useState([]);

    // define a handler that will send user input to the server
    const handleSearchIngredient = async () => {        
        const ingredient = searchIngredient.trim();
        
        if(ingredient !== '') {
            try {
                const response = await fetch("http://localhost:3000/search", {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // mode: 'no-cors',
                    body: JSON.stringify({
                        data: ingredient
                    }),
                });

                if (!response.ok) {
                    throw new Error('A network error occurred.')
                }
                const data = await response.json();

                // this is not updating properly
                setResults(data);

                // fetch recipe images using recipe IDs
                if (data && Array.isArray(data)) {
                    
                    const recipeIds = data.map(recipe => recipe.id);
                    
                    const recipeCardsResponse = await fetch("http://localhost:3000/fetchRecipeCards", {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ recipeIds })
                    });

                    if (!recipeCardsResponse.ok) {
                        throw new Error('Failed to retrieve recipes.')
                    }

                    const fetchedRecipeCards = await recipeCardsResponse.json();
                    // console.log('Fetched recipe card data:', fetchedRecipeCards);

                    const combinedResults = data.map(recipe => {
                        const image = fetchedRecipeCards.find(img => img.id === recipe.id);
                        return { ...recipe, image: image ? image.image : null }
                    })

                    // update results with fetched recipe data
                    setResults(combinedResults);
                    
                } else {
                    console.error('Data is not an array:', data)
                }
                
                setSearchIngredient('');
                
            } catch (error) {
                console.error('Error in response from server:', error)
            }
        }
        else {
            alert('Please enter an ingredient and try again.');
            setSearchIngredient('');
        }
    }

    // consider changing / updating to form element ---  https://react.dev/reference/react-dom/components/form
    return(
        <div id='searchContainer'>
            <h2 id='searchTitle'>What Can I Make With ...</h2>
            <input
                id='searchBar'
                name='searchBar'
                placeholder='Type an ingredient here!'
                type='text'
                value={searchIngredient}
                onChange={(e) => setSearchIngredient(e.target.value)}>
            </input>
            <button id='submitButton' onClick={handleSearchIngredient} type='button'>Submit</button>
            {<SearchResults id='searchResults' results={results}/>}
        </div>
    )
}

export default SearchContainer