import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Settings from "../Settings";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

test("renders the style quiz sections", () => {
    renderWithProviders(<Settings />);

    expect(screen.getByText("Style Identity Quiz")).toBeInTheDocument();
    expect(screen.getByText("Color Palette")).toBeInTheDocument();
    expect(screen.getByText("Preferred Fits")).toBeInTheDocument();
    expect(screen.getByText("Everyday Occasions")).toBeInTheDocument();
    expect(screen.getByText("Climate Reality")).toBeInTheDocument();
    expect(screen.getByText("Style Tags")).toBeInTheDocument();
});

test("allows selection changes and reset", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Settings />);

    const navyButton = screen.getByRole("button", { name: "Navy" });
    await user.click(navyButton);
    expect(navyButton).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByText("No colors selected yet.")).toBeInTheDocument();
    expect(screen.getByText("Climate not set")).toBeInTheDocument();
});
