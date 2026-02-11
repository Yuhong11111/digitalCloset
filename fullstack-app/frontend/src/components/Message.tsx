export type MessageRole = "user" | "assistant";

export interface Message {
    role: MessageRole;
    content: string;
    mode?: "chat" | "command";
    imageUrl?: string;
    imageDataUrl?: string;
    type?: string;
    draftItem?: {
        name?: string | null;
        category?: string | null;
        color?: string[] | null;
        season?: string[] | null;
        material?: string | null;
        brand?: string | null;
    } | null;
    missingFields?: string[];
}
