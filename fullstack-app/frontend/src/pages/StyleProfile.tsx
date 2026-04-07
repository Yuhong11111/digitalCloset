import { useMemo, useState } from "react";
import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    Input,
    SimpleGrid,
    Stack,
    Text,
} from "@chakra-ui/react";
import {
    FiCloudRain,
    FiCompass,
    FiMapPin,
    FiSun,
    FiTarget,
    FiWind,
} from "react-icons/fi";
import AppLayout from "./AppLayout";
import { pageBackgroundStyles } from "../theme";

type QuizSection = {
    id: "colors" | "fits" | "occasions" | "climate" | "styleTags";
    title: string;
    description: string;
    limit: string;
    options: string[];
};

const quizSections: QuizSection[] = [
    {
        id: "colors",
        title: "Color Palette",
        description: "Pick the shades you reach for first.",
        limit: "Choose up to 4",
        options: [
            "Black",
            "White",
            "Navy",
            "Cream",
            "Olive",
            "Brown",
            "Pastels",
            "Brights",
        ],
    },
    {
        id: "fits",
        title: "Preferred Fits",
        description: "Tell the closet how you like garments to sit.",
        limit: "Choose up to 3",
        options: [
            "Relaxed",
            "Tailored",
            "Oversized",
            "Slim",
            "Structured",
            "Flowy",
        ],
    },
    {
        id: "occasions",
        title: "Everyday Occasions",
        description: "Prioritize the moments you dress for most often.",
        limit: "Choose up to 4",
        options: [
            "Work",
            "Weekend",
            "Date Night",
            "Travel",
            "Formal Events",
            "Gym",
            "Lounging",
            "Going Out",
        ],
    },
    {
        id: "climate",
        title: "Climate Reality",
        description: "Shape recommendations around the weather you actually live in.",
        limit: "Choose up to 3",
        options: [
            "Hot & Humid",
            "Four Seasons",
            "Cold Winters",
            "Rainy Days",
            "Dry Heat",
            "Windy",
        ],
    },
    {
        id: "styleTags",
        title: "Style Tags",
        description: "Add the words that best describe your ideal wardrobe.",
        limit: "Choose up to 5",
        options: [
            "Minimal",
            "Classic",
            "Streetwear",
            "Romantic",
            "Scandi",
            "Sporty",
            "Vintage",
            "Edgy",
            "Bohemian",
            "Modern Prep",
        ],
    },
];

const selectionLimits: Record<QuizSection["id"], number> = {
    colors: 4,
    fits: 3,
    occasions: 4,
    climate: 3,
    styleTags: 5,
};

const initialSelections: Record<QuizSection["id"], string[]> = {
    colors: ["Black", "Cream"],
    fits: ["Relaxed"],
    occasions: ["Work", "Weekend"],
    climate: ["Four Seasons"],
    styleTags: ["Minimal", "Classic"],
};

const initialCustomInputs: Record<QuizSection["id"], string> = {
    colors: "",
    fits: "",
    occasions: "",
    climate: "",
    styleTags: "",
};

const climateIcons = {
    "Hot & Humid": FiSun,
    "Four Seasons": FiCompass,
    "Cold Winters": FiWind,
    "Rainy Days": FiCloudRain,
    "Dry Heat": FiSun,
    "Windy": FiWind,
};

