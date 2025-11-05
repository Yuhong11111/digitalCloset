import axios from "axios";
import { createContext, useEffect, PropsWithChildren } from "react";
import { useState } from "react"

// Define the context type
interface UserContextType {
    username: string | null;
    setUsername: (username: string | null) => void;
    id: string | null;
    setId: (id: string | null) => void;
}

// Create context with initial values
export const UserContext = createContext<UserContextType>({
    username: null,
    setUsername: () => { },
    id: null,
    setId: () => { }
});

export function UserContextProvider({ children }: PropsWithChildren) {
    const [username, setUsername] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        axios.get('/profile').then(response => {
            setUsername(response.data.username);
            setId(response.data.userId);
        })
    }, [])

    return (
        <UserContext.Provider value={{ username, setUsername, id, setId }}>
            {children}
        </UserContext.Provider>
    )
}