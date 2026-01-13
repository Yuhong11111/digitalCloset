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
import { Flex, Input, Box, Button, Spacer, Group, ButtonGroup, Card, Image, Text } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from "react";
import { ClothContext, ClothContextProvider } from "../components/ClothContext";


export function Closet() {
    const navigate = useNavigate();
    // const { id: userId } = useContext(UserContext);
    // const { username } = useContext(UserContext);
    // const [items, setItems] = React.useState<any[]>([]);
    const { clothes } = useContext(ClothContext);

    // if (!clothes || clothes.length === 0)
    //     return <Text>No clothes found.</Text>;


    return (
        <AppLayout>
            <Flex direction="column" minH="100vh" overflowY="auto">
                <Flex p={4} gap={4}>
                    <h1>Welcome to your Closet!</h1>
                </Flex>
                <Flex flexWrap="wrap">
                    <Box margin={5} gap={4} display="flex" alignItems="center">
                        <Group attached w="full" maxW="sm">
                            <Input w="28rem" flex="10" placeholder={"for search, filter, sort controls"} />
                            <Button variant="outline">
                                Search
                            </Button>
                        </Group>
                        <ButtonGroup variant="ghost">
                            <Button>Filter</Button>
                            <Button>Sort</Button>
                        </ButtonGroup>
                    </Box>
                    <Spacer />
                    <Box margin={15}>
                        <Button colorPalette={"blue"} onClick={() => { navigate('/add') }}>Add Item</Button>
                    </Box>
                </Flex>
                <Flex wrap="wrap" gap={6} padding={6}>
                    {clothes.map((item) => (
                        <Card.Root
                            key={item._id}
                            maxW="sm"
                            overflow="hidden"
                            boxShadow="md"
                            borderRadius="xl"
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
                                    bg="gray.100"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text color="gray.500">No Image</Text>
                                </Box>
                            )}

                            <Card.Body gap="2">
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

                            <Card.Footer>
                                <Button variant={item.favorite ? "solid" : "outline"} colorScheme="pink">
                                    {item.favorite ? "★ Favorite" : "♡ Mark Favorite"}
                                </Button>
                                <Button onClick={() => navigate(`/edit/${item._id}`)} variant='subtle'>Edit</Button>
                            </Card.Footer>
                        </Card.Root>
                    ))}
                </Flex>
            </Flex>
        </AppLayout >
    );
}

export default Closet;  
