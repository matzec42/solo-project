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
                const response = await fetch("http://localhost:3000/v2/search", {
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

                // update state
                setResults(data);
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