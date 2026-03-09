// screen is a utility provided by the React Testing Library that allows you to query the DOM for elements in a way that simulates how users interact with the page. 
// It provides various methods to find elements based on their text content, role, placeholder text, and more. 
// In this test, we use screen.getByPlaceholderText to find input fields based on their placeholder text, which is a common way to identify form fields in tests.
import { screen } from '@testing-library/react'; //query elements from the rendered DOM
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Login } from '../login';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { API_BASE_URL } from '../../config';

const mockNavigate = jest.fn(); // Mock the navigate function from react-router-dom

jest.mock('axios'); // Replace the real axios module with a mock version. so when we do axios.post in our tests, it will use the mock implementation instead of making real HTTP requests.
// This allows us to control the responses and test how our component handles different scenarios without relying on a real backend server.
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');// Import the actual react-router-dom module to preserve all of its functionality except for the useNavigate hook that we want to mock.
    return {
        ...actual,
        useNavigate: () => mockNavigate,// create a mock implementation of the useNavigate hook that returns our mockNavigate function. This allows us to track when navigate is called and with what arguments during our tests.
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

// This test checks if the Login component renders the expected form fields for username, password, and email.
// format: test('description of the test', () => { ...test implementation... });
test('renders login form fields', () => {
    renderWithProviders(<Login />);//It renders the Login component in a simulated browser environment.

    // getByPlaceholderText: This searches the DOM for an element with a specific placeholder attribute. like <input placeholder="Enter your username...">. It returns the element if found, or throws an error if not found.
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});

test('defaults to login mode with disabled email input', () => {
    renderWithProviders(<Login />);

    expect(screen.getByTestId('auth-title')).toHaveTextContent('Welcome back');
    expect(screen.getByTestId('auth-submit')).toHaveTextContent('Login');
    expect(screen.getByTestId('auth-email')).toBeDisabled();
});

test('switches to signup mode and enables email input', async () => {
    const user = userEvent.setup(); // This creates a userEvent instance that allows us to simulate user interactions like clicking and typing in our tests.
    renderWithProviders(<Login />);

    //await ensures that the simulated user interaction completes and the UI updates before the test checks the result.
    await user.click(screen.getByTestId('auth-toggle-mode'));

    expect(screen.getByTestId('auth-title')).toHaveTextContent('Create your account');
    expect(screen.getByTestId('auth-submit')).toHaveTextContent('Sign Up');
    expect(screen.getByTestId('auth-email')).toBeEnabled();
});

test('submits login and navigates to closet on success', async () => {
    const user = userEvent.setup();
    const postMock = axios.post as jest.Mock; //even though Jest replaced the real axios module with mocked functions before, we need to explicitly tell TypeScript that axios.post is a jest.Mock so that we can use mockResolvedValue and mockRejectedValue on it.
    postMock.mockResolvedValue({ // This simulates a successful response from the backend when the login form is submitted. It tells the mock axios.post function to return a resolved promise with the specified data when it is called during the test.
        data: {
            status: 'success',
            userId: 'u-123',
        },
    });

    renderWithProviders(<Login />);

    await user.type(screen.getByTestId('auth-username'), 'alice');
    await user.type(screen.getByTestId('auth-password'), 'secret123');
    await user.click(screen.getByTestId('auth-submit'));

    // toHaveBeenCalledWith: This is a Jest matcher that checks if a mock function was called with specific arguments.
    // In this case, we are checking if the mock axios.post function was called with the correct URL and payload when the login form is submitted.
    expect(postMock).toHaveBeenCalledWith(`${API_BASE_URL}/auth/login`, {
        username: 'alice',
        password: 'secret123',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/closet');
});

test('shows backend error message on failed login', async () => {
    const user = userEvent.setup();
    const postMock = axios.post as jest.Mock;
    postMock.mockRejectedValue({
        response: {
            data: {
                message: 'Invalid username or password',
            },
        },
    });

    renderWithProviders(<Login />);

    await user.type(screen.getByTestId('auth-username'), 'alice');
    await user.type(screen.getByTestId('auth-password'), 'wrong-password');
    await user.click(screen.getByTestId('auth-submit'));

    expect(await screen.findByText('Invalid username or password')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
});
