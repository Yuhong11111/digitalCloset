import React, { useEffect, useRef, useState, useContext } from 'react';
import AppLayout from './AppLayout';
import {
    Flex,
    Box,
    Stack,
    Text,
    Textarea,
    Spinner,
    Button
} from '@chakra-ui/react';
import type { Message } from '../components/Message';
import axios from 'axios';
import { UserContext } from "../components/UserContext";
import { API_BASE_URL } from '../config';

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
        { role: "assistant", content: "Hi! I'm your AI stylist. Ask me about outfits or styling tips!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedItems, setSuggestedItems] = useState<Array<{ name?: string; color?: string; category?: string; season?: string }>>([]);
    const isMounted = useRef(true);

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

    async function sendMessage() {
        // Don’t send if a request is already in progress.
        if (!input.trim() || isLoading) return;
        const userInput = input;
        const updatedMessages = [...messages, { role: "user" as const, content: userInput }];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);
        // console.log("Sending message:", userInput);
        try {
            const url = `${API_BASE_URL}/assistant`;
            const payload = {
                message: messagesToPrompt(getMessages(messages, userInput)),
                max_tokens: 200,
            };
            const response = await axios.post(url, payload);
            const data = response.data;
            const answer = data.response;
            const referencedItems = data.referencedItems ?? [];
            setSuggestedItems(referencedItems);
            // console.log("Received response:", data);
            // console.log(isMounted.current);
            if (isMounted.current) {
                // console.log("Updating messages with assistant response");
                setMessages([...updatedMessages, { role: "assistant", content: answer || "No response" }]);
            }
        } catch (error) {
            if (isMounted.current) {
                setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    return <div>
        <AppLayout>
            <Flex direction="column" minH="100vh" overflowY="auto">
                <Flex p={4} gap={4}>
                    <h1>Here is your AI stylist</h1>
                </Flex>

                {/* two parts: left = chat (2/3), right = outfit list (1/3) */}
                <Flex direction="row" p={4} gap={4}>

                    {/* LEFT: Chat + Tips → 2/3 width */}
                    <Flex direction="column" flex="2" gap={4}>
                        <Box p="4" bg="#96b1dd92" color="black" borderRadius="md">
                            Style Tip: Ask me for outfit ideas based on your closet! E.g.,
                            "Suggest an outfit for a chilly weekend brunch" or
                            "What goes well with my blue jeans?"
                        </Box>
                        <Flex direction="column" bg="white" borderRadius="md" shadow="md" h="500px" flexShrink={0}>
                            <Box p="4" flex="1" overflowY="auto">
                                <Stack gap={4}>
                                    {messages.map((msg, idx) => (
                                        <Box
                                            key={idx}
                                            alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                                            maxW="80%"
                                            p={3}
                                            borderRadius="lg"
                                            bg={msg.role === "user" ? "#D1E8FF" : "#F1F5F9"}
                                            color="black"
                                        >
                                            <Text fontWeight="bold" mb={1}>
                                                {msg.role === "user" ? "You" : "Assistant"}
                                            </Text>
                                            <Text>{msg.content}</Text>
                                        </Box>
                                    ))}
                                    {isLoading && (
                                        <Box textAlign="center">
                                            <Spinner size="sm" /> Thinking...
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                            <Box h="1px" bg="gray.200" />
                            <Box p="4" borderTop="1px solid #E2E8F0">
                                <Textarea
                                    placeholder="Ask about styling... e.g., 'Need an outfit for a rainy day.'"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    mb={2}
                                />
                                <Button
                                    colorScheme="blue"
                                    loading={isLoading}
                                    disabled={isLoading || !input.trim()}
                                    onClick={sendMessage}
                                >
                                    Send
                                </Button>
                            </Box>
                        </Flex>
                    </Flex>

                    {/* RIGHT: Outfit list → 1/3 width */}
                    <Box flex="1" p="4" bg="#F3F4F6" color="grey">
                        <Text fontWeight="bold" mb={3}>
                            Outfit Suggestions
                        </Text>
                        {suggestedItems.length === 0 ? (
                            <Text color="gray.500">Ask about a specific color or item to see matching pieces.</Text>
                        ) : (
                            <Stack gap={4}>
                                {suggestedItems.map((item, idx) => (
                                    <Box key={`${item.name}-${idx}`} p={3} bg="white" borderRadius="md" shadow="sm">
                                        <Text fontWeight="semibold">{item.name || "Unnamed item"}</Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {[item.color, item.category, item.season].filter(Boolean).join(" • ")}
                                        </Text>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Box>

                </Flex>
            </Flex>

        </AppLayout>
    </div >;
}

export default Assistant;
