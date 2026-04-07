import { screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { useContext } from "react";
import { API_BASE_URL } from "../../config";
import { UserContext, UserContextProvider } from "../UserContext";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

// Mock axios to control its behavior in tests
jest.mock("axios");

// This component consumes the UserContext and displays its values for testing purposes.
// In the real app, context values aren’t directly shown in the UI, so in tests we create a small helper component to read the context and render it, allowing us to assert on it.
function UserContextConsumer() {
  const { username, id, loading } = useContext(UserContext);

  return (
    <div>
      <div data-testid="loading">{loading ? "true" : "false"}</div>
      <div data-testid="username">{username ?? "null"}</div>
      <div data-testid="user-id">{id ?? "null"}</div>
    </div>
  );
}

function renderUserContext() {
  return renderWithProviders(
    // We wrap the UserContextConsumer with UserContextProvider so that it has access to the context values. 
    // This allows us to test how the provider fetches and updates the user profile data, and how the consumer reflects those changes in the UI.

    // Fetches user data (using mocked axios)
    <UserContextProvider>
      {/* Displays context values so test can see them */}
      <UserContextConsumer />
    </UserContextProvider>
  );
}

describe("UserContextProvider", () => {
  let responseErrorHandler: ((error: unknown) => Promise<never>) | undefined;
  let ejectMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    ejectMock = jest.fn();
    responseErrorHandler = undefined;

    const mockedAxios = axios as jest.Mocked<typeof axios> & {
      interceptors: {
        response: {
          use: jest.Mock;
          eject: jest.Mock;
        };
      };
    };

    mockedAxios.interceptors = {
      response: {
        use: jest.fn((onSuccess, onError) => {
          responseErrorHandler = onError;
          return 1;
        }),
        eject: ejectMock,
      },
    };
  });

  test("starts in loading state and fetches the user profile", async () => {
    // We need to capture the resolve function of the Promise returned by axios.get so that we can simulate the profile request resolving after we check the initial loading state.
    // Promise is a built-in JavaScript object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. (an object that represents a value that will be available in the future)
    // When we create a new Promise, we pass in a function that receives two arguments: resolve and reject. These are functions that we can call to indicate that the asynchronous operation has completed successfully (resolve) or has failed (reject). 
    // In this case, we want to capture the resolve function so that we can call it later in our test to simulate the profile request completing successfully.
    let resolveRequest: (value: unknown) => void = () => { };

    // fake implementation of axios.get that returns a Promise which we can control when it resolves. 
    // This allows us to test the loading state before the profile data is available, and then simulate the profile request completing with user data.
    const getMock = axios.get as jest.Mock;
    getMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
    );
    // So the request stays pending until the test manually does: resolveRequest(...)

    renderUserContext();

    expect(screen.getByTestId("loading")).toHaveTextContent("true");
    expect(getMock).toHaveBeenCalledWith(`${API_BASE_URL}/profile`);

    // Simulate the profile request resolving with user data
    resolveRequest({ data: { username: "alice", userId: "user-123" } });

    await waitFor(() =>
      expect(screen.getByTestId("loading")).toHaveTextContent("false")
    );
  });

  test("stores profile data when the profile request succeeds", async () => {
    const getMock = axios.get as jest.Mock;
    getMock.mockResolvedValue({
      // mock response from the profile endpoint with user data
      // This simulates a successful response from the backend when the UserContextProvider fetches the user profile. 
      // It tells the mock axios.get function to return a resolved promise with the specified data when it is called during the test.
      data: {
        username: "alice",
        userId: "user-123",
      },
    });

    renderUserContext();

    await waitFor(() =>
      expect(screen.getByTestId("loading")).toHaveTextContent("false")
    );

    expect(screen.getByTestId("username")).toHaveTextContent("alice");
    expect(screen.getByTestId("user-id")).toHaveTextContent("user-123");
  });

  test("clears user data when the profile request fails", async () => {
    const getMock = axios.get as jest.Mock;
    getMock.mockRejectedValue(new Error("request failed"));

    renderUserContext();

    await waitFor(() =>
      expect(screen.getByTestId("loading")).toHaveTextContent("false")
    );

    expect(screen.getByTestId("username")).toHaveTextContent("null");
    expect(screen.getByTestId("user-id")).toHaveTextContent("null");
  });

  test("clears user data when a later request returns 401", async () => {
    const getMock = axios.get as jest.Mock;
    getMock.mockResolvedValue({
      data: {
        username: "alice",
        userId: "user-123",
      },
    });

    renderUserContext();

    await waitFor(() =>
      expect(screen.getByTestId("loading")).toHaveTextContent("false")
    );

    expect(screen.getByTestId("username")).toHaveTextContent("alice");

    await expect(
      responseErrorHandler?.({
        response: {
          status: 401,
        },
      })
    ).rejects.toEqual({
      response: {
        status: 401,
      },
    });

    await waitFor(() =>
      expect(screen.getByTestId("username")).toHaveTextContent("null")
    );
    expect(screen.getByTestId("user-id")).toHaveTextContent("null");
  });
});
