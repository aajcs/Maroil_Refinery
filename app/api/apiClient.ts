import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api-maroil-refinery-2500582bacd8.herokuapp.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
