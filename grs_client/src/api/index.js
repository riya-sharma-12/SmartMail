import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api";
//axios.defaults.baseURL = process.env.NODE_ENV === "production" ? "/" : "http://192.168.0.26:5002/api/v1/";
//axios.defaults.baseURL = process.env.NODE_ENV === "production" ? "/" : "http://192.168.97.128:3002/api/v1/";
//axios.defaults.baseURL = "/ats/api";
/** Make API Requests */
const token = localStorage.getItem("authToken");

export async function CustomPostApi(url, object, contentType) {
    //const navigate = useNavigate();
    let data = null;
    let error = null;
    let headers = null;
    try {
        const resp = await axios.post(url, object, {
            headers: {
                Authorization: token, // Include the token in the request header
                'Content-Type': contentType || 'application/json',

            }
        });
        headers = resp.headers['content-type'];
        //console.log("respStatus--in api", resp.status);
        if (resp.status === 401) {
            localStorage.clear();
            //navigate('/');
            window.location.reload();
        }
        if (resp.status === 200 || resp.status === 201) {
            data = resp?.data;
        } else if (resp.status === 404) {
            error = error?.response?.data?.msg || "NOT FOUND!";
        } else if (resp.status === 417) {
            error = error.response.data.msg || "Expectation Process Failed!";
        } else if (resp.status === 422) {
            error = error.response.data.msg || "Unprocessable Entity, Please try again!";
        } else if (resp.status === 500) {
            error = error.response.data.msg || "Internal Error, Contact Your Admin";
        } else {
            error = error.response.data.msg || "Something Went Wrong";
        }

    } catch (err) {
        //console.log("error CustomPostApi", err);
        error = err?.response?.data?.msg || err?.response?.data[0].msg || err?.message || err || "Something Went Wrong";
    }
    return { data, error, headers };
}
export async function CustomGetApi(url, contentType) {
    //const navigate = useNavigate();
    let data = null;
    let error = null;
    let headers = null;
    try {
        const resp = await axios.get(url, {
            headers: {
                Authorization: token,
                'Content-Type': contentType || 'application/json',
            }
        });
        headers = resp.headers['content-type'];
        if (resp.status === 401) {
            localStorage.clear();
            //navigate('/');
            window.location.reload();
        }
        if (resp.status === 200) {
            data = resp?.data;
        } else if (resp.status === 404) {
            error = error.response.data.msg || "NOT FOUND!";
        } else if (resp.status === 417) {
            error = error.response.data.msg || "Expectation Process Failed!";
        } else if (resp.status === 422) {
            error = error.response.data.msg || "Unprocessable Entity, Please try again!";
        } else if (resp.status === 500) {
            error = error.response.data.msg || "Internal Error, Contact Your Admin";
        } else {
            error = error.response.data.msg || "Something Went Wrong";
        }

    } catch (err) {
        error = err?.response?.data?.msg || err?.response?.data[0].msg || err?.message || err || "Something Went Wrong";
    }
    return { data, error, headers }
}