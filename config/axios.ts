import axios from "axios";

async function refreshToken() {
  try {
    await axios.post(`/api/token/refresh`);
  } catch (error) {
    console.error("Refresh Token failed:", error);
    return Promise.reject(`Refresh Token failed:${error}`);
  }
}

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    // If the error response status is 401 (Unauthorized) and it's not a token refresh request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the token
        await refreshToken();

        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
