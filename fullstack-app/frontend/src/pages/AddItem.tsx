import {
    Box,
    Button,
    ButtonGroup,
    Grid,
    Heading,
    Image,
    Input,
    NativeSelect,
    Switch,
    Textarea,
    For,
    Flex,
    Text,
    Icon,
} from "@chakra-ui/react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from "./AppLayout";
import { ClothingCategory, SeasonTag } from "../components/ClothContext";
import { useClothContext } from "../hooks/useClothContext";
import axios from "axios";
import { UserContext } from "../components/UserContext";
import { FiArrowLeft, FiImage, FiStar } from "react-icons/fi";
import { API_BASE_URL } from "../config";
import { pageBackgroundStyles } from "../theme";

const categories: ClothingCategory[] = ["top", "bottom", "outerwear", "footwear", "accessory", "others", "dress"];
const seasons: SeasonTag[] = ["all", "spring", "summer", "fall", "winter"];

export default function AddItem() {
    const { refreshClothes, clothes } = useClothContext();
    const navigate = useNavigate();

    const { id: userId } = useContext(UserContext);

    const [name, setName] = useState("");
    const [category, setCategory] = useState<ClothingCategory>("top");
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [material, setMaterial] = useState("");
    const [brand, setBrand] = useState("");
    const [tags, setTags] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [season, setSeason] = useState<SeasonTag>("all");
    const [imagePreview, setImagePreview] = useState("");
    const [imageFileName, setImageFileName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [notes, setNotes] = useState("");
    const [favorite, setFavorite] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [originalItem, setOriginalItem] = useState<any | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    // edit mode
    // parse the :id param from the url if exists to determine edit mode
    const params = useParams<{ id: string }>();
    const isEditMode = Boolean(params.id);

    useEffect(() => {
        if (!isEditMode) return;

        async function fetchItemData() {
            try {
                const response = await axios.get(`${API_BASE_URL}/items/${params.id}`);
                const item = response.data;
                setName(item.name);
                setCategory(item.category);
                setColor(item.color);
                setSize(item.size || "");
                setMaterial(item.material || "");
                setBrand(item.brand || "");
                setTags(Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "");
                setPurchasePrice(item.purchase_price ? String(item.purchase_price) : "");
                setSeason(item.season);
                setNotes(item.notes || "");
                setFavorite(item.favorite || false);
                setOriginalItem(item);
                if (item.imageUrl) {
                    setImagePreview(item.imageUrl);
                    const urlParts = item.imageUrl.split('/');
                    setImageFileName(urlParts[urlParts.length - 1]);
                }
            } catch (error) {
                console.error("Failed to fetch item data", error);
            }
        }

        const existingItem = clothes.find((entry) => entry._id === params.id);
        if (existingItem) {
            setName(existingItem.name);
            setCategory(existingItem.category);
            setColor(existingItem.color);
            setSize(existingItem.size || "");
            setMaterial(existingItem.material || "");
            setBrand(existingItem.brand || "");
            setTags(Array.isArray(existingItem.tags) ? existingItem.tags.join(", ") : existingItem.tags || "");
            setPurchasePrice(existingItem.purchase_price ? String(existingItem.purchase_price) : "");
            setSeason(existingItem.season);
            setNotes(existingItem.notes || "");
            setFavorite(existingItem.favorite || false);
            setOriginalItem(existingItem);
            if (existingItem.imageUrl) {
                setImagePreview(existingItem.imageUrl);
            }
        }

        fetchItemData();
    }, [clothes, isEditMode, params.id]);

    const resetForm = () => {
        setName("");
        setCategory("top");
        setColor("");
        setSize("");
        setMaterial("");
        setBrand("");
        setTags("");
        setPurchasePrice("");
        setSeason("all");
        setImagePreview("");
        setImageFile(null);
        setImageFileName("");
        setNotes("");
        setFavorite(false);
    };

    // for any edit changes or new item submission
    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setFormError(null);
        setIsSubmitting(true);
        if (!userId) {
            console.error('No user id—redirect to login or show an error');
            setIsSubmitting(false);
            return;
        }
        if (!name.trim() || !category || !color.trim() || !season) {
            setFormError("Please fill out all required fields (Name, Category, Color, Season).");
            setIsSubmitting(false);
            return;
        }
        const formData = new FormData();

        // If in edit mode, only append changed fields
        if (isEditMode) {
            if (!originalItem) {
                console.error("Missing original item data for patch.");
                setIsSubmitting(false);
                return;
            }

            let hasChanges = false;
            if (name !== originalItem.name) {
                formData.append("name", name);
                hasChanges = true;
            }
            if (category !== originalItem.category) {
                formData.append("category", category);
                hasChanges = true;
            }
            if (color !== originalItem.color) {
                formData.append("color", color);
                hasChanges = true;
            }
            if (season !== originalItem.season) {
                formData.append("season", season);
                hasChanges = true;
            }
            if ((originalItem.size || "") !== size) {
                formData.append("size", size);
                hasChanges = true;
            }
            if ((originalItem.material || "") !== material) {
                formData.append("material", material);
                hasChanges = true;
            }
            if ((originalItem.brand || "") !== brand) {
                formData.append("brand", brand);
                hasChanges = true;
            }
            const originalTags = Array.isArray(originalItem.tags) ? originalItem.tags.join(", ") : originalItem.tags || "";
            if (originalTags !== tags) {
                formData.append("tags", tags);
                hasChanges = true;
            }
            const originalPrice = originalItem.purchase_price ? String(originalItem.purchase_price) : "";
            if (originalPrice !== purchasePrice) {
                formData.append("purchase_price", purchasePrice);
                hasChanges = true;
            }
            if (Boolean(originalItem.favorite) !== favorite) {
                formData.append("favorite", String(favorite));
                hasChanges = true;
            }

            const originalNotes = originalItem.notes || "";
            if (notes !== originalNotes) {
                formData.append("notes", notes);
                hasChanges = true;
            }
            if (imageFile) {
                formData.append("image", imageFile);
                hasChanges = true;
            }

            if (!hasChanges) {
                setIsSubmitting(false);
                navigate('/closet');
                return;
            }
        } else {
            // New item - append all fields
            formData.append("name", name);
            formData.append("category", category);
            formData.append("color", color);
            if (size) formData.append("size", size);
            if (material) formData.append("material", material);
            if (brand) formData.append("brand", brand);
            if (tags) formData.append("tags", tags);
            if (purchasePrice) formData.append("purchase_price", purchasePrice);
            formData.append("season", season);
            formData.append("favorite", String(favorite));
            if (notes) formData.append("notes", notes);
            formData.append("ownerId", userId);
            if (imageFile) {
                formData.append("image", imageFile);
            }
        }

        try {
            const url = isEditMode ? `${API_BASE_URL}/items/${params.id}` : `${API_BASE_URL}/items`;
            // PATCH request for edit mode, POST for new item
            const response = isEditMode
                ? await axios.patch(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                : await axios.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            if (response.data.status === "success") {
                await refreshClothes();
                resetForm();
                navigate('/closet');
            } else {
                console.error("Failed to add item:", response.data);
            }
        } catch (error) {
            console.error("Failed to add item", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; //only take the first file
        if (!file) return;

        setImageFile(file);
        // following is only for ui display
        const reader = new FileReader(); //FileReader is a browser API that can convert files into strings so you can preview them.
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
            setImageFileName(file.name);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setImagePreview("");
        setImageFile(null);
        setImageFileName("");
    };

    return (
        <AppLayout>
            <Flex
                direction="column"
                minH="100vh"
                overflowY="auto"
                px={6}
                {...pageBackgroundStyles}
            >
                <Flex align="center" justify="space-between" pt={8} pb={6} position="relative" zIndex={1}>
                    <Box>
                        <Heading
                            size="2xl"
                            fontWeight="800"
                            letterSpacing="-0.02em"
                            fontFamily="'Outfit', 'Nunito', system-ui, sans-serif"
                        >
                            {isEditMode ? "Edit Clothing Item" : "Add New Clothing Item"}
                        </Heading>
                        <Text color="gray.600" mt={2}>Capture the details so future outfits feel effortless.</Text>
                    </Box>
                    <Button variant="ghost" onClick={() => { navigate('/closet') }}>
                        <Icon as={FiArrowLeft} mr={2} />
                        Back to Closet
                    </Button>
                </Flex>

                <Box
                    maxW="4xl"
                    mx="auto"
                    w="full"
                    bg="white"
                    borderRadius="3xl"
                    boxShadow="sm"
                    borderWidth="1px"
                    borderColor="gray.100"
                    p={{ base: 6, md: 8 }}
                    position="relative"
                    zIndex={1}
                >
                    {formError && (
                        <Box mb={4} px={4} py={3} bg="#fff1ee" borderRadius="xl" color="#b42318">
                            {formError}
                        </Box>
                    )}
                    <form onSubmit={handleSubmit}>
                        <Grid templateColumns={["1fr", "repeat(2, 1fr)"]} gap={6}>
                            <Box>
                                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
                                    Name <Text as="span" color="#b42318">*</Text>
                                </Text>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Black T-Shirt"
                                    h="46px"
                                    borderRadius="xl"
                                    borderColor="gray.200"
                                    bg="white"
                                />
                            </Box>
                            <Box>
                                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
                                    Category <Text as="span" color="#b42318">*</Text>
                                </Text>
                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                                        borderRadius="xl"
                                        h="46px"
                                        fontWeight="600"
                                        fontFamily="'Nunito', ui-rounded, system-ui, sans-serif"
                                    >
                                        <For each={categories}>
                                            {(option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            )}
                                        </For>
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Box>
                            <Box>
                                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
                                    Color <Text as="span" color="#b42318">*</Text>
                                </Text>
                                <Input
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="e.g., Navy"
                                    h="46px"
                                    borderRadius="xl"
                                    borderColor="gray.200"
                                    bg="white"
                                />
                            </Box>
                            <Box>
                                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
                                    Size
                                </Text>
                                <Input
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    placeholder="e.g., M, 32, 8.5"
                                    h="46px"
                                    borderRadius="xl"
                                    borderColor="gray.200"
                                    bg="white"
                                />
                            </Box>
                            <Box>
                                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
                                    Material
                                </Text>
                                <Input
                                    value={material}
                                    onChange={(e) => setMaterial(e.target.value)}
                                    placeholder="e.g., Cotton, Wool"
                                    h="46px"
                                    borderRadius="xl"
                                    borderColor="gray.200"
                                    bg="white"
                                />
                            </Box>
                            <Box>
                                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
                                    Brand
                                </Text>
                                <Input
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    placeholder="e.g., Uniqlo"
                                    h="46px"
                                    borderRadius="xl"
                                    borderColor="gray.200"
                                    bg="white"
                                />
                            </Box>
                            <Box>
                                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
                                    Tags
                                </Text>
                                <Input
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="e.g., casual, work, summer"
                                    h="46px"
                                    borderRadius="xl"
                                    borderColor="gray.200"
                                    bg="white"
                                />
                            </Box>
                            <Box>
                                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
                                    Purchase Price
                                </Text>
                                <Input
                                    value={purchasePrice}
                                    onChange={(e) => setPurchasePrice(e.target.value)}
                                    placeholder="e.g., 49.99"
                                    h="46px"
                                    borderRadius="xl"
                                    borderColor="gray.200"
                                    bg="white"
                                    type="number"
                                    inputMode="decimal"
                                />
                            </Box>
                            <Box>
                                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
                                    Season <Text as="span" color="#b42318">*</Text>
                                </Text>
                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        value={season}
                                        onChange={(e) => setSeason(e.target.value as SeasonTag)}
                                        borderRadius="xl"
                                        h="46px"
                                        fontWeight="600"
                                        fontFamily="'Nunito', ui-rounded, system-ui, sans-serif"
                                    >
                                        <For each={seasons}>
                                            {(option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            )}
                                        </For>
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Box>
                            <Box gridColumn={["auto", "span 2"]}>
                                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>Image</Text>
                                <Box
                                    borderWidth="1px"
                                    borderStyle="dashed"
                                    borderColor="gray.300"
                                    borderRadius="xl"
                                    p={4}
                                    bg="#fbf7f3"
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiImage} color="gray.500" />
                                        <Input type="file" accept="image/*" onChange={handleFileChange} bg="white" borderRadius="lg" />
                                    </Flex>
                                </Box>
                                {imagePreview && (
                                    <Box mt={3}>
                                        <Image
                                            src={imagePreview}
                                            alt={name || "Preview"}
                                            maxH="200px"
                                            objectFit="cover"
                                            borderRadius="xl"
                                            borderWidth="1px"
                                            borderColor="gray.100"
                                        />
                                        <ButtonGroup mt={2} size="xs">
                                            <Button variant="ghost" onClick={clearImage}>
                                                Remove
                                            </Button>
                                            {imageFileName && (
                                                <Button variant="ghost">
                                                    {imageFileName}
                                                </Button>
                                            )}
                                        </ButtonGroup>
                                    </Box>
                                )}
                            </Box>
                            <Box gridColumn={["auto", "span 2"]}>
                                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>Notes</Text>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Fabric, brand, outfit ideas..."
                                    rows={3}
                                    borderRadius="xl"
                                    borderColor="gray.200"
                                    bg="white"
                                />
                            </Box>
                            <Box display="flex" alignItems="center" gap="3">
                                <Icon as={FiStar} color={favorite ? "#c17852" : "gray.400"} />
                                <Switch.Root
                                    checked={favorite}
                                    onCheckedChange={(e) => {
                                        setFavorite(e.checked)
                                    }}>
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                    <Switch.Label>Favorite</Switch.Label>
                                </Switch.Root>
                            </Box>
                        </Grid>
                        <Flex mt={8} align="center" justify="space-between" flexWrap="wrap" gap={3}>
                            <Button
                                type="submit"
                                bg="#ead7c7"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                                color="ink"
                                borderRadius="2xl"
                                h="48px"
                                fontWeight="700"
                                _hover={{ bg: "#e1c8b5" }}
                            >
                                {isEditMode ? "Update Item" : "Add Item"}
                            </Button>
                            {isEditMode && (
                                <Button
                                    variant="outline"
                                    borderRadius="2xl"
                                    h="48px"
                                    borderColor="red.200"
                                    color="red.700"
                                    onClick={async () => {
                                        if (!params.id) return;
                                        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
                                        if (!confirmDelete) return;

                                        try {
                                            const response = await axios.delete(`${API_BASE_URL}/items/${params.id}`);
                                            if (response.data.status === "success") {
                                                await refreshClothes();
                                                navigate('/closet');
                                            } else {
                                                console.error("Failed to delete item:", response.data);
                                            }
                                        } catch (error) {
                                            console.error("Failed to delete item", error);
                                        }
                                    }}
                                >
                                    Delete Item
                                </Button>
                            )}
                        </Flex>
                    </form>
                </Box>
            </Flex>
        </AppLayout>
    );
}
