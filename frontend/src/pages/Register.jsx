import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/functionalComponents/PasswordInput";
import { useContext, useState } from "react";
import { MessageContext } from "./Root";
import { AuthContext } from "../Auth/AuthProvider";
import Loader from "./../components/shared/Loader";
import useAxiosSecure from "./../hooks/useAxiosSecure";

const Register = () => {
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const { createUser, updateUserProfile, loading, setLoading } =
        useContext(AuthContext);

    const axiosSecure = useAxiosSecure();

    const { notifyError, notifySuccess } = useContext(MessageContext);

    const navigate = useNavigate();

    const handleRegister = (event) => {
        event.preventDefault();
        if (password !== confirmation) {
            notifyError("Passwords do not match");
            return;
        }

        const formData = new FormData(event.target);
        const email = formData.get("email");
        const name = formData.get("name");
        const age = formData.get("age");
        const gender = formData.get("gender");
        const url =
            formData.get("url") ||
            "https://i.ibb.co.com/hYbbGyR/6596121-modified.png";

        //password validation
        if (password.length < 6) {
            notifyError("Password must be at least 6 characters long");
            return;
        }
        if (!/[a-z]/.test(password)) {
            notifyError("Password must contain at least one lowercase letter");
            return;
        }
        if (!/[A-Z]/.test(password)) {
            notifyError("Password must contain at least one uppercase letter");
            return;
        }
        if (!/\d/.test(password)) {
            notifyError("Password must contain at least one digit");
            return;
        }
        if (!/[@$!%*?&]/.test(password)) {
            notifyError("Password must contain at least one special character");
            return;
        }

        setLoading(true);
        createUser(email, password)
            .then(() => {
                updateUserProfile(name, url);
                navigate("/");
            })
            .catch((error) => {
                notifyError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });

        const user = {
            name,
            email,
            age,
            gender,
            url,
        };

        axiosSecure
            .post("/createUser", user)
            .then(() => {
                notifySuccess("User registered successfully");
                navigate("/");
            })
            .catch((error) => {
                notifyError(error.message);
            });
    };

    if (loading) return <Loader />;

    return (
        <section className="h-[calc(100dvh-100px)] lg:w-full flex items-center justify-center mt-20">
            <div className="glass2 animate__animated animate__fadeIn xl:mx-auto xl:min-w-fit custom-shadow p-10 xl:max-w-sm 2xl:max-w-md rounded-lg  mx-3 mt-8">
                <div className="mb-2 flex justify-center"></div>
                <h2 className="text-center text-2xl font-bold leading-tight text-primary">
                    Regsiter for an account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-950">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary font-extrabold">
                        Login
                    </Link>
                </p>
                <form className="mt-2" onSubmit={(e) => handleRegister(e)}>
                    <div className="space-y-5">
                        <div>
                            <label className="text-base font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    placeholder="Email"
                                    type="email"
                                    name="email"
                                    className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-700"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="w-1/2 pr-2">
                                <label className="text-base font-medium text-gray-900">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <input
                                        placeholder="Full Name"
                                        type="text"
                                        name="name"
                                        className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-600"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="text-base font-medium text-gray-900">
                                    Photo Url
                                </label>
                                <div className="mt-2">
                                    <input
                                        placeholder="Photo URL"
                                        type="text"
                                        name="url"
                                        className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="w-1/2 pr-2">
                                <label className="text-base font-medium text-gray-900">
                                    Age
                                </label>
                                <div className="mt-2">
                                    <input
                                        placeholder="Age"
                                        type="number"
                                        name="age"
                                        required
                                        className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-600"
                                    />
                                </div>
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="text-base font-medium text-gray-900">
                                    Gender
                                </label>
                                <div className="mt-2">
                                    <select
                                        name="gender"
                                        required
                                        className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-600"
                                    >
                                        <option value="" disabled selected>
                                            Select your gender
                                        </option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="not_mentioned">
                                            Don&apos;t want to mention
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex lg:flex-row flex-col">
                            <div className="w-1/2 pr-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-base font-medium text-gray-900">
                                        Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <PasswordInput
                                        name="password"
                                        placeholder="Password"
                                        onValueChange={(value) =>
                                            setPassword(value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="w-1/2 pl-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-base font-medium text-gray-900">
                                        Confirm Password
                                    </label>
                                </div>
                                <div className="mt-2 relative">
                                    <PasswordInput
                                        name="confirmation"
                                        placeholder="Confirm Password"
                                        onValueChange={(value) =>
                                            setConfirmation(value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        {/* password rules dynamically check*/}
                        <div className="text-sm text-gray-900">
                            {password.length < 6 ? (
                                <p className="text-black">
                                    Password must be at least 6 characters long
                                    ❌
                                </p>
                            ) : !/[a-z]/.test(password) ? (
                                <p className="text-black">
                                    Password must contain at least one lowercase
                                    letter ❌
                                </p>
                            ) : !/[A-Z]/.test(password) ? (
                                <p className="text-black">
                                    Password must contain at least one uppercase
                                    letter ❌
                                </p>
                            ) : !/\d/.test(password) ? (
                                <p className="text-black">
                                    Password must contain at least one digit ❌
                                </p>
                            ) : !/[@$!%*?&]/.test(password) ? (
                                <p className="text-black">
                                    Password must contain at least one special
                                    character ❌
                                </p>
                            ) : //passwords don't match
                            password !== confirmation && confirmation != "" ? (
                                <p className="text-black">
                                    Passwords do not match ❌
                                </p>
                            ) : (
                                <p className="text-black">
                                    Password meets all requirements ✅
                                </p>
                            )}
                        </div>
                        <div>
                            <button
                                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-primary/80"
                                type="submit"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Register;
