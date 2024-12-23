import { Link } from "react-router-dom";
import useDocumentTitle from './../hooks/useDocumentTitle';



const Error404 = () => {

        useDocumentTitle("404 | DermaScan");

    return (
        <section className="fixed inset-0 z-50 flex items-center justify-center p-16 text-gray-900 h-dvh glass glass2">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl ">
                        <span className="sr-only">Error</span>404
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl">
                        Sorry, we couldn&apos;t find this page.
                    </p>
                    <p className="mt-4 mb-8 ">
                        But dont worry, you can find plenty of other things on
                        our homepage.
                    </p>
                    <Link to={"/"}
                        rel="noopener noreferrer"
                        href="#"
                        className="px-8 py-3 font-semibold text-white rounded bg-primary"
                    >
                        Back to homepage
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Error404;
