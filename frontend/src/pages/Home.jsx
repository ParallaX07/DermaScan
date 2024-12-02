import { FiZap } from "react-icons/fi";
import { LuMicroscope } from "react-icons/lu";
import { TbActivityHeartbeat } from "react-icons/tb";
import { Link } from "react-router-dom";
import useDocumentTitle from "./../hooks/useDocumentTitle";

const Home = () => {
    useDocumentTitle("Home | DermaDoc");

    return (
        <div className="pt-32  min-h-dvh flex flex-col justify-center items-center text-center glass-chat">
            <section className=" flex flex-col justify-center items-center text-center mx-10">
                <div className="flex items-center pb-12">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                            AI-Powered Skin Disease Detection
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl font-bold">
                            Detect and analyze skin conditions with the power of artificial
                            intelligence. Fast, accurate, and non-invasive.
                        </p>
                    </div>
                    <img src="https://dp9eps5gd5xd0.cloudfront.net/images/news/ImageForNews_15227_17254650737621930.jpg" className="max-h-[400px] rounded-lg" alt="" />
                </div>
                <button className="mt-5 px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-dark">
                    <Link to="/skin-check">Get Started</Link>
                </button>
            </section>
            <section className="w-full pb-12 pt-12 mt-8 flex justify-center items-center glass-morph">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                        How It Works
                    </h2>
                    <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
                        <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                            <div className="p-2 bg-primary bg-opacity-50 rounded-full">
                                <LuMicroscope className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">Upload Image</h3>
                            <p className="text-sm text-gray-500 text-center">
                                Simply upload a clear image of the affected skin
                                area.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                            <div className="p-2 bg-primary bg-opacity-50 rounded-full">
                                <FiZap className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">AI Analysis</h3>
                            <p className="text-sm text-gray-500 text-center">
                                Our advanced AI analyzes the image for potential
                                skin conditions.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                            <div className="p-2 bg-primary bg-opacity-50 rounded-full">
                                <TbActivityHeartbeat className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">Get Results</h3>
                            <p className="text-sm text-gray-500 text-center">
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
