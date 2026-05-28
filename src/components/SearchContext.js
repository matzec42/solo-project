import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchIngredient, setSearchIngredient] = useState('');
    const [savedRecipes, setSavedRecipes] = useState([]);

    return (
        <SearchContext.Provider value={{results, setResults, currentPage, setCurrentPage, searchIngredient, setSearchIngredient, savedRecipes, setSavedRecipes}}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearch = () => useContext(SearchContext);