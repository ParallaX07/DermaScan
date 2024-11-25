import { BodyComponent } from "@darshanpatel2608/human-body-react";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import PropTypes from "prop-types";
import { MessageContext } from "./Root";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const FileUploadButton = ({ fileInputRef, img }) => {
    return (
        <div className="max-w-md mx-auto rounded-lg overflow-hidden">
            <div className="md:flex">
                <div className="w-full p-3">
                    <div className="glass2 relative h-48 rounded-lg border-2 border-blue-500 flex justify-center items-center transition-shadow duration-300 ease-in-out">
                        <div className="absolute flex flex-col items-center">
                            {img ? (
                                <div className="p-5 bg-white">
                                    <img
                                        src={`data:image/*;base64,${img}`}
                                        alt="uploaded"
                                        className="max-w-xl object-contain rounded-lg"
                                        style={{
                                            objectFit: "contain",
                                            width: "100%",
                                            height: "auto",
                                        }}
                                    />
                                </div>
                            ) : (
                                <img
                                    alt="File Icon"
                                    className="mb-3"
                                    src="https://img.icons8.com/?size=100&id=67369&format=png&color=000000"
                                />
                            )}
                            {!img ? (
                                <>
                                    <span className="block text-gray-500 font-semibold">
                                        Drag &amp; drop your files here
                                    </span>
                                    <span className="block text-gray-400 font-normal mt-1">
                                        or click to upload
                                    </span>
                                </>
                            ) : (
                                ""
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            name=""
                            className="h-full w-full opacity-0 cursor-pointer"
                            type="file"
                            accept="image/*"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

FileUploadButton.propTypes = {
    fileInputRef: PropTypes.object.isRequired,
    img: PropTypes.string,
};

const SkinCheck = () => {
    const [params, setParam] = useState();

    const navigate = useNavigate();

    //set of selected body parts
    const [selectedParts, setSelectedParts] = useState([]);
    const fileInputRef = useRef(null);
    const [img, setImg] = useState(null);

    const { user } = useContext(AuthContext);
    const { notifySuccess, notifyError } = useContext(MessageContext);

    const axiosSecure5000 = useAxiosSecure(5000);
    const axiosSecure8000 = useAxiosSecure(8000);

    //handle click event of body parts
    const handleBodyPartClick = (part) => {
        console.log("Selected body part:", part);

        if (selectedParts.includes(part)) {
            setSelectedParts([]);
            setParam("");
        } else {
            setSelectedParts([part]);
            setParam(part);
        }
    };

    const handleFileChange = (e) => {
        e.preventDefault();
        const file = fileInputRef.current.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImg(reader.result.split(",")[1]); // Extract base64 string
            };
            reader.readAsDataURL(file);
        }
        console.log("File uploaded:", file);
        console.log(img);
    };

    const handleFileUpload = (e) => {
        e.preventDefault();
        if (!img) {
            notifyError("Please upload an image");
            return;
        }

        if (!params) {
            notifyError("Please select a body part");
            return;
        }

        const skinImage = {
            image: img,
            bodyPart: params,
            user: user.email,
        };

        Swal.fire({
            title: "Confirm Upload for analysis?",
            showDenyButton: true,
            confirmButtonText: "Confirm",
            denyButtonText: "Cancel",
            customClass: {
                popup: "swal2-popup",
                title: "swal2-title",
                confirmButton: "swal2-confirm",
                denyButton: "swal2-deny",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure5000
                    .post("/upload-image", skinImage)
                    .then((res) => {
                        console.log("Response:", res.data);
                        // Reset form and state
                        e.target.reset();
                        setImg(null);
                        setParam("");
                        setSelectedParts([]);

                        let returnedImageID = "";

                        // Wait for the image to be analyzed and get the image ID
                        notifySuccess("Image is being analyzed");
                        setTimeout(() => {
                            Promise.all([
                                axiosSecure8000.get("/getPendingImage"),
                                new Promise((resolve) =>
                                    setTimeout(resolve, 2000)
                                ), // Wait for 2 seconds
                            ])
                                .then(([imageRes]) => {
                                    
                                    returnedImageID = imageRes.data.imageId;

                                    // Run prediction using the returned image ID
                                    return axiosSecure8000.get(
                                        `/runPrediction/${returnedImageID}`
                                    );
                                })
                                .then(() => {
                                    notifySuccess("Analysis completed");
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                        }, 3000);

                        navigate("/results");
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        });
    };

    const handleCameraClick = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement("video");
            video.srcObject = stream;
            video.play();

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            Swal.fire({
                title: "Capture Image",
                html: video,
                showCancelButton: true,
                confirmButtonText: "Capture",
                preConfirm: () => {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL("image/jpeg");
                    setImg(dataUrl.split(",")[1]); // Extract base64 string
                    stream.getTracks().forEach((track) => track.stop());
                },
                willClose: () => {
                    stream.getTracks().forEach((track) => track.stop());
                },
            });
        } catch (error) {
            console.error("Error accessing camera:", error);
            notifyError("Error accessing camera");
        }
    };

    return (
        <div className="min-h-[calc(100dvh-5px)] pt-24 flex justify-center items-center gap-10">
            <div>
                <BodyComponent
                    partsInput={params}
                    onClick={handleBodyPartClick}
                />
            </div>
            {/*Upload image option*/}
            <form
                className="flex flex-col items-center justify-center"
                onSubmit={handleFileUpload}
                onChange={handleFileChange}
            >
                <div className="flex justify-center mt-5">
                    <FileUploadButton fileInputRef={fileInputRef} img={img} />
                </div>
                
                {/* selected body part */}
                <div className="mt-5 capitalize flex  items-center gap-2 font-semibold text-lg">
                    Selected Body Part:{" "}
                    <p className="font-normal">
                        {!params
                            ? "No Selection"
                            : selectedParts.map((str) => {
                                  return str.replace(/_/g, " ");
                              })}
                    </p>
                </div>
                <div className="text-sm text-gray-700">
                    Please deselect a body part before selecting another region
                </div>
                <div className="flex justify-center mt-5 gap-5">
                    <button
                        type="button"
                        onClick={handleCameraClick}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Use Camera
                    </button>
                    <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Start Analysis
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SkinCheck;