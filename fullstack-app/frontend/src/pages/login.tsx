import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../components/UserContext";
import { Box, Button, Flex, Field, Input, Text, Heading, Icon } from "@chakra-ui/react";
import { RiArrowLeftLine } from "react-icons/ri";
import { FiKey, FiMail, FiUser } from "react-icons/fi";
import { API_BASE_URL } from "../config";
import { pageBackgroundStyles } from "../theme";

export function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('login'); // 'login' or 'signup'
    const { setId, setUsername: setContextUsername } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        setErrorMessage('');
        try {
            const url = status === 'login' ? '/auth/login' : '/auth/signup';
            const payload = status === 'login'
                ? { username, password }
                : { username, password, email };

            const response = await axios.post(`${API_BASE_URL}${url}`, payload);

            if (response.data.status === 'success') {
                setContextUsername(username);
                setId(response.data.userId);
                navigate('/closet');
            } else {
                setErrorMessage(response.data.message || 'An error occurred');
            }
            // console.log(response.data);
        } catch (errorMessage: any) {
            setErrorMessage(errorMessage.response?.data?.message || 'An error occurred');
        }
    }

    return (
        <Flex
            direction="column"
            minH="100vh"
            overflowY="auto"
            px={6}
            {...pageBackgroundStyles}
        >
            <Flex direction="column" align="center" justify="center" flex="1" py={{ base: 10, md: 14 }} position="relative" zIndex={1}>
                <Box
                    w="full"
                    maxW="420px"
                    bg="white"
                    borderRadius="3xl"
                    boxShadow="sm"
                    borderWidth="1px"
                    borderColor="gray.100"
                    p={{ base: 6, md: 8 }}
                >
                    <Heading
                        data-testid="auth-title"
                        size="xl"
                        fontWeight="800"
                        fontFamily="'Outfit', 'Nunito', system-ui, sans-serif"
                        mb={2}
                    >
                        {status === 'login' ? 'Welcome back' : 'Create your account'}
                    </Heading>
                    <Text color="gray.600" mb={6}>
                        {status === 'login'
                            ? 'Sign in to keep styling your wardrobe.'
                            : 'Join and start building your digital closet.'}
                    </Text>

                    {errorMessage && (
                        <Box bg="#ffe9e5" color="#b42318" borderRadius="lg" px={3} py={2} mb={4}>
                            {errorMessage}
                        </Box>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Flex direction="column" gap={4}>
                            <Field.Root required>
                                <Field.Label fontWeight="600" color="gray.600">
                                    Username <Field.RequiredIndicator />
                                </Field.Label>
                                <Box position="relative">
                                    <Icon as={FiUser} position="absolute" left="12px" top="50%" transform="translateY(-50%)" color="gray.400" />
                                    <Input
                                        data-testid="auth-username"
                                        pl="38px"
                                        value={username}
                                        onChange={ev => setUsername(ev.target.value)}
                                        type="text"
                                        placeholder="Enter your username..."
                                        h="46px"
                                        borderRadius="xl"
                                    />
                                </Box>
                            </Field.Root>
                            <Field.Root required>
                                <Field.Label fontWeight="600" color="gray.600">
                                    Password <Field.RequiredIndicator />
                                </Field.Label>
                                <Box position="relative">
                                    <Icon as={FiKey} position="absolute" left="12px" top="50%" transform="translateY(-50%)" color="gray.400" />
                                    <Input
                                        data-testid="auth-password"
                                        pl="38px"
                                        value={password}
                                        onChange={ev => setPassword(ev.target.value)}
                                        type="password"
                                        placeholder="Enter your password..."
                                        h="46px"
                                        borderRadius="xl"
                                    />
                                </Box>
                            </Field.Root>
                            <Field.Root required={status === 'signup'}>
                                <Field.Label fontWeight="600" color="gray.600">
                                    Email {status === 'signup' && <Field.RequiredIndicator />}
                                </Field.Label>
                                <Box position="relative">
                                    <Icon as={FiMail} position="absolute" left="12px" top="50%" transform="translateY(-50%)" color="gray.400" />
                                    <Input
                                        data-testid="auth-email"
                                        pl="38px"
                                        value={email}
                                        onChange={ev => setEmail(ev.target.value)}
                                        type="email"
                                        placeholder="me@example.com"
                                        disabled={status === 'login'}
                                        h="46px"
                                        borderRadius="xl"
                                    />
                                </Box>
                            </Field.Root>
                            <Button
                                data-testid="auth-submit"
                                type="submit"
                                bg="#ead7c7"
                                color="ink"
                                borderRadius="2xl"
                                h="48px"
                                fontWeight="700"
                                _hover={{ bg: "#e1c8b5" }}
                            >
                                {status === 'login' ? 'Login' : 'Sign Up'}
                            </Button>
                            <Button
                                data-testid="auth-toggle-mode"
                                variant="ghost"
                                onClick={() => setStatus(status === 'login' ? 'signup' : 'login')}
                            >
                                {status === 'login' ? 'Switch to Sign Up' : 'Switch to Login'}
                            </Button>
                        </Flex>
                    </form>
                </Box>
                <Button variant="ghost" mt={6} onClick={() => { navigate('/') }}>
                    <RiArrowLeftLine />
                    Back to Main Page
                </Button>
            </Flex>
        </Flex>
    );
}

export default Login;
