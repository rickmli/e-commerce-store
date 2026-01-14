import axios from "axios";

const backendPORT = import.meta.env.PORT;
const axiosInstance = axios.create({
  baseURL:
    import.meta.MODE === "development"
      ? `http://localhost:${backendPORT}/api`
      : "/api",
  withCredentials: true, // send cookies to the server
});

export default axiosInstance;
