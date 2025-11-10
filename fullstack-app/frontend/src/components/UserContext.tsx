import axios from "axios";
import { createContext, useEffect, PropsWithChildren } from "react";
import { useState } from "react"

// Define the context type
interface UserContextType {
    username: string | null;
    setUsername: (username: string | null) => void;
    id: string | null;
    setId: (id: string | null) => void;
    loading: boolean;
}

// Create context with initial values
export const UserContext = createContext<UserContextType>({
    username: null,
    setUsername: () => { },
    id: null,
    setId: () => { },
    loading: true
});

export function UserContextProvider({ children }: PropsWithChildren) {
    const [username, setUsername] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/profile');
                setUsername(response.data?.username ?? null);
                setId(response.data?.userId ?? null);
            } catch {
                setUsername(null);
                setId(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [])

    return (
        <UserContext.Provider value={{ username, setUsername, id, setId, loading }}>
            {children}
        </UserContext.Provider>
    )
}
