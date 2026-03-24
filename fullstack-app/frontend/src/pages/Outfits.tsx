import {
    Box,
    Button,
    Dialog,
    Flex,
    Heading,
    Icon,
    Input,
    NativeSelect,
    Portal,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";
import { FiCloud, FiMapPin, FiPlus, FiRefreshCw, FiSun } from "react-icons/fi";
import AppLayout from "./AppLayout";
import { pageBackgroundStyles } from "../theme";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

type GeoPermissionState = "idle" | "prompt" | "granted" | "denied" | "unsupported";

type WeatherDisplay = {
    location: string;
    temp: string;
    condition: string;
};

const fallbackWeather: WeatherDisplay = {
    location: "San Francisco",
    temp: "68°F",
    condition: "Partly Cloudy",
};

const outfitItems = [
    { icon: "🧥", label: "Light Jacket" },
    { icon: "👕", label: "White T-Shirt" },
    { icon: "👖", label: "Jeans" },
];

const insightCards = [
    {
        title: "Start with a mood",
        description: "Curate looks by season, event, or color palette.",
    },
    {
        title: "Plan the week",
        description: "Save outfits you want ready for busy mornings.",
    },
    {
        title: "Seasonal capsule",
        description: "Build a capsule that keeps your favorites in rotation.",
    },
];

async function fetchWeatherForCoords(latitude: number, longitude: number): Promise<WeatherDisplay> {
    const response = await fetch(
        `${API_BASE_URL}/weather/current?lat=${latitude}&lon=${longitude}`,
        { credentials: "include" }
    );

    if (!response.ok) {
        throw new Error("Unable to fetch weather");
    }

    const data = await response.json();

    return {
        location: typeof data?.location === "string" && data.location.trim() ? data.location : fallbackWeather.location,
        temp: typeof data?.temp_c === "number" ? `${Math.round(data.temp_c)}°C` : fallbackWeather.temp,
        condition: typeof data?.condition === "string" && data.condition.trim() ? data.condition : fallbackWeather.condition,
    };
}

function CreateOutfitDialog() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button
                    px={6}
                    boxShadow="0 12px 30px rgba(131, 102, 81, 0.12)"
                    bg="#ead7c7"
                    color="ink"
                    borderRadius="2xl"
                    h="48px"
                    fontWeight="700"
                    _hover={{ bg: "#e1c8b5" }}
                >
                    <Icon as={FiPlus} mr={2.5} boxSize={5} />
                    Create Outfit
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(6px)" />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW="560px"
                        w="full"
                        bg="#fbf6f1"
                        borderRadius="30px"
                        boxShadow="0 32px 90px rgba(64, 43, 28, 0.18)"
                        p={6}
                    >
                        <Flex align="center" justify="space-between" pb={3} borderBottom="1px solid" borderColor="blackAlpha.100">
                            <Dialog.Title fontSize="2xl" fontWeight="700">Create Outfit</Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                                <Button variant="ghost" size="sm" fontSize="lg">×</Button>
                            </Dialog.CloseTrigger>
                        </Flex>
                        <Dialog.Body pt={5}>
                            <Flex direction="column" gap={5}>
                                <Box>
                                    <Text fontWeight="600" color="gray.600" mb={2}>Outfit Name</Text>
                                    <Input placeholder="Weekend layers" bg="white" borderRadius="xl" h="45px" />
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
                                                bg="white"
                                                fontWeight="600"
                                                fontFamily="'Nunito', ui-rounded, system-ui, sans-serif"
                                            >
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
                                                bg="white"
                                                fontWeight="600"
                                                fontFamily="'Nunito', ui-rounded, system-ui, sans-serif"
                                            >
                                                <option>Casual</option>
                                                <option>Work</option>
                                                <option>Weekend</option>
                                                <option>Travel</option>
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>
                                    </Box>
                                </Flex>
                                <Button
                                    bg="#d9b899"
                                    color="white"
                                    borderRadius="xl"
                                    h="48px"
                                    fontWeight="700"
                                    _hover={{ bg: "#cea785" }}
                                >
                                    Start Creating
                                </Button>
                            </Flex>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

function OutfitVisual() {
    return (
        <Box
            flex="1"
            minH={{ base: "340px", lg: "400px" }}
            borderRadius="28px"
            position="relative"
            overflow="hidden"
            bg="linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(247,240,232,0.95) 100%)"
        >
            <Box
                position="absolute"
                inset={0}
                bg="radial-gradient(circle at 20% 20%, rgba(255,255,255,0.95), transparent 35%), radial-gradient(circle at 70% 30%, rgba(204, 231, 230, 0.45), transparent 34%), radial-gradient(circle at 50% 85%, rgba(232, 219, 207, 0.75), transparent 36%)"
            />
            <Box
                position="absolute"
                left={{ base: "16%", md: "22%" }}
                top={{ base: "8%", md: "6%" }}
                w={{ base: "26%", md: "22%" }}
                h={{ base: "60%", md: "68%" }}
                borderRadius="100px 100px 28px 28px"
                bg="linear-gradient(180deg, #6db8b6 0%, #5ea5a3 100%)"
                boxShadow="0 24px 36px rgba(80, 140, 138, 0.22)"
            >
                <Box position="absolute" insetX="39%" top="-18px" w="22%" h="24px" border="3px solid #ccb4a2" borderBottom="0" borderRadius="full" />
                <Box position="absolute" top="18%" left="-10%" w="18%" h="52%" borderRadius="full" bg="#69b1ae" transform="rotate(10deg)" />
                <Box position="absolute" top="18%" right="-10%" w="18%" h="52%" borderRadius="full" bg="#69b1ae" transform="rotate(-10deg)" />
                <Box position="absolute" top="9%" left="33%" w="34%" h="18%" borderRadius="0 0 24px 24px" borderTop="3px solid rgba(255,255,255,0.55)" />
                <Box position="absolute" top="26%" left="49%" w="3px" h="44%" bg="rgba(255,255,255,0.38)" />
                {[0, 1, 2, 3, 4].map((index) => (
                    <Box
                        key={index}
                        position="absolute"
                        left="calc(49% - 4px)"
                        top={`calc(31% + ${index * 8}%)`}
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg="#ead7cb"
                    />
                ))}
            </Box>
            <Box
                position="absolute"
                left={{ base: "48%", md: "49%" }}
                top={{ base: "9%", md: "10%" }}
                w={{ base: "24%", md: "21%" }}
                h={{ base: "42%", md: "46%" }}
                borderRadius="36px 36px 22px 22px"
                bg="linear-gradient(180deg, #63b7b7 0%, #57a8a9 100%)"
                boxShadow="0 24px 36px rgba(80, 140, 138, 0.18)"
            >
                <Box position="absolute" top="5%" left="30%" w="40%" h="14%" borderRadius="0 0 24px 24px" borderTop="3px solid rgba(255,255,255,0.48)" />
                <Box position="absolute" top="18%" left="-12%" w="22%" h="35%" borderRadius="full" bg="#63b7b7" transform="rotate(14deg)" />
                <Box position="absolute" top="18%" right="-12%" w="22%" h="35%" borderRadius="full" bg="#63b7b7" transform="rotate(-14deg)" />
            </Box>
            <Box
                position="absolute"
                right={{ base: "10%", md: "13%" }}
                top={{ base: "43%", md: "44%" }}
                w={{ base: "16%", md: "15%" }}
                h={{ base: "33%", md: "36%" }}
                borderRadius="18px 18px 12px 12px"
                bg="linear-gradient(180deg, #8ccccc 0%, #78b7b8 100%)"
                transform="rotate(4deg)"
                boxShadow="0 20px 32px rgba(80, 140, 138, 0.16)"
            >
                <Box position="absolute" top="8%" left="14%" w="72%" h="10%" borderTop="2px solid rgba(110, 140, 140, 0.55)" />
                <Box position="absolute" top="18%" left="18%" w="18%" h="10%" borderRadius="full" border="2px solid rgba(110, 140, 140, 0.45)" />
                <Box position="absolute" top="18%" right="18%" w="18%" h="10%" borderRadius="full" border="2px solid rgba(110, 140, 140, 0.45)" />
            </Box>
            <Box
                position="absolute"
                left={{ base: "9%", md: "12%" }}
                bottom={{ base: "7%", md: "6%" }}
                w={{ base: "20%", md: "18%" }}
                h={{ base: "19%", md: "21%" }}
                borderRadius="28px 28px 16px 16px"
                bg="linear-gradient(180deg, #5f9ea0 0%, #538a8d 100%)"
                boxShadow="0 18px 28px rgba(80, 140, 138, 0.2)"
            >
                <Box position="absolute" left="12%" right="12%" top="18%" h="14%" borderTop="3px solid rgba(255,255,255,0.35)" borderRadius="full" />
                <Box position="absolute" left="20%" right="20%" top="-28%" h="48%" border="4px solid #4d8285" borderBottom="0" borderRadius="full" />
                <Box position="absolute" right="-8%" bottom="5%" w="14%" h="50%" borderRadius="full" border="4px solid #4d8285" borderLeft="0" />
                <Box position="absolute" left="44%" top="40%" w="18%" h="16%" borderRadius="6px" bg="#dec2a8" />
            </Box>
            <Flex
                position="absolute"
                right={{ base: "16%", md: "20%" }}
                bottom={{ base: "6%", md: "7%" }}
                gap={3}
                align="flex-end"
            >
                <Box
                    w={{ base: "48px", md: "56px" }}
                    h={{ base: "74px", md: "82px" }}
                    borderRadius="18px 18px 10px 10px"
                    bg="linear-gradient(180deg, #78c6c6 0%, #69b1b0 100%)"
                    transform="rotate(8deg)"
                    boxShadow="0 12px 24px rgba(80, 140, 138, 0.18)"
                />
                <Box
                    w={{ base: "48px", md: "56px" }}
                    h={{ base: "74px", md: "82px" }}
                    borderRadius="18px 18px 10px 10px"
                    bg="linear-gradient(180deg, #85d0d0 0%, #74bbbc 100%)"
                    transform="rotate(-8deg)"
                    boxShadow="0 12px 24px rgba(80, 140, 138, 0.18)"
                />
            </Flex>
        </Box>
    );
}

export function Outfits() {
    const [weather, setWeather] = useState<WeatherDisplay>(fallbackWeather);
    const [geoPermission, setGeoPermission] = useState<GeoPermissionState>("idle");
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationMessage, setLocationMessage] = useState("Using default weather");

    //The basic workflow is:
    //1. On component mount, we check if geolocation is supported and what the current permission status is. We also set up a listener for changes to the permission status, so if the user grants or denies permission after the initial check, we can update our UI accordingly.
    //2. When the user clicks the "Use my location" button, we request their current position. If they grant permission and we successfully get their location, we fetch the weather for those coordinates and update our display. If they deny permission or if there's an error getting their location, we show an appropriate message.
    //On page load -> check if geolocation is supported -> check permission status -> store it in state -> listen for changes -> update UI accordingly -> clean up listeners on unmount
    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setGeoPermission("unsupported");
            setLocationMessage("Location is not supported in this browser");
            return;
        }

        // check user permission status for geolocation
        if (!("permissions" in navigator) || !navigator.permissions?.query) {
            setGeoPermission("prompt"); //prompt means we can still ask for permission, but we can't track changes to it
            return;
        }

        let cancelled = false;
        // granted -> denied or unsupported, or denied -> granted, etc
        let permissionStatus: PermissionStatus | null = null;

        const syncPermission = () => {
            if (cancelled || !permissionStatus) return;
            // granted, denied, prompt
            setGeoPermission(permissionStatus.state as GeoPermissionState);
        };

        navigator.permissions
            .query({ name: "geolocation" as PermissionName }) //check the current permission status for geolocation
            .then((status) => {
                if (cancelled) return;
                permissionStatus = status; // store the PermissionStatus object so we can remove the event listener later if needed
                syncPermission(); // set initial state based on current permission
                permissionStatus.addEventListener("change", syncPermission);// listen for changes to the permission status, so we can update our UI if the user changes their decision after initially denying or granting permission
            })
            .catch(() => {
                if (!cancelled) {
                    setGeoPermission("prompt");
                }
            });

        return () => {
            cancelled = true;
            permissionStatus?.removeEventListener("change", syncPermission);
        };
    }, []);

    const requestLocation = () => {
        if (!("geolocation" in navigator)) {
            setGeoPermission("unsupported");
            setLocationMessage("Location is not supported in this browser");
            return;
        }

        setLocationLoading(true);
        setLocationMessage("Requesting location permission...");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setGeoPermission("granted");

                try {
                    const nextWeather = await fetchWeatherForCoords(latitude, longitude);

                    setWeather(nextWeather);
                    setLocationMessage("Weather updated from your current location");
                } catch (error) {
                    console.error("Failed to fetch location-based weather", error);
                    setLocationMessage("Location granted, but live weather could not be loaded");
                } finally {
                    setLocationLoading(false);
                }
            },
            (error) => {
                setLocationLoading(false);

                if (error.code === error.PERMISSION_DENIED) {
                    setGeoPermission("denied");
                    setLocationMessage("Location permission denied");
                    return;
                }

                setLocationMessage("Unable to get your current location");
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    };

    const locationButtonLabel = locationLoading
        ? "Getting location..."
        : geoPermission === "granted"
            ? "Refresh location"
            : "Use my location";

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
                            data-testid="closet-title"
                            size="3xl"
                            fontWeight="1000"
                            letterSpacing="-0.02em"
                            fontFamily="'Outfit', 'Nunito', system-ui, sans-serif"
                        >
                            Dress For Today
                        </Heading>
                        <Text
                            color="gray.600" mt={2}
                        >
                            Get a smart outfit suggestion based on your weather
                        </Text>
                        <Flex mt={4} align={{ base: "stretch", md: "center" }} gap={3} direction={{ base: "column", md: "row" }}>
                            <Button
                                bg="#efe3d9"
                                color="#241f1a"
                                borderRadius="22px"
                                h="46px"
                                px={5}
                                fontWeight="700"
                                boxShadow="0 12px 30px rgba(131, 102, 81, 0.12)"
                                _hover={{ bg: "#e8d8cb" }}
                                onClick={requestLocation}
                                loading={locationLoading}
                                disabled={locationLoading || geoPermission === "unsupported"}
                            >
                                <Icon as={FiMapPin} mr={2.5} boxSize={4.5} />
                                {locationButtonLabel}
                            </Button>
                            <Text fontSize="sm" color="#6d645d" fontWeight="600">
                                {locationMessage}
                            </Text>
                        </Flex>
                    </Box>
                    <Box alignSelf={{ base: "flex-start", md: "center" }}>
                        <CreateOutfitDialog />
                    </Box>
                </Flex>


                <Box
                    position="relative"
                    zIndex={1}
                    maxW="1400px"
                    mx="auto"
                    w="full"
                    borderRadius={{ base: "28px", md: "34px" }}
                    bg="rgba(255,255,255,0.72)"
                    border="1px solid rgba(182, 157, 138, 0.18)"
                    boxShadow="0 24px 70px rgba(146, 118, 91, 0.15)"
                    backdropFilter="blur(18px)"
                    px={{ base: 6, md: 9 }}
                    py={{ base: 6, md: 8 }}
                >
                    <Flex
                        align={{ base: "flex-start", md: "center" }}
                        direction={{ base: "column", md: "row" }}
                        gap={3}
                        color="#3a3531"
                        mb={5}
                    >
                        <Flex align="center" gap={2.5}>
                            <Box position="relative" w="34px" h="34px">
                                <Icon as={FiSun} color="#f2b53d" boxSize={7} position="absolute" left="0" top="0" />
                                <Icon as={FiCloud} color="#b5b8c6" boxSize={6} position="absolute" right="-2px" bottom="0" />
                            </Box>
                            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" letterSpacing="-0.03em">
                                {weather.location}
                            </Text>
                        </Flex>
                        <Text fontSize={{ base: "lg", md: "xl" }} color="#6a625b">{weather.temp}</Text>
                        <Text fontSize={{ base: "lg", md: "xl" }} color="#6a625b">· {weather.condition}</Text>
                        <Flex align="center" gap={1.5} color="#84786e" ml={{ md: "auto" }}>
                            <Icon as={FiMapPin} />
                            <Text fontSize="xs" fontWeight="600">
                                {geoPermission === "granted" ? "Using your location" : "Weather-based pick"}
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex
                        direction={{ base: "column", xl: "row" }}
                        gap={6}
                        borderRadius={{ base: "24px", md: "30px" }}
                        bg="rgba(255,255,255,0.6)"
                        border="1px solid rgba(243, 242, 241, 0.14)"
                        // boxShadow="inset 0 1px 0 rgba(255,255,255,0.55), 0 14px 30px rgba(125, 99, 77, 0.09)"
                        p={{ base: 5, md: 6 }}
                    >
                        <Flex direction="column" justify="space-between" gap={5} maxW={{ xl: "430px" }}>
                            <Box>
                                <Heading
                                    size={{ base: "xl", md: "xl" }}
                                    fontWeight="700"
                                    letterSpacing="-0.03em"
                                    color="#3a3531"
                                    fontFamily="'Outfit', 'Nunito', system-ui, sans-serif"
                                >
                                    Suggested Outfit for Today
                                </Heading>
                                <Box
                                    mt={6}
                                    bg="rgba(255,255,255,0.8)"
                                    borderRadius="24px"
                                    p={5}
                                    boxShadow="0 16px 30px rgba(122, 95, 74, 0.08)"
                                >
                                    {outfitItems.map((item) => (
                                        <Flex key={item.label} align="center" gap={4} py={3}>
                                            <Text fontSize="xl" lineHeight="1">{item.icon}</Text>
                                            <Text
                                                fontSize={{ base: "lg", md: "lg" }}
                                                lineHeight="1.1"
                                                color="#6b625b"
                                                fontFamily="'Outfit', 'Nunito', system-ui, sans-serif"
                                            >
                                                {item.label}
                                            </Text>
                                        </Flex>
                                    ))}
                                </Box>
                            </Box>

                            <Flex gap={4} wrap="wrap">
                                <Button
                                    bg="#efe3d9"
                                    color="#241f1a"
                                    borderRadius="22px"
                                    h="48px"
                                    px={6}
                                    fontWeight="800"
                                    boxShadow="0 12px 30px rgba(131, 102, 81, 0.12)"
                                    _hover={{ bg: "#e8d8cb" }}
                                >
                                    <Icon as={FiPlus} mr={2.5} boxSize={5} />
                                    Generate Outfit
                                </Button>
                                <Button
                                    bg="#f0f0f0ff"
                                    color="#241f1a"
                                    borderRadius="22px"
                                    h="48px"
                                    px={6}
                                    fontWeight="800"
                                    boxShadow="0 12px 30px rgba(131, 102, 81, 0.12)"
                                    _hover={{ bg: "#e8d8cb" }}
                                >
                                    <Icon as={FiRefreshCw} mr={2.5} boxSize={5} />
                                    Customize
                                </Button>
                            </Flex>
                        </Flex>

                        <OutfitVisual />
                    </Flex>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={5} mt={9} pb={{ base: 10, md: 16 }} position="relative" zIndex={1}>
                    {insightCards.map((card) => (
                        <Box
                            key={card.title}
                            borderRadius="28px"
                            bg="rgba(255,255,255,0.74)"
                            border="1px solid rgba(182, 157, 138, 0.16)"
                            boxShadow="0 18px 38px rgba(129, 103, 81, 0.09)"
                            minH={{ base: "220px", md: "250px" }}
                            px={{ base: 5, md: 6 }}
                            pt={{ base: 6, md: 7 }}
                            pb={{ base: 9, md: 11 }}
                        >
                            <Heading
                                size="lg"
                                fontWeight="800"
                                letterSpacing="-0.03em"
                                mb={3}
                                color="#3a3531"
                                fontFamily="'Outfit', 'Nunito', system-ui, sans-serif"
                            >
                                {card.title}
                            </Heading>
                            <Text fontSize="lg" color="#6d645d" maxW="28ch">
                                {card.description}
                            </Text>
                        </Box>
                    ))}
                </SimpleGrid>
            </Flex>
        </AppLayout >
    );
}

export default Outfits;
