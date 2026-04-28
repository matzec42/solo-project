import React from 'react';
// import { useState } from 'react';
import SearchResults from './SearchResults';
import { useSearch } from './SearchContext.js';


// variable for pagination
const RESULTS_PER_PAGE = 8;

const SearchContainer = () => {

    // useContext to help maintain state for this component (keeps search results when navigating to and back from recipes)
    const { results, setResults, currentPage, setCurrentPage, searchIngredient, setSearchIngredient } = useSearch();
    // const [searchIngredient, setSearchIngredient] = useState('');
    // const [results, setResults] = useState([]);
    // const [currentPage, setCurrentPage] = useState(1);

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
                // reset to page 1 on new searches
                setCurrentPage(1);
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

    // pagination
    const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const paginatedResults = results.slice(startIndex, startIndex + RESULTS_PER_PAGE);

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

            <SearchResults id='searchResults' results={paginatedResults}/>

            {results.length > 0 && (
                <div id='pagination'>
                    <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1} >
                        Previous
                    </button>
                    <span>{currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default SearchContainer