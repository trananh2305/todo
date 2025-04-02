import axios from "axios";
import { handleLogoutAPI, refreshTokenAPI } from "../apis";
import { toast } from "sonner";

const logOnDev = (message) => {
  if (import.meta.env.MODE === "development") {
    console.log(message);
  }
};

const onResponse = (response) => {
  const { method, url } = response.config;
  const { status } = response;

  logOnDev(`[${method?.toUpperCase()}] ${url} - ${status}`);

  return response;
};

const onRequest = (config) => {
  const { method, url } = config;

  logOnDev(`[${method?.toUpperCase()}] ${url}`);

  if (method === "get") {
    config.timeout = 1000 * 60 * 10;
  }

  return config;
};

let refreshTokenPromise = null;

const onErrorResponse = async (error) => {
  if (axios.isAxiosError(error)) {
    const { message } = error;
    const { method, url } = error.config;

    logOnDev(`[${method?.toUpperCase()}] ${url} - ${message}`);

    // Xử lý khi AccessToken hết hạn (401)
    if (error.response?.status === 401) {
      await handleLogoutAPI();
      location.href = "/login";
      return;
    }

    // Nếu lỗi 410 -> Refresh Token
    const originalRequest = error.config;
    if (error.response?.status === 410 && originalRequest) {
      if (!refreshTokenPromise) {
        const refreshToken = localStorage.getItem("refreshToken");

        refreshTokenPromise = refreshTokenAPI(refreshToken)
          .then((res) => {
            console.log(res.data);
          })
          .catch((_error) => {
            handleLogoutAPI().then(() => {
              location.href = "/login";
            });
            return Promise.reject(_error);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      return refreshTokenPromise.then(() => {
        return axiosInstance(originalRequest);
      });
    }

    if (error.response?.status !== 410) {
      toast.error(`🚨 [API] | Error ${error.response?.data?.message || message}`);
    }
  } else {
    logOnDev(`🚨 [API] | Error ${error?.message || "Unknown error"}`);
  }

  return Promise.reject(error);
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
  timeout: 1000 * 60 * 10,
});

// Thêm Interceptors
axiosInstance.interceptors.request.use(onRequest, onErrorResponse);
axiosInstance.interceptors.response.use(onResponse, onErrorResponse);

export default axiosInstance;
