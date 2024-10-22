import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Root from "./pages/Root";
import Home from "./pages/Home";
import AuthProvider from "./Auth/AuthProvider";
import Register from "./pages/Register";
import PrivateRoute from "./Auth/PrivateRoute";
import Error404 from "./pages/Error404";
import SkinCheck from "./pages/SkinCheck";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <Error404 />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/prevention",
                element: <div className="mt-32">Prevention</div>,
            },
            {
                path: "/skin-check",
                element: (
                    <PrivateRoute>
                        <SkinCheck />
                    </PrivateRoute>
                ),
            },
            {
                path: "/early-detection",
                element: <div className="mt-32">Early Detection</div>,
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
