import React from "react"
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useContext, useState } from "react"
import { UserContext } from "../components/UserContext";

export function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('login'); // 'login' or 'signup'
    const { setId, setUsername: setContextUsername } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        setErrorMessage('');
        try {
            const baseUrl = 'http://localhost:8000';
            const url = status === 'login' ? '/login' : '/signup';
            const response = await axios.post(`${baseUrl}${url}`, {
                username,
                password
            });

            if (response.data.status === 'success') {
                setContextUsername(username);
                setId(response.data.userId);
                navigate('/');
            } else {
                setErrorMessage(response.data.message || 'An error occurred');
            }
            console.log(response.data);
        } catch (errorMessage: any) {
            setErrorMessage(errorMessage.response?.data?.message || 'An error occurred');
        }
    }

    return (
        <div>
            <button onClick={() => { navigate('/') }}>Back to Main Page</button>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 border rounded" >
                <h1>{status === 'login' ? 'Login Page' : 'Sign Up Page'}</h1>
                {errorMessage && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {errorMessage}
                    </div>
                )}
                <label>Username</label>
                <input value={username}
                    onChange={ev => setUsername(ev.target.value)}
                    type="text" placeholder="Enter your username..." className="block w-full rounded-sm p-2 mb-2 border" />
                <label>Password</label>
                <input value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    type="password" placeholder="Enter your password..." className="block w-full rounded-sm p-2 mb-2 border" />
                <button className="bg-blue-500 text-white block w-full rounded-sm p-2 mb-2 border">
                    {status === 'login' ? 'Login' : 'Sign Up'}
                </button>
                {status == 'login' && (
                    <div>
                        <button onClick={() => setStatus('signup')}>Switch to Sign Up</button>
                    </div>
                )}
                {status == 'signup' && (
                    <div>
                        <button onClick={() => setStatus('login')}>Switch to Login</button>
                    </div>
                )}
                {/* Add your login form here */}
            </form>
        </div>
    )
}

export default Login;