export function StyleProfile() {
    const [selections, setSelections] = useState(initialSelections);
    const [customInputs, setCustomInputs] = useState(initialCustomInputs);

    const completedSections = quizSections.filter((section) => selections[section.id].length > 0).length;
    const progress = Math.round((completedSections / quizSections.length) * 100);

    const totalSelections = useMemo(
        () => Object.values(selections).reduce((count, entry) => count + entry.length, 0),
        [selections]
    );

    const dominantMood = useMemo(() => {
        if (selections.styleTags.includes("Minimal")) return "clean-lined";
        if (selections.styleTags.includes("Streetwear")) return "bold";
        if (selections.styleTags.includes("Romantic")) return "soft";
        if (selections.styleTags.includes("Vintage")) return "nostalgic";
        return "balanced";
    }, [selections.styleTags]);

    const resetQuiz = () => {
        setSelections({
            colors: [],
            fits: [],
            occasions: [],
            climate: [],
            styleTags: [],
        });
        setCustomInputs(initialCustomInputs);
    };

    const toggleOption = (sectionId: QuizSection["id"], option: string) => {
        setSelections((current) => {
            const currentValues = current[sectionId];
            const isSelected = currentValues.includes(option);

            if (isSelected) {
                return {
                    ...current,
                    [sectionId]: currentValues.filter((item) => item !== option),
                };
            }

            if (currentValues.length >= selectionLimits[sectionId]) {
                return current;
            }

            return {
                ...current,
                [sectionId]: [...currentValues, option],
            };
        });
    };

    const addCustomOption = (sectionId: QuizSection["id"]) => {
        const value = customInputs[sectionId].trim();

        if (!value) {
            return;
        }

        const alreadyExists = quizSections
            .find((section) => section.id === sectionId)
            ?.options.some((option) => option.toLowerCase() === value.toLowerCase());

        const alreadySelected = selections[sectionId].some(
            (option) => option.toLowerCase() === value.toLowerCase()
        );

        if (alreadyExists || alreadySelected || selections[sectionId].length >= selectionLimits[sectionId]) {
            return;
        }

        setSelections((current) => ({
            ...current,
            [sectionId]: [...current[sectionId], value],
        }));

        setCustomInputs((current) => ({
            ...current,
            [sectionId]: "",
        }));
    };

    const summaryText = `A ${dominantMood} wardrobe built around ${selections.colors.join(", ") || "your core neutrals"}, ${selections.fits.join(", ").toLowerCase() || "easy proportions"}, and outfits that cover ${selections.occasions.join(", ").toLowerCase() || "daily life"}.`;

    return (
        <AppLayout>
            <Flex
                direction="column"
                minH="100vh"
                px={{ base: 2, md: 6 }}
                py={{ base: 4, md: 8 }}
                gap={6}
                overflow="hidden"
                {...pageBackgroundStyles}
            >
                <SimpleGrid columns={{ base: 1, xl: 2 }} gap={6} position="relative" zIndex={1}>
                    <Box
                        bg="rgba(255,255,255,0.78)"
                        backdropFilter="blur(18px)"
                        borderRadius="32px"
                        border="1px solid"
                        borderColor="rgba(130, 94, 65, 0.12)"
                        px={{ base: 5, md: 8 }}
                        py={{ base: 6, md: 8 }}
                        boxShadow="0 24px 80px rgba(102, 77, 54, 0.12)"
                    >
                        <Badge
                            bg="#efe1d2"
                            color="#6d4f3b"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            textTransform="uppercase"
                            letterSpacing="0.12em"
                            mb={4}
                        >
                            Style Identity Quiz
                        </Badge>
                        <Heading
                            fontSize={{ base: "3xl", md: "5xl" }}
                            lineHeight={1}
                            letterSpacing="-0.04em"
                            fontFamily="'Outfit', 'Avenir Next', sans-serif"
                            maxW="10ch"
                        >
                            Build a closet that already knows your taste.
                        </Heading>
                        <Text mt={4} color="gray.600" maxW="54ch" fontSize="md">
                            This frontend-only quiz captures your palette, fits, occasions, climate,
                            and style tags so the rest of the product can feel tailored from the first screen.
                        </Text>

                        <Flex
                            mt={8}
                            gap={4}
                            direction={{ base: "column", sm: "row" }}
                            align={{ base: "stretch", sm: "center" }}
                        >
                            <Box
                                flex="1"
                                bg="#fcf7f2"
                                borderRadius="24px"
                                border="1px solid"
                                borderColor="#ead8c8"
                                px={5}
                                py={4}
                            >
                                <Text fontSize="sm" color="gray.500">Completion</Text>
                                <Text fontSize="3xl" fontWeight="900" lineHeight={1.1}>{progress}%</Text>
                                <Box mt={4} h="10px" bg="#eadfd6" borderRadius="full" overflow="hidden">
                                    <Box
                                        h="full"
                                        w={`${progress}%`}
                                        borderRadius="full"
                                        bgGradient="linear(to-r, #b88862, #e3bb8d)"
                                        transition="width 0.25s ease"
                                    />
                                </Box>
                            </Box>
                            <Box
                                minW={{ base: "auto", sm: "220px" }}
                                bg="#1f1b18"
                                color="white"
                                borderRadius="24px"
                                px={5}
                                py={4}
                            >
                                <Text fontSize="sm" color="whiteAlpha.700">Selections</Text>
                                <Text fontSize="3xl" fontWeight="900" lineHeight={1.1}>{totalSelections}</Text>
                                <Text mt={2} fontSize="sm" color="whiteAlpha.800">
                                    Enough signal to personalize the wardrobe experience.
                                </Text>
                            </Box>
                        </Flex>
                    </Box>

                    <Box
                        bg="#221d19"
                        color="white"
                        borderRadius="32px"
                        px={{ base: 5, md: 8 }}
                        py={{ base: 6, md: 8 }}
                        boxShadow="0 24px 70px rgba(34, 29, 25, 0.28)"
                    >
                        <Flex justify="space-between" align="start" gap={4} flexWrap="wrap">
                            <Box>
                                <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.16em" color="whiteAlpha.700">
                                    Live Preview
                                </Text>
                                <Heading
                                    mt={2}
                                    fontSize={{ base: "2xl", md: "4xl" }}
                                    lineHeight={1}
                                    letterSpacing="-0.03em"
                                    fontFamily="'Outfit', 'Avenir Next', sans-serif"
                                >
                                    Your profile snapshot
                                </Heading>
                            </Box>
                            <Button
                                variant="outline"
                                borderColor="whiteAlpha.400"
                                color="white"
                                borderRadius="full"
                                _hover={{ bg: "whiteAlpha.100" }}
                                onClick={resetQuiz}
                            >
                                Reset
                            </Button>
                        </Flex>

                        <Text mt={5} color="whiteAlpha.800" fontSize="md">
                            {summaryText}
                        </Text>

                        <Stack mt={8} gap={5}>
                            <Box>
                                <Text fontSize="sm" color="whiteAlpha.700" mb={2}>Core Colors</Text>
                                <Flex wrap="wrap" gap={2}>
                                    {selections.colors.length > 0 ? selections.colors.map((color) => (
                                        <Badge key={color} bg="whiteAlpha.200" color="white" px={3} py={1} borderRadius="full">
                                            {color}
                                        </Badge>
                                    )) : (
                                        <Text fontSize="sm" color="whiteAlpha.600">No colors selected yet.</Text>
                                    )}
                                </Flex>
                            </Box>

                            <Box>
                                <Text fontSize="sm" color="whiteAlpha.700" mb={2}>Style Direction</Text>
                                <Flex wrap="wrap" gap={2}>
                                    {selections.styleTags.length > 0 ? selections.styleTags.map((tag) => (
                                        <Badge key={tag} bg="#c89e78" color="#1f1b18" px={3} py={1} borderRadius="full">
                                            {tag}
                                        </Badge>
                                    )) : (
                                        <Text fontSize="sm" color="whiteAlpha.600">No style tags selected yet.</Text>
                                    )}
                                </Flex>
                            </Box>

                            <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
                                {selections.climate.length > 0 ? selections.climate.map((entry) => {
                                    const ClimateIcon = climateIcons[entry as keyof typeof climateIcons] ?? FiMapPin;
                                    return (
                                        <Box key={entry} bg="whiteAlpha.100" borderRadius="22px" p={4}>
                                            <ClimateIcon size={18} />
                                            <Text mt={3} fontWeight="700">{entry}</Text>
                                            <Text fontSize="sm" color="whiteAlpha.700">
                                                Account for this climate in outfit planning.
                                            </Text>
                                        </Box>
                                    );
                                }) : (
                                    <Box bg="whiteAlpha.100" borderRadius="22px" p={4}>
                                        <Text fontWeight="700">Climate not set</Text>
                                        <Text fontSize="sm" color="whiteAlpha.700">
                                            Select climate conditions to tune seasonality and layering.
                                        </Text>
                                    </Box>
                                )}
                            </SimpleGrid>
                        </Stack>
                    </Box>
                </SimpleGrid>

                <Stack gap={5} position="relative" zIndex={1}>
                    {quizSections.map((section) => (
                        <Box
                            key={section.id}
                            bg="rgba(255,255,255,0.86)"
                            backdropFilter="blur(12px)"
                            borderRadius="28px"
                            px={{ base: 5, md: 6 }}
                            py={{ base: 5, md: 6 }}
                            border="1px solid"
                            borderColor="rgba(130, 94, 65, 0.10)"
                            boxShadow="0 18px 50px rgba(113, 87, 63, 0.10)"
                        >
                            <Flex
                                direction={{ base: "column", md: "row" }}
                                justify="space-between"
                                gap={4}
                                mb={5}
                            >
                                <Box>
                                    <Flex align="center" gap={3}>
                                        <Box
                                            w="42px"
                                            h="42px"
                                            borderRadius="16px"
                                            bg="#f1e4d7"
                                            color="#8a6447"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            {section.id === "colors" && <FiTarget />}
                                            {section.id === "fits" && <FiCompass />}
                                            {section.id === "occasions" && <FiMapPin />}
                                            {section.id === "climate" && <FiCloudRain />}
                                            {section.id === "styleTags" && <FiSun />}
                                        </Box>
                                        <Box>
                                            <Heading fontSize={{ base: "xl", md: "2xl" }}>{section.title}</Heading>
                                            <Text color="gray.600">{section.description}</Text>
                                        </Box>
                                    </Flex>
                                </Box>
                                <Badge
                                    alignSelf={{ base: "start", md: "center" }}
                                    bg="#f8efe7"
                                    color="#8a6447"
                                    borderRadius="full"
                                    px={3}
                                    py={1.5}
                                >
                                    {selections[section.id].length}/{selectionLimits[section.id]} selected
                                </Badge>
                            </Flex>

                            <Text fontSize="sm" color="gray.500" mb={4}>
                                {section.limit}
                            </Text>

                            <Flex wrap="wrap" gap={3}>
                                {[...section.options, ...selections[section.id].filter(
                                    (option) =>
                                        !section.options.some(
                                            (defaultOption) =>
                                                defaultOption.toLowerCase() === option.toLowerCase()
                                        )
                                )].map((option) => {
                                    const isSelected = selections[section.id].includes(option);

                                    return (
                                        <Button
                                            key={option}
                                            onClick={() => toggleOption(section.id, option)}
                                            aria-pressed={isSelected}
                                            borderRadius="full"
                                            px={5}
                                            h="48px"
                                            fontWeight="700"
                                            border="1px solid"
                                            borderColor={isSelected ? "#1f1b18" : "#e8ddd2"}
                                            bg={isSelected ? "#1f1b18" : "white"}
                                            color={isSelected ? "white" : "#3e342d"}
                                            _hover={{
                                                bg: isSelected ? "#2a2520" : "#faf3ec",
                                            }}
                                        >
                                            {option}
                                        </Button>
                                    );
                                })}
                            </Flex>

                            <Flex
                                mt={4}
                                gap={3}
                                direction={{ base: "column", md: "row" }}
                                align={{ base: "stretch", md: "center" }}
                            >
                                <Input
                                    value={customInputs[section.id]}
                                    onChange={(event) =>
                                        setCustomInputs((current) => ({
                                            ...current,
                                            [section.id]: event.target.value,
                                        }))
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            addCustomOption(section.id);
                                        }
                                    }}
                                    placeholder={`Add a custom ${section.title.toLowerCase()} choice`}
                                    bg="white"
                                    borderRadius="full"
                                    h="48px"
                                    borderColor="#e8ddd2"
                                    _placeholder={{ color: "gray.400" }}
                                />
                                <Button
                                    onClick={() => addCustomOption(section.id)}
                                    borderRadius="full"
                                    h="48px"
                                    px={5}
                                    bg="#ead7c7"
                                    color="#2d241d"
                                    fontWeight="700"
                                    _hover={{ bg: "#dfc5b0" }}
                                >
                                    Add Custom
                                </Button>
                            </Flex>
                        </Box>
                    ))}
                </Stack>
            </Flex>
        </AppLayout>
    );
}

export default StyleProfile;
