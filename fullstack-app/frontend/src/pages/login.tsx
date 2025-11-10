import React from "react"
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useContext, useState } from "react"
import { UserContext } from "../components/UserContext";
import { Box, Button, Flex, Field, Input } from "@chakra-ui/react";
import { RiArrowLeftLine } from "react-icons/ri";

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
            const url = status === 'login' ? '/auth/login' : '/auth/signup';
            const response = await axios.post(`${baseUrl}${url}`, {
                username,
                password
            });

            console.log("Response:", response);

            if (response.data.status === 'success') {
                setContextUsername(username);
                setId(response.data.userId);
                navigate('/closet');
            } else {
                setErrorMessage(response.data.message || 'An error occurred');
            }
            console.log(response.data);
        } catch (errorMessage: any) {
            setErrorMessage(errorMessage.response?.data?.message || 'An error occurred');
        }
    }

    return (
        <Flex direction={"column"} align="center" justify="center" gap={6} >
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 border rounded" >
                <h1>{status === 'login' ? 'Login Page' : 'Sign Up Page'}</h1>
                {errorMessage && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {errorMessage}
                    </div>
                )}
                <Field.Root required>
                    <Field.Label>
                        Username
                        <Field.RequiredIndicator />
                    </Field.Label>
                    <Input value={username}
                        onChange={ev => setUsername(ev.target.value)}
                        type="text" placeholder="Enter your username..." />
                </Field.Root>
                {/* <label>Username</label>
                <input value={username}
                    onChange={ev => setUsername(ev.target.value)}
                    type="text" placeholder="Enter your username..." className="block w-full rounded-sm p-2 mb-2 border" /> */}
                {/* <label>Password</label>
                <input value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    type="password" placeholder="Enter your password..." className="block w-full rounded-sm p-2 mb-2 border" /> */}
                <Field.Root required>
                    <Field.Label>
                        Password
                        <Field.RequiredIndicator />
                    </Field.Label>
                    <Input value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        type="password" placeholder="Enter your password..." />
                </Field.Root>
                {/* <Field.Root required>
                    <Field.Label>
                        Email
                        <Field.RequiredIndicator />
                    </Field.Label>
                    <Input placeholder="me@example.com" />
                </Field.Root> */}
                <Button type="submit" className="bg-blue-500 text-white block w-full rounded-sm p-2 mb-2 border">
                    {status === 'login' ? 'Login' : 'Sign Up'}
                </Button>
                {status == 'login' && (
                    <div>
                        <Button onClick={() => setStatus('signup')}>Switch to Sign Up</Button>
                    </div>
                )}
                {status == 'signup' && (
                    <div>
                        <Button onClick={() => setStatus('login')}>Switch to Login</Button>
                    </div>
                )}
                {/* Add your login form here */}
            </form>
            <Box p={4}>
                <Button variant="surface" onClick={() => { navigate('/') }}><RiArrowLeftLine />Back to Main Page</Button>
            </Box>
        </Flex>
    )
}

export default Login;
