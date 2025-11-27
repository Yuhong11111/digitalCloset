import React, { useState } from 'react';
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

    const sendMessage = async () => {
        // Don’t send if a request is already in progress.
        if (!input.trim() || isLoading) return;
        const userInput = input;
        const updatedMessages = [...messages, { role: "user", content: userInput }];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);
        try {
            const url = 'http://localhost:8000/assistant';
            const payload = {
                message: messagesToPrompt(getMessages(messages, userInput)),
                max_tokens: 200,
            }
            const response = await axios.post(url, payload);
            const data = response.data;
            // console.log("Assistant response:", data);
            setMessages([...updatedMessages, { role: "assistant", content: data.response || "No response" }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
        } finally {
            setIsLoading(false);
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
                                    // isLoading={isLoading}
                                    // isDisabled={isLoading || !input.trim()}
                                    onClick={sendMessage}
                                >
                                    Send
                                </Button>
                            </Box>
                        </Flex>
                    </Flex>

                    {/* RIGHT: Outfit list → 1/3 width */}
                    <Box flex="1" p="4" bg="#F3F4F6" color="grey">
                        Outfit Suggestions will appear here.
                    </Box>

                </Flex>
            </Flex>

        </AppLayout>
    </div >;
}

export default Assistant;
