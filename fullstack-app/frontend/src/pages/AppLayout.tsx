import { type ReactNode } from "react";
import { Outlet, NavLink } from "react-router-dom";

type AppLayoutProps = {
    children?: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900">
            <nav className="border-b border-stone-200 bg-white/80 backdrop-blur">
                <div className="max-w-6xl mx-auto h-14 flex items-center justify-between px-4">
                    <div className="flex items-center gap-6 text-sm">
                        <NavLink to="/Closet" end>Closet</NavLink>
                        <NavLink to="/outfits">Outfits</NavLink>
                        <NavLink to="/assistant">Assistant</NavLink>
                        <NavLink to="/settings">Settings</NavLink>
                    </div>
                </div>
            </nav>
            <main className="max-w-6xl mx-auto p-4">
                {children ?? <Outlet />}  {/* Use explicit children when provided, otherwise fall back to routing outlet */}
            </main>
        </div>
    );
}
