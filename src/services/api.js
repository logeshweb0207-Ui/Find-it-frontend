import axios from "axios";


const LOCAL_API_URL =
    "http://localhost:5000/api";

const PRODUCTION_API_URL =
    "https://find-it-backend-qqsp.onrender.com/api";


const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    PRODUCTION_API_URL;


/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const API = axios.create({

    baseURL: API_BASE_URL,

    timeout: 60000,

    headers: {
        "Content-Type": "application/json"
    }

});


/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

API.interceptors.request.use(

    (config) => {

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

API.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        if (error.response) {

            console.error(
                "API Error:",
                error.response.status,
                error.response.data
            );

        } else if (error.request) {

            console.error(
                "API Server Unreachable:",
                {
                    baseURL: API_BASE_URL,
                    url: error.config?.url || "unknown"
                }
            );

        } else {

            console.error(
                "API Request Error:",
                error.message
            );

        }


        return Promise.reject(error);

    }

);


export {
    API_BASE_URL,
    LOCAL_API_URL,
    PRODUCTION_API_URL
};


export default API;
