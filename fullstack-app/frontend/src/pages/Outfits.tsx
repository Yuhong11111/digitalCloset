import {
    Flex,
    Button,
    Box,
    NativeSelect,
    Input,
    Dialog,
    Portal,
    Text,
    Heading,
    SimpleGrid,
    Icon,
} from "@chakra-ui/react";
import AppLayout from "./AppLayout";
import { FiPlus, FiSearch, FiSliders, FiArrowDown } from "react-icons/fi";
import { pageBackgroundStyles } from "../theme";

export function Outfits() {
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
                            Outfits
                        </Heading>
                        <Text color="gray.600" mt={2}>Build looks, save favorites, and plan your week.</Text>
                    </Box>
                    <Dialog.Root>
                        <Dialog.Trigger asChild>
                            <Button
                                bg="#ead7c7"
                                color="ink"
                                borderRadius="2xl"
                                px={5}
                                h="48px"
                                fontWeight="700"
                                _hover={{ bg: "#e1c8b5" }}
                            >
                                <Icon as={FiPlus} mr={2} />
                                Create Outfit
                            </Button>
                        </Dialog.Trigger>
                        <Portal>
                            <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(6px)" />
                            <Dialog.Positioner>
                                <Dialog.Content
                                    maxW="560px"
                                    w="full"
                                    bg="#f8f3ef"
                                    borderRadius="3xl"
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
                <Flex gap={3} pb={4} flexWrap="wrap" align="center" position="relative" zIndex={1}>
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
                    >
                        <Icon as={FiSearch} color="gray.400" />
                        <Input
                            placeholder="Search outfits..."
                            bg="transparent"
                            border="none"
                            _focusVisible={{ boxShadow: "none" }}
                            _placeholder={{ color: "gray.400" }}
                        />
                        <Button size="sm" borderRadius="full" bg="#f1e7de" _hover={{ bg: "#eadcd0" }}>
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
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        borderWidth="1px"
                        borderColor="gray.100"
                        boxShadow="sm"
                        p={6}
                    >
                        <Heading size="md" fontWeight="700" mb={2}>Start with a mood</Heading>
                        <Text color="gray.600" mb={4}>
                            Curate looks by season, event, or color palette.
                        </Text>
                        <Button
                            bg="#ead7c7"
                            color="ink"
                            borderRadius="2xl"
                            h="44px"
                            fontWeight="700"
                            _hover={{ bg: "#e1c8b5" }}
                        >
                            Create a Moodboard
                        </Button>
                    </Box>
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        borderWidth="1px"
                        borderColor="gray.100"
                        boxShadow="sm"
                        p={6}
                    >
                        <Heading size="md" fontWeight="700" mb={2}>Plan the week</Heading>
                        <Text color="gray.600">
                            Save outfits you want ready for busy mornings.
                        </Text>
                    </Box>
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        borderWidth="1px"
                        borderColor="gray.100"
                        boxShadow="sm"
                        p={6}
                    >
                        <Heading size="md" fontWeight="700" mb={2}>Seasonal capsule</Heading>
                        <Text color="gray.600">
                            Build a capsule that keeps your favorites in rotation.
                        </Text>
                    </Box>
                </SimpleGrid>
            </Flex>
        </AppLayout>
    );
}

export default Outfits;
