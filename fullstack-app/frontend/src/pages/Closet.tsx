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
import { Flex, Input, Box, Button, Spacer, Group, ButtonGroup } from "@chakra-ui/react";


export function Closet() {
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
                        <Button colorPalette={"blue"}>Add Item</Button>
                    </Box>
                </Flex>
            </Flex>
        </AppLayout >
    );
}

export default Closet;  
