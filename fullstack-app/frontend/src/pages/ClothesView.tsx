import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    Text,
    Wrap,
    WrapItem,
    Badge,
    SimpleGrid,
    ButtonGroup,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "./AppLayout";
import type { ClothItem } from "../components/ClothContext";
import { API_BASE_URL } from "../config";
import { FiArrowLeft } from "react-icons/fi";

type LoadState = "idle" | "loading" | "error" | "ready";

export default function ClothesView() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [item, setItem] = useState<ClothItem | null>(null);
    const [status, setStatus] = useState<LoadState>("idle");
    const [isWorking, setIsWorking] = useState(false);

    useEffect(() => {
        if (!id) {
            setStatus("error");
            return;
        }

        let isMounted = true;
        setStatus("loading");
        axios
            .get<ClothItem>(`${API_BASE_URL}/items/${id}`)
            .then((response) => {
                if (!isMounted) return;
                setItem(response.data ?? null);
                setStatus("ready");
            })
            .catch((error) => {
                console.error("Failed to load item", error);
                if (!isMounted) return;
                setItem(null);
                setStatus("error");
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    return (
        <AppLayout>
            <Box maxW="6xl" mx="auto" py={6}>
                <Button variant="ghost" mb={6} onClick={() => navigate(-1)}>
                    <Box as="span" mr={2} display="inline-flex">
                        <FiArrowLeft />
                    </Box>
                    Back to Closet
                </Button>
                {status === "loading" && (
                    <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm">
                        <Text color="gray.600">Loading item...</Text>
                    </Box>
                )}
                {status === "error" && (
                    <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm">
                        <Heading size="lg" mb={2}>
                            Clothing item not found
                        </Heading>
                        <Text color="gray.600">
                            Please return to the closet and select an item again.
                        </Text>
                    </Box>
                )}
                {status === "ready" && item && (
                    <Flex direction={{ base: "column", lg: "row" }} gap={8}>
                        <Box flex="1" minW={0}>
                            <Box
                                bg="white"
                                borderRadius="2xl"
                                overflow="hidden"
                                boxShadow="sm"
                                borderWidth="1px"
                                borderColor="gray.100"
                            >
                                {item.imageUrl ? (
                                    <Image src={item.imageUrl} alt={item.name} objectFit="cover" w="full" h={{ base: "380px", md: "520px" }} />
                                ) : (
                                    <Flex
                                        align="center"
                                        justify="center"
                                        h={{ base: "380px", md: "520px" }}
                                        bgGradient="linear(to-br, #f7efe8, #efe4db)"
                                    >
                                        <Text color="gray.500">No Image</Text>
                                    </Flex>
                                )}
                            </Box>
                        </Box>
                        <Box
                            flex="1"
                            bg="white"
                            borderRadius="2xl"
                            p={{ base: 6, md: 8 }}
                            boxShadow="sm"
                            borderWidth="1px"
                            borderColor="gray.100"
                        >
                            <Heading size="lg" textTransform="capitalize">
                                {item.name}
                            </Heading>
                            <Text color="gray.500" mt={1}>
                                {item.color} · {item.category}
                            </Text>

                            <ButtonGroup mt={4} gap={3}>
                                <Button
                                    variant="outline"
                                    borderRadius="full"
                                    onClick={async () => {
                                        setIsWorking(true);
                                        try {
                                            const formData = new FormData();
                                            formData.append("favorite", String(!item.favorite));
                                            await axios.patch(`${API_BASE_URL}/items/${item._id}`, formData, {
                                                headers: {
                                                    "Content-Type": "multipart/form-data",
                                                },
                                            });
                                            setItem({ ...item, favorite: !item.favorite });
                                        } catch (error) {
                                            console.error("Failed to update favorite", error);
                                        } finally {
                                            setIsWorking(false);
                                        }
                                    }}
                                >
                                    {item.favorite ? "♥ Favorite" : "♡ Favorite"}
                                </Button>
                                <Button
                                    borderRadius="full"
                                    bg="#ead7c7"
                                    color="ink"
                                    _hover={{ bg: "#e1c8b5" }}
                                    onClick={async () => {
                                        setIsWorking(true);
                                        try {
                                            const formData = new FormData();
                                            const nextWearCount = (item.wear_count ?? 0) + 1;
                                            const nowIso = new Date().toISOString();
                                            formData.append("wear_count", String(nextWearCount));
                                            formData.append("last_worn_at", nowIso);
                                            await axios.patch(`${API_BASE_URL}/items/${item._id}`, formData, {
                                                headers: {
                                                    "Content-Type": "multipart/form-data",
                                                },
                                            });
                                            setItem({
                                                ...item,
                                                wear_count: nextWearCount,
                                                last_worn_at: nowIso,
                                            });
                                        } catch (error) {
                                            console.error("Failed to update wear stats", error);
                                        } finally {
                                            setIsWorking(false);
                                        }
                                    }}
                                >
                                    I wore today
                                </Button>
                                <Button
                                    borderRadius="full"
                                    color="gray.700"
                                    bg="#f2e7de"
                                    _hover={{ bg: "#eadfd6" }}
                                    onClick={() => navigate(`/edit/${item._id}`)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    borderRadius="full"
                                    variant="outline"
                                    color="red.600"
                                    borderColor="red.200"
                                    onClick={async () => {
                                        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
                                        if (!confirmDelete) return;
                                        setIsWorking(true);
                                        try {
                                            await axios.delete(`${API_BASE_URL}/items/${item._id}`);
                                            navigate("/closet");
                                        } catch (error) {
                                            console.error("Failed to delete item", error);
                                        } finally {
                                            setIsWorking(false);
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </ButtonGroup>

                            <Box borderTop="1px solid" borderColor="gray.100" my={6} />

                            <Heading size="sm" mb={3}>
                                Details
                            </Heading>
                            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} mb={6}>
                                <Flex justify="space-between">
                                    <Text color="gray.500">Category</Text>
                                    <Text fontWeight="600" textTransform="capitalize">
                                        {item.category || "—"}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color="gray.500">Color</Text>
                                    <Text fontWeight="600" textTransform="capitalize">
                                        {item.color || "—"}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color="gray.500">Fit</Text>
                                    <Text fontWeight="600">
                                        {item.size || "—"}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color="gray.500">Material</Text>
                                    <Text fontWeight="600" textTransform="capitalize">
                                        {item.material || "—"}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color="gray.500">Brand</Text>
                                    <Text fontWeight="600" textTransform="capitalize">
                                        {item.brand || "—"}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color="gray.500">Season</Text>
                                    <Text fontWeight="600" textTransform="capitalize">
                                        {item.season || "—"}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color="gray.500">Purchase price</Text>
                                    <Text fontWeight="600">
                                        {typeof item.purchase_price === "number" ? `$${item.purchase_price.toFixed(2)}` : "—"}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color="gray.500">Wear count</Text>
                                    <Text fontWeight="600">
                                        {typeof item.wear_count === "number" ? item.wear_count : "—"}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color="gray.500">Last worn</Text>
                                    <Text fontWeight="600">
                                        {item.last_worn_at ? new Date(item.last_worn_at).toLocaleDateString() : "—"}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color="gray.500">Added</Text>
                                    <Text fontWeight="600">
                                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}
                                    </Text>
                                </Flex>
                            </SimpleGrid>

                            <Box borderTop="1px solid" borderColor="gray.100" my={6} />

                            {item.tags && item.tags.length > 0 && (
                                <Flex align="center" gap={3} mb={4}>
                                    <Text fontWeight="600">Tags</Text>
                                    <Wrap gap={2}>
                                        {item.tags.map((tag, index) => {
                                            const palettes = ["teal", "blue", "green", "purple", "pink", "cyan"];
                                            const palette = palettes[index % palettes.length];
                                            return (
                                                <WrapItem key={`${tag}-${index}`}>
                                                    <Badge
                                                        variant="subtle"
                                                        colorPalette={palette}
                                                        borderRadius="full"
                                                        textTransform="lowercase"
                                                        px={3}
                                                        py={1}
                                                        fontSize="xs"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                </WrapItem>
                                            );
                                        })}
                                    </Wrap>
                                </Flex>
                            )}

                            {item.notes && (
                                <Box bg="#f8f4f0" borderRadius="xl" px={4} py={3}>
                                    <Text fontWeight="600" mb={1}>
                                        Notes
                                    </Text>
                                    <Text color="gray.600">{item.notes}</Text>
                                </Box>
                            )}
                        </Box>
                    </Flex>
                )}
            </Box>
        </AppLayout>
    );
}
