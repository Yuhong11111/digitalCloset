import AddItem from "../AddItem";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import { UserContext } from "../../components/UserContext";
import { ClothContext } from "../../components/ClothContext";
import { MemoryRouter, Route, Routes } from "react-router";
import { API_BASE_URL } from "../../config";

jest.mock("axios");

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockUserContext = {
    username: "testuser",
    id: "u-123",
    loading: false,
    setUsername: jest.fn(),
    setId: jest.fn(),
}

const existingItem = {
    _id: "item-123",
    name: "Blue Jeans",
    category: "bottom",
    color: "Blue",
    size: "M",
    material: "Denim",
    brand: "BrandB",
    season: "all",
    purchase_price: "49.99",
    imageUrl: "http://example.com/blue-jeans.jpg",
    notes: "A pair of comfortable blue jeans.",
};

function renderAddItemWithUserContext(
    clothOverrides = {},
    {
        route = "/add",
        path = "/add",
    }: { route?: string; path?: string } = {}
) {
    return renderWithProviders(
        <UserContext.Provider value={mockUserContext}>
            <ClothContext.Provider
                value={{
                    clothes: [],
                    setClothes: jest.fn(),
                    isLoading: false,
                    refreshClothes: jest.fn(),
                    page: 1,
                    pageSize: 12,
                    total: 0,
                    ...clothOverrides,
                }}
            >
                <MemoryRouter initialEntries={[route]}>
                    <Routes>
                        <Route path={path} element={<AddItem />} />
                    </Routes>
                </MemoryRouter>
            </ClothContext.Provider>
        </UserContext.Provider>,
        { withRouter: false }
    );
}

beforeEach(() => {
    jest.clearAllMocks();
});

test("renders add item form fields", () => {
    renderWithProviders(<AddItem />);

    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('image-upload')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
    expect(screen.getByTestId('color-input')).toBeInTheDocument();
    expect(screen.getByTestId('size-input')).toBeInTheDocument();
    expect(screen.getByTestId('material-input')).toBeInTheDocument();
    expect(screen.getByTestId('brand-input')).toBeInTheDocument();
});

test("submits new item and navigates to closet on success", async () => {
    const user = userEvent.setup();
    const refreshClothesMock = jest.fn().mockResolvedValue(undefined);
    const postMock = axios.post as jest.Mock;
    postMock.mockResolvedValue({
        data: { status: "success" },
    });


    renderAddItemWithUserContext({ refreshClothes: refreshClothesMock });

    await user.type(screen.getByTestId('name-input'), "Red Shirt");
    await user.type(screen.getByTestId('image-upload'), "http://example.com/red-shirt.jpg");
    await user.type(screen.getByTestId('category-select'), "Tops");
    await user.type(screen.getByTestId('color-input'), "Red");
    await user.type(screen.getByTestId('season-select'), "Summer");
    await user.type(screen.getByTestId('material-input'), "Cotton");
    await user.type(screen.getByTestId('brand-input'), "BrandA");

    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
        expect(postMock).toHaveBeenCalled();
        expect(refreshClothesMock).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/closet");
});

test("failed to submit new item shows error message", async () => {
    const user = userEvent.setup();
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
    const refreshClothesMock = jest.fn().mockResolvedValue(undefined);
    const postMock = axios.post as jest.Mock;
    postMock.mockRejectedValue({
        response: {
            data: {
                message: "Having trouble adding item",
            },
        },
    });

    renderAddItemWithUserContext({ refreshClothes: refreshClothesMock });
    await user.type(screen.getByTestId('name-input'), "Red Shirt");
    await user.type(screen.getByTestId('category-select'), "Tops");
    await user.type(screen.getByTestId('color-input'), "Red");
    await user.type(screen.getByTestId('season-select'), "Summer");

    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
        expect(postMock).toHaveBeenCalled();
        expect(refreshClothesMock).not.toHaveBeenCalled();
    });

    expect(consoleErrorMock).toHaveBeenCalledWith("Failed to add item", { "response": { "data": { "message": "Having trouble adding item" } } });
    expect(mockNavigate).not.toHaveBeenCalled();
});

test("logs an error when add item response is not successful", async () => {
    const user = userEvent.setup();
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
    const refreshClothesMock = jest.fn().mockResolvedValue(undefined);
    const postMock = axios.post as jest.Mock;
    postMock.mockResolvedValue({
        data: { status: "error", message: "Unable to save item" },
    });

    renderAddItemWithUserContext({ refreshClothes: refreshClothesMock });

    await user.type(screen.getByTestId('name-input'), "Red Shirt");
    await user.type(screen.getByTestId('color-input'), "Red");
    await user.selectOptions(screen.getByTestId('category-select'), "top");
    await user.selectOptions(screen.getByTestId('season-select'), "summer");
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
        expect(postMock).toHaveBeenCalled();
        expect(refreshClothesMock).not.toHaveBeenCalled();
    });

    expect(consoleErrorMock).toHaveBeenCalledWith("Failed to add item:", {
        status: "error",
        message: "Unable to save item",
    });
    expect(mockNavigate).not.toHaveBeenCalled();
});

