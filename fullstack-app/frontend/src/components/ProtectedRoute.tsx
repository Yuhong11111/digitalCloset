import { ReactNode, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";

type ProtectedRouteProps = {
    children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { username, loading } = useContext(UserContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-stone-500">
                Checking your session...
            </div>
        );
    }

    if (!username) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
}

