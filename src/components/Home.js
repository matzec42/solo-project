import React from "react";
import { useNavigate } from 'react-router-dom';
import SearchContainer from './SearchContainer.js';
import RecipeBook from './RecipeBook.js';

const Home = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogoutClick = async (e) => {
        e.preventDefault();

        try {
            // clear cookie from backend
            const logoutResponse = await fetch("http://localhost:3000/logout", {
                method: 'POST',
                credentials: 'include',  // Ensure cookies are sent with the request
            });

            if (!logoutResponse.ok) {
                throw new Error('Logout failed')
            }

            setIsAuthenticated(false);
            alert('You are now logging out of IngrEDIBLE.');
            navigate('/');

        } catch (err) {
            console.error('Logout error:', err)
            alert('Failed to log out. Please try again.');
        }
    }

    return (
        <div id='homePage'>
            <button id='logoutButton' onClick={handleLogoutClick} >Logout</button>
            <h1>
                IngrEDIBLE!
            </h1>
                <SearchContainer />
                <RecipeBook />
            <footer>Powered by <a href='https://spoonacular.com/food-api'>spoonacular.com</a></footer>
        </div>
    )
}

export default Home