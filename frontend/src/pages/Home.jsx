import { FiZap } from "react-icons/fi";
import { LuMicroscope } from "react-icons/lu";
import { TbActivityHeartbeat } from "react-icons/tb";
import { Link } from "react-router-dom";
import useDocumentTitle from "./../hooks/useDocumentTitle";

const Home = () => {
    useDocumentTitle("Home | DermaDoc");

    return (
        <div className="flex flex-col items-center justify-center pt-32 text-center min-h-dvh glass-chat">
            <section className="flex flex-col items-center justify-center mx-20 text-center ">
                <div className="flex items-center gap-16">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                            AI-Powered Skin Disease Detection
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl font-bold">
                            Detect and analyze skin conditions with the power of
                            artificial intelligence. Fast, accurate, and
                            non-invasive.
                        </p>
                        <button className="px-8 py-3 mt-5 font-bold text-white rounded-lg shadow-lg bg-primary hover:bg-primary-dark w-fit">
                            <Link to="/skin-check">Get Started</Link>
                        </button>
                    </div>
                </div>
            </section>
            <hr className="w-3/4 my-12 border-2 border-primary opacity-30" />
            <section className="flex items-center justify-center w-full">            
                <div className="container px-4">
                    <h2 className="mb-8 text-3xl font-bold tracking-tighter text-center sm:text-5xl">
                        How It Works
                    </h2>
                    <div className="grid max-w-5xl gap-10 mx-auto sm:grid-cols-2 md:grid-cols-3">
                        <div className="flex flex-col items-center p-4 space-y-2 border-gray-800 rounded-lg">
                            <div className="p-2 bg-opacity-50 rounded-full bg-primary">
                                <LuMicroscope className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">Upload Image</h3>
                            <p className="text-sm text-center text-gray-500">
                                Simply upload a clear image of the affected skin
                                area.
                            </p>
                        </div>
                        <div className="flex flex-col items-center p-4 space-y-2 border-gray-800 rounded-lg">
                            <div className="p-2 bg-opacity-50 rounded-full bg-primary">
                                <FiZap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">AI Analysis</h3>
                            <p className="text-sm text-center text-gray-500">
                                Our advanced AI analyzes the image for potential
                                skin conditions.
                            </p>
                        </div>
                        <div className="flex flex-col items-center p-4 space-y-2 border-gray-800 rounded-lg">
                            <div className="p-2 bg-opacity-50 rounded-full bg-primary">
                                <TbActivityHeartbeat className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">Get Results</h3>
                            <p className="text-sm text-center text-gray-500">
                                Receive a detailed report with potential
                                diagnoses and next steps.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
