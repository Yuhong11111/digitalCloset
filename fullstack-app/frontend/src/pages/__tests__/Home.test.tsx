import { screen } from "@testing-library/react";
// Update the import path if HomePage is located elsewhere, for example:
import { HomePage } from "../Home";
// Or, if the file is named differently, update accordingly:
// import { HomePage } from "../SomeOtherPath/HomePage";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

const mockNavigate = jest.fn();

// jest.mock replaces the real useNavigate so when the component calls it, it actually gets the fake (mockNavigate)
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders home page with title and button', () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByTestId('home-title')).toBeInTheDocument();
    expect(screen.getByTestId('start-button')).toBeInTheDocument();
});

test('navigates to login page on button click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    const startButton = screen.getByTestId('start-button');
    await user.click(startButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
});