import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/functionalComponents/PasswordInput";
import { useContext, useState } from "react";
import { MessageContext } from "./Root";
import { AuthContext } from "../Auth/AuthProvider";
import Loader from "../components/shared/Loader";

const Login = () => {

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const { notifyError, notifySuccess } = useContext(MessageContext);
    const { login, user, loading, setLoading } = useContext(AuthContext);

    if (user) {
        navigate("/");
    }

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get("email");
        
        setLoading(true);
        login(email, password)
            .then(() => {
                notifySuccess("Login successful");
                setLoading(false);
                navigate("/");
            })
            .catch((error) => {
                notifyError(error.message);
                setLoading(false);
            }).finally(() => {
                setLoading(false);
            });
    }



    if (loading) return <Loader />;


    return (
        <section className="h-[calc(100dvh-100px)] w-full flex items-center justify-center mt-20">
            <div className="glass2 animate__animated animate__fadeIn xl:mx-auto xl:w-full custom-shadow p-10 xl:max-w-lg 2xl:max-w-lg rounded-lg mx-3 mt-8">
                <h2 className="text-center text-2xl font-bold leading-tight text-primary">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-900">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-primary font-extrabold"
                    >
                        Register with email
                    </Link>
                </p>
                <form className="mt-2" onSubmit={(e) => handleLogin(e)}>
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
                                    className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-600"
                                    required
                                />
                            </div>
                        </div>
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
                            <button
                                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-primary/80"
                                type="submit"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </form>
                
            </div>
        </section>
    );
};

export default Login;
