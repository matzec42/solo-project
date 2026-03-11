import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import Home from './components/Home.js';
import SignUp from './components/SignUp.js';
import RecipeDetail from './components/RecipeDetail.js';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // state for verifying (when user is in a session, this keeps them from being redirected to /home when page is refreshed)
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/v2/verify', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) throw new Error('Not authenticated');

                const data = await response.json();
                console.log('User verified:', data);
                setIsAuthenticated(true);

            } catch (err) {
                setIsAuthenticated(false);
            } finally {
                setIsVerifying(false);
            }
        };

        verifyUser();
    }, []);

    if (isVerifying) return <div>Loading...</div>

    return (
        <div>
            <Router>
                <Routes>
                    <Route
                        path='/'
                        element={
                            <Login
                                isAuthenticated={isAuthenticated}
                                setIsAuthenticated={setIsAuthenticated}
                            />
                        }
                    />
                    <Route path='signup' element={<SignUp />} />
                    <Route
                        path='/home'
                        element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> : <Navigate to='/' />}
                    />
                    <Route
                        path='/recipes/:id'
                        element={isAuthenticated ? <RecipeDetail /> : <Navigate to='/' />}
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App