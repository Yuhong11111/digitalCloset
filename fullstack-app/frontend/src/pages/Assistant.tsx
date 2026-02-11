import React, { useEffect, useRef, useState } from 'react';
import AppLayout from './AppLayout';
import {
    Flex,
    Box,
    Stack,
    Text,
    Textarea,
    Spinner,
    Button,
    Heading,
    SimpleGrid,
    Icon,
    Input
} from '@chakra-ui/react';
import type { Message } from '../components/Message';
import axios from 'axios';
import { FiSend, FiMessageCircle, FiPlus } from "react-icons/fi";
import { API_BASE_URL } from '../config';
import { pageBackgroundStyles } from "../theme";

// leave last 6 messages + new user input
function getMessages(messages: Message[], newUserInput: string): Message[] {
    const contextMessages = messages.slice(-6);
    return [...contextMessages, { role: "user", content: newUserInput }];
}

// convert messages to prompt string
function messagesToPrompt(messages: Message[]): string {
    return messages
        .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n") + "\nAssistant:";
}


export function Assistant() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi! I'm your AI stylist. Ask me about outfits or styling tips!", mode: "chat" }
    ]);
    const [input, setInput] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [mode, setMode] = useState<"chat" | "command">("chat");
    // useEffect(() => {
    //     console.log("Assistant mode:", mode);
    // }, [mode]);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedItems, setSuggestedItems] = useState<Array<{ name?: string; color?: string; category?: string; season?: string }>>([]);
    const isMounted = useRef(true);
    const chatScrollRef = useRef<HTMLDivElement | null>(null);
    const isAtBottomRef = useRef(true);
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const addMenuRef = useRef<HTMLDivElement | null>(null);
    const addFileInputRef = useRef<HTMLInputElement | null>(null);

    // run once then the component mounts
    useEffect(() => {
        // React automatically treats the returned function in useEffect as a cleanup function.
        // and React calls it automatically on unmount.
        isMounted.current = true;
        return () => {
            // When the component is about to be removed from the screen, mark it as unmounted
            isMounted.current = false;
        };
    }, []); //The empty array [] means it will not run again

    useEffect(() => {
        const container = chatScrollRef.current;
        if (!container) return;
        if (isAtBottomRef.current) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages, isLoading]);

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (!isAddMenuOpen) return;
            const target = event.target as Node;
            if (addMenuRef.current && !addMenuRef.current.contains(target)) {
                setIsAddMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isAddMenuOpen]);

    async function sendMessage() {
        // Don’t send if a request is already in progress.
        if (!input.trim() || isLoading) return;
        const userInput = input;
        const imageUrl = selectedImage ? URL.createObjectURL(selectedImage) : undefined;
        const updatedMessages = [
            ...messages,
            { role: "user" as const, content: userInput, mode: mode ?? "chat", imageUrl }
        ];
        setMessages(updatedMessages);
        setInput("");
        setSelectedImage(null);
        if (addFileInputRef.current) {
            addFileInputRef.current.value = "";
        }
        setIsLoading(true);
        // console.log("Sending message:", userInput);
        try {
            const url = `${API_BASE_URL}/assistant`;
            const formData = new FormData();
            formData.append("message", messagesToPrompt(getMessages(messages, userInput)));
            formData.append("max_tokens", "200");
            formData.append("mode", mode ?? "chat");
            if (selectedImage) {
                formData.append("image", selectedImage);
            }
            const response = await axios.post(url, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const data = response.data;
            const answer = data.message;
            const responseType = data.type;
            const responseMode = data.mode ?? (mode ?? "chat");
            const draftItem = data.draftItem ?? null;
            const missingFields = data.missingFields ?? [];
            const referencedItems = data.referencedItems ?? [];
            setSuggestedItems(referencedItems);
            // console.log("Received response:", data);
            // console.log(isMounted.current);
            if (isMounted.current) {
                // console.log("Updating messages with assistant response");
                setMessages([
                    ...updatedMessages,
                    {
                        role: "assistant",
                        content: answer || "No response",
                        mode: responseMode,
                        type: responseType,
                        draftItem,
                        missingFields,
                        imageUrl,
                    }
                ]);
            }
        } catch (error) {
            if (isMounted.current) {
                setMessages(prev => [
                    ...prev,
                    { role: "assistant", content: "Sorry, something went wrong.", mode: mode ?? "chat" }
                ]);
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

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
                            AI Stylist
                        </Heading>
                        <Text color="gray.600" mt={2}>Ask for outfit ideas or styling tips tailored to your closet.</Text>
                    </Box>
                    <Button
                        bg="#ead7c7"
                        color="ink"
                        borderRadius="2xl"
                        px={5}
                        h="48px"
                        fontWeight="700"
                        onClick={() => setMessages([{ role: "assistant", content: "Hi! I'm your AI stylist. Ask me about outfits or styling tips!", mode: "chat" }])}
                        _hover={{ bg: "#e1c8b5" }}
                    >
                        <Icon as={FiMessageCircle} mr={2} />
                        New Chat
                    </Button>
                </Flex>

                <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} pb={10} position="relative" zIndex={1}>
                    <Flex direction="column" gap={4} gridColumn={{ lg: "span 2" }}>
                        <Box
                            bg="white"
                            borderRadius="2xl"
                            boxShadow="sm"
                            borderWidth="1px"
                            borderColor="gray.100"
                            p={4}
                            display="flex"
                            alignItems="center"
                            gap={3}
                        >
                            <Icon as={FiMessageCircle} color="#8b6f5a" />
                            <Text color="gray.700">
                                Style Tip: Ask for a weekend look, a work outfit, or how to style a specific color.
                            </Text>
                        </Box>
                        <Flex
                            direction="column"
                            bg="white"
                            borderRadius="2xl"
                            boxShadow="sm"
                            borderWidth="1px"
                            borderColor="gray.100"
                            h={{ base: "520px", lg: "600px" }}
                            overflow="hidden"
                        >
                            <Box
                                p={4}
                                flex="1"
                                overflowY="auto"
                                ref={chatScrollRef}
                                onScroll={() => {
                                    const container = chatScrollRef.current;
                                    if (!container) return;
                                    const threshold = 24;
                                    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
                                    isAtBottomRef.current = distanceFromBottom <= threshold;
                                }}
                            >
                                <Stack gap={4}>
                                    {messages.map((msg, idx) => {
                                        const isAssistantCommand = msg.role === "assistant" && msg.mode === "command" && msg.draftItem;
                                        if (isAssistantCommand) {
                                            const item = msg.draftItem || {};
                                            const missing = new Set(msg.missingFields || []);
                                            const valueOrMissing = (key: "category" | "material" | "brand") => {
                                                const value = item[key];
                                                if (value) return value;
                                                return missing.has(key) ? "— missing —" : "— optional —";
                                            };
                                            const colorText = (item.color && item.color.length > 0)
                                                ? item.color.join(", ")
                                                : (missing.has("color") ? "— missing —" : "— optional —");
                                            const seasonText = (item.season && item.season.length > 0)
                                                ? item.season.join(" / ")
                                                : (missing.has("season") ? "— missing —" : "— optional —");
                                            const isMissingRequired =
                                                missing.has("name") ||
                                                missing.has("category") ||
                                                missing.has("color") ||
                                                missing.has("season");
                                            const missingRequiredList = ["name", "category", "color", "season"]
                                                .filter(field => missing.has(field))
                                                .join(", ");
                                            return (
                                                <Box
                                                    key={idx}
                                                    alignSelf="flex-start"
                                                    maxW="80%"
                                                    p={4}
                                                    borderRadius="xl"
                                                    bg="#f7f1ec"
                                                    color="gray.800"
                                                    borderWidth="1px"
                                                    borderColor="gray.200"
                                                >
                                                    <Text fontWeight="700" mb={1}>
                                                        Assistant
                                                    </Text>
                                                    <Text fontWeight="500" mb={2}>
                                                        {item.name || "New clothing item"}
                                                    </Text>
                                                    <Stack gap={1}>
                                                        <Text>Category: {valueOrMissing("category")}</Text>
                                                        <Text>Color: {colorText}</Text>
                                                        <Text>Season: {seasonText}</Text>
                                                        <Text>Material: {valueOrMissing("material")}</Text>
                                                        <Text>Brand: {valueOrMissing("brand")}</Text>
                                                    </Stack>
                                                    {isMissingRequired && (
                                                        <Text mt={2} fontSize="sm" color="red.600">
                                                            Missing required: {missingRequiredList}
                                                        </Text>
                                                    )}
                                                    {msg.imageUrl && (
                                                        <img
                                                            src={msg.imageUrl}
                                                            alt="attached"
                                                            style={{
                                                                marginTop: '12px',
                                                                maxHeight: '220px',
                                                                borderRadius: '8px',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    )}
                                                    <Flex gap={3} mt={4}>
                                                        <Button size="sm" variant="outline">
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant={isMissingRequired ? "ghost" : undefined}
                                                            bg={isMissingRequired ? "transparent" : "#ead7c7"}
                                                            color="ink"
                                                            disabled={isMissingRequired}
                                                        >
                                                            Confirm
                                                        </Button>
                                                    </Flex>
                                                </Box>
                                            );
                                        }
                                        return (
                                            <Box
                                                key={idx}
                                                alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                                                maxW="80%"
                                                p={3}
                                                borderRadius="xl"
                                                bg={msg.role === "user" ? "#f0e3d7" : "#f7f1ec"}
                                                color="gray.800"
                                            >
                                                <Text fontWeight="600" mb={1}>
                                                    {msg.role === "user" ? "You" : "Assistant"}
                                                </Text>
                                                <Text>{msg.content}</Text>
                                                {msg.imageUrl && (
                                                    <img
                                                        src={msg.imageUrl}
                                                        alt="attached"
                                                        style={{
                                                            marginTop: '8px',
                                                            maxHeight: '200px',
                                                            borderRadius: '8px',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        );
                                    })}
                                    {isLoading && (
                                        <Box textAlign="center">
                                            <Spinner size="sm" /> Thinking...
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                            <Box borderTop="1px solid" borderColor="gray.100" p={4} bg="#faf6f2">
                                <Box position="relative" mb={3} ref={addMenuRef}>
                                    <Textarea
                                        placeholder="Ask about styling... e.g., 'Need an outfit for a rainy day.'"
                                        value={input}
                                        onChange={(e) => {
                                            setMode("chat");
                                            setInput(e.target.value);
                                        }}
                                        borderRadius="xl"
                                        borderColor="gray.200"
                                        bg="white"
                                        pr="56px"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        borderRadius="lg"
                                        bg="white"
                                        borderColor="gray.200"
                                        _hover={{ bg: "gray.50" }}
                                        px={2}
                                        minW="36px"
                                        position="absolute"
                                        top="8px"
                                        right="8px"
                                        onClick={() => setIsAddMenuOpen(prev => !prev)}
                                    >
                                        <Icon as={FiPlus} />
                                    </Button>
                                    {isAddMenuOpen && (
                                        <Box
                                            position="absolute"
                                            top="44px"
                                            right="8px"
                                            bg="white"
                                            borderWidth="1px"
                                            borderColor="gray.200"
                                            borderRadius="lg"
                                            boxShadow="sm"
                                            minW="160px"
                                            zIndex={2}
                                            overflow="hidden"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                w="100%"
                                                justifyContent="flex-start"
                                                onClick={() => {
                                                    setIsAddMenuOpen(false);
                                                    setMode("command");
                                                    if (!input.trim()) {
                                                        setInput("add clothes");
                                                    }
                                                    addFileInputRef.current?.click();
                                                }}
                                            >
                                                Add a clothes
                                            </Button>
                                        </Box>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        ref={addFileInputRef}
                                        display="none"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            setSelectedImage(file);
                                        }}
                                    />
                                </Box>
                                {selectedImage && (
                                    <Flex align="center" gap={2} mb={3}>
                                        <Text fontSize="sm" color="gray.600">
                                            Attached: {selectedImage.name}
                                        </Text>
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setMode("chat");
                                                setInput("");
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </Flex>
                                )}
                                <Button
                                    bg="#ead7c7"
                                    color="ink"
                                    borderRadius="2xl"
                                    h="44px"
                                    fontWeight="700"
                                    loading={isLoading}
                                    disabled={isLoading || !input.trim()}
                                    onClick={sendMessage}
                                >
                                    <Icon as={FiSend} mr={2} />
                                    Send
                                </Button>
                            </Box>
                        </Flex>
                    </Flex>

                    <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="sm"
                        borderWidth="1px"
                        borderColor="gray.100"
                        p={5}
                        h="fit-content"
                    >
                        <Heading size="md" fontWeight="700" mb={4}>
                            Outfit Suggestions
                        </Heading>
                        {suggestedItems.length === 0 ? (
                            <Text color="gray.500">Ask about a color or item to see matching pieces.</Text>
                        ) : (
                            <Stack gap={3}>
                                {suggestedItems.map((item, idx) => (
                                    <Box key={`${item.name}-${idx}`} p={3} bg="#f7f1ec" borderRadius="xl">
                                        <Text fontWeight="600">{item.name || "Unnamed item"}</Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {[item.color, item.category, item.season].filter(Boolean).join(" • ")}
                                        </Text>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Box>
                </SimpleGrid>
            </Flex >
        </AppLayout >
    );
}

export default Assistant;
