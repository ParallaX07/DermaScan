import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../Auth/AuthProvider";
import { MdPendingActions } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import Loader from "../components/shared/Loader";
import Swal from "sweetalert2";

const MyResults = () => {
    const axiosSecure8000 = useAxiosSecure(8000);
    const { user, loading, setLoading } = useContext(AuthContext);

    const showFullImage = (image) => {
        const fullImage = document.createElement("div");
        fullImage.classList.add(
            "fixed",
            "top-0",
            "left-0",
            "w-full",
            "h-full",
            "bg-black",
            "bg-opacity-80",
            "z-50",
            "flex",
            "justify-center",
            "results-center"
        );
        fullImage.innerHTML = `<img src="${image}" alt="Full Image" class="max-h-full max-w-full object-contain" />`;
        fullImage.addEventListener("click", () => {
            fullImage.remove();
        });
        document.body.appendChild(fullImage);
    };

    const [allResults, setAllResults] = useState([]);

    useEffect(() => {
        let intervalId;
        let counter = 0;

        const fetchResults = () => {
            if (user) {
                axiosSecure8000
                    .get(`/allResults/${user?.email}`)
                    .then((res) => {
                        setAllResults(res.data.results);
                        console.log(res.data.results);
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                    .finally(() => {
                    });
            }
        };

        if (user) {
            setLoading(true);
            fetchResults(); // Initial fetch
            setLoading(false);
            intervalId = setInterval(() => {
                counter++;
                if (counter < 5) { // Fetch results every 2 seconds for 10 seconds
                    fetchResults();
                } else {
                    clearInterval(intervalId);
                }
            }, 2000); 
        }

        return () => {
            // Clear the interval when the component is unmounted
            clearInterval(intervalId);
        };
    }, []);

    const getTopThreeResults = (resultObject) => {
        return Object.entries(resultObject)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3); // Take the top 3 entries
    };

    const showAllResults = (resultObject) => {
        const allresults = Object.entries(resultObject).sort(
            ([, a], [, b]) => b - a
        );
        Swal.fire({
            title: "Full Analysis Report",
            confirmButtonText: "Back",
            customClass: {
                popup: "swal2-popup",
                title: "swal2-title",
                confirmButton: "swal2-confirm",
                denyButton: "swal2-deny",
            },
            buttonsStyling: false,
            width: '50%',
            html: `
                <table class="table-auto capitalize w-full mx-auto border-t-2 border-b border-black">
                    <thead>
                        <tr>
                            <th class="px-4 py-2">Disease</th>
                            <th class="px-4 py-2">Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allresults
                            .map(([key, res]) => {
                                return `
                                <tr>
                                    <td class="px-4 py-2">${key}</td>
                                    <td class="px-4 py-2">${(res * 100).toFixed(1)}%</td>
                                </tr>
                            `;
                            })
                            .join("")}
                    </tbody>
                </table>
            `,
        });
    };

    if (loading) return <Loader />;

    if (allResults.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h1 className="text-3xl font-bold">No Results Found</h1>
                <p className="text-lg">Please upload an image to get results</p>
            </div>
        );
    }

    return (
        <div className="pt-24 flex gap-10">
            <table className=" border-x-2 border-t-2 glass2  mx-auto table-auto overflow-auto my-10 rounded-lg transition duration-300">
                <thead className="">
                    <tr className="text-left font-medium text-xl  bg-primary text-accent">
                        <th className="px-4 py-2">Image</th>
                        <th className="px-4 py-2 ">Status</th>
                        <th className="px-4 py-2 ">Results</th>
                        <th className="px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody className=" text-lg dark:text-brown-accent">
                    <tr className="border-b-2">
                        <td></td>
                        <td></td>
                        <td className="px-4 py-2">
                            <p className="capitalize flex items-center justify-between gap-3 font-bold">
                                <span>Disease</span>
                                <span>Confidence</span>
                            </p>
                        </td>
                        <td></td>
                    </tr>

                    {allResults &&
                        allResults.map((result) => (
                            <tr key={result?.imageId} className={`border-b-2`}>
                                <td className="px-4 py-2">
                                    <img
                                        src={`data:image/jpeg;base64,${result?.image}`}
                                        className="w-20 h-20 object-cover rounded-lg shadow-md cursor-pointer hover:scale-110 transition-transform duration-500 ease-in-out"
                                        onClick={() =>
                                            showFullImage(
                                                `data:image/jpeg;base64,${result?.image}`
                                            )
                                        }
                                    />
                                </td>
                                <td className="px-4 py-2 ">
                                    <p className="capitalize flex gap-3 items-center justify-center">
                                        {result?.status === "pending result" || result?.status === "pending image" ? (
                                            <MdPendingActions className="text-orange-500" />
                                        ) : (
                                            <SiTicktick className="text-green-500" />
                                        )}
                                        {result?.status}
                                    </p>
                                </td>
                                <td className="px-4 py-2 capitalize">
                                    {getTopThreeResults(
                                        result?.result || {}
                                    ).map(([key, res], index) => (
                                        <p
                                            key={index}
                                            className="capitalize flex items-center justify-between gap-20 "
                                        >
                                            <span className="text-gray-800 font-semibold">{key}:</span>
                                            <span className="just">
                                                {(res * 100).toFixed(1)}%
                                            </span>
                                        </p>
                                    ))}
                                </td>
                                <td className="px-4">
                                    <button
                                        className="bg-primary text-accent px-2 py-1 rounded-lg"
                                        onClick={() =>
                                            showAllResults(result?.result)
                                        }
                                    >
                                        All Results
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyResults;