test("show error message when user id is missing", async () => {
    const user = userEvent.setup();
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
    renderWithProviders(<AddItem />);

    await user.type(screen.getByTestId('name-input'), "Red Shirt");
    await user.type(screen.getByTestId('category-select'), "Tops");
    await user.type(screen.getByTestId('color-input'), "Red");
    await user.type(screen.getByTestId('season-select'), "Summer");
    await user.click(screen.getByTestId('submit-button'));

    expect(consoleErrorMock).toHaveBeenCalledWith('No user id—redirect to login or show an error');
});

test("logs an error when edit mode is missing original item data", async () => {
    const user = userEvent.setup();
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
    const getMock = axios.get as jest.Mock;
    getMock.mockImplementation(() => new Promise(() => { }));

    renderAddItemWithUserContext(
        {},
        {
            route: "/edit/item-123",
            path: "/edit/:id",
        }
    );

    await user.type(screen.getByTestId('name-input'), "Blue Jeans");
    await user.type(screen.getByTestId('color-input'), "Blue");
    await user.click(screen.getByTestId('submit-button'));

    expect(consoleErrorMock).toHaveBeenCalledWith("Missing original item data for patch.");
    expect(mockNavigate).not.toHaveBeenCalled();
});

test("renders existing item data in edit mode", () => {

    renderAddItemWithUserContext(
        { clothes: [existingItem] },
        {
            route: "/edit/item-123",
            path: "/edit/:id",
        }
    );


    expect(screen.getByTestId('name-input')).toHaveValue("Blue Jeans");
    expect(screen.getByTestId('category-select')).toHaveValue("bottom");
    expect(screen.getByTestId('color-input')).toHaveValue("Blue");
    expect(screen.getByTestId('size-input')).toHaveValue("M");
    expect(screen.getByTestId('material-input')).toHaveValue("Denim");
    expect(screen.getByTestId('brand-input')).toHaveValue("BrandB");
    expect(screen.getByTestId('season-select')).toHaveValue("all");
    expect(screen.getByTestId('purchase-price-input')).toHaveValue(49.99);
    expect(screen.getByTestId('notes-input')).toHaveValue("A pair of comfortable blue jeans.");
});

test("deletes item and navigates to closet on success", async () => {
    const user = userEvent.setup();
    const refreshClothesMock = jest.fn().mockResolvedValue(undefined);
    const confirmMock = jest.spyOn(window, "confirm").mockReturnValue(true);
    const deleteMock = axios.delete as jest.Mock;
    deleteMock.mockResolvedValue({
        data: { status: "success" },
    });

    renderAddItemWithUserContext(
        {
            clothes: [existingItem],
            refreshClothes: refreshClothesMock,
        },
        {
            route: "/edit/item-123",
            path: "/edit/:id",
        }
    );

    await user.click(screen.getByTestId('delete-button'));

    await waitFor(() => {
        expect(confirmMock).toHaveBeenCalled();
        expect(deleteMock).toHaveBeenCalledWith(`${API_BASE_URL}/items/item-123`);
        expect(refreshClothesMock).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/closet");
    confirmMock.mockRestore();
});

test("failed to delete item shows error message", async () => {
    const user = userEvent.setup();
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
    const confirmMock = jest.spyOn(window, "confirm").mockReturnValue(true);
    const deleteMock = axios.delete as jest.Mock;
    deleteMock.mockRejectedValue(new Error("Failed to delete item"));

    renderAddItemWithUserContext(
        {
            clothes: [existingItem]
        },
        {
            route: "/edit/item-123",
            path: "/edit/:id",
        }
    );

    await user.click(screen.getByTestId('delete-button'));

    await waitFor(() => {
        expect(confirmMock).toHaveBeenCalled();
        expect(deleteMock).toHaveBeenCalledWith(`${API_BASE_URL}/items/item-123`);
    });

    expect(consoleErrorMock).toHaveBeenCalledWith("Failed to delete item", new Error("Failed to delete item"));
    expect(mockNavigate).not.toHaveBeenCalled();
    confirmMock.mockRestore();
});

test("logs an error when delete response is not successful", async () => {
    const user = userEvent.setup();
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
    const confirmMock = jest.spyOn(window, "confirm").mockReturnValue(true);
    const deleteMock = axios.delete as jest.Mock;
    deleteMock.mockResolvedValue({
        data: { status: "error", message: "Unable to delete item" },
    });

    renderAddItemWithUserContext(
        {
            clothes: [existingItem]
        },
        {
            route: "/edit/item-123",
            path: "/edit/:id",
        }
    );

    await user.click(screen.getByTestId('delete-button'));

    await waitFor(() => {
        expect(confirmMock).toHaveBeenCalled();
        expect(deleteMock).toHaveBeenCalledWith(`${API_BASE_URL}/items/item-123`);
    });

    expect(consoleErrorMock).toHaveBeenCalledWith("Failed to delete item:", {
        status: "error",
        message: "Unable to delete item",
    });
    expect(mockNavigate).not.toHaveBeenCalled();
    confirmMock.mockRestore();
});

test("updates an existing item with patch and navigates to closet on success", async () => {
    const user = userEvent.setup();
    const refreshClothesMock = jest.fn().mockResolvedValue(undefined);
    const getMock = axios.get as jest.Mock;
    const patchMock = axios.patch as jest.Mock;

    getMock.mockResolvedValue({ data: existingItem });
    patchMock.mockResolvedValue({
        data: { status: "success" },
    });

    renderAddItemWithUserContext(
        {
            clothes: [existingItem],
            refreshClothes: refreshClothesMock,
        },
        {
            route: "/edit/item-123",
            path: "/edit/:id",
        }
    );

    await user.clear(screen.getByTestId("brand-input"));
    await user.type(screen.getByTestId("brand-input"), "BrandC");
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
        expect(patchMock).toHaveBeenCalledWith(
            `${API_BASE_URL}/items/item-123`,
            expect.any(FormData),
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );
        expect(refreshClothesMock).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/closet");
});

test("navigates to closet without patching when no changes are made in edit mode", async () => {
    const user = userEvent.setup();
    const refreshClothesMock = jest.fn().mockResolvedValue(undefined);
    const getMock = axios.get as jest.Mock;
    const patchMock = axios.patch as jest.Mock;

    getMock.mockResolvedValue({ data: existingItem });

    renderAddItemWithUserContext(
        {
            clothes: [existingItem],
            refreshClothes: refreshClothesMock,
        },
        {
            route: "/edit/item-123",
            path: "/edit/:id",
        }
    );

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
        expect(patchMock).not.toHaveBeenCalled();
        expect(refreshClothesMock).not.toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/closet");
    });
});

