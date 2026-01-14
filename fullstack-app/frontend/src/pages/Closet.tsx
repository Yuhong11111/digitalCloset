/**
* WardrobePage – a post-login homepage for the Digital Closet app.
*
* Features
* - Top navigation (Wardrobe, Outfits, Assistant, Settings)
* - Search, Filter (by type), Sort controls
* - Responsive grid of item cards
* - Add Item modal (name, type, color, season, image URL)
* - Delete item
* - Favorites toggle (client-only demo)
* - Fetches from FastAPI endpoints using HttpOnly cookie auth
* GET /items
* POST /items
* DELETE /items/:id
*
* Notes
* - This file is intentionally self-contained. Wire it into your router at /app/wardrobe.
* - Replace the placeholder API calls with your real backend as needed.
*/

import AppLayout from "./AppLayout";
import { Flex, Input, Box, Button, ButtonGroup, Card, Image, Text, Heading, NativeSelect } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useClothContext } from "../hooks/useClothContext";
import { API_BASE_URL } from "../config";


export function Closet() {
    const navigate = useNavigate();
    // const { id: userId } = useContext(UserContext);
    // const { username } = useContext(UserContext);
    // const [items, setItems] = React.useState<any[]>([]);
    const { clothes, refreshClothes } = useClothContext();

    // if (!clothes || clothes.length === 0)xw
    //     return <Text>No clothes found.</Text>;

    // change favorite status
    const toggleFavorite = async (itemId: string, currentFavorite?: boolean) => {
        try {
            const formData = new FormData();
            formData.append("favorite", String(!currentFavorite));
            await axios.patch(`${API_BASE_URL}/items/${itemId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await refreshClothes();
        } catch (error) {
            console.error("Failed to update favorite", error);
        }
    };


    return (
        <AppLayout>
            <Flex direction="column" minH="100vh" overflowY="auto" px={5} bg="canvas">
                <Flex align="center" justify="space-between" px={4} pt={6} pb={3}>
                    <h1>Welcome to your Closet!</h1>
                    <Button
                        bg="#E8DAD0"
                        color="ink"
                        borderRadius="xl"
                        px={5}
                        h="45px"
                        onClick={() => { navigate('/add') }}
                        _hover={{ bg: "#d4c1b3ff" }}
                    >
                        + Add Item
                    </Button>
                </Flex>
                <Flex direction="row" align="center" gap={3} px={4} pb={4} justify="flex-start" flexWrap="wrap">
                    <Box maxW="500px" w="full">
                        <Input
                            placeholder="Search items..."
                            bg="#f6f2efff"
                            borderColor="gray.300"
                            borderRadius="lg"
                            size="lg"
                            h="45px"
                            _placeholder={{ color: "gray.500" }}
                        />
                    </Box>
                    <NativeSelect.Root size="md" w="fit-content" minW="unset" bg="#f6eee8ff" borderRadius="xl">
                        <NativeSelect.Field
                            w="full"
                            pr="7"
                            borderRadius="xl"
                            h="45px"
                            fontWeight="600"
                            fontFamily="'Nunito', ui-rounded, system-ui, sans-serif"
                        // sx={{ "& option": { fontWeight: "600" } }}
                        >
                            <option>Filter</option>
                            <option>All</option>
                            <option>Favorites</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <NativeSelect.Root size="md" w="fit-content" minW="unset" bg="#f6eee8ff" borderRadius="xl">
                        <NativeSelect.Field
                            borderRadius="xl"
                            w="full"
                            pr="7"
                            h="45px"
                            fontWeight="600"
                            fontFamily="'Nunito', ui-rounded, system-ui, sans-serif"
                        // sx={{ "& option": { fontWeight: "600" } }}
                        >
                            <option>Sort: Recently Added</option>
                            <option>Alphabetical</option>
                            <option>Season</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Flex>
                <Flex wrap="wrap" gap={6} padding={6}>
                    {clothes.map((item) => (
                        <Card.Root
                            key={item._id}
                            maxW="sm"
                            overflow="hidden"
                            boxShadow="sm"
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor="gray.100"
                            bg="#f6f2efff"
                        >
                            {item.imageUrl ? (
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    objectFit="cover"
                                    height="220px"
                                />
                            ) : (
                                <Box
                                    height="220px"
                                    bg="gray.50"
                                    borderRadius="lg"
                                    mx={4}
                                    mt={4}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text color="gray.500">No Image</Text>
                                </Box>
                            )}

                            <Card.Body gap="2" px={4}>
                                <Card.Title textTransform="capitalize">{item.name}</Card.Title>
                                <Card.Description>
                                    {item.color} · {item.category} · {item.season}
                                </Card.Description>
                                {item.notes && (
                                    <Text fontSize="sm" color="gray.500">
                                        {item.notes}
                                    </Text>
                                )}
                            </Card.Body>

                            <Card.Footer px={4} pb={4}>
                                <ButtonGroup size="sm" variant="outline">
                                    <Button onClick={() => toggleFavorite(item._id, item.favorite)} borderRadius="md" bg="#f3ede9ff" _hover={{ bg: "#e8dcd3ff" }}>
                                        {item.favorite ? "♥ Favorite" : "♡ Favorite"}
                                    </Button>
                                    <Button onClick={() => navigate(`/edit/${item._id}`)} borderRadius="md" bg="#F1E8E2" _hover={{ bg: "#e8dcd3ff" }}>Edit</Button>
                                </ButtonGroup>
                            </Card.Footer>
                        </Card.Root>
                    ))}
                </Flex>
            </Flex>
        </AppLayout >
    );
}

export default Closet;  
