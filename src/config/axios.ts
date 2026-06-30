import axios from "axios";
const isProd = import.meta.env.PROD;
// create an Axios instance with default configuration
export const api = axios.create({
    // vite environment variable for the base URL, fallback to localhost if not set
    baseURL: isProd ? "/api" : "http://127.0.0.1:8000/api",

    // for sending cookies with requests, useful for authentication
    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Response Interceptor
 * In the future, you can centralize the management of backend errors (e.g., 401 errors or custom error structures)
 * in this section.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // example: if the backend returns a 401 Unauthorized error, you can handle it here
        if (error.response && error.response.status === 401) {
            // in case of need, redirect to the login page
        }
        return Promise.reject(error);
    },
);