test("redirects to closet when fetching an edit item returns 404", async () => {
    const getMock = axios.get as jest.Mock;
    getMock.mockRejectedValue({
        response: {
            status: 404,
        },
    });

    renderAddItemWithUserContext(
        {},
        {
            route: "/edit/item-123",
            path: "/edit/:id",
        }
    );

    await waitFor(() => {
        expect(getMock).toHaveBeenCalledWith(`${API_BASE_URL}/items/item-123`);
        expect(mockNavigate).toHaveBeenCalledWith("/closet");
    });
});

test("update button shows up when in edit mode", () => {
    renderAddItemWithUserContext(
        { clothes: [existingItem] },
        {
            route: "/edit/item-123",
            path: "/edit/:id",
        }
    );

    expect(screen.getByTestId('submit-button')).toHaveTextContent("Update Item");
});

test("delete button does not show up when adding new item", () => {
    renderAddItemWithUserContext();

    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
});

test("error message shows when trying to submit without required fields", async () => {
    const user = userEvent.setup();

    renderAddItemWithUserContext();

    await user.click(screen.getByTestId('submit-button'));
    expect(
        await screen.findByText(/please fill out all required fields/i)
    ).toBeInTheDocument();
});

// image test
test("shows image preview when a valid file is uploaded", async () => {
    const user = userEvent.setup();
    const file = new File(["dummy image"], "red-shirt.jpg", {
        type: "image/jpeg",
    });

    renderAddItemWithUserContext();

    await user.upload(screen.getByTestId("image-file-input"), file);

    expect(await screen.findByAltText(/preview/i)).toBeInTheDocument();
});

test("shows image name when a valid image file is uploaded", async () => {
    const user = userEvent.setup();

    renderAddItemWithUserContext();

    const fileInput = screen.getByTestId("image-file-input") as HTMLInputElement;
    const file = new File(["dummy content"], "red-shirt.jpg", { type: "image/jpeg" });

    await user.upload(fileInput, file);

    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0]).toEqual(file);

    expect(await screen.findByText("red-shirt.jpg")).toBeInTheDocument();
});

test("show remove button when a valid image file is uploaded", async () => {
    const user = userEvent.setup();

    renderAddItemWithUserContext();

    const fileInput = screen.getByTestId('image-file-input') as HTMLInputElement;
    const file = new File(["dummy content"], "red-shirt.jpg", { type: "image/jpeg" });

    await user.upload(fileInput, file);

    expect(await screen.findByTestId('remove-image-button')).toBeInTheDocument();
});

test("removes image preview and file name when remove is clicked", async () => {
    const user = userEvent.setup();

    renderAddItemWithUserContext();

    const fileInput = screen.getByTestId('image-file-input') as HTMLInputElement;
    const file = new File(["dummy content"], "red-shirt.jpg", { type: "image/jpeg" });

    await user.upload(fileInput, file);
    await user.click(await screen.findByTestId('remove-image-button'));

    await waitFor(() => {
        expect(screen.queryByTestId('remove-image-button')).not.toBeInTheDocument();
        expect(screen.queryByText("red-shirt.jpg")).not.toBeInTheDocument();
    });
});
