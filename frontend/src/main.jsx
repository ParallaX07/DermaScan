import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Root from "./pages/Root";
import Home from "./pages/Home";
import AuthProvider from "./Auth/AuthProvider";
import Register from "./pages/Register";
// import PrivateRoute from "./Auth/PrivateRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: (
                        <Login />
                ),
            },
            {
                path: "/register",
                element: <Register/>,
            },
            {
                path: "/prevention",
                element: <div>Prevention</div>,
            },
            {
                path: "/skin-check",
                element: <div>Skin Check</div>,
            },
            {
                path: "/early-detection",
                element: <div>Early Detection</div>,
            }
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
