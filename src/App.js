import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import Home from './components/Home.js';
import SignUp from './components/SignUp.js';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/verify', {
                    method: 'GET',
                    credentials: 'include',
                });
    
                if (!response.ok) throw new Error('Not authenticated');
    
                const data = await response.json();
                console.log('User verified:', data);
                setIsAuthenticated(true);

            } catch (err) {
                console.log('User is not authenticated.');
                setIsAuthenticated(false);
            }
        };
    
        verifyUser();
    }, []);

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
                        element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated}/> : <Navigate to='/' />}
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App