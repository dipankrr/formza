import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import "./index.css";
import {TRPCProvider} from "@/providers/trpc-provider";

createRoot(
    document.getElementById("root")!
).render(
    <TRPCProvider>

<RouterProvider
router={router}
/>

</TRPCProvider>
);