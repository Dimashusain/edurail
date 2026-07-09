import axios from "axios";

console.log(
  "API URL:",
  process.env.NEXT_PUBLIC_API_URL
);

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL,
  // Token kini dibawa via httpOnly cookie yang diset backend,
  // jadi tidak perlu lagi header Authorization manual / localStorage.
  withCredentials: true,
});

// Konfigurasi Retry jika Backend Belum Menyala (Network Error)
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Sesi habis (cookie token hilang/expired) → arahkan ke login.
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !window.location.pathname.startsWith("/login")
    ) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Hanya coba lagi jika terjadi Network Error (tidak ada respon dari server) pada request GET
    if (!error.response && config && config.method?.toLowerCase() === "get") {
      const dynamicConfig = config as any;
      dynamicConfig.__retryCount = dynamicConfig.__retryCount || 0;

      if (dynamicConfig.__retryCount < MAX_RETRIES) {
        dynamicConfig.__retryCount += 1;
        console.warn(
          `Koneksi API gagal. Mencoba kembali (${dynamicConfig.__retryCount}/${MAX_RETRIES}) dalam ${RETRY_DELAY_MS}ms...`
        );

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        return api(config);
      }
    }

    return Promise.reject(error);
  }
);

export default api;