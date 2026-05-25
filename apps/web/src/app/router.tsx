import { createBrowserRouter } from "react-router-dom";

import HomePage from "../routes/Home";
import LoginPage from "../routes/Login";
import RegisterPage from "../routes/Register";
import Dashboard from "../routes/Dashboard";

import { ProtectedLayout } from "@/lib/ProtectedLayout";
import GuestLayout from "@/lib/GuestLayoout";
import FormEditorPage from "@/routes/FormEditorPage";

export const router = createBrowserRouter([
    // public routes
    {
        path: "/",
        element: <HomePage />
    },

    // guest routes

    {
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/register",
                element: <RegisterPage />
            },
        ]
    },
            

    // protected group
    {
        element: <ProtectedLayout />,
        children: [
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path:"/forms/:formId/edit",
                element:<FormEditorPage/>
            }
        ]
    }
]);