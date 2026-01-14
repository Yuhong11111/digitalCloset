import { Flex, Button, Box, NativeSelect, Input } from "@chakra-ui/react";
import AppLayout from "./AppLayout";
import { useNavigate } from 'react-router-dom';

export function Outfits() {
    const navigate = useNavigate();
    return <div>
        <AppLayout>
            <Flex direction="column" minH="100vh" overflowY="auto" px={5} bg="canvas">
                <Flex align="center" justify="space-between" px={4} pt={6} pb={3}>
                    <h1>Here are your outfits!</h1>
                    <Button
                        bg="#E8DAD0"
                        color="ink"
                        borderRadius="xl"
                        px={5}
                        h="45px"
                        onClick={() => { navigate('/add') }}
                        _hover={{ bg: "#d4c1b3ff" }}
                    >
                        + Create Outfit
                    </Button>
                </Flex>
                <Flex direction="row" align="center" gap={3} px={4} pb={4} justify="flex-start" flexWrap="wrap">
                    <Box maxW="500px" w="full">
                        <Input
                            placeholder="Search outfits..."
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
            </Flex>
        </AppLayout>
    </div >;
}

export default Outfits;