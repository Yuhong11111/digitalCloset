import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Flex } from '@chakra-ui/react';

export function HomePage() {
    const navigate = useNavigate();
    return (
        <Flex height="50vh"
            align="center"
            justify="center"
            gap={6}
            direction="row">
            <h1 data-testid="home-title">Welcome to the Digital Closet</h1>
            <Button onClick={() => navigate('/login')} data-testid="start-button">
                Log in/Sign in
            </Button>
            {/* <button onClick={testBackendConnection}>Test Backend Connection</button> */}
        </Flex>
    );
}

export default HomePage;
