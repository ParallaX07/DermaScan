import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../Auth/AuthProvider";
import { MdPendingActions } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import Loader from "../components/shared/Loader";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import useDocumentTitle from "../hooks/useDocumentTitle";

const MyResults = () => {
    useDocumentTitle("My Results | DermaDoc");

    const axiosSecure8000 = useAxiosSecure(8000);
    const { user, loading, setLoading } = useContext(AuthContext);

        //key value pairs of the disease and the corresponding dermnet link
        const dermnetLinks = {
            "basal cell carcinoma": "https://dermnetnz.org/topics/basal-cell-carcinoma",
            "melanoma": "https://dermnetnz.org/topics/melanoma",
            "dermatofibroma": "https://dermnetnz.org/topics/dermatofibroma",
            "melanocytic naevi": "https://dermnetnz.org/topics/melanocytic-naevi",
            "pyogenic granulomas and hemorrhage": "https://dermnetnz.org/topics/pyogenic-granuloma",
            "benign keratosis-like lesions": "https://dermnetnz.org/topics/seborrhoeic-keratosis",
            "Actinic keratoses and intraepithelial carcinomae": "https://dermnetnz.org/topics/actinic-keratosis",
        }

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
                    .get(`/allResults/${user.email}`)
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
                if (counter < 5) { // Fetch results every .5 seconds for 5 times
                    fetchResults();
                } else {
                    clearInterval(intervalId);
                }
            }, 200); 
        }

        

        return () => {
            // Clear the interval when the component is unmounted
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        if (allResults.length === 0) {
            setLoading(true);
            const timer = setTimeout(() => {
                setLoading(false);
            }, 1000); // 1 second delay
            
            return () => clearTimeout(timer);
        }
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

    // if (loading) return <Loader />;

    if (allResults.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <h1 className="text-3xl font-bold">No Results Found</h1>
                        <p className="text-lg">Please upload an image to get results</p>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="flex gap-10 pt-24">
            <table className="mx-auto my-10 overflow-auto transition duration-300 border-t-2 rounded-lg table-auto  border-x-2 glass2">
                <thead className="">
                    <tr className="text-xl font-medium text-left bg-primary text-accent">
                        <th className="px-4 py-2">Image</th>
                        <th className="px-4 py-2 ">Status</th>
                        <th className="px-4 py-2 ">Results</th>
                        <th className="px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody className="text-lg  dark:text-brown-accent">
                    <tr className="border-b-2">
                        <td></td>
                        <td></td>
                        <td className="px-4 py-2">
                            <p className="flex items-center justify-between gap-3 font-bold capitalize">
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
                                        className="object-cover w-20 h-20 transition-transform duration-500 ease-in-out rounded-lg shadow-md cursor-pointer hover:scale-110"
                                        onClick={() =>
                                            showFullImage(
                                                `data:image/jpeg;base64,${result?.image}`
                                            )
                                        }
                                    />
                                </td>
                                <td className="px-4 py-2 ">
                                    <p className="flex items-center justify-center gap-3 capitalize">
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
                                            className="flex items-center justify-between gap-20 capitalize clicklink"
                                        >
                                            <Link to={dermnetLinks[key]} target="_blank" className="hover:underline-offset-4 hover:underline"><span className="font-semibold text-gray-800">{key}:</span></Link>
                                            <span className="just">
                                                {(res * 100).toFixed(1)}%
                                            </span>
                                        </p>
                                    ))}
                                </td>
                                <td className="px-4">
                                    <button
                                        className="px-2 py-1 rounded-lg bg-primary text-accent"
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
            <Tooltip
                anchorSelect=".clicklink"
                place="left"
                style={{
                    backgroundColor: "rgba(0, 119, 182, 1)",
                    color: "rgb(255, 255, 255)",
                    borderColor: "rgba(0, 119, 182, 1)",
                    borderWidth: "2px",
                    fontWeight: "700",
                }}
            >
                {"Click to know more"}
            </Tooltip>
        </div>
    );
};

export default MyResults;
