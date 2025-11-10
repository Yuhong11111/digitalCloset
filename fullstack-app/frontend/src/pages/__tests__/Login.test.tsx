import { render, screen } from '@testing-library/react';
import { Login } from '../login';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from '../../theme';

test('renders login form', () => {
    render(
        <ChakraProvider value={system}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </ChakraProvider>
    );

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});
