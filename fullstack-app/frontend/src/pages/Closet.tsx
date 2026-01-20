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
import { Flex, Input, Box, Button, ButtonGroup, Card, Image, Text, Heading, NativeSelect, SimpleGrid, Badge, Icon } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiSliders, FiArrowDown, FiPlus, FiGrid, FiHeart, FiX } from "react-icons/fi";
import { useClothContext } from "../hooks/useClothContext";
import { API_BASE_URL } from "../config";
import { pageBackgroundStyles } from "../theme";
import React, { useState } from "react";
import { ClothItem } from "../components/ClothContext";


export function Closet() {
    const navigate = useNavigate();
    // const { id: userId } = useContext(UserContext);
    // const { username } = useContext(UserContext);
    // const [items, setItems] = React.useState<any[]>([]);
    const { clothes, refreshClothes, setClothes } = useClothContext();
    const totalItems = clothes.length;
    const favoriteCount = clothes.filter((item) => item.favorite).length;
    const [searchQuery, setSearchQuery] = useState("");

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

    async function handleSearch() {
        try {
            const response = await axios.get<ClothItem[]>(`${API_BASE_URL}/items`, {
                params: searchQuery ? { search: searchQuery } : {}
            });
            setClothes(response.data ?? []);
            // setItems(response.data ?? []);
        } catch (error) {
            console.error("Failed to search items", error);
            setClothes([]);
        }
    }


    return (
        <AppLayout>
            <Flex
                direction="column"
                minH="100vh"
                overflowY="auto"
                px={6}
                {...pageBackgroundStyles}
            >
                <Flex align="center" justify="space-between" pt={8} pb={4} position="relative" zIndex={1}>
                    <Box>
                        <Heading
                            size="3xl"
                            fontWeight="1000"
                            letterSpacing="-0.02em"
                            fontFamily="'Outfit', 'Nunito', system-ui, sans-serif"
                        >
                            Welcome to your Closet
                        </Heading>
                        <Text color="gray.600" mt={2}>Curate your wardrobe with clarity and style.</Text>
                    </Box>
                    <Button
                        bg="#ead7c7"
                        color="ink"
                        borderRadius="2xl"
                        px={6}
                        h="48px"
                        fontWeight="700"
                        onClick={() => { navigate('/add') }}
                        _hover={{ bg: "#e1c8b5" }}
                    >
                        <Icon as={FiPlus} mr={2} />
                        Add Item
                    </Button>
                </Flex>

                <Flex gap={3} pb={4} flexWrap="wrap" align="center" position="relative" zIndex={1}>
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="sm"
                        px={4}
                        py={3}
                        display="flex"
                        gap={4}
                        alignItems="center"
                    >
                        <Box
                            w="42px"
                            h="42px"
                            borderRadius="full"
                            bg="#f4e6d9"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Icon as={FiGrid} color="#8b6f5a" />
                        </Box>
                        <Box>
                            <Text fontSize="sm" color="gray.500">Total Items</Text>
                            <Text fontWeight="700" fontSize="lg">{totalItems}</Text>
                        </Box>
                        <Box borderLeft="1px solid" borderColor="gray.200" h="28px" />
                        <Box
                            w="42px"
                            h="42px"
                            borderRadius="full"
                            bg="#f4e6d9"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Icon as={FiHeart} color="#8b6f5a" />
                        </Box>
                        <Box>
                            <Text fontSize="sm" color="gray.500">Favorites</Text>
                            <Text fontWeight="700" fontSize="lg">{favoriteCount}</Text>
                        </Box>
                    </Box>
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="sm"
                        px={4}
                        py={3}
                        display="flex"
                        alignItems="center"
                        gap={3}
                        flex="1"
                        minW="260px"
                        position="relative"
                    >
                        <Icon as={FiSearch} color="gray.400" />
                        <Input
                            placeholder="Search items..."
                            bg="transparent"
                            border="none"
                            _focusVisible={{ boxShadow: "none" }}
                            _placeholder={{ color: "gray.400" }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        {searchQuery && (
                            <Button
                                size="xs"
                                variant="ghost"
                                borderRadius="full"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => { refreshClothes(); setSearchQuery(""); }}
                                aria-label="Clear search"
                            >
                                <Icon as={FiX} />
                            </Button>
                        )}
                        <Button size="sm" borderRadius="full" bg="#f1e7de" _hover={{ bg: "#eadcd0" }} onClick={() => handleSearch()}>
                            Search
                        </Button>
                    </Box>
                    <Flex gap={2} flexWrap="wrap">
                        <Box position="relative">
                            <Icon
                                as={FiSliders}
                                position="absolute"
                                left="12px"
                                top="50%"
                                transform="translateY(-50%)"
                                color="gray.400"
                                zIndex={1}
                            />
                            <NativeSelect.Root size="md" w="fit-content" minW="unset" bg="white" borderRadius="xl" boxShadow="sm">
                                <NativeSelect.Field
                                    w="full"
                                    pl="36px"
                                    pr="7"
                                    borderRadius="xl"
                                    h="40px"
                                    fontWeight="600"
                                    fontFamily="'Nunito', ui-rounded, system-ui, sans-serif"
                                >
                                    <option>Filter</option>
                                    <option>All</option>
                                    <option>Favorites</option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </Box>
                        <Box position="relative">
                            <Icon
                                as={FiArrowDown}
                                position="absolute"
                                left="12px"
                                top="50%"
                                transform="translateY(-50%)"
                                color="gray.400"
                                zIndex={1}
                            />
                            <NativeSelect.Root size="md" w="fit-content" minW="unset" bg="white" borderRadius="xl" boxShadow="sm">
                                <NativeSelect.Field
                                    borderRadius="xl"
                                    w="full"
                                    pl="36px"
                                    pr="7"
                                    h="40px"
                                    fontWeight="600"
                                    fontFamily="'Nunito', ui-rounded, system-ui, sans-serif"
                                >
                                    <option>Sort: Recently Added</option>
                                    <option>Alphabetical</option>
                                    <option>Season</option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </Box>
                    </Flex>
                </Flex>

                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6} pb={10} position="relative" zIndex={1}>
                    {clothes.map((item) => (
                        <Card.Root
                            key={item._id}
                            overflow="hidden"
                            borderRadius="2xl"
                            borderWidth="1px"
                            borderColor="gray.100"
                            bg="white"
                            boxShadow="sm"
                            transition="transform 0.2s ease, box-shadow 0.2s ease"
                            _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
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
                                    bgGradient="linear(to-br, #f7efe8, #efe4db)"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text color="gray.500">No Image</Text>
                                </Box>
                            )}

                            <Card.Body gap="2" px={4} pt={4}>
                                <Flex align="center" justify="space-between">
                                    <Card.Title textTransform="capitalize">{item.name}</Card.Title>
                                    <Badge colorPalette="orange" variant="subtle" borderRadius="full">
                                        {item.season}
                                    </Badge>
                                </Flex>
                                <Card.Description>
                                    {item.color} · {item.category}
                                </Card.Description>
                                {item.notes && (
                                    <Text fontSize="sm" color="gray.500">
                                        {item.notes}
                                    </Text>
                                )}
                            </Card.Body>

                            <Card.Footer px={4} pb={4}>
                                <ButtonGroup size="sm" variant="outline">
                                    <Button onClick={() => toggleFavorite(item._id, item.favorite)} borderRadius="md" bg="#f7f0ea" _hover={{ bg: "#eadfd6" }}>
                                        {item.favorite ? "♥ Favorite" : "♡ Favorite"}
                                    </Button>
                                    <Button onClick={() => navigate(`/edit/${item._id}`)} borderRadius="md" bg="#f2e7de" _hover={{ bg: "#eadfd6" }}>Edit</Button>
                                </ButtonGroup>
                            </Card.Footer>
                        </Card.Root>
                    ))}
                </SimpleGrid>
            </Flex>
        </AppLayout >
    );
}

export default Closet;  
