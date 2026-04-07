import axios from "axios";
import { API_BASE_URL } from "../config";
import { createContext, useEffect, PropsWithChildren } from "react";
import { useState } from "react"
import type { AxiosError } from "axios";

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

    const clearSession = () => {
        setUsername(null);
        setId(null);
        setLoading(false);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/profile`);
                setUsername(response.data?.username ?? null);
                setId(response.data?.userId ?? null);
            } catch {
                clearSession();
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [])

    // any 401 response from the server will trigger session clearing, which logs the user out
    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    clearSession();
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptorId);
        };
    }, []);

    return (
        <UserContext.Provider value={{ username, setUsername, id, setId, loading }}>
            {children}
        </UserContext.Provider>
    )
}
