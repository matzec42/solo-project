import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const navigate = useNavigate();

    const handleSignUpClick = async (e) => {
        e.preventDefault();

        console.log(newUsername, newPassword);

        if (!newUsername.trim() || !newPassword.trim()) {
            alert('Please enter a valid username and/or password.');
            return;
        };
        
        try {
            const response = await fetch("http://localhost:3000/signup",
                {  
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        newUsername: newUsername,
                        newPassword: newPassword
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            )

            if (!response.ok) throw new Error('Failed to sign up.');

            const data = await response.json();
            console.log('Sign up success');

            console.log('User is signed up:', data);

            setNewUsername('');
            setNewPassword('');

            navigate('/');

        } catch (error) {
            alert('Please enter a valid username and/or password.');
            console.error('Login error:', error);
        }
    }

    return (
        <div id='signUpPage'>
            <h1>
                Create an Account
            </h1>
            <form id='signUpForm' onSubmit={handleSignUpClick} style={{ textAlign: 'center' }}>
                <h3>Please enter your username and password:</h3>
                <input
                    id='signUpFieldUsername'
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder='New Username'
                /><br />
                <input
                    id='signUpFieldPassword'
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='New Password'
                /><br />
                <button className='signUpButton' type='submit'>
                    Create New Account
                </button>
            </form>
            <footer>Powered by <a href='https://spoonacular.com/food-api'>spoonacular.com</a></footer>
        </div>
    )
}

export default SignUp 