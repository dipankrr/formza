import { createBrowserRouter } from "react-router-dom";

import HomePage from "../routes/Home";
import LoginPage from "../routes/Login";

export const router = createBrowserRouter([
    {
        path:"/",
        element:<HomePage/>
    },
    {
        path:"/login",
        element:<LoginPage/>
    }
]);