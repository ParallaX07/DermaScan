import { Outlet } from "react-router-dom";
import { createContext, useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoIosArrowUp } from "react-icons/io";
import NavBar from "../components/shared/Navbar";
import ChatWindow from "../components/shared/ChatWindow";
import { useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";

const MessageContext = createContext();

const Root = () => {
    const notifySuccess = (message) => {
        toast.success(message, {
            style: {
                border: "1px solid #10B981",
                padding: "16px",
                color: "#10B981",
            },
            iconTheme: {
                primary: "#10B981",
                secondary: "#FFFAEE",
            },
        });
    };

    const notifyError = (message) => {
        toast.error(message, {
            style: {
                border: "1px solid #EF4444 ",
                padding: "16px",
                color: "#EF4444 ",
            },
            iconTheme: {
                primary: "#EF4444 ",
                secondary: "#FFFAEE",
            },
        });
    };

    const messageInfo = {
        notifySuccess,
        notifyError,
    };

    const [showScroll, setShowScroll] = useState(false);
    const { user } = useContext(AuthContext);

    const checkScrollTop = useCallback(() => {
        if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false);
        }
    }, [showScroll]);

    useEffect(() => {
        window.addEventListener("scroll", checkScrollTop);
        return () => {
            window.removeEventListener("scroll", checkScrollTop);
        };
    }, [checkScrollTop]);

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <MessageContext.Provider value={messageInfo}>
                <main className={` transition duration-300`}>
                    <NavBar />
                    <Outlet />
                </main>
            </MessageContext.Provider>
            {/* scroll up button */}
            {showScroll && (
                <div
                    className="fixed p-2 text-white rounded-full cursor-pointer bottom-5 right-5 bg-secondary animate__animated animate__fadeInRight"
                    onClick={scrollTop}
                >
                    <IoIosArrowUp className="text-2xl" />
                </div>
            )}
            {user && <ChatWindow />}

            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
};

export { MessageContext };

export default Root;