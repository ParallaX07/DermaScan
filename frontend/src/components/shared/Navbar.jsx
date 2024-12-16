import { IoMdLogOut } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { TiThMenu } from "react-icons/ti";
import { Tooltip } from "react-tooltip";
import { MessageContext } from "../../pages/Root";
import { AuthContext } from "../../Auth/AuthProvider";
import { IoPerson } from "react-icons/io5";
import logo from "../../assets/logo.png";

const NavBar = () => {
    const active = "text-primary";
    const inactive = "hover:text-primary";

    const { user, logout, loading } = useContext(AuthContext);
    const { notifySuccess, notifyError } = useContext(MessageContext);

    const handleLogout = async () => {
        try {
            await logout();
            notifySuccess("Logged out successfully");
        } catch (err) {
            notifyError("An error occurred. Please try again later.");
            console.error(err);
        }
    };

    /**
     * Represents the logged out state of the Navbar component.
     * @type {JSX.Element}
     */
    const loggedOutState = (
        <>
            <div className="items-center hidden gap-2 lg:flex ">
                <div className="p-2 border-2 rounded-full border-primary">
                    <IoPerson className="text-xl text-primary " />
                </div>
                <NavLink
                    to="/register"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Register
                </NavLink>
                <p>/</p>
                <NavLink
                    to="/login"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Login
                </NavLink>
            </div>
        </>
    );

    /**
     * Represents the logged-in state of the Navbar component.
     * @returns {JSX.Element} The JSX element representing the logged-in state.
     */
    const loggedInState = (
        <>
            <div className="flex items-center gap-2">
                <a className="profileImage">
                    <img
                        className="rounded-full size-12"
                        src={user?.photoURL}
                        alt=""
                    />
                </a>

                <button
                    onClick={handleLogout}
                    className="items-center hidden gap-2 border-2 rounded-full logout lg:py-2 lg:px-3 bg-primary text-primary bg-opacity-20 border-primary lg:flex"
                >
                    <IoMdLogOut className="size-6" />
                </button>
            </div>
        </>
    );

    const [dropDown, setDropDown] = useState(false);

    /**
     * Toggles the dropdown state.
     */
    const handleDropDown = () => {
        setDropDown(!dropDown);
    };

    useEffect(() => {
        /**
         * Handles the click event outside of the dropdown and hamburger elements.
         * If the click is outside and the dropdown is open, it closes the dropdown.
         * @param {Event} event - The click event object.
         */
        const handleClickOutside = (event) => {
            if (
                dropDown &&
                event.target.closest(".dropdown") === null &&
                event.target.closest(".hamburger") === null
            ) {
                setDropDown(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [dropDown]);

    const loadingSkeleton = (
        <div className="flex items-center gap-2 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full profileImage"></div>
            <button className="items-center hidden gap-2 text-gray-200 bg-gray-200 border-2 border-gray-200 rounded-full lg:py-2 lg:px-3 bg-opacity-20 lg:flex">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                Getting info
            </button>
        </div>
    );

    const navItems = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/skin-check"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Skin Check
                </NavLink>
            </li>
            {user && (
                <li>
                    <NavLink
                        to="/results"
                        className={({ isActive }) =>
                            isActive ? `${active}` : `${inactive}`
                        }
                    >
                        My Results
                    </NavLink>
                </li>
            )}
        </>
    );

    return (
        <header className="fixed z-50 flex w-full mx-auto transition duration-300 top-5 custom-shadow">
            <nav className="flex items-center justify-between w-2/3 px-3 py-2 mx-auto mt-3 text-sm font-bold lg:px-5 glass-morph lg:text-base">
                <Link to="/" className="flex items-center gap-2">
                    <img className="lg:size-16 size-14" src={logo} alt="logo" />
                    <div>
                        <h1 className="flex flex-col text-lg font-black transition duration-300 text-primary lg:text-2xl lg:flex-row lg:gap-2">
                            Derma <span className="text-black">Scan</span>
                        </h1>
                        <p className="text-xs font-bold text-primary lg:text-sm">
                            Detect. Diagnose. Protect.
                        </p>
                    </div>
                </Link>
                <ul className="hidden gap-4 lg:flex">{navItems}</ul>{" "}
                <div className="relative flex items-center gap-3">
                    {loading
                        ? loadingSkeleton
                        : user
                        ? loggedInState
                        : loggedOutState}{" "}
                    {/* right most element */}
                    <TiThMenu
                        onClick={handleDropDown}
                        className="flex lg:hidden size-6 text-primary hamburger"
                    />
                    <div
                        className={`dropdown ${
                            dropDown ? "flex" : "hidden"
                        } absolute top-6 right-1 rounded-lg bg-white py-3 px-5 font-medium border border-primary w-44 z-10`}
                    >
                        <ul className="flex flex-col gap-3 text-lg font-medium">
                            {navItems}
                            {user ? (
                                <li
                                    onClick={handleLogout}
                                    className="flex items-center gap-2"
                                >
                                    <IoMdLogOut className="text-primary" />
                                    Logout
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <NavLink
                                            to="/login"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? `${active}`
                                                    : `${inactive}`
                                            }
                                        >
                                            Login
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/register"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? `${active}`
                                                    : `${inactive}`
                                            }
                                        >
                                            Register
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <Tooltip
                anchorSelect=".profileImage"
                place="top"
                style={{
                    backgroundColor: "rgba(0, 119, 182, 1)",
                    color: "rgb(255, 255, 255)",
                    borderColor: "rgba(0, 119, 182, 1)",
                    borderWidth: "2px",
                    fontWeight: "700",
                }}
            >
                {user?.displayName}
            </Tooltip>

            <Tooltip
                anchorSelect=".logout"
                place="top"
                style={{
                    backgroundColor: "rgba(0, 119, 182, 1)",
                    color: "rgb(255, 255, 255)",
                    borderColor: "rgba(0, 119, 182, 1)",
                    borderWidth: "2px",
                    fontWeight: "700",
                }}
            >
                Logout
            </Tooltip>
        </header>
    );
};

export default NavBar;
