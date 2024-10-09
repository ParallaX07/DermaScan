import { Link } from "react-router-dom";
import PasswordInput from "../components/functionalComponents/PasswordInput";
import { useState } from "react";

const Register = () => {
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");

    return (
        <section className="h-[calc(100dvh-100px)] lg:w-full flex items-center justify-center mt-20">
            <div className="bg-white animate__animated animate__fadeIn xl:mx-auto xl:min-w-fit custom-shadow p-10 xl:max-w-sm 2xl:max-w-md rounded-lg  mx-3 mt-8">
                <div className="mb-2 flex justify-center"></div>
                <h2 className="text-center text-2xl font-bold leading-tight text-black">
                    Regsiter for an account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary font-extrabold">
                        Login
                    </Link>
                </p>
                <form className="mt-2">
                    <div className="space-y-5">
                        <div>
                            <label className="text-base font-medium text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    placeholder="Full Name"
                                    type="text"
                                    name="name"
                                    className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-400"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-base font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    placeholder="Email"
                                    type="email"
                                    name="email"
                                    className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-400"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-base font-medium text-gray-900">
                                Photo Url
                            </label>
                            <div className="mt-2">
                                <input
                                    placeholder="Photo URL"
                                    type="text"
                                    name="url"
                                    className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                        <div className="flex lg:flex-row flex-col gap-5">
                            <div>
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
                            <div>
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