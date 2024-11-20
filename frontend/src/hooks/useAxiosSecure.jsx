import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthProvider";


const useAxiosSecure = (port) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Create a new Axios instance with the provided base URL
    const axiosSecure = axios.create({
        baseURL: `http://localhost:${port}`, // Dynamically set base URL
    });

    useEffect(() => {
        // Attach an interceptor for error handling
        axiosSecure.interceptors.response.use(
            (response) => {
                return response; // Pass through if no error
            },
            (error) => {
                console.log('Error tracked in the interceptor', error.response);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.log('Logging out the user');
                    logout()
                        .then(() => {
                            navigate('/login');
                        })
                        .catch((err) => console.log(err));
                }
                return Promise.reject(error); // Reject the error for further handling
            }
        );
    }, [logout, navigate, axiosSecure]);

    return axiosSecure;
};

export default useAxiosSecure;
