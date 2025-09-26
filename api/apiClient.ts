import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// The Axios Instance for making API requests
// const url = 'http://10.8.1.175:3000'
const url = "https://www.werdq.com/api/v2";
const apiClient = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export default apiClient;
