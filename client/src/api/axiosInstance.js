import axios from "axios";

const customAxios = axios.create({
    // baseURL: "http://localhost:4567"
    baseURL: "https://mini-order-management-2.onrender.com"
});


export default customAxios;