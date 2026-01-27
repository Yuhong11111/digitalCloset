import { Box, Badge, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "./AppLayout";
import type { ClothItem } from "../components/ClothContext";
import { API_BASE_URL } from "../config";

type LoadState = "idle" | "loading" | "error" | "ready";

export default function ClothesView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState<ClothItem | null>(null);
  const [status, setStatus] = useState<LoadState>("idle");

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
      <Box maxW="3xl" mx="auto" py={6}>
        <Button variant="ghost" mb={4} onClick={() => navigate(-1)}>
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
          <Flex direction={{ base: "column", md: "row" }} gap={6}>
            <Box
              flex="1"
              bg="white"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.100"
            >
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} objectFit="cover" w="full" h="360px" />
              ) : (
                <Flex
                  align="center"
                  justify="center"
                  h="360px"
                  bgGradient="linear(to-br, #f7efe8, #efe4db)"
                >
                  <Text color="gray.500">No Image</Text>
                </Flex>
              )}
            </Box>
            <Box flex="1" bg="white" borderRadius="2xl" p={6} boxShadow="sm">
              <Flex align="center" justify="space-between" mb={3}>
                <Heading size="lg" textTransform="capitalize">
                  {item.name}
                </Heading>
                <Badge colorPalette="orange" variant="subtle" borderRadius="full">
                  {item.season}
                </Badge>
              </Flex>
              <Text color="gray.600" mb={3}>
                {item.color} · {item.category}
              </Text>
              {item.notes && (
                <Text color="gray.600" mb={4}>
                  {item.notes}
                </Text>
              )}
              <Button onClick={() => navigate(`/edit/${item._id}`)} bg="#f2e7de" _hover={{ bg: "#eadfd6" }}>
                Edit Item
              </Button>
            </Box>
          </Flex>
        )}
      </Box>
    </AppLayout>
  );
}
