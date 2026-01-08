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
} from "@chakra-ui/react";
import { FormEvent, useContext, useState } from "react";
import AppLayout from "./AppLayout";
import { ClothingCategory, SeasonTag } from "../components/ClothContext";
import { useClothContext } from "../hooks/useClothContext";
import axios from "axios";
import { UserContext } from "../components/UserContext";
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../config";

const categories: ClothingCategory[] = ["top", "bottom", "outerwear", "footwear", "accessory"];
const seasons: SeasonTag[] = ["all", "spring", "summer", "fall", "winter"];

export default function AddItem() {
    const { refreshClothes } = useClothContext();
    const navigate = useNavigate();

    const { id: userId } = useContext(UserContext);

    const [name, setName] = useState("");
    const [category, setCategory] = useState<ClothingCategory>("top");
    const [color, setColor] = useState("");
    const [season, setSeason] = useState<SeasonTag>("all");
    const [imagePreview, setImagePreview] = useState("");
    const [imageFileName, setImageFileName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [notes, setNotes] = useState("");
    const [favorite, setFavorite] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setName("");
        setCategory("top");
        setColor("");
        setSeason("all");
        setImagePreview("");
        setImageFile(null);
        setImageFileName("");
        setNotes("");
        setFavorite(false);
    };

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setIsSubmitting(true);
        if (!userId) {
            console.error('No user id—redirect to login or show an error');
            setIsSubmitting(false);
            return;
        }
        const url = `${API_BASE_URL}/items`;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("category", category);
        formData.append("color", color);
        formData.append("season", season);
        formData.append("favorite", String(favorite));
        if (notes) formData.append("notes", notes);
        formData.append("ownerId", userId);
        if (imageFile) {
            formData.append("image", imageFile);
        }
        try {
            const response = await axios.post(url, formData, {
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
            <Box maxW="3xl" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" bg="white">
                <Heading size="md" mb={6}>
                    Add New Item
                </Heading>
                <form onSubmit={handleSubmit}>
                    <Grid templateColumns={["1fr", "repeat(2, 1fr)"]} gap={6}>
                        <Box>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Black T-Shirt" />
                        </Box>
                        <Box>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as ClothingCategory)}
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
                            <label className="block text-sm font-medium text-gray-700">Color</label>
                            <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g., Navy" />
                        </Box>
                        <Box>
                            <label className="block text-sm font-medium text-gray-700">Season</label>
                            <NativeSelect.Root>
                                <NativeSelect.Field value={season} onChange={(e) => setSeason(e.target.value as SeasonTag)}>
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
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <Input type="file" accept="image/*" onChange={handleFileChange} />
                            {imagePreview && (
                                <Box mt={3}>
                                    <Image
                                        src={imagePreview}
                                        alt={name || "Preview"}
                                        maxH="200px"
                                        objectFit="cover"
                                        borderRadius="md"
                                        borderWidth="1px"
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
                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Fabric, brand, outfit ideas..."
                                rows={3}
                            />
                        </Box>
                        <Box display="flex" alignItems="center" gap="2">
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
                    <Button type="submit" mt={8} colorScheme="blue" loading={isSubmitting} disabled={isSubmitting}>
                        Save Item
                    </Button>
                    <Button mt={8} onClick={() => { navigate('/closet') }} ml={4} variant="ghost">
                        Back to Closet
                    </Button>
                </form>
            </Box>
        </AppLayout>
    );
}
