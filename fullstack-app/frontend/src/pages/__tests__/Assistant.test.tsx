import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Assistant from "../Assistant";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

jest.mock("axios");
jest.mock("../AppLayout", () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("../../hooks/useClothContext", () => ({
    useClothContext: () => ({
        refreshClothes: jest.fn(),
    }),
}));
jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => jest.fn(),
    };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
    mockedAxios.post.mockReset();
    window.localStorage.clear();
});

test("sends recommendation-off preference in the assistant prompt", async () => {
    mockedAxios.post.mockResolvedValue({
        data: {
            message: "Acknowledged.",
            mode: "chat",
            referencedItems: [],
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
    });

    const user = userEvent.setup();
    renderWithProviders(<Assistant />);

    await user.click(screen.getByTestId("recommendation-toggle"));
    await user.type(
        screen.getByPlaceholderText("Ask about styling... e.g., 'Need an outfit for a rainy day.'"),
        "Help me style my jacket"
    );
    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());

    const [, formData] = mockedAxios.post.mock.calls[0];
    expect(formData).toBeInstanceOf(FormData);
    expect((formData as FormData).get("message")).toContain("User: Help me style my jacket\nAssistant:");
    expect((formData as FormData).get("recommendations_enabled")).toBe("false");
    expect(window.localStorage.getItem("assistantRecommendationPreference")).toBe("off");
});
