import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StyleProfile from "../StyleProfile";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import axios from "axios";
import { API_BASE_URL } from "../../config";

jest.mock("axios");

test("renders the style quiz sections", () => {
    renderWithProviders(<StyleProfile />);

    expect(screen.getByText("Style Identity Quiz")).toBeInTheDocument();
    expect(screen.getByText("Color Palette")).toBeInTheDocument();
    expect(screen.getByText("Preferred Fits")).toBeInTheDocument();
    expect(screen.getByText("Everyday Occasions")).toBeInTheDocument();
    expect(screen.getByText("Climate Reality")).toBeInTheDocument();
    expect(screen.getByText("Style Tags")).toBeInTheDocument();
});

test("tracks unsaved changes, saves locally, and resets", async () => {
    const user = userEvent.setup();
    const postMock = axios.post as jest.Mock;
    postMock.mockResolvedValue({ status: 200, data: { message: "Preferences saved successfully" } });
    renderWithProviders(<StyleProfile />);

    expect(screen.getByTestId("save-status")).toHaveTextContent("Preferences are up to date.");

    const navyButton = screen.getByRole("button", { name: "Navy" });
    await user.click(navyButton);
    expect(navyButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("save-status")).toHaveTextContent("You have unsaved changes.");

    const customColorInput = screen.getByPlaceholderText("Add a custom color palette choice");
    await user.type(customColorInput, "Charcoal");
    await user.click(screen.getAllByRole("button", { name: "Add Custom" })[0]);

    expect(screen.getByRole("button", { name: "Charcoal" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Save Preferences" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Save Preferences" }));

    expect(postMock).toHaveBeenCalledWith(`${API_BASE_URL}/preferences`, {
        preferred_colors: ["Black", "Cream", "Navy", "Charcoal"],
        preferred_fits: ["Relaxed"],
        preferred_occasions: ["Work", "Weekend"],
        preferred_climate: ["Four Seasons"],
        preferred_style_tags: ["Minimal", "Classic"],
    });
    expect(screen.getByTestId("save-status")).toHaveTextContent("Preferences saved.");

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByTestId("save-status")).toHaveTextContent("You have unsaved changes.");
    expect(screen.getByText("No colors selected yet.")).toBeInTheDocument();
    expect(screen.getByText("Climate not set")).toBeInTheDocument();
});
