import { type ReactNode, useMemo } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Avatar, Menu, Portal, Flex, Box } from "@chakra-ui/react";
import { UserContext } from "../components/UserContext";
import { useContext } from "react"
import axios from "axios";

type AppLayoutProps = {
    children?: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    const { username } = useContext(UserContext);
    const navigate = useNavigate();
    const initials = useMemo(() => {
        if (!username) return "?";
        return username
            .split(/\s+/)
            .map(part => part[0]?.toUpperCase())
            .slice(0, 2)
            .join("");
    }, [username]);

    async function handleLogout() {
        const baseUrl = 'http://localhost:8000';
        try {
            const response = await axios.post(`${baseUrl}/auth/logout`);
            // console.log(response.data.message);
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    }

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900">
            <nav className="border-b border-stone-200 bg-white/80 backdrop-blur">
                <Flex direction={"row"}>
                    <Box p={4} gap={4} display="flex" alignItems="center">
                        <NavLink to="/Closet" end>Closet</NavLink>
                        <NavLink to="/outfits" end>Outfits</NavLink>
                        <NavLink to="/assistant" end>Assistant</NavLink>
                        <NavLink to="/settings" end>Settings</NavLink>
                    </Box>
                    <Box ml="auto" p={4}>
                        <Menu.Root positioning={{ placement: "bottom-end" }}>
                            <Menu.Trigger rounded="full" focusRing="outside">
                                <Avatar.Root size="sm">
                                    <Avatar.Fallback>{initials}</Avatar.Fallback>
                                </Avatar.Root>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        <Menu.Item value="account">Account</Menu.Item>
                                        <Menu.Item value="settings">Settings</Menu.Item>
                                        <Menu.Item value="logout" onClick={handleLogout}>
                                            Logout
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    </Box>
                </Flex>
            </nav>
            <main className="max-w-6xl mx-auto p-4">
                {children ?? <Outlet />}  {/* Use explicit children when provided, otherwise fall back to routing outlet */}
            </main>
        </div>
    );
}
