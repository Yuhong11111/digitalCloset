import {
    Flex,
    Button,
    Box,
    NativeSelect,
    Input,
    Dialog,
    Portal,
    Text,
} from "@chakra-ui/react";
import AppLayout from "./AppLayout";

export function Outfits() {
    return <div>
        <AppLayout>
            <Flex direction="column" minH="100vh" overflowY="auto" px={5} bg="canvas">
                <Flex align="center" justify="space-between" px={4} pt={6} pb={3}>
                    <h1>Here are your outfits!</h1>
                    <Dialog.Root>
                        <Dialog.Trigger asChild>
                            <Button
                                bg="#E8DAD0"
                                color="ink"
                                borderRadius="xl"
                                px={5}
                                h="45px"
                                fontWeight="600"
                                _hover={{ bg: "#d4c1b3ff" }}
                            >
                                + Create Outfit
                            </Button>
                        </Dialog.Trigger>
                        <Portal>
                            <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(6px)" />
                            <Dialog.Positioner>
                                <Dialog.Content
                                    maxW="520px"
                                    w="full"
                                    bg="#f8f3ef"
                                    borderRadius="2xl"
                                    boxShadow="xl"
                                    p={6}
                                >
                                    <Flex align="center" justify="space-between" pb={3} borderBottom="1px solid" borderColor="gray.200">
                                        <Dialog.Title fontSize="2xl" fontWeight="700">Create Outfit</Dialog.Title>
                                        <Dialog.CloseTrigger asChild>
                                            <Button variant="ghost" size="sm" fontSize="lg">×</Button>
                                        </Dialog.CloseTrigger>
                                    </Flex>
                                    <Dialog.Body pt={5}>
                                        <Flex direction="column" gap={5}>
                                            <Box>
                                                <Text fontWeight="600" color="gray.600" mb={2}>Outfit Name</Text>
                                                <Input
                                                    placeholder="Create Outfit"
                                                    bg="whiteAlpha.600"
                                                    borderRadius="xl"
                                                    h="45px"
                                                />
                                            </Box>
                                            <Box>
                                                <Text fontWeight="600" color="gray.600" mb={2}>Tags</Text>
                                                <Flex gap={2} wrap="wrap" bg="whiteAlpha.600" borderRadius="xl" p={2}>
                                                    {["Casual", "Neutral", "Comfy"].map((tag) => (
                                                        <Box
                                                            key={tag}
                                                            px={3}
                                                            py={1}
                                                            bg="white"
                                                            borderRadius="full"
                                                            borderWidth="1px"
                                                            borderColor="gray.200"
                                                            fontWeight="600"
                                                        >
                                                            {tag} <Box as="span" ml={2} color="gray.400">×</Box>
                                                        </Box>
                                                    ))}
                                                </Flex>
                                            </Box>
                                            <Flex gap={4} wrap="wrap">
                                                <Box flex="1" minW="200px">
                                                    <Text fontWeight="600" color="gray.600" mb={2}>Season</Text>
                                                    <NativeSelect.Root size="md" w="full">
                                                        <NativeSelect.Field
                                                            borderRadius="xl"
                                                            w="full"
                                                            pr="7"
                                                            h="45px"
                                                            fontWeight="600"
                                                            fontFamily="'Nunito', ui-rounded, system-ui, sans-serif"
                                                        >
                                                            <option>All</option>
                                                            <option>Spring</option>
                                                            <option>Summer</option>
                                                            <option>Fall</option>
                                                            <option>Winter</option>
                                                        </NativeSelect.Field>
                                                        <NativeSelect.Indicator />
                                                    </NativeSelect.Root>
                                                </Box>
                                                <Box flex="1" minW="200px">
                                                    <Text fontWeight="600" color="gray.600" mb={2}>Occasion</Text>
                                                    <NativeSelect.Root size="md" w="full">
                                                        <NativeSelect.Field
                                                            borderRadius="xl"
                                                            w="full"
                                                            pr="7"
                                                            h="45px"
                                                            fontWeight="600"
                                                            fontFamily="'Nunito', ui-rounded, system-ui, sans-serif"
                                                        >
                                                            <option>Casual</option>
                                                            <option>Work</option>
                                                            <option>Formal</option>
                                                            <option>Weekend</option>
                                                        </NativeSelect.Field>
                                                        <NativeSelect.Indicator />
                                                    </NativeSelect.Root>
                                                </Box>
                                            </Flex>
                                            <Button
                                                bg="#e1cfc2"
                                                color="ink"
                                                borderRadius="xl"
                                                h="48px"
                                                fontWeight="700"
                                                _hover={{ bg: "#d4c1b3ff" }}
                                            >
                                                Start Creating
                                            </Button>
                                        </Flex>
                                    </Dialog.Body>
                                </Dialog.Content>
                            </Dialog.Positioner>
                        </Portal>
                    </Dialog.Root>
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
