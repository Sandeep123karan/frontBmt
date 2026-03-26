import axios from "axios";

const API = axios.create({
  baseURL: "https://bmtadmin.onrender.com/api",
});

export default API;
