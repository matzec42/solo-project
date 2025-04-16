import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ isAuthenticated, setIsAuthenticated }) => {
    // state for standard login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        console.log('isAuthenticated changed:', isAuthenticated);
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const handleLoginClick = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert('Please enter a valid username and/or password.');
        };

        try {
            const response = await fetch("http://localhost:3000/login",
                {  
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        username: username,
                        password: password
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            )

            if (!response.ok) throw new Error('Failed to login.');

            const data = await response.json();
            console.log('Login success');

            setIsAuthenticated(true);
            console.log('User is logged in:', data);

            setUsername('');
            setPassword('');

        } catch {
            alert('Please enter a valid username and/or password.');
            console.error('Login error');
        }
    }

    const handleSignUpClick = (e) => {
        e.preventDefault();
        navigate('/signup');
    }

    return (
        <div id= "loginPage">
            <h1>
                IngrEDIBLE!
            </h1>
            <form id="loginForm" onSubmit={handleLoginClick} style={{ textAlign: "center" }}>
                <h3>Log into IngrEDIBLE</h3>
                <input
                    id="loginFieldUsername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                /><br />
                <input
                    id="loginFieldPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                /><br />
                <button className="loginButton" type="submit" >Login</button>

                <p>Don't have an account?</p>
                <button className="loginButton" onClick={handleSignUpClick} type="button">
                    Sign Up
                </button>
            </form>
            <footer>Powered by <a href='https://spoonacular.com/food-api'>spoonacular.com</a></footer>
        </div>
    )
}

export default Login