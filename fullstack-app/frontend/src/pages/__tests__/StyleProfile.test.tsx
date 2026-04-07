import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StyleProfile from "../StyleProfile";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

test("renders the style quiz sections", () => {
    renderWithProviders(<StyleProfile />);

    expect(screen.getByText("Style Identity Quiz")).toBeInTheDocument();
    expect(screen.getByText("Color Palette")).toBeInTheDocument();
    expect(screen.getByText("Preferred Fits")).toBeInTheDocument();
    expect(screen.getByText("Everyday Occasions")).toBeInTheDocument();
    expect(screen.getByText("Climate Reality")).toBeInTheDocument();
    expect(screen.getByText("Style Tags")).toBeInTheDocument();
});

test("allows selection changes and reset", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StyleProfile />);

    const navyButton = screen.getByRole("button", { name: "Navy" });
    await user.click(navyButton);
    expect(navyButton).toHaveAttribute("aria-pressed", "true");

    const customColorInput = screen.getByPlaceholderText("Add a custom color palette choice");
    await user.type(customColorInput, "Charcoal");
    await user.click(screen.getAllByRole("button", { name: "Add Custom" })[0]);

    expect(screen.getByRole("button", { name: "Charcoal" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByText("No colors selected yet.")).toBeInTheDocument();
    expect(screen.getByText("Climate not set")).toBeInTheDocument();
});
