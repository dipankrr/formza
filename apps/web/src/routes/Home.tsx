import { useLocation, useNavigate } from "react-router-dom";
import { type LoginResponseType } from "@repo/shared";

export default function HomePage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Cast the state safely using your shared type
    const state = location.state as { user: LoginResponseType } | null;

    // Guard clause in case someone navigates to /home directly without logging in
    if (!state?.user) {
        return (
            <div className="p-8">
                <p>You are not logged in.</p>
                <button onClick={() => navigate("/login")} className="underline">Go to Login</button>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Welcome Home!</h1>
            <div className="bg-slate-100 p-4 rounded-lg max-w-sm">
                <p><strong>Name:</strong> {state.user.name}</p>
                <p><strong>Email:</strong> {state.user.email}</p>
            </div>
        </div>
    );
}